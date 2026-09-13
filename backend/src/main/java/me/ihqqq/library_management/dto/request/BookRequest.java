package me.ihqqq.library_management.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BookRequest {

    @NotBlank(message = "BOOK_NAME_REQUIRED")
    @Size(max = 100, message = "BOOK_NAME_TOO_LONG")
    String bookName;

    String publisherId;

    Integer year;

    String description;

    @Builder.Default
    List<String> authorIds = new ArrayList<>();

    @Builder.Default
    List<String> categoryIds = new ArrayList<>();

    @Valid
    @Builder.Default
    List<BookCopyRequest> copies = new ArrayList<>();
}