package me.ihqqq.library_management.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
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
public class BorrowBooksRequest {

    @NotBlank(message = "READER_ID_REQUIRED")
    String readerId;

    @NotEmpty(message = "COPY_IDS_REQUIRED")
    List<String> copyIds;

    String notes;
}