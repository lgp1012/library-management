package me.ihqqq.library_management.controller;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import me.ihqqq.library_management.dto.response.ApiResponse;
import me.ihqqq.library_management.dto.response.AuthorResponse;
import me.ihqqq.library_management.dto.response.CategoryResponse;
import me.ihqqq.library_management.dto.response.PublisherResponse;
import me.ihqqq.library_management.dto.response.ShelfResponse;
import me.ihqqq.library_management.service.AdminService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ReferenceDataController {

    AdminService adminService; // Reuse existing fetch logic

    @GetMapping("/categories")
    @PreAuthorize("isAuthenticated()") // Or hasAnyRole('ADMIN', 'EMPLOYEE', 'READER')
    ApiResponse<List<CategoryResponse>> getCategories() {
        return ApiResponse.<List<CategoryResponse>>builder()
                .result(adminService.getCategories())
                .build();
    }

    @GetMapping("/authors")
    @PreAuthorize("isAuthenticated()")
    ApiResponse<List<AuthorResponse>> getAuthors() {
        return ApiResponse.<List<AuthorResponse>>builder()
                .result(adminService.getAuthors())
                .build();
    }

    @GetMapping("/publishers")
    @PreAuthorize("isAuthenticated()")
    ApiResponse<List<PublisherResponse>> getPublishers() {
        return ApiResponse.<List<PublisherResponse>>builder()
                .result(adminService.getPublishers())
                .build();
    }

    @GetMapping("/shelves")
    @PreAuthorize("isAuthenticated()")
    ApiResponse<List<ShelfResponse>> getShelves() {
        return ApiResponse.<List<ShelfResponse>>builder()
                .result(adminService.getShelves())
                .build();
    }
}
