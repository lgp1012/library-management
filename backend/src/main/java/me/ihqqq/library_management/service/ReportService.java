package me.ihqqq.library_management.service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import me.ihqqq.library_management.dto.response.AvailableCopyLocationResponse;
import me.ihqqq.library_management.dto.response.BookCatalogSummaryResponse;
import me.ihqqq.library_management.dto.response.OverdueReaderResponse;
import me.ihqqq.library_management.dto.response.ReaderBorrowingHistoryResponse;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Đọc dữ liệu trực tiếp từ các VIEW đã định nghĩa sẵn trong CSDL
 * (vw_AvailableBooks, vw_OverdueReaders, vw_BookCatalogDetail, vw_ReaderBorrowingHistory)
 * thay vì lặp lại logic JOIN bằng JPA — tận dụng đúng phần đã thiết kế trong script T-SQL.
 */
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ReportService {

    JdbcTemplate jdbc;

    public List<OverdueReaderResponse> getOverdueReaders() {
        return jdbc.query(
                "SELECT * FROM vw_OverdueReaders ORDER BY overdue_days DESC",
                new BeanPropertyRowMapper<>(OverdueReaderResponse.class));
    }

    public List<BookCatalogSummaryResponse> searchCatalog(String keyword) {
        String like = "%" + (keyword == null ? "" : keyword) + "%";
        return jdbc.query(
                "SELECT * FROM vw_BookCatalogDetail WHERE book_name LIKE ? ORDER BY book_name",
                new BeanPropertyRowMapper<>(BookCatalogSummaryResponse.class),
                like);
    }

    public List<AvailableCopyLocationResponse> getAvailableCopyLocations(String bookId) {
        return jdbc.query(
                "SELECT * FROM vw_AvailableBooks WHERE book_id = ? ORDER BY copy_id",
                new BeanPropertyRowMapper<>(AvailableCopyLocationResponse.class),
                bookId);
    }

    public List<ReaderBorrowingHistoryResponse> getReaderBorrowingHistory(String readerId) {
        return jdbc.query(
                "SELECT * FROM vw_ReaderBorrowingHistory WHERE reader_id = ? ORDER BY borrow_date DESC",
                new BeanPropertyRowMapper<>(ReaderBorrowingHistoryResponse.class),
                readerId);
    }
}
