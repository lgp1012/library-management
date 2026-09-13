package me.ihqqq.library_management.dto.request;

import jakarta.validation.constraints.Min;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProcessReservationRequest {

    @Min(value = 1, message = "RESERVATION_EXPIRY_DAYS_INVALID")
    @Builder.Default
    Integer expiryDays = 7;
}