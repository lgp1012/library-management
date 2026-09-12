package me.ihqqq.library_management.util;

import java.security.SecureRandom;

public class IdGenerator {

    private static final String CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static final int USER_ID_LENGTH = 10;
    private static final SecureRandom RANDOM = new SecureRandom();

    private IdGenerator() {
    }

    public static String generateUserId() {
        return generateId("", USER_ID_LENGTH);
    }

    public static String generateId(String prefix, int totalLength) {
        if (prefix.length() >= totalLength) {
            return prefix.substring(0, totalLength);
        }
        StringBuilder sb = new StringBuilder(prefix);
        while (sb.length() < totalLength) {
            sb.append(CHARS.charAt(RANDOM.nextInt(CHARS.length())));
        }
        return sb.toString();
    }

    public static String generateReaderId() {
        return generateId("RD", USER_ID_LENGTH);
    }

    public static String generateReservationId() {
        return generateId("RE", USER_ID_LENGTH);
    }

    public static String generateNotificationId() {
        return generateId("N", USER_ID_LENGTH);
    }
}