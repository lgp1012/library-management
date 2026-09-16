package me.ihqqq.library_management.controller;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import me.ihqqq.library_management.dto.response.ApiResponse;
import me.ihqqq.library_management.dto.response.AvailableCopyLocationResponse;
import me.ihqqq.library_management.dto.response.BookCatalogSummaryResponse;
import me.ihqqq.library_management.dto.response.OverdueReaderResponse;
import me.ihqqq.library_management.dto.response.ReaderBorrowingHistoryResponse;
import me.ihqqq.library_management.service.ReportService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/employees/reports")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ReportController {

    ReportService reportService;

    @GetMapping("/overdue")
    ApiResponse<List<OverdueReaderResponse>> getOverdueReaders() {
        return ApiResponse.<List<OverdueReaderResponse>>builder()
                .result(reportService.getOverdueReaders())
                .build();
    }

    @GetMapping("/catalog-search")
    ApiResponse<List<BookCatalogSummaryResponse>> searchCatalog(@RequestParam(defaultValue = "") String q) {
        return ApiResponse.<List<BookCatalogSummaryResponse>>builder()
                .result(reportService.searchCatalog(q))
                .build();
    }

    @GetMapping("/available-locations")
    ApiResponse<List<AvailableCopyLocationResponse>> getAvailableLocations(@RequestParam String bookId) {
        return ApiResponse.<List<AvailableCopyLocationResponse>>builder()
                .result(reportService.getAvailableCopyLocations(bookId))
                .build();
    }

    @GetMapping("/readers/{readerId}/history")
    ApiResponse<List<ReaderBorrowingHistoryResponse>> getReaderHistory(@PathVariable String readerId) {
        return ApiResponse.<List<ReaderBorrowingHistoryResponse>>builder()
                .result(reportService.getReaderBorrowingHistory(readerId))
                .build();
    }
}
