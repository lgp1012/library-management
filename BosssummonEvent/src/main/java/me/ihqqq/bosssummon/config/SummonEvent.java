package me.ihqqq.bosssummon.config;

import org.bukkit.Location;

import java.util.List;

public class SummonEvent {

    private final String id;
    private final String displayName;
    private final int timeLimitSeconds;
    private final BossBarSettings bossBarSettings;
    private final List<KillRequirement> requirements;
    private final Location defaultSummonLocation; // co the null -> dung vi tri nguoi thuc hien lenh
    private final List<SummonMobEntry> summonMobs;
    private final SuccessEffects successEffects;
    private final FailEffects failEffects;

    public SummonEvent(String id, String displayName, int timeLimitSeconds,
                       BossBarSettings bossBarSettings, List<KillRequirement> requirements,
                       Location defaultSummonLocation, List<SummonMobEntry> summonMobs,
                       SuccessEffects successEffects, FailEffects failEffects) {
        this.id = id;
        this.displayName = displayName;
        this.timeLimitSeconds = timeLimitSeconds;
        this.bossBarSettings = bossBarSettings;
        this.requirements = requirements;
        this.defaultSummonLocation = defaultSummonLocation;
        this.summonMobs = summonMobs;
        this.successEffects = successEffects;
        this.failEffects = failEffects;
    }

    public String getId() {
        return id;
    }

    public String getDisplayName() {
        return displayName;
    }

    public int getTimeLimitSeconds() {
        return timeLimitSeconds;
    }

    public BossBarSettings getBossBarSettings() {
        return bossBarSettings;
    }

    public List<KillRequirement> getRequirements() {
        return requirements;
    }

    public int getTotalRequiredAmount() {
        return requirements.stream().mapToInt(KillRequirement::getAmount).sum();
    }

    public Location getDefaultSummonLocation() {
        return defaultSummonLocation;
    }

    public List<SummonMobEntry> getSummonMobs() {
        return summonMobs;
    }

    public SuccessEffects getSuccessEffects() {
        return successEffects;
    }

    public FailEffects getFailEffects() {
        return failEffects;
    }
}