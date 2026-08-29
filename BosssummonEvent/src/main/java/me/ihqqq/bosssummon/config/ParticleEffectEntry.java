package me.ihqqq.bosssummon.config;

import org.bukkit.Particle;

public class ParticleEffectEntry {

    private final Particle particle;
    private final int count;
    private final double offsetX;
    private final double offsetY;
    private final double offsetZ;
    private final double speed;

    public ParticleEffectEntry(Particle particle, int count, double offsetX, double offsetY, double offsetZ, double speed) {
        this.particle = particle;
        this.count = count;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.offsetZ = offsetZ;
        this.speed = speed;
    }

    public Particle getParticle() {
        return particle;
    }

    public int getCount() {
        return count;
    }

    public double getOffsetX() {
        return offsetX;
    }

    public double getOffsetY() {
        return offsetY;
    }

    public double getOffsetZ() {
        return offsetZ;
    }

    public double getSpeed() {
        return speed;
    }
}