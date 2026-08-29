package me.ihqqq.bosssummon.config;

import org.bukkit.boss.BarColor;
import org.bukkit.boss.BarStyle;

public class BossBarSettings {

    private final String titleTemplate;
    private final BarColor color;
    private final BarStyle style;

    public BossBarSettings(String titleTemplate, BarColor color, BarStyle style) {
        this.titleTemplate = titleTemplate;
        this.color = color;
        this.style = style;
    }

    public String getTitleTemplate() {
        return titleTemplate;
    }

    public BarColor getColor() {
        return color;
    }

    public BarStyle getStyle() {
        return style;
    }
}