package me.ihqqq.bosssummon.config;

public class KillRequirement {

    public enum Type {
        MYTHIC,
        VANILLA
    }

    private final Type type;
    private final String id;
    private final int amount;

    public KillRequirement(Type type, String id, int amount) {
        this.type = type;
        this.id = id;
        this.amount = Math.max(1, amount);
    }

    public Type getType() {
        return type;
    }

    public String getId() {
        return id;
    }

    public int getAmount() {
        return amount;
    }


    public String key() {
        return type.name() + ":" + id.toLowerCase();
    }

    public boolean matchesMythic(String mythicInternalName) {
        return type == Type.MYTHIC && id.equalsIgnoreCase(mythicInternalName);
    }

    public boolean matchesVanilla(String bukkitEntityTypeName) {
        return type == Type.VANILLA && id.equalsIgnoreCase(bukkitEntityTypeName);
    }
}