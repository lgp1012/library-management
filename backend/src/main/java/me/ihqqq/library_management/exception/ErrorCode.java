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

    READER_NOT_FOUND(1401, "Reader not found", HttpStatus.NOT_FOUND),
    READER_NAME_REQUIRED(1402, "Reader name is required", HttpStatus.BAD_REQUEST),
    READER_NAME_TOO_LONG(1403, "Reader name must not exceed 100 characters", HttpStatus.BAD_REQUEST),
    PHONE_NUMBER_TOO_LONG(1404, "Phone number must not exceed 20 characters", HttpStatus.BAD_REQUEST),

    BOOK_NOT_FOUND(1501, "Book not found", HttpStatus.NOT_FOUND),
    BOOK_STILL_AVAILABLE(1502, "This book still has available copies, no need to reserve", HttpStatus.BAD_REQUEST),
    RESERVATION_EXISTED(1503, "You already have a pending reservation for this book", HttpStatus.BAD_REQUEST),

    DETAIL_BORROWING_NOT_FOUND(1601, "Borrowing detail not found", HttpStatus.NOT_FOUND),
    BORROWING_NOT_OWNED(1602, "This borrowing record does not belong to you", HttpStatus.FORBIDDEN),
    BOOK_ALREADY_RETURNED(1603, "This book has already been returned, cannot renew", HttpStatus.BAD_REQUEST),
    BOOK_RESERVED_BY_OTHERS(1604, "Cannot renew: another reader is waiting for this book", HttpStatus.BAD_REQUEST),
    BORROWING_CONFIG_NOT_FOUND(1605, "Borrowing configuration has not been set up", HttpStatus.NOT_FOUND),

    EMPLOYEE_NOT_FOUND(1701, "Employee not found", HttpStatus.NOT_FOUND),
    EMPLOYEE_NAME_REQUIRED(1702, "Employee name is required", HttpStatus.BAD_REQUEST),
    EMPLOYEE_NAME_TOO_LONG(1703, "Employee name must not exceed 100 characters", HttpStatus.BAD_REQUEST),
    EMPLOYEE_ADDRESS_TOO_LONG(1704, "Employee address must not exceed 200 characters", HttpStatus.BAD_REQUEST),
    EMPLOYEE_ALREADY_INACTIVE(1705, "Employee account is already inactive", HttpStatus.BAD_REQUEST),

    BORROWING_CONFIG_VALUE_REQUIRED(1710, "Borrowing configuration values are required", HttpStatus.BAD_REQUEST),
    BORROWING_CONFIG_VALUE_INVALID(1711, "Borrowing configuration values must be greater than zero", HttpStatus.BAD_REQUEST),
    FINE_CONFIG_NOT_FOUND(1712, "Fine configuration has not been set up", HttpStatus.NOT_FOUND),
    FINE_TYPE_REQUIRED(1713, "Fine type is required", HttpStatus.BAD_REQUEST),
    FINE_TYPE_TOO_LONG(1714, "Fine type must not exceed 100 characters", HttpStatus.BAD_REQUEST),
    FINE_RATE_REQUIRED(1715, "Fine rate is required", HttpStatus.BAD_REQUEST),
    FINE_RATE_INVALID(1716, "Fine rate must be greater than zero and have at most two decimal places", HttpStatus.BAD_REQUEST),
    FINE_DESCRIPTION_TOO_LONG(1717, "Fine description must not exceed 500 characters", HttpStatus.BAD_REQUEST),

    CATEGORY_NOT_FOUND(1720, "Category not found", HttpStatus.NOT_FOUND),
    CATEGORY_NAME_REQUIRED(1721, "Category name is required", HttpStatus.BAD_REQUEST),
    CATEGORY_NAME_TOO_LONG(1722, "Category name must not exceed 100 characters", HttpStatus.BAD_REQUEST),
    CATEGORY_NAME_EXISTED(1723, "Category name already exists", HttpStatus.BAD_REQUEST),
    CATEGORY_IN_USE(1724, "Cannot delete a category assigned to books", HttpStatus.BAD_REQUEST),

    AUTHOR_NOT_FOUND(1730, "Author not found", HttpStatus.NOT_FOUND),
    AUTHOR_NAME_REQUIRED(1731, "Author name is required", HttpStatus.BAD_REQUEST),
    AUTHOR_NAME_TOO_LONG(1732, "Author name must not exceed 100 characters", HttpStatus.BAD_REQUEST),
    AUTHOR_NAME_EXISTED(1733, "Author name already exists", HttpStatus.BAD_REQUEST),
    AUTHOR_IN_USE(1734, "Cannot delete an author assigned to books", HttpStatus.BAD_REQUEST),
    AUTHOR_BIRTHDAY_INVALID(1735, "Author birthday must be in the past", HttpStatus.BAD_REQUEST),
    AUTHOR_NATIONALITY_TOO_LONG(1736, "Author nationality must not exceed 100 characters", HttpStatus.BAD_REQUEST),

    PUBLISHER_NOT_FOUND(1740, "Publisher not found", HttpStatus.NOT_FOUND),
    PUBLISHER_NAME_REQUIRED(1741, "Publisher name is required", HttpStatus.BAD_REQUEST),
    PUBLISHER_NAME_TOO_LONG(1742, "Publisher name must not exceed 100 characters", HttpStatus.BAD_REQUEST),
    PUBLISHER_NAME_EXISTED(1743, "Publisher name already exists", HttpStatus.BAD_REQUEST),
    PUBLISHER_IN_USE(1744, "Cannot delete a publisher assigned to books", HttpStatus.BAD_REQUEST),

    SHELF_NOT_FOUND(1750, "Shelf not found", HttpStatus.NOT_FOUND),
    SHELF_NAME_REQUIRED(1751, "Shelf name is required", HttpStatus.BAD_REQUEST),
    SHELF_NAME_TOO_LONG(1752, "Shelf name must not exceed 100 characters", HttpStatus.BAD_REQUEST),
    SHELF_NAME_EXISTED(1753, "Shelf name already exists", HttpStatus.BAD_REQUEST),
    SHELF_IN_USE(1754, "Cannot delete a shelf that contains book copies", HttpStatus.BAD_REQUEST),
    SHELF_POSITION_TOO_LONG(1755, "Shelf position must not exceed 100 characters", HttpStatus.BAD_REQUEST),

    MEMBERSHIP_EXPIRY_INVALID(1760, "Membership expiry must not be in the past", HttpStatus.BAD_REQUEST),
    BOOK_NAME_REQUIRED(1761, "Book name is required", HttpStatus.BAD_REQUEST),
    BOOK_NAME_TOO_LONG(1762, "Book name must not exceed 100 characters", HttpStatus.BAD_REQUEST),
    BOOK_NAME_EXISTED(1763, "Book name already exists", HttpStatus.BAD_REQUEST),
    BOOK_HAS_COPIES(1764, "Cannot delete a book that still has copies", HttpStatus.BAD_REQUEST),
    COPY_ID_REQUIRED(1765, "Copy id is required", HttpStatus.BAD_REQUEST),
    COPY_ID_TOO_LONG(1766, "Copy id must not exceed 10 characters", HttpStatus.BAD_REQUEST),
    COPY_ID_EXISTED(1767, "Copy id already exists", HttpStatus.BAD_REQUEST),
    COPY_NOT_FOUND(1768, "Book copy not found", HttpStatus.NOT_FOUND),
    INVALID_COPY_STATUS(1769, "Invalid book copy status", HttpStatus.BAD_REQUEST),
    READER_ID_REQUIRED(1770, "Reader id is required", HttpStatus.BAD_REQUEST),
    COPY_IDS_REQUIRED(1771, "At least one book copy is required", HttpStatus.BAD_REQUEST),
    READER_HAS_UNPAID_FINE(1772, "Reader has unpaid fines", HttpStatus.BAD_REQUEST),
    READER_HAS_ACTIVE_BORROWING(1773, "Reader still has borrowed books", HttpStatus.BAD_REQUEST),
    READER_HAS_PENDING_RESERVATION(1774, "Reader has pending reservations", HttpStatus.BAD_REQUEST),
    BORROWING_LIMIT_REACHED(1775, "Reader has reached the borrowing limit", HttpStatus.BAD_REQUEST),
    COPY_NOT_AVAILABLE(1776, "Book copy is not available", HttpStatus.BAD_REQUEST),
    BORROWING_NOT_FOUND(1777, "Borrowing slip not found", HttpStatus.NOT_FOUND),
    DETAIL_ID_REQUIRED(1778, "Borrowing detail id is required", HttpStatus.BAD_REQUEST),
    COPY_ALREADY_RETURNED(1779, "Book copy has already been returned", HttpStatus.BAD_REQUEST),
    INVALID_RETURN_STATUS(1780, "Return condition must be Available, Lost, or Damaged", HttpStatus.BAD_REQUEST),
    FINE_NOT_FOUND(1781, "Fine notice not found", HttpStatus.NOT_FOUND),
    FINE_ALREADY_PAID(1782, "Fine notice is already paid", HttpStatus.BAD_REQUEST),
    RESERVATION_NOT_FOUND(1783, "Reservation not found", HttpStatus.NOT_FOUND),
    RESERVATION_NOT_AVAILABLE(1784, "No available copy for this reservation", HttpStatus.BAD_REQUEST),
    RESERVATION_EXPIRY_DAYS_INVALID(1785, "Reservation expiry days must be greater than zero", HttpStatus.BAD_REQUEST),
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