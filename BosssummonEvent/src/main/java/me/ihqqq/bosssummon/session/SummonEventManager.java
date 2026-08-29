package me.ihqqq.bosssummon.session;

import me.ihqqq.bosssummon.config.KillRequirement;
import me.ihqqq.bosssummon.config.SummonEvent;
import me.ihqqq.bosssummon.config.SummonMobEntry;
import me.ihqqq.bosssummon.util.EffectPlayer;
import me.ihqqq.bosssummon.util.MessageUtil;
import io.lumine.mythic.api.mobs.MythicMob;
import io.lumine.mythic.bukkit.BukkitAdapter;
import io.lumine.mythic.bukkit.MythicBukkit;
import io.lumine.mythic.core.mobs.ActiveMob;
import net.kyori.adventure.text.Component;
import net.kyori.adventure.text.serializer.legacy.LegacyComponentSerializer;
import org.bukkit.Location;
import org.bukkit.command.CommandSender;
import org.bukkit.entity.Player;
import org.bukkit.plugin.Plugin;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.logging.Level;

public class SummonEventManager {

    private final Plugin plugin;
    private Map<String, SummonEvent> definitions; // key = eventId lowercase
    private final Map<String, SummonSession> activeSessions = new ConcurrentHashMap<>(); // key = eventId lowercase

    private boolean progressNotifyEnabled;
    private String progressNotifyActionBar;

    public SummonEventManager(Plugin plugin, Map<String, SummonEvent> definitions) {
        this.plugin = plugin;
        this.definitions = definitions;
        reloadGlobalSettings();
    }

    public void reloadGlobalSettings() {
        this.progressNotifyEnabled = plugin.getConfig().getBoolean("progress-notify.enabled", true);
        this.progressNotifyActionBar = plugin.getConfig().getString("progress-notify.action-bar", null);
    }

    public void setDefinitions(Map<String, SummonEvent> definitions) {
        this.definitions = definitions;
    }

    public Map<String, SummonEvent> getDefinitions() {
        return definitions;
    }

    public Optional<SummonEvent> getDefinition(String eventId) {
        return Optional.ofNullable(definitions.get(eventId.toLowerCase()));
    }

    public Optional<SummonSession> getActiveSession(String eventId) {
        return Optional.ofNullable(activeSessions.get(eventId.toLowerCase()));
    }

    public Map<String, SummonSession> getActiveSessions() {
        return activeSessions;
    }

    public enum StartResult {
        SUCCESS,
        UNKNOWN_EVENT,
        ALREADY_RUNNING,
        NO_LOCATION
    }

    public StartResult startEvent(String eventId, Location overrideLocation, CommandSender starter) {
        SummonEvent def = definitions.get(eventId.toLowerCase());
        if (def == null) {
            return StartResult.UNKNOWN_EVENT;
        }
        if (activeSessions.containsKey(eventId.toLowerCase())) {
            return StartResult.ALREADY_RUNNING;
        }
        Location loc = overrideLocation != null ? overrideLocation : def.getDefaultSummonLocation();
        if (loc == null || loc.getWorld() == null) {
            return StartResult.NO_LOCATION;
        }

        SummonSession session = new SummonSession(def, loc);
        activeSessions.put(eventId.toLowerCase(), session);

        for (Player p : loc.getWorld().getPlayers()) {
            session.addViewer(p);
        }
        updateBossBar(session);

        int taskId = plugin.getServer().getScheduler().scheduleSyncRepeatingTask(plugin, () -> tickSession(eventId.toLowerCase()), 20L, 20L);
        session.setCountdownTaskId(taskId);

        plugin.getLogger().info("Su kien '" + eventId + "' da bat dau boi "
                + (starter != null ? starter.getName() : "console") + " tai " + formatLoc(loc));
        return StartResult.SUCCESS;
    }

    public boolean cancelEvent(String eventId, boolean silent) {
        String key = eventId.toLowerCase();
        SummonSession session = activeSessions.get(key);
        if (session == null) return false;

        session.setState(SummonSession.State.CANCELLED);
        stopSession(session);
        activeSessions.remove(key);

        if (!silent) {
            EffectPlayer.playFail(session.getSummonLocation(), session.getEvent().getFailEffects(),
                    placeholders(session));
        }
        return true;
    }

    public void shutdownAll() {
        for (SummonSession session : activeSessions.values()) {
            stopSession(session);
        }
        activeSessions.clear();
    }

    private void stopSession(SummonSession session) {
        if (session.getCountdownTaskId() != -1) {
            plugin.getServer().getScheduler().cancelTask(session.getCountdownTaskId());
        }
        session.removeAllViewers();
    }

