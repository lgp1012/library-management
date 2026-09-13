package me.ihqqq.library_management.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
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
public class BorrowingConfigRequest {

    @NotNull(message = "BORROWING_CONFIG_VALUE_REQUIRED")
    @Positive(message = "BORROWING_CONFIG_VALUE_INVALID")
    Integer maxBorrowDays;

    @NotNull(message = "BORROWING_CONFIG_VALUE_REQUIRED")
    @Positive(message = "BORROWING_CONFIG_VALUE_INVALID")
    Integer maxBooksPerReader;
}