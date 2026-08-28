package me.ihqqq.library_management.exception;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION(9999, "Uncategorized error", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_KEY(1001, "Invalid key", HttpStatus.BAD_REQUEST),

    ROLE_NOT_FOUND(1101, "Role not found", HttpStatus.NOT_FOUND),
    ROLE_NAME_REQUIRED(1102, "Role name is required", HttpStatus.BAD_REQUEST),
    ROLE_NAME_TOO_LONG(1103, "Role name must not exceed 50 characters", HttpStatus.BAD_REQUEST),
    ROLE_NAME_EXISTED(1104, "Role name already exists", HttpStatus.BAD_REQUEST),
    ROLE_IN_USE(1105, "Cannot delete role that is still assigned to users", HttpStatus.BAD_REQUEST),

    USER_NOT_FOUND(1201, "User not found", HttpStatus.NOT_FOUND),
    USERNAME_REQUIRED(1202, "Username is required", HttpStatus.BAD_REQUEST),
    USERNAME_TOO_LONG(1203, "Username must not exceed 50 characters", HttpStatus.BAD_REQUEST),
    USERNAME_EXISTED(1204, "Username already exists", HttpStatus.BAD_REQUEST),
    PASSWORD_REQUIRED(1205, "Password is required", HttpStatus.BAD_REQUEST),
    INVALID_PASSWORD(1206, "Password must be at least {min} characters", HttpStatus.BAD_REQUEST),
    EMAIL_REQUIRED(1207, "Email is required", HttpStatus.BAD_REQUEST),
    INVALID_EMAIL(1208, "Invalid email address", HttpStatus.BAD_REQUEST),
    EMAIL_TOO_LONG(1209, "Email must not exceed 100 characters", HttpStatus.BAD_REQUEST),
    EMAIL_EXISTED(1210, "Email already exists", HttpStatus.BAD_REQUEST),

    UNAUTHENTICATED(1301, "Unauthenticated", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(1302, "You do not have permission", HttpStatus.FORBIDDEN),
    USER_INACTIVE(1303, "This account has been deactivated", HttpStatus.FORBIDDEN),
    ;

    int code;
    String message;
    HttpStatusCode statusCode;

    ErrorCode(int code, String message, HttpStatusCode statusCode) {
        this.code = code;
        this.message = message;
        this.statusCode = statusCode;
    }
}