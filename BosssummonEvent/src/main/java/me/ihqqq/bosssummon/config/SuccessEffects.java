package me.ihqqq.bosssummon.config;

import java.util.List;

public class SuccessEffects {

    private final String title;
    private final String subtitle;
    private final int fadeIn;
    private final int stay;
    private final int fadeOut;
    private final String broadcastMessage;
    private final SoundEffectEntry sound; // nullable
    private final List<ParticleEffectEntry> particles;
    private final boolean firework;
    private final int fireworkCount;
    private final double fireworkRadius;

    public SuccessEffects(String title, String subtitle, int fadeIn, int stay, int fadeOut,
                          String broadcastMessage, SoundEffectEntry sound,
                          List<ParticleEffectEntry> particles,
                          boolean firework, int fireworkCount, double fireworkRadius) {
        this.title = title;
        this.subtitle = subtitle;
        this.fadeIn = fadeIn;
        this.stay = stay;
        this.fadeOut = fadeOut;
        this.broadcastMessage = broadcastMessage;
        this.sound = sound;
        this.particles = particles;
        this.firework = firework;
        this.fireworkCount = fireworkCount;
        this.fireworkRadius = fireworkRadius;
    }

    public String getTitle() {
        return title;
    }

    public String getSubtitle() {
        return subtitle;
    }

    public int getFadeIn() {
        return fadeIn;
    }

    public int getStay() {
        return stay;
    }

    public int getFadeOut() {
        return fadeOut;
    }

    public String getBroadcastMessage() {
        return broadcastMessage;
    }

    public SoundEffectEntry getSound() {
        return sound;
    }

    public List<ParticleEffectEntry> getParticles() {
        return particles;
    }

    public boolean isFirework() {
        return firework;
    }

    public int getFireworkCount() {
        return fireworkCount;
    }

    public double getFireworkRadius() {
        return fireworkRadius;
    }
}