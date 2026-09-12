package me.ihqqq.library_management.service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import me.ihqqq.library_management.constant.BookCopyStatus;
import me.ihqqq.library_management.constant.PredefinedRole;
import me.ihqqq.library_management.constant.ReservationStatus;
import me.ihqqq.library_management.dto.request.ReaderRegistrationRequest;
import me.ihqqq.library_management.dto.request.ReaderUpdateRequest;
import me.ihqqq.library_management.dto.request.ReservationRequest;
import me.ihqqq.library_management.dto.response.DetailBorrowingSlipResponse;
import me.ihqqq.library_management.dto.response.ReaderResponse;
import me.ihqqq.library_management.dto.response.ReservationResponse;
import me.ihqqq.library_management.entity.Book;
import me.ihqqq.library_management.entity.BorrowingConfig;
import me.ihqqq.library_management.entity.DetailBorrowingSlip;
import me.ihqqq.library_management.entity.Notification;
import me.ihqqq.library_management.entity.Reader;
import me.ihqqq.library_management.entity.Reservation;
import me.ihqqq.library_management.entity.Role;
import me.ihqqq.library_management.entity.User;
import me.ihqqq.library_management.exception.AppException;
import me.ihqqq.library_management.exception.ErrorCode;
import me.ihqqq.library_management.mapper.ReaderMapper;
import me.ihqqq.library_management.mapper.ReservationMapper;
import me.ihqqq.library_management.repository.BookCopyRepository;
import me.ihqqq.library_management.repository.BookRepository;
import me.ihqqq.library_management.repository.BorrowingConfigRepository;
import me.ihqqq.library_management.repository.DetailBorrowingSlipRepository;
import me.ihqqq.library_management.repository.NotificationRepository;
import me.ihqqq.library_management.repository.ReaderRepository;
import me.ihqqq.library_management.repository.ReservationRepository;
import me.ihqqq.library_management.repository.RoleRepository;
import me.ihqqq.library_management.repository.UserRepository;
import me.ihqqq.library_management.util.IdGenerator;
import me.ihqqq.library_management.util.PasswordUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ReaderService {

    ReaderRepository readerRepository;
    UserRepository userRepository;
    RoleRepository roleRepository;
    BookRepository bookRepository;
    BookCopyRepository bookCopyRepository;
    ReservationRepository reservationRepository;
    DetailBorrowingSlipRepository detailBorrowingSlipRepository;
    BorrowingConfigRepository borrowingConfigRepository;
    NotificationRepository notificationRepository;
    ReaderMapper readerMapper;
    ReservationMapper reservationMapper;

    /**
     * Đăng ký tài khoản độc giả (READER > Đăng ký tài khoản).
     * Bảng liên quan: users, readers, notifications.
     */
    @Transactional
    public ReaderResponse register(ReaderRegistrationRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new AppException(ErrorCode.USERNAME_EXISTED);
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new AppException(ErrorCode.EMAIL_EXISTED);
        }

        Role readerRole = roleRepository.findByRoleNameIgnoreCase(PredefinedRole.READER_ROLE)
                .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND));

        User user = User.builder()
                .userId(generateUniqueUserId())
                .username(request.getUsername())
                .passwordHash(PasswordUtils.hash(request.getPassword()))
                .email(request.getEmail())
                .active(true)
                .role(readerRole)
                .build();
        user = userRepository.save(user);

        Reader reader = Reader.builder()
                .readerId(generateUniqueReaderId())
                .readerName(request.getReaderName())
                .phoneNumber(request.getPhoneNumber())
                .membershipExpiry(LocalDate.now().plusYears(1))
                .user(user)
                .build();
        reader = readerRepository.save(reader);

        createNotification(user, "Đăng ký tài khoản",
                "Đăng ký tài khoản độc giả thành công.", "SYSTEM");

        log.info("Reader registered: {} (readerId: {}, userId: {})",
                user.getUsername(), reader.getReaderId(), user.getUserId());

        return readerMapper.toReaderResponse(reader);
    }

    /**
     * Xem thông tin cá nhân (dựa trên username lấy từ JWT subject).
     */
    @Transactional(readOnly = true)
    public ReaderResponse getMyProfile(String username) {
        Reader reader = getReaderByUsername(username);
        return readerMapper.toReaderResponse(reader);
    }

    /**
     * Cập nhật thông tin cá nhân (READER > Cập nhật thông tin cá nhân).
     * Reader chỉ được sửa họ tên và số điện thoại.
     */
    @Transactional
    public ReaderResponse updateProfile(String username, ReaderUpdateRequest request) {
        Reader reader = getReaderByUsername(username);

        if (request.getReaderName() != null) {
            reader.setReaderName(request.getReaderName());
        }
        if (request.getPhoneNumber() != null) {
            reader.setPhoneNumber(request.getPhoneNumber());
        }

        Reader saved = readerRepository.save(reader);
        log.info("Reader profile updated: {}", saved.getReaderId());

        return readerMapper.toReaderResponse(saved);
    }

    /**
     * Đặt trước sách (READER > Đặt trước sách).
     * Bảng liên quan: book_copies, reservations, notifications.
     */
    @Transactional
    public ReservationResponse reserveBook(String username, ReservationRequest request) {
        Reader reader = getReaderByUsername(username);

        Book book = bookRepository.findById(request.getBookId())
                .orElseThrow(() -> new AppException(ErrorCode.BOOK_NOT_FOUND));

        long availableCopies = bookCopyRepository.countByBook_BookIdAndStatus(
                book.getBookId(), BookCopyStatus.AVAILABLE);
        if (availableCopies > 0) {
            throw new AppException(ErrorCode.BOOK_STILL_AVAILABLE);
        }

        boolean hasPendingReservation = reservationRepository
                .existsByReader_ReaderIdAndBook_BookIdAndStatusNot(
                        reader.getReaderId(), book.getBookId(), ReservationStatus.PROCESSED);
        if (hasPendingReservation) {
            throw new AppException(ErrorCode.RESERVATION_EXISTED);
        }

        Reservation reservation = Reservation.builder()
                .reservationId(generateUniqueReservationId())
                .reader(reader)
                .book(book)
                .reservationDate(LocalDate.now())
                .status(ReservationStatus.UNPROCESSED)
                .build();
        reservation = reservationRepository.save(reservation);

        createNotification(reader.getUser(), "Đặt trước sách",
                "Đặt trước sách \"" + book.getBookName() + "\" thành công. "
                        + "Bạn sẽ được thông báo khi sách sẵn sàng để nhận.", "RESERVATION");

        log.info("Reservation created: {} (reader: {}, book: {})",
                reservation.getReservationId(), reader.getReaderId(), book.getBookId());

        return reservationMapper.toReservationResponse(reservation);
    }

    /**
     * Gia hạn thời gian mượn sách (READER > Gia hạn thời gian mượn sách).
     * Bảng liên quan: detail_borrowing_slips, borrowing_config, reservations, notifications.
     * <p>
     * Ghi chú: thiết kế CSDL không tách riêng "số ngày gia hạn" khỏi
     * "số ngày mượn tối đa", nên số ngày gia hạn được tính bằng
     * {@code borrowing_config.max_borrow_days} hiện hành.
     */
    @Transactional
    public DetailBorrowingSlipResponse renewBorrowing(String username, String detailId) {
        Reader reader = getReaderByUsername(username);

        DetailBorrowingSlip detail = detailBorrowingSlipRepository.findById(detailId)
                .orElseThrow(() -> new AppException(ErrorCode.DETAIL_BORROWING_NOT_FOUND));

        if (!detail.getBorrowingSlip().getReader().getReaderId().equals(reader.getReaderId())) {
            throw new AppException(ErrorCode.BORROWING_NOT_OWNED);
        }

        if (detail.getActualReturnDate() != null) {
            throw new AppException(ErrorCode.BOOK_ALREADY_RETURNED);
        }

        Book book = detail.getCopy().getBook();
        boolean waitingReservationExists = reservationRepository
                .existsByBook_BookIdAndStatus(book.getBookId(), ReservationStatus.WAITING);
        if (waitingReservationExists) {
            throw new AppException(ErrorCode.BOOK_RESERVED_BY_OTHERS);
        }

        BorrowingConfig config = borrowingConfigRepository.findTopByOrderByUpdatedAtDesc()
                .orElseThrow(() -> new AppException(ErrorCode.BORROWING_CONFIG_NOT_FOUND));

        LocalDate newExpectedReturnDate = detail.getExpectedReturnDate().plusDays(config.getMaxBorrowDays());
        detail.setExpectedReturnDate(newExpectedReturnDate);
        DetailBorrowingSlip saved = detailBorrowingSlipRepository.save(detail);

        createNotification(reader.getUser(), "Gia hạn mượn sách",
                "Gia hạn thành công cho sách \"" + book.getBookName()
                        + "\". Hạn trả mới: " + newExpectedReturnDate + ".", "BORROWING");

        log.info("Borrowing detail renewed: {} -> new expected return date {}",
                detailId, newExpectedReturnDate);

        return DetailBorrowingSlipResponse.builder()
                .detailId(saved.getDetailId())
                .borrowingId(saved.getBorrowingSlip().getBorrowingId())
                .copyId(saved.getCopy().getCopyId())
                .bookId(book.getBookId())
                .bookName(book.getBookName())
                .expectedReturnDate(saved.getExpectedReturnDate())
                .actualReturnDate(saved.getActualReturnDate())
                .build();
    }

    private Reader getReaderByUsername(String username) {
        return readerRepository.findByUser_Username(username)
                .orElseThrow(() -> new AppException(ErrorCode.READER_NOT_FOUND));
    }

    private void createNotification(User user, String title, String message, String type) {
        Notification notification = Notification.builder()
                .notificationId(generateUniqueNotificationId())
                .createdByUser(user)
                .title(title)
                .notificationMessage(message)
                .notificationType(type)
                .read(false)
                .build();
        notificationRepository.save(notification);
    }

    private String generateUniqueUserId() {
        String id;
        do {
            id = IdGenerator.generateUserId();
        } while (userRepository.existsById(id));
        return id;
    }

    private String generateUniqueReaderId() {
        String id;
        do {
            id = IdGenerator.generateReaderId();
        } while (readerRepository.existsById(id));
        return id;
    }

    private String generateUniqueReservationId() {
        String id;
        do {
            id = IdGenerator.generateReservationId();
        } while (reservationRepository.existsById(id));
        return id;
    }

    private String generateUniqueNotificationId() {
        String id;
        do {
            id = IdGenerator.generateNotificationId();
        } while (notificationRepository.existsById(id));
        return id;
    }
}
