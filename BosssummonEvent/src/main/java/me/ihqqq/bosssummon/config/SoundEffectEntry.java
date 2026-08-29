package me.ihqqq.bosssummon.config;

import org.bukkit.Sound;

public class SoundEffectEntry {

    private final Sound sound;
    private final float volume;
    private final float pitch;

    public SoundEffectEntry(Sound sound, float volume, float pitch) {
        this.sound = sound;
        this.volume = volume;
        this.pitch = pitch;
    }

    public Sound getSound() {
        return sound;
    }

    public float getVolume() {
        return volume;
    }

    public float getPitch() {
        return pitch;
    }
}