package me.ihqqq.library_management.dto.response;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BookResponse {
    String bookId;
    String bookName;
    String publisherId;
    Integer year;
    String description;
    List<String> authorIds;
    List<String> categoryIds;
    List<BookCopyResponse> copies;
}