package me.ihqqq.library_management.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
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
public class EmployeeCreationRequest {

    @NotBlank(message = "EMPLOYEE_NAME_REQUIRED")
    @Size(max = 100, message = "EMPLOYEE_NAME_TOO_LONG")
    String employeeName;

    @NotBlank(message = "USERNAME_REQUIRED")
    @Size(max = 50, message = "USERNAME_TOO_LONG")
    String username;

    @NotBlank(message = "PASSWORD_REQUIRED")
    @Size(min = 6, message = "INVALID_PASSWORD")
    String password;

    @NotBlank(message = "EMAIL_REQUIRED")
    @Email(message = "INVALID_EMAIL")
    @Size(max = 100, message = "EMAIL_TOO_LONG")
    String email;

    @Size(max = 20, message = "PHONE_NUMBER_TOO_LONG")
    String phoneNumber;

    @Size(max = 200, message = "EMPLOYEE_ADDRESS_TOO_LONG")
    String address;
}