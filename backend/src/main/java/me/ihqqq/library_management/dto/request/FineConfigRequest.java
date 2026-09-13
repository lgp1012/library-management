package me.ihqqq.library_management.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FineConfigRequest {

    @NotBlank(message = "FINE_TYPE_REQUIRED")
    @Size(max = 100, message = "FINE_TYPE_TOO_LONG")
    String fineType;

    @NotNull(message = "FINE_RATE_REQUIRED")
    @DecimalMin(value = "0.01", message = "FINE_RATE_INVALID")
    @Digits(integer = 10, fraction = 2, message = "FINE_RATE_INVALID")
    BigDecimal fineRatePerDay;

    @Size(max = 500, message = "FINE_DESCRIPTION_TOO_LONG")
    String descriptionFine;
}