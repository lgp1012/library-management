package me.ihqqq.library_management.service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.Instant;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

/**
 * Real feature: "phiên kiểm tra dữ liệu" giữ NGUYÊN một transaction/connection thật mở xuyên
 * suốt nhiều request HTTP, để một nhân viên/độc giả có thể đọc lại (re-read) trong CÙNG một
 * transaction và tự thấy con số thay đổi giữa 2 lần đọc — đúng bản chất Non-repeatable Read /
 * Phantom Read (khác với việc so sánh 2 lần gọi API độc lập, vốn luôn có thể lệch nhau và
 * không chứng minh được gì về transaction isolation).
 *
 * Phiên tự huỷ (rollback + đóng connection) sau AUTO_CLOSE_MINUTES nếu không được dùng, để
 * tránh rò rỉ connection trong pool.
 */
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class InventoryAuditService {

    private static final long AUTO_CLOSE_MINUTES = 5;

    DataSource dataSource;

    Map<String, Session> sessions = new ConcurrentHashMap<>();
    ScheduledExecutorService cleaner = Executors.newSingleThreadScheduledExecutor(r -> {
        Thread t = new Thread(r, "audit-session-cleaner");
        t.setDaemon(true);
        return t;
    });

    {
        cleaner.scheduleAtFixedRate(this::evictStale, 1, 1, TimeUnit.MINUTES);
    }

    private static class Session {
        Connection connection;
        String kind; // SHELF | BOOK_AVAILABLE
        String key;
        Instant lastUsed;
    }

    private static final String SHELF_COUNT_SQL =
            "SELECT COUNT(*) FROM book_copies WHERE shelf_id = ? AND status = 'AVAILABLE'";

    public AuditResult startShelfCount(String shelfId) {
        Session s = new Session();
        s.kind = "SHELF";
        s.key = shelfId;
        return open(s, SHELF_COUNT_SQL);
    }

    public AuditResult recountShelf(String auditId) {
        return recount(auditId, SHELF_COUNT_SQL);
    }

    public AuditResult startAvailableCount(String bookId) {
        Session s = new Session();
        s.kind = "BOOK_AVAILABLE";
        s.key = bookId;
        return open(s, "SELECT COUNT(*) FROM book_copies WHERE book_id = ? AND status = 'AVAILABLE'");
    }

    public AuditResult recountAvailable(String auditId) {
        return recount(auditId, "SELECT COUNT(*) FROM book_copies WHERE book_id = ? AND status = 'AVAILABLE'");
    }

    private AuditResult open(Session s, String sql) {
        try {
            Connection c = dataSource.getConnection();
            c.setAutoCommit(false);
            c.setTransactionIsolation(Connection.TRANSACTION_READ_COMMITTED);
            s.connection = c;
            s.lastUsed = Instant.now();
            int count = runCount(c, sql, s.key);
            String auditId = UUID.randomUUID().toString();
            sessions.put(auditId, s);
            return new AuditResult(auditId, count, false);
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    private AuditResult recount(String auditId, String sql) {
        Session s = sessions.get(auditId);
        if (s == null) {
            throw new IllegalStateException("Phiên kiểm tra đã hết hạn hoặc không tồn tại. Hãy bắt đầu lại.");
        }
        try {
            s.lastUsed = Instant.now();
            int count = runCount(s.connection, sql, s.key);
            return new AuditResult(auditId, count, true);
        } catch (SQLException e) {
            throw new RuntimeException(e);
        } finally {
            closeAndRemove(auditId);
        }
    }

    private int runCount(Connection c, String sql, String key) throws SQLException {
        try (PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setString(1, key);
            try (ResultSet rs = ps.executeQuery()) {
                rs.next();
                return rs.getInt(1);
            }
        }
    }

    private void closeAndRemove(String auditId) {
        Session s = sessions.remove(auditId);
        if (s != null) {
            try {
                s.connection.commit();
                s.connection.close();
            } catch (SQLException ignored) {
            }
        }
    }

    private void evictStale() {
        Instant cutoff = Instant.now().minusSeconds(AUTO_CLOSE_MINUTES * 60);
        sessions.entrySet().removeIf(entry -> {
            if (entry.getValue().lastUsed.isBefore(cutoff)) {
                try {
                    entry.getValue().connection.rollback();
                    entry.getValue().connection.close();
                } catch (SQLException ignored) {
                }
                return true;
            }
            return false;
        });
    }

    public record AuditResult(String auditId, int count, boolean closed) {
    }
}
