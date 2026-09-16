package me.ihqqq.library_management.controller;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import me.ihqqq.library_management.dto.response.ApiResponse;
import me.ihqqq.library_management.service.InventoryAuditService;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Phiên kiểm tra dữ liệu thật (giữ transaction mở xuyên nhiều request) — dùng cho tính năng
 * "Kiểm kê kệ" (nhân viên) và "Tìm sách / kiểm tra lại" (độc giả) khi bật Chế độ demo, để
 * minh hoạ Non-repeatable Read / Phantom Read bằng đúng 1 transaction đọc 2 lần.
 */
@RestController
@RequestMapping("/inventory-audit")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class InventoryAuditController {

    InventoryAuditService inventoryAuditService;

    @PostMapping("/shelf/start")
    ApiResponse<InventoryAuditService.AuditResult> startShelf(@RequestParam String shelfId) {
        return ApiResponse.<InventoryAuditService.AuditResult>builder()
                .result(inventoryAuditService.startShelfCount(shelfId))
                .build();
    }

    @PostMapping("/shelf/{auditId}/recount")
    ApiResponse<InventoryAuditService.AuditResult> recountShelf(@PathVariable String auditId) {
        return ApiResponse.<InventoryAuditService.AuditResult>builder()
                .result(inventoryAuditService.recountShelf(auditId))
                .build();
    }

    @PostMapping("/available/start")
    ApiResponse<InventoryAuditService.AuditResult> startAvailable(@RequestParam String bookId) {
        return ApiResponse.<InventoryAuditService.AuditResult>builder()
                .result(inventoryAuditService.startAvailableCount(bookId))
                .build();
    }

    @PostMapping("/available/{auditId}/recount")
    ApiResponse<InventoryAuditService.AuditResult> recountAvailable(@PathVariable String auditId) {
        return ApiResponse.<InventoryAuditService.AuditResult>builder()
                .result(inventoryAuditService.recountAvailable(auditId))
                .build();
    }
}
