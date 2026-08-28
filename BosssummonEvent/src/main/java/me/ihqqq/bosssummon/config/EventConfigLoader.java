package me.ihqqq.bosssummon.config;

import org.bukkit.Bukkit;
import org.bukkit.ChatColor;
import org.bukkit.Location;
import org.bukkit.Particle;
import org.bukkit.Sound;
import org.bukkit.World;
import org.bukkit.boss.BarColor;
import org.bukkit.boss.BarStyle;
import org.bukkit.configuration.ConfigurationSection;
import org.bukkit.plugin.Plugin;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;


public class EventConfigLoader {

    private final Plugin plugin;

    public EventConfigLoader(Plugin plugin) {
        this.plugin = plugin;
    }

    public Map<String, SummonEvent> loadAll() {
        Map<String, SummonEvent> result = new LinkedHashMap<>();
        ConfigurationSection eventsSection = plugin.getConfig().getConfigurationSection("events");
        if (eventsSection == null) {
            plugin.getLogger().warning("Khong tim thay muc 'events' trong config.yml - khong co su kien nao duoc nap.");
            return result;
        }

        for (String eventId : eventsSection.getKeys(false)) {
            ConfigurationSection sec = eventsSection.getConfigurationSection(eventId);
            if (sec == null) continue;
            try {
                SummonEvent event = parseEvent(eventId, sec);
                result.put(eventId.toLowerCase(), event);
                plugin.getLogger().info("Da nap su kien trieu hoi boss: " + eventId);
            } catch (Exception ex) {
                plugin.getLogger().log(Level.WARNING, "Bo qua su kien '" + eventId + "' do loi cau hinh: " + ex.getMessage(), ex);
            }
        }
        return result;
    }

    private SummonEvent parseEvent(String id, ConfigurationSection sec) {
        String displayName = color(sec.getString("display-name", id));
        int timeLimit = sec.getInt("time-limit-seconds", 300);

        ConfigurationSection barSec = sec.getConfigurationSection("bossbar");
        String barTitle = barSec != null ? barSec.getString("title", "{display_name} {current}/{required}") : "{display_name} {current}/{required}";
        BarColor barColor = BarColor.RED;
        BarStyle barStyle = BarStyle.SOLID;
        if (barSec != null) {
            try {
                barColor = BarColor.valueOf(barSec.getString("color", "RED").toUpperCase());
            } catch (IllegalArgumentException ignored) {
                plugin.getLogger().warning("Mau BossBar khong hop le cho su kien '" + id + "', dung mac dinh RED.");
            }
            try {
                barStyle = BarStyle.valueOf(barSec.getString("style", "SOLID").toUpperCase());
            } catch (IllegalArgumentException ignored) {
                plugin.getLogger().warning("Kieu BossBar khong hop le cho su kien '" + id + "', dung mac dinh SOLID.");
            }
        }
        BossBarSettings bossBarSettings = new BossBarSettings(barTitle, barColor, barStyle);

        List<KillRequirement> requirements = new ArrayList<>();
        List<Map<?, ?>> reqList = sec.getMapList("requirements");
        for (Map<?, ?> raw : reqList) {
            String typeStr = String.valueOf(raw.get("type"));
            String reqId = String.valueOf(raw.get("id"));
            int amount = raw.get("amount") != null ? Integer.parseInt(String.valueOf(raw.get("amount"))) : 1;
            KillRequirement.Type type = KillRequirement.Type.valueOf(typeStr.toUpperCase());
            requirements.add(new KillRequirement(type, reqId, amount));
        }
        if (requirements.isEmpty()) {
            throw new IllegalArgumentException("Su kien phai co it nhat 1 requirement.");
        }

        ConfigurationSection summonSec = sec.getConfigurationSection("summon");
        Location location = null;
        List<SummonMobEntry> summonMobs = new ArrayList<>();
        if (summonSec != null) {
            ConfigurationSection locSec = summonSec.getConfigurationSection("location");
            if (locSec != null) {
                String worldName = locSec.getString("world");
                World world = worldName != null ? Bukkit.getWorld(worldName) : null;
                if (world != null) {
                    double x = locSec.getDouble("x");
                    double y = locSec.getDouble("y");
                    double z = locSec.getDouble("z");
                    float yaw = (float) locSec.getDouble("yaw", 0.0);
                    float pitch = (float) locSec.getDouble("pitch", 0.0);
                    location = new Location(world, x, y, z, yaw, pitch);
                } else if (worldName != null) {
                    plugin.getLogger().warning("The gioi '" + worldName + "' khong ton tai cho su kien '" + id + "' - se dung vi tri nguoi thuc hien lenh.");
                }
            }
            List<Map<?, ?>> mobList = summonSec.getMapList("mobs");
            for (Map<?, ?> raw : mobList) {
                String mobId = String.valueOf(raw.get("id"));
                int amount = raw.get("amount") != null ? Integer.parseInt(String.valueOf(raw.get("amount"))) : 1;
                summonMobs.add(new SummonMobEntry(mobId, amount));
            }
        }
        if (summonMobs.isEmpty()) {
            throw new IllegalArgumentException("Su kien phai co it nhat 1 mob duoc trieu hoi trong 'summon.mobs'.");
        }

        ConfigurationSection successSec = sec.getConfigurationSection("success-effects");
        SuccessEffects successEffects = parseSuccessEffects(id, successSec);

        ConfigurationSection failSec = sec.getConfigurationSection("fail");
        FailEffects failEffects = parseFailEffects(failSec);

        return new SummonEvent(id, displayName, timeLimit, bossBarSettings, requirements,
                location, summonMobs, successEffects, failEffects);
    }

