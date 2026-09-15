package me.ihqqq.library_management.controller;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import me.ihqqq.library_management.dto.response.ApiResponse;
import me.ihqqq.library_management.dto.response.BookResponse;
import me.ihqqq.library_management.service.EmployeeService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/books")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BookController {

    EmployeeService employeeService; // Reusing EmployeeService for getting books

    @GetMapping
    @PreAuthorize("isAuthenticated()") // Any logged in user (READER, EMPLOYEE, ADMIN)
    ApiResponse<List<BookResponse>> getBooks() {
        return ApiResponse.<List<BookResponse>>builder()
                .result(employeeService.getBooks())
                .build();
    }
}
