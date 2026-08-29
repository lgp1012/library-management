package me.ihqqq.bosssummon.config;

public class FailEffects {

    private final String broadcastMessage;
    private final SoundEffectEntry sound; // nullable

    public FailEffects(String broadcastMessage, SoundEffectEntry sound) {
        this.broadcastMessage = broadcastMessage;
        this.sound = sound;
    }

    public String getBroadcastMessage() {
        return broadcastMessage;
    }

    public SoundEffectEntry getSound() {
        return sound;
    }
}