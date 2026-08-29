package me.ihqqq.bosssummon.config;

public class SummonMobEntry {

    private final String mythicInternalName;
    private final int amount;

    public SummonMobEntry(String mythicInternalName, int amount) {
        this.mythicInternalName = mythicInternalName;
        this.amount = Math.max(1, amount);
    }

    public String getMythicInternalName() {
        return mythicInternalName;
    }

    public int getAmount() {
        return amount;
    }
}