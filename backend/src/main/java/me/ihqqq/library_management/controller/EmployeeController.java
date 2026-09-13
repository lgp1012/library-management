package me.ihqqq.library_management.controller;

import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import me.ihqqq.library_management.dto.request.BookRequest;
import me.ihqqq.library_management.dto.request.BorrowBooksRequest;
import me.ihqqq.library_management.dto.request.FineNoticeRequest;
import me.ihqqq.library_management.dto.request.InventoryItemRequest;
import me.ihqqq.library_management.dto.request.ProcessReservationRequest;
import me.ihqqq.library_management.dto.request.ReaderAdminUpdateRequest;
import me.ihqqq.library_management.dto.request.ReaderRegistrationRequest;
import me.ihqqq.library_management.dto.request.ReturnBookRequest;
import me.ihqqq.library_management.dto.response.ApiResponse;
import me.ihqqq.library_management.dto.response.BookCopyResponse;
import me.ihqqq.library_management.dto.response.BookResponse;
import me.ihqqq.library_management.dto.response.EmployeeOperationResponse;
import me.ihqqq.library_management.dto.response.FineNoticeResponse;
import me.ihqqq.library_management.dto.response.ReaderResponse;
import me.ihqqq.library_management.dto.response.ReservationResponse;
import me.ihqqq.library_management.service.EmployeeService;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/employees")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('EMPLOYEE', 'ADMIN')")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class EmployeeController {

    EmployeeService employeeService;

    @GetMapping("/readers")
    ApiResponse<List<ReaderResponse>> getReaders() {
        return ApiResponse.<List<ReaderResponse>>builder()
                .result(employeeService.getReaders())
                .build();
    }

    @PostMapping("/readers")
    @ResponseStatus(HttpStatus.CREATED)
    ApiResponse<ReaderResponse> createReader(
            @RequestBody @Valid ReaderRegistrationRequest request,
            Authentication authentication
    ) {
        return ApiResponse.<ReaderResponse>builder()
                .result(employeeService.createReader(request, authentication.getName()))
                .build();
    }

    @PutMapping("/readers/{readerId}")
    ApiResponse<ReaderResponse> updateReader(
            @PathVariable String readerId,
            @RequestBody @Valid ReaderAdminUpdateRequest request,
            Authentication authentication
    ) {
        return ApiResponse.<ReaderResponse>builder()
                .result(employeeService.updateReader(readerId, request, authentication.getName()))
                .build();
    }

    @PutMapping("/readers/{readerId}/deactivate")
    ApiResponse<Void> deactivateReader(
            @PathVariable String readerId,
            Authentication authentication
    ) {
        employeeService.deactivateReader(readerId, authentication.getName());
        return ApiResponse.<Void>builder()
                .message("Reader account deactivated successfully")
                .build();
    }

    @GetMapping("/books")
    ApiResponse<List<BookResponse>> getBooks() {
        return ApiResponse.<List<BookResponse>>builder()
                .result(employeeService.getBooks())
                .build();
    }

    @PostMapping("/books")
    @ResponseStatus(HttpStatus.CREATED)
    ApiResponse<BookResponse> createBook(
            @RequestBody @Valid BookRequest request,
            Authentication authentication
    ) {
        return ApiResponse.<BookResponse>builder()
                .result(employeeService.createBook(request, authentication.getName()))
                .build();
    }

    @PutMapping("/books/{bookId}")
    ApiResponse<BookResponse> updateBook(
            @PathVariable String bookId,
            @RequestBody @Valid BookRequest request,
            Authentication authentication
    ) {
        return ApiResponse.<BookResponse>builder()
                .result(employeeService.updateBook(bookId, request, authentication.getName()))
                .build();
    }

    @DeleteMapping("/books/{bookId}")
    ApiResponse<Void> deleteBook(
            @PathVariable String bookId,
            Authentication authentication
    ) {
        employeeService.deleteBook(bookId, authentication.getName());
        return ApiResponse.<Void>builder().message("Book deleted successfully").build();
    }

    @PutMapping("/inventory")
    ApiResponse<BookCopyResponse> updateInventory(
            @RequestBody @Valid InventoryItemRequest request,
            Authentication authentication
    ) {
        return ApiResponse.<BookCopyResponse>builder()
                .result(employeeService.updateInventory(request, authentication.getName()))
                .build();
    }

    @PostMapping("/borrowings")
    @ResponseStatus(HttpStatus.CREATED)
    ApiResponse<EmployeeOperationResponse> borrowBooks(
            @RequestBody @Valid BorrowBooksRequest request,
            Authentication authentication
    ) {
        return ApiResponse.<EmployeeOperationResponse>builder()
                .result(employeeService.borrowBooks(request, authentication.getName()))
                .build();
    }

    @PostMapping("/returns")
    ApiResponse<EmployeeOperationResponse> returnBook(
            @RequestBody @Valid ReturnBookRequest request,
            Authentication authentication
    ) {
        return ApiResponse.<EmployeeOperationResponse>builder()
                .result(employeeService.returnBook(request, authentication.getName()))
                .build();
    }

    @PatchMapping("/borrowings/{detailId}/renew")
    ApiResponse<EmployeeOperationResponse> renewBorrowing(
            @PathVariable String detailId,
            Authentication authentication
    ) {
        return ApiResponse.<EmployeeOperationResponse>builder()
                .result(employeeService.renewBorrowing(detailId, authentication.getName()))
                .build();
    }

    @GetMapping("/fines/readers/{readerId}")
    ApiResponse<List<FineNoticeResponse>> getFines(@PathVariable String readerId) {
        return ApiResponse.<List<FineNoticeResponse>>builder()
                .result(employeeService.getFines(readerId))
                .build();
    }

    @PostMapping("/fines")
    @ResponseStatus(HttpStatus.CREATED)
    ApiResponse<FineNoticeResponse> createFine(
            @RequestBody @Valid FineNoticeRequest request,
            Authentication authentication
    ) {
        return ApiResponse.<FineNoticeResponse>builder()
                .result(employeeService.createFine(request, authentication.getName()))
                .build();
    }

    @PutMapping("/fines/{fineId}/collect")
    ApiResponse<FineNoticeResponse> collectFine(
            @PathVariable String fineId,
            Authentication authentication
    ) {
        return ApiResponse.<FineNoticeResponse>builder()
                .result(employeeService.collectFine(fineId, authentication.getName()))
                .build();
    }

    @GetMapping("/reservations/pending")
    ApiResponse<List<ReservationResponse>> getPendingReservations() {
        return ApiResponse.<List<ReservationResponse>>builder()
                .result(employeeService.getPendingReservations())
                .build();
    }

    @PutMapping("/reservations/{reservationId}/process")
    ApiResponse<ReservationResponse> processReservation(
            @PathVariable String reservationId,
            @RequestBody @Valid ProcessReservationRequest request,
            Authentication authentication
    ) {
        return ApiResponse.<ReservationResponse>builder()
                .result(employeeService.processReservation(
                        reservationId, request, authentication.getName()))
                .build();
    }

    @PostMapping("/reservations/expire")
    ApiResponse<Integer> expireReservations(Authentication authentication) {
        return ApiResponse.<Integer>builder()
                .result(employeeService.expireReservations(authentication.getName()))
                .message("Expired reservations processed successfully")
                .build();
    }
}