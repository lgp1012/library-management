package me.ihqqq.library_management.controller;

import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import me.ihqqq.library_management.dto.request.AuthorRequest;
import me.ihqqq.library_management.dto.request.BorrowingConfigRequest;
import me.ihqqq.library_management.dto.request.CategoryRequest;
import me.ihqqq.library_management.dto.request.EmployeeCreationRequest;
import me.ihqqq.library_management.dto.request.FineConfigRequest;
import me.ihqqq.library_management.dto.request.PublisherRequest;
import me.ihqqq.library_management.dto.request.ShelfRequest;
import me.ihqqq.library_management.dto.response.ApiResponse;
import me.ihqqq.library_management.dto.response.AuthorResponse;
import me.ihqqq.library_management.dto.response.BorrowingConfigResponse;
import me.ihqqq.library_management.dto.response.CategoryResponse;
import me.ihqqq.library_management.dto.response.EmployeeResponse;
import me.ihqqq.library_management.dto.response.FineConfigResponse;
import me.ihqqq.library_management.dto.response.PublisherResponse;
import me.ihqqq.library_management.dto.response.ShelfResponse;
import me.ihqqq.library_management.dto.response.SystemLogResponse;
import me.ihqqq.library_management.service.AdminService;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AdminController {

    AdminService adminService;

    @GetMapping("/employees")
    ApiResponse<List<EmployeeResponse>> getEmployees() {
        return ApiResponse.<List<EmployeeResponse>>builder()
                .result(adminService.getEmployees())
                .build();
    }

    @PostMapping("/employees")
    @ResponseStatus(HttpStatus.CREATED)
    ApiResponse<EmployeeResponse> createEmployee(
            @RequestBody @Valid EmployeeCreationRequest request,
            Authentication authentication
    ) {
        return ApiResponse.<EmployeeResponse>builder()
                .result(adminService.createEmployee(request, authentication.getName()))
                .build();
    }

    @PutMapping("/employees/{employeeId}/deactivate")
    ApiResponse<Void> deactivateEmployee(
            @PathVariable String employeeId,
            Authentication authentication
    ) {
        adminService.deactivateEmployee(employeeId, authentication.getName());
        return ApiResponse.<Void>builder()
                .message("Employee account deactivated successfully")
                .build();
    }

    @GetMapping("/config/borrowing")
    ApiResponse<BorrowingConfigResponse> getBorrowingConfig() {
        return ApiResponse.<BorrowingConfigResponse>builder()
                .result(adminService.getBorrowingConfig())
                .build();
    }

    @PutMapping("/config/borrowing")
    ApiResponse<BorrowingConfigResponse> updateBorrowingConfig(
            @RequestBody @Valid BorrowingConfigRequest request,
            Authentication authentication
    ) {
        return ApiResponse.<BorrowingConfigResponse>builder()
                .result(adminService.updateBorrowingConfig(request, authentication.getName()))
                .build();
    }

    @GetMapping("/config/fines")
    ApiResponse<FineConfigResponse> getFineConfig() {
        return ApiResponse.<FineConfigResponse>builder()
                .result(adminService.getFineConfig())
                .build();
    }

    @PutMapping("/config/fines")
    ApiResponse<FineConfigResponse> updateFineConfig(
            @RequestBody @Valid FineConfigRequest request,
            Authentication authentication
    ) {
        return ApiResponse.<FineConfigResponse>builder()
                .result(adminService.updateFineConfig(request, authentication.getName()))
                .build();
    }

    @GetMapping("/categories")
    ApiResponse<List<CategoryResponse>> getCategories() {
        return ApiResponse.<List<CategoryResponse>>builder()
                .result(adminService.getCategories())
                .build();
    }

    @PostMapping("/categories")
    @ResponseStatus(HttpStatus.CREATED)
    ApiResponse<CategoryResponse> createCategory(
            @RequestBody @Valid CategoryRequest request,
            Authentication authentication
    ) {
        return ApiResponse.<CategoryResponse>builder()
                .result(adminService.createCategory(request, authentication.getName()))
                .build();
    }

    @PutMapping("/categories/{categoryId}")
    ApiResponse<CategoryResponse> updateCategory(
            @PathVariable String categoryId,
            @RequestBody @Valid CategoryRequest request,
            Authentication authentication
    ) {
        return ApiResponse.<CategoryResponse>builder()
                .result(adminService.updateCategory(categoryId, request, authentication.getName()))
                .build();
    }

    @DeleteMapping("/categories/{categoryId}")
    ApiResponse<Void> deleteCategory(
            @PathVariable String categoryId,
            Authentication authentication
    ) {
        adminService.deleteCategory(categoryId, authentication.getName());
        return ApiResponse.<Void>builder().message("Category deleted successfully").build();
    }

    @GetMapping("/authors")
    ApiResponse<List<AuthorResponse>> getAuthors() {
        return ApiResponse.<List<AuthorResponse>>builder()
                .result(adminService.getAuthors())
                .build();
    }

    @PostMapping("/authors")
    @ResponseStatus(HttpStatus.CREATED)
    ApiResponse<AuthorResponse> createAuthor(
            @RequestBody @Valid AuthorRequest request,
            Authentication authentication
    ) {
        return ApiResponse.<AuthorResponse>builder()
                .result(adminService.createAuthor(request, authentication.getName()))
                .build();
    }

    @PutMapping("/authors/{authorId}")
    ApiResponse<AuthorResponse> updateAuthor(
            @PathVariable String authorId,
            @RequestBody @Valid AuthorRequest request,
            Authentication authentication
    ) {
        return ApiResponse.<AuthorResponse>builder()
                .result(adminService.updateAuthor(authorId, request, authentication.getName()))
                .build();
    }

    @DeleteMapping("/authors/{authorId}")
    ApiResponse<Void> deleteAuthor(
            @PathVariable String authorId,
            Authentication authentication
    ) {
        adminService.deleteAuthor(authorId, authentication.getName());
        return ApiResponse.<Void>builder().message("Author deleted successfully").build();
    }

    @GetMapping("/publishers")
    ApiResponse<List<PublisherResponse>> getPublishers() {
        return ApiResponse.<List<PublisherResponse>>builder()
                .result(adminService.getPublishers())
                .build();
    }

    @PostMapping("/publishers")
    @ResponseStatus(HttpStatus.CREATED)
    ApiResponse<PublisherResponse> createPublisher(
            @RequestBody @Valid PublisherRequest request,
            Authentication authentication
    ) {
        return ApiResponse.<PublisherResponse>builder()
                .result(adminService.createPublisher(request, authentication.getName()))
                .build();
    }

    @PutMapping("/publishers/{publisherId}")
    ApiResponse<PublisherResponse> updatePublisher(
            @PathVariable String publisherId,
            @RequestBody @Valid PublisherRequest request,
            Authentication authentication
    ) {
        return ApiResponse.<PublisherResponse>builder()
                .result(adminService.updatePublisher(publisherId, request, authentication.getName()))
                .build();
    }

    @DeleteMapping("/publishers/{publisherId}")
    ApiResponse<Void> deletePublisher(
            @PathVariable String publisherId,
            Authentication authentication
    ) {
        adminService.deletePublisher(publisherId, authentication.getName());
        return ApiResponse.<Void>builder().message("Publisher deleted successfully").build();
    }

    @GetMapping("/shelves")
    ApiResponse<List<ShelfResponse>> getShelves() {
        return ApiResponse.<List<ShelfResponse>>builder()
                .result(adminService.getShelves())
                .build();
    }

    @PostMapping("/shelves")
    @ResponseStatus(HttpStatus.CREATED)
    ApiResponse<ShelfResponse> createShelf(
            @RequestBody @Valid ShelfRequest request,
            Authentication authentication
    ) {
        return ApiResponse.<ShelfResponse>builder()
                .result(adminService.createShelf(request, authentication.getName()))
                .build();
    }

    @PutMapping("/shelves/{shelfId}")
    ApiResponse<ShelfResponse> updateShelf(
            @PathVariable String shelfId,
            @RequestBody @Valid ShelfRequest request,
            Authentication authentication
    ) {
        return ApiResponse.<ShelfResponse>builder()
                .result(adminService.updateShelf(shelfId, request, authentication.getName()))
                .build();
    }

    @DeleteMapping("/shelves/{shelfId}")
    ApiResponse<Void> deleteShelf(
            @PathVariable String shelfId,
            Authentication authentication
    ) {
        adminService.deleteShelf(shelfId, authentication.getName());
        return ApiResponse.<Void>builder().message("Shelf deleted successfully").build();
    }

    @GetMapping("/system-logs")
    ApiResponse<List<SystemLogResponse>> getSystemLogs() {
        return ApiResponse.<List<SystemLogResponse>>builder()
                .result(adminService.getSystemLogs())
                .build();
    }
}