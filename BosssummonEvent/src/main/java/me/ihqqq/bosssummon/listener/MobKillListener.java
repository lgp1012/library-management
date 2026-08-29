package me.ihqqq.bosssummon.listener;

import me.ihqqq.bosssummon.session.SummonEventManager;
import io.lumine.mythic.bukkit.MythicBukkit;
import io.lumine.mythic.bukkit.events.MythicMobDeathEvent;
import org.bukkit.entity.LivingEntity;
import org.bukkit.entity.Player;
import org.bukkit.event.EventHandler;
import org.bukkit.event.EventPriority;
import org.bukkit.event.Listener;
import org.bukkit.event.entity.EntityDeathEvent;

public class MobKillListener implements Listener {

    private final SummonEventManager manager;

    public MobKillListener(SummonEventManager manager) {
        this.manager = manager;
    }

    @EventHandler(priority = EventPriority.MONITOR, ignoreCancelled = true)
    public void onMythicMobDeath(MythicMobDeathEvent event) {
        LivingEntity killerEntity = event.getKiller();
        Player killer = (killerEntity instanceof Player) ? (Player) killerEntity : null;

        String internalName = event.getMob().getMobType();
        manager.registerMythicKill(internalName, killer);
    }

    @EventHandler(priority = EventPriority.MONITOR, ignoreCancelled = true)
    public void onVanillaEntityDeath(EntityDeathEvent event) {
        LivingEntity entity = event.getEntity();

        if (MythicBukkit.inst().getMobManager().isMythicMob(entity)) {
            return;
        }

        Player killer = entity.getKiller();
        if (killer == null) return;

        manager.registerVanillaKill(entity.getType().name(), killer);
    }
}