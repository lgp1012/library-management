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

/** Ánh xạ view vw_OverdueReaders. */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OverdueReaderResponse {
    String readerId;
    String readerName;
    String email;
    String phoneNumber;
    String bookName;
    String copyId;
    LocalDate expectedReturnDate;
    Integer overdueDays;
    BigDecimal estimatedFine;
}
