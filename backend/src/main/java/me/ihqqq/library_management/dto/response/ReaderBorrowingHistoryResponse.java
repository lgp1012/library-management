package me.ihqqq.library_management.dto.response;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/** Ánh xạ view vw_ReaderBorrowingHistory. */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ReaderBorrowingHistoryResponse {
    String readerId;
    String bookName;
    String copyId;
    LocalDateTime borrowDate;
    LocalDate expectedReturnDate;
    LocalDate actualReturnDate;
    BigDecimal fineAmount;
    Boolean paidStatus;
}
