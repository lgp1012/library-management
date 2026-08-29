package me.ihqqq.bosssummon.util;

import me.ihqqq.bosssummon.config.FailEffects;
import me.ihqqq.bosssummon.config.ParticleEffectEntry;
import me.ihqqq.bosssummon.config.SoundEffectEntry;
import me.ihqqq.bosssummon.config.SuccessEffects;
import org.bukkit.Bukkit;
import org.bukkit.Color;
import org.bukkit.FireworkEffect;
import org.bukkit.Location;
import org.bukkit.World;
import org.bukkit.entity.Firework;
import org.bukkit.entity.Player;
import org.bukkit.inventory.meta.FireworkMeta;
import org.bukkit.plugin.Plugin;
import org.bukkit.scheduler.BukkitRunnable;

import java.util.Map;
import java.util.Random;

public final class EffectPlayer {

    private static final Random RANDOM = new Random();
    private static final double NOTIFY_RADIUS = 60.0;
    private EffectPlayer() {}

    public static void playSuccess(Plugin plugin, SuccessEffects effects, Location location, Map<String, String> placeholders) {
        World world = location.getWorld();
        if (world == null) return;

        for (Player p : world.getPlayers()) {
            if (p.getLocation().distanceSquared(location) <= NOTIFY_RADIUS * NOTIFY_RADIUS) {
                if (effects.getTitle() != null || effects.getSubtitle() != null) {
                    String title = MessageUtil.placeholders(effects.getTitle() != null ? effects.getTitle() : "", placeholders);
                    String subtitle = MessageUtil.placeholders(effects.getSubtitle() != null ? effects.getSubtitle() : "", placeholders);
                    p.sendTitle(title, subtitle, effects.getFadeIn(), effects.getStay(), effects.getFadeOut());
                }
                playSound(p, effects.getSound());
            }
        }

        if (effects.getBroadcastMessage() != null) {
            Bukkit.broadcastMessage(MessageUtil.placeholders(effects.getBroadcastMessage(), placeholders));
        }

        animateParticles(plugin, world, location, effects.getParticles());

        if (effects.isFirework()) {
            spawnFireworks(plugin, location, effects.getFireworkCount(), effects.getFireworkRadius());
        }
    }

    public static void playFail(Location location, FailEffects effects, Map<String, String> placeholders) {
        if (effects == null) return;
        if (effects.getBroadcastMessage() != null) {
            Bukkit.broadcastMessage(MessageUtil.placeholders(effects.getBroadcastMessage(), placeholders));
        }
        if (location.getWorld() != null && effects.getSound() != null) {
            for (Player p : location.getWorld().getPlayers()) {
                if (p.getLocation().distanceSquared(location) <= NOTIFY_RADIUS * NOTIFY_RADIUS) {
                    playSound(p, effects.getSound());
                }
            }
        }
    }

    private static void playSound(Player p, SoundEffectEntry sound) {
        if (sound == null) return;
        p.playSound(p.getLocation(), sound.getSound(), sound.getVolume(), sound.getPitch());
    }

    private static void animateParticles(Plugin plugin, World world, Location center, java.util.List<ParticleEffectEntry> particles) {
        if (particles == null || particles.isEmpty()) return;
        new BukkitRunnable() {
            int ticks = 0;

            @Override
            public void run() {
                if (ticks >= 20 || !world.isChunkLoaded(center.getBlockX() >> 4, center.getBlockZ() >> 4)) {
                    cancel();
                    return;
                }
                for (ParticleEffectEntry pe : particles) {
                    world.spawnParticle(pe.getParticle(), center, pe.getCount(),
                            pe.getOffsetX(), pe.getOffsetY(), pe.getOffsetZ(), pe.getSpeed());
                }
                ticks++;
            }
        }.runTaskTimer(plugin, 0L, 2L);
    }

    private static void spawnFireworks(Plugin plugin, Location center, int count, double radius) {
        World world = center.getWorld();
        if (world == null) return;
        new BukkitRunnable() {
            int launched = 0;

            @Override
            public void run() {
                if (launched >= count) {
                    cancel();
                    return;
                }
                double dx = (RANDOM.nextDouble() * 2 - 1) * radius;
                double dz = (RANDOM.nextDouble() * 2 - 1) * radius;
                Location loc = center.clone().add(dx, 0.2, dz);
                Firework fw = world.spawn(loc, Firework.class);
                FireworkMeta meta = fw.getFireworkMeta();
                meta.addEffect(FireworkEffect.builder()
                        .withColor(randomColor(), randomColor())
                        .withFade(randomColor())
                        .with(randomType())
                        .trail(RANDOM.nextBoolean())
                        .flicker(RANDOM.nextBoolean())
                        .build());
                meta.setPower(1);
                fw.setFireworkMeta(meta);
                launched++;
            }
        }.runTaskTimer(plugin, 0L, 5L);
    }

    private static Color randomColor() {
        Color[] palette = {Color.RED, Color.ORANGE, Color.YELLOW, Color.PURPLE, Color.AQUA, Color.WHITE, Color.LIME};
        return palette[RANDOM.nextInt(palette.length)];
    }

    private static FireworkEffect.Type randomType() {
        FireworkEffect.Type[] types = FireworkEffect.Type.values();
        return types[RANDOM.nextInt(types.length)];
    }
}