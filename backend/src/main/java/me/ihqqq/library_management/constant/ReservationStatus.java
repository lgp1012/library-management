package me.ihqqq.library_management.constant;

/**
 * Trạng thái của một yêu cầu đặt trước sách
 */
public class ReservationStatus {
    public static final String UNPROCESSED = "Chưa xử lý";
    public static final String WAITING = "Đang đợi xử lý";
    public static final String PROCESSED = "Đã xử lý";
    public static final String EXPIRED = "Hết hạn";

    private ReservationStatus() {
    }
}
