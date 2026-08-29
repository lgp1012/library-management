package me.ihqqq.library_management.util;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Arrays;

public class PasswordUtils {

    private static final String ALGORITHM = "SHA-512";

    private PasswordUtils() {
    }

    public static byte[] hash(String rawPassword) {
        try {
            MessageDigest digest = MessageDigest.getInstance(ALGORITHM);
            return digest.digest(rawPassword.getBytes(StandardCharsets.UTF_8));
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException();
        }
    }

    public static boolean matches(String rawPassword, byte[] hashed) {
        return Arrays.equals(hash(rawPassword), hashed);
    }
}