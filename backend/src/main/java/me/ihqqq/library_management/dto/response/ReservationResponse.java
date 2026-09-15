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
public class ReservationResponse {
    String reservationId;
    String readerId;
    String readerName;
    String bookId;
    String bookName;
    LocalDate reservationDate;
    LocalDate expiryDate;
    LocalDate estimatedAvailableDate;
    String status;
}
