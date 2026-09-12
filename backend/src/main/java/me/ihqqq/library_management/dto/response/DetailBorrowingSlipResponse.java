package me.ihqqq.library_management.dto.response;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class DetailBorrowingSlipResponse {
    String detailId;
    String borrowingId;
    String copyId;
    String bookId;
    String bookName;
    LocalDate expectedReturnDate;
    LocalDate actualReturnDate;
}
