package me.ihqqq.bosssummon.util;

import org.bukkit.ChatColor;

import java.util.Map;

public final class MessageUtil {

    private MessageUtil() {}

    public static String color(String s) {
        if (s == null) return null;
        return ChatColor.translateAlternateColorCodes('&', s);
    }

    /**
     * Thay the cac placeholder dang {key} bang gia tri tuong ung trong map.
     * Placeholder khong khop se duoc giu nguyen.
     */
    public static String placeholders(String template, Map<String, String> values) {
        if (template == null) return null;
        String result = template;
        for (Map.Entry<String, String> e : values.entrySet()) {
            result = result.replace("{" + e.getKey() + "}", e.getValue());
        }
        return result;
    }
}