    private void tickSession(String key) {
        SummonSession session = activeSessions.get(key);
        if (session == null) return;
        if (session.getState() != SummonSession.State.RUNNING) return;

        session.decrementSecond();
        updateBossBar(session);

        if (session.getSecondsRemaining() <= 0) {
            // Het gio ma chua hoan thanh -> huy
            activeSessions.remove(key);
            session.setState(SummonSession.State.CANCELLED);
            stopSession(session);
            EffectPlayer.playFail(session.getSummonLocation(), session.getEvent().getFailEffects(), placeholders(session));
        }
    }



    public void registerMythicKill(String mythicInternalName, Player killer) {
        registerKillInternal(req -> req.matchesMythic(mythicInternalName), mythicInternalName, killer);
    }

    public void registerVanillaKill(String bukkitEntityTypeName, Player killer) {
        registerKillInternal(req -> req.matchesVanilla(bukkitEntityTypeName), bukkitEntityTypeName, killer);
    }

    private void registerKillInternal(java.util.function.Predicate<KillRequirement> matcher, String mobLabel, Player killer) {
        if (activeSessions.isEmpty()) return;

        for (SummonSession session : activeSessions.values()) {
            if (session.getState() != SummonSession.State.RUNNING) continue;

            for (KillRequirement req : session.getEvent().getRequirements()) {
                if (!matcher.test(req)) continue;
                int before = session.getProgressFor(req);
                if (before >= req.getAmount()) continue; // da du roi

                int delta = session.addProgress(req, 1);
                if (delta <= 0) continue;

                updateBossBar(session);
                notifyProgress(session, killer, mobLabel);

                if (session.isComplete()) {
                    completeSession(session);
                }
                break;
            }
        }
    }

    private void notifyProgress(SummonSession session, Player killer, String mobLabel) {
        if (!progressNotifyEnabled || progressNotifyActionBar == null || killer == null) return;
        Map<String, String> ph = new HashMap<>();
        ph.put("mob", mobLabel);
        ph.put("current", String.valueOf(session.getTotalKilled()));
        ph.put("required", String.valueOf(session.getTotalRequired()));
        String msg = MessageUtil.color(MessageUtil.placeholders(progressNotifyActionBar, ph));
        Component component = LegacyComponentSerializer.legacySection().deserialize(msg);
        killer.sendActionBar(component);
    }

    private void updateBossBar(SummonSession session) {
        Map<String, String> ph = placeholders(session);
        String rendered = MessageUtil.color(MessageUtil.placeholders(session.getEvent().getBossBarSettings().getTitleTemplate(), ph));
        session.refreshBossBar(rendered);
    }

    private Map<String, String> placeholders(SummonSession session) {
        Map<String, String> ph = new HashMap<>();
        ph.put("display_name", session.getEvent().getDisplayName());
        ph.put("current", String.valueOf(session.getTotalKilled()));
        ph.put("required", String.valueOf(session.getTotalRequired()));
        ph.put("time_left", String.valueOf(session.getSecondsRemaining()));
        ph.put("world", session.getSummonLocation().getWorld() != null ? session.getSummonLocation().getWorld().getName() : "?");
        return ph;
    }


    private void completeSession(SummonSession session) {
        session.setState(SummonSession.State.COMPLETED);
        stopSession(session);
        activeSessions.remove(session.getEvent().getId().toLowerCase());

        Location loc = session.getSummonLocation();
        spawnBossMobs(session.getEvent(), loc);

        EffectPlayer.playSuccess(plugin, session.getEvent().getSuccessEffects(), loc, placeholders(session));
    }

    private void spawnBossMobs(SummonEvent event, Location loc) {
        for (SummonMobEntry entry : event.getSummonMobs()) {
            Optional<MythicMob> mythicMob = MythicBukkit.inst().getMobManager().getMythicMob(entry.getMythicInternalName());
            if (mythicMob.isEmpty()) {
                plugin.getLogger().log(Level.WARNING, "Khong tim thay MythicMob '" + entry.getMythicInternalName()
                        + "' (su kien '" + event.getId() + "') - bo qua.");
                continue;
            }
            for (int i = 0; i < entry.getAmount(); i++) {
                Location spawnAt = loc.clone().add(
                        (Math.random() * 4) - 2,
                        0,
                        (Math.random() * 4) - 2
                );
                ActiveMob active = mythicMob.get().spawn(BukkitAdapter.adapt(spawnAt), 1.0);
                if (active == null) {
                    plugin.getLogger().warning("Trieu hoi that bai cho mob '" + entry.getMythicInternalName() + "'.");
                }
            }
        }
    }

    private String formatLoc(Location loc) {
        return String.format("%s @ %.1f, %.1f, %.1f",
                loc.getWorld() != null ? loc.getWorld().getName() : "?", loc.getX(), loc.getY(), loc.getZ());
    }
}