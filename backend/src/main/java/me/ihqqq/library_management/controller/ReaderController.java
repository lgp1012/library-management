package me.ihqqq.library_management.controller;

import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import me.ihqqq.library_management.dto.request.ReaderRegistrationRequest;
import me.ihqqq.library_management.dto.request.ReaderUpdateRequest;
import me.ihqqq.library_management.dto.request.ReservationRequest;
import me.ihqqq.library_management.dto.response.ApiResponse;
import me.ihqqq.library_management.dto.response.DetailBorrowingSlipResponse;
import me.ihqqq.library_management.dto.response.ReaderResponse;
import me.ihqqq.library_management.dto.response.ReservationResponse;
import me.ihqqq.library_management.service.ReaderService;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/readers")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ReaderController {

    ReaderService readerService;

    /**
     * Đăng ký tài khoản độc giả — endpoint công khai, không cần xác thực.
     */
    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    ApiResponse<ReaderResponse> register(@RequestBody @Valid ReaderRegistrationRequest request) {
        return ApiResponse.<ReaderResponse>builder()
                .result(readerService.register(request))
                .build();
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('READER')")
    ApiResponse<ReaderResponse> getMyProfile(Authentication authentication) {
        return ApiResponse.<ReaderResponse>builder()
                .result(readerService.getMyProfile(authentication.getName()))
                .build();
    }

    @PutMapping("/me")
    @PreAuthorize("hasRole('READER')")
    ApiResponse<ReaderResponse> updateMyProfile(Authentication authentication,
                                                @RequestBody @Valid ReaderUpdateRequest request) {
        return ApiResponse.<ReaderResponse>builder()
                .result(readerService.updateProfile(authentication.getName(), request))
                .build();
    }

    /**
     * Đặt trước sách.
     */
    @PostMapping("/me/reservations")
    @PreAuthorize("hasRole('READER')")
    @ResponseStatus(HttpStatus.CREATED)
    ApiResponse<ReservationResponse> reserveBook(Authentication authentication,
                                                 @RequestBody @Valid ReservationRequest request) {
        return ApiResponse.<ReservationResponse>builder()
                .result(readerService.reserveBook(authentication.getName(), request))
                .build();
    }

    /**
     * Gia hạn thời gian mượn sách cho một chi tiết phiếu mượn cụ thể.
     */
    @PatchMapping("/me/borrowings/{detailId}/renew")
    @PreAuthorize("hasRole('READER')")
    ApiResponse<DetailBorrowingSlipResponse> renewBorrowing(Authentication authentication,
                                                            @PathVariable String detailId) {
        return ApiResponse.<DetailBorrowingSlipResponse>builder()
                .result(readerService.renewBorrowing(authentication.getName(), detailId))
                .build();
    }
}