    private SuccessEffects parseSuccessEffects(String eventId, ConfigurationSection sec) {
        if (sec == null) {
            return new SuccessEffects(null, null, 10, 60, 20, null, null, new ArrayList<>(), false, 0, 0);
        }
        String title = color(sec.getString("title", null));
        String subtitle = color(sec.getString("subtitle", null));
        int fadeIn = sec.getInt("title-fade-in", 10);
        int stay = sec.getInt("title-stay", 60);
        int fadeOut = sec.getInt("title-fade-out", 20);
        String broadcast = color(sec.getString("broadcast-message", null));

        SoundEffectEntry sound = parseSound(sec.getConfigurationSection("sound"), eventId);

        List<ParticleEffectEntry> particles = new ArrayList<>();
        List<Map<?, ?>> particleList = sec.getMapList("particles");
        for (Map<?, ?> raw : particleList) {
            try {
                Particle particle = Particle.valueOf(String.valueOf(raw.get("particle")).toUpperCase());
                int count = raw.get("count") != null ? Integer.parseInt(String.valueOf(raw.get("count"))) : 20;
                double ox = raw.get("offset-x") != null ? Double.parseDouble(String.valueOf(raw.get("offset-x"))) : 0.5;
                double oy = raw.get("offset-y") != null ? Double.parseDouble(String.valueOf(raw.get("offset-y"))) : 0.5;
                double oz = raw.get("offset-z") != null ? Double.parseDouble(String.valueOf(raw.get("offset-z"))) : 0.5;
                double speed = raw.get("speed") != null ? Double.parseDouble(String.valueOf(raw.get("speed"))) : 0.0;
                particles.add(new ParticleEffectEntry(particle, count, ox, oy, oz, speed));
            } catch (Exception ex) {
                plugin.getLogger().warning("Bo qua particle khong hop le trong su kien '" + eventId + "': " + raw);
            }
        }

        boolean firework = sec.getBoolean("firework", false);
        int fireworkCount = sec.getInt("firework-count", 5);
        double fireworkRadius = sec.getDouble("firework-radius", 2.5);

        return new SuccessEffects(title, subtitle, fadeIn, stay, fadeOut, broadcast, sound, particles,
                firework, fireworkCount, fireworkRadius);
    }

    private FailEffects parseFailEffects(ConfigurationSection sec) {
        if (sec == null) {
            return new FailEffects(null, null);
        }
        String broadcast = color(sec.getString("broadcast-message", null));
        SoundEffectEntry sound = parseSound(sec.getConfigurationSection("sound"), "fail");
        return new FailEffects(broadcast, sound);
    }

    private SoundEffectEntry parseSound(ConfigurationSection soundSec, String eventId) {
        if (soundSec == null) return null;
        String name = soundSec.getString("name");
        if (name == null) return null;
        try {
            Sound sound = Sound.valueOf(name.toUpperCase());
            float volume = (float) soundSec.getDouble("volume", 1.0);
            float pitch = (float) soundSec.getDouble("pitch", 1.0);
            return new SoundEffectEntry(sound, volume, pitch);
        } catch (IllegalArgumentException ex) {
            plugin.getLogger().warning("Ten am thanh khong hop le '" + name + "' trong su kien '" + eventId + "'.");
            return null;
        }
    }

    private String color(String s) {
        if (s == null) return null;
        return ChatColor.translateAlternateColorCodes('&', s);
    }
}