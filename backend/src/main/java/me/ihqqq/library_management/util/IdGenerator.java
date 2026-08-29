package me.ihqqq.library_management.util;

import java.security.SecureRandom;

public class IdGenerator {

    private static final String CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static final int USER_ID_LENGTH = 10;
    private static final SecureRandom RANDOM = new SecureRandom();

    private IdGenerator() {
    }

    public static String generateUserId() {
        StringBuilder sb = new StringBuilder(USER_ID_LENGTH);
        for (int i = 0; i < USER_ID_LENGTH; i++) {
            sb.append(CHARS.charAt(RANDOM.nextInt(CHARS.length())));
        }
        return sb.toString();
    }
}