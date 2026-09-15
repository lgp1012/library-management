package me.ihqqq.library_management.constant;

/**
 * Trạng thái của một bản sao sách
 */
public class BookCopyStatus {
    public static final String AVAILABLE = "AVAILABLE";
    public static final String BORROWED = "BORROWED";
    public static final String RESERVED = "RESERVED";
    public static final String LOST = "LOST";
    public static final String DAMAGED = "DAMAGED";

    private BookCopyStatus() {
    }
}
