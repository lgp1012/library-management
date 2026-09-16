package me.ihqqq.library_management.dto.response;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

/** Ánh xạ view vw_BookCatalogDetail. */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BookCatalogSummaryResponse {
    String bookId;
    String bookName;
    String publisherName;
    Integer year;
    String authors;
    String categories;
    Integer totalCopies;
    Integer availableCopies;
}
