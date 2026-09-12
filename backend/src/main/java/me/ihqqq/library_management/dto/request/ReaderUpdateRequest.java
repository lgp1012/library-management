package me.ihqqq.library_management.dto.request;

import jakarta.validation.constraints.Size;
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
public class ReaderUpdateRequest {

    @Size(max = 100, message = "READER_NAME_TOO_LONG")
    String readerName;

    @Size(max = 20, message = "PHONE_NUMBER_TOO_LONG")
    String phoneNumber;
}
