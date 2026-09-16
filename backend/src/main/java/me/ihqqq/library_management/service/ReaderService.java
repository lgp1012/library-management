package me.ihqqq.library_management.service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import me.ihqqq.library_management.constant.BookCopyStatus;
import me.ihqqq.library_management.constant.PredefinedRole;
import me.ihqqq.library_management.constant.ReservationStatus;
import me.ihqqq.library_management.dto.request.ChangePasswordRequest;
import me.ihqqq.library_management.dto.request.ReaderRegistrationRequest;
import me.ihqqq.library_management.dto.request.ReaderUpdateRequest;
import me.ihqqq.library_management.dto.request.ReservationRequest;
import me.ihqqq.library_management.dto.response.DetailBorrowingSlipResponse;
import me.ihqqq.library_management.dto.response.ReaderResponse;
import me.ihqqq.library_management.dto.response.ReservationResponse;
import me.ihqqq.library_management.entity.Book;
import me.ihqqq.library_management.entity.BookCopy;
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
import me.ihqqq.library_management.repository.FineNoticeRepository;
import me.ihqqq.library_management.repository.NotificationRepository;
import me.ihqqq.library_management.repository.ReaderRepository;
import me.ihqqq.library_management.repository.ReservationRepository;
import me.ihqqq.library_management.repository.RoleRepository;
import me.ihqqq.library_management.repository.UserRepository;
import me.ihqqq.library_management.util.IdGenerator;
import me.ihqqq.library_management.util.PasswordUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionTemplate;

import java.time.LocalDate;
import java.util.List;

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
    FineNoticeRepository fineNoticeRepository;
    NotificationRepository notificationRepository;
    ReaderMapper readerMapper;
    ReservationMapper reservationMapper;
    TransactionTemplate transactionTemplate;

    /**
     * Đăng ký tài khoản độc giả (READER > Đăng ký tài khoản).
     * Bảng liên quan: users, readers, notifications.
     */
    public ReaderResponse register(ReaderRegistrationRequest request) {
        return transactionTemplate.execute(status -> {
            if (userRepository.countRegistrationConflictsForUpdate(
                    request.getUsername(), request.getEmail()) > 0) {
                if (userRepository.existsByUsername(request.getUsername())) {
                    throw new AppException(ErrorCode.USERNAME_EXISTED);
                }
                throw new AppException(ErrorCode.EMAIL_EXISTED);
            }
            Role readerRole = roleRepository.findByRoleNameIgnoreCase(PredefinedRole.READER_ROLE)
                    .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND));
            User user = userRepository.save(User.builder()
                    .userId(generateUniqueUserId())
                    .username(request.getUsername())
                    .passwordHash(PasswordUtils.hash(request.getPassword()))
                    .email(request.getEmail())
                    .active(true)
                    .role(readerRole)
                    .build());
            Reader reader = readerRepository.save(Reader.builder()
                    .readerId(generateUniqueReaderId())
                    .readerName(request.getReaderName())
                    .phoneNumber(request.getPhoneNumber())
                    .membershipExpiry(LocalDate.now().plusYears(1))
                    .user(user)
                    .build());
            createNotification(user, "Đăng ký tài khoản",
                    "Đăng ký tài khoản độc giả thành công.", "ACCOUNT");
            log.info("Reader registered: {} (readerId: {}, userId: {})",
                    user.getUsername(), reader.getReaderId(), user.getUserId());
            return populateExtraFields(reader);
        });
    }

    /**
     * Xem thông tin cá nhân (dựa trên username lấy từ JWT subject).
     */
    @Transactional(readOnly = true)

    private ReaderResponse populateExtraFields(Reader reader) {
        ReaderResponse response = readerMapper.toReaderResponse(reader);
        response.setCurrentlyBorrowedBooks(
                detailBorrowingSlipRepository.countByBorrowingSlip_Reader_ReaderIdAndActualReturnDateIsNull(reader.getReaderId()));
        java.util.List<me.ihqqq.library_management.entity.FineNotice> notices = fineNoticeRepository.findByDetail_BorrowingSlip_Reader_ReaderIdOrderByPaidStatusAscFineIdAsc(reader.getReaderId());
        java.math.BigDecimal unpaidFine = notices.stream()
                .filter(n -> !n.isPaidStatus())
                .map(me.ihqqq.library_management.entity.FineNotice::getFinePrice)
                .reduce(java.math.BigDecimal.ZERO, java.math.BigDecimal::add);
        response.setUnpaidFine(unpaidFine);
        return response;
    }

    @Transactional(readOnly = true)
    public java.util.List<DetailBorrowingSlipResponse> getMyBorrowings(String username) {
        Reader reader = getReaderByUsername(username);
        java.util.List<DetailBorrowingSlip> details = detailBorrowingSlipRepository.findByBorrowingSlip_Reader_ReaderIdAndActualReturnDateIsNull(reader.getReaderId());
        return details.stream().map(d -> DetailBorrowingSlipResponse.builder()
                .detailId(d.getDetailId())
                .borrowingId(d.getBorrowingSlip().getBorrowingId())
                .readerId(reader.getReaderId())
                .readerName(reader.getReaderName())
                .copyId(d.getCopy().getCopyId())
                .bookId(d.getCopy().getBook().getBookId())
                .bookName(d.getCopy().getBook().getBookName())
                .borrowingDate(d.getBorrowingSlip().getBorrowDate().toLocalDate())
                .expectedReturnDate(d.getExpectedReturnDate())
                .actualReturnDate(d.getActualReturnDate())
                .build()).collect(java.util.stream.Collectors.toList());
    }

    public ReaderResponse getMyProfile(String username) {
        Reader reader = getReaderByUsername(username);
        return populateExtraFields(reader);
    }

    /**
     * Cập nhật thông tin cá nhân (READER > Cập nhật thông tin cá nhân).
     * Reader chỉ được sửa họ tên và số điện thoại.
     */
    public ReaderResponse updateProfile(String username, ReaderUpdateRequest request) {
        return transactionTemplate.execute(status -> {
            Reader reader = getReaderByUsernameForUpdate(username);
            ensureActive(reader);
            if (request.getReaderName() != null) {
                reader.setReaderName(request.getReaderName());
            }
            if (request.getPhoneNumber() != null) {
                reader.setPhoneNumber(request.getPhoneNumber());
            }
            if (request.getEmail() != null) {
                reader.getUser().setEmail(request.getEmail());
            }
            Reader saved = readerRepository.save(reader);
            userRepository.save(reader.getUser());
            log.info("Reader profile updated: {}", saved.getReaderId());
            return populateExtraFields(saved);
        });
    }

    public void changePassword(String username, ChangePasswordRequest request) {
        transactionTemplate.executeWithoutResult(status -> {
            User user = userRepository.findByUsernameForUpdate(username)
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
            if (!user.isActive() || !PredefinedRole.READER_ROLE.equalsIgnoreCase(user.getRole().getRoleName())) {
                throw new AppException(ErrorCode.UNAUTHORIZED);
            }
            if (!PasswordUtils.matches(request.getOldPassword(), user.getPasswordHash())) {
                throw new AppException(ErrorCode.INVALID_PASSWORD);
            }
            user.setPasswordHash(PasswordUtils.hash(request.getNewPassword()));
            userRepository.save(user);
            createNotification(user, "Đổi mật khẩu thành công",
                    "Tài khoản của bạn vừa đổi mật khẩu thành công. Nếu không phải bạn thực hiện, "
                            + "vui lòng liên hệ thủ thư.", "SECURITY");
            log.info("Reader password changed: {}", user.getUserId());
        });
    }

    @Transactional(readOnly = true)
    public java.util.List<ReservationResponse> getMyReservations(String username) {
        Reader reader = getReaderByUsername(username);
        java.util.List<Reservation> reservations = reservationRepository.findByReader_ReaderIdOrderByReservationDateDesc(reader.getReaderId());
        return reservations.stream().map(res -> {
            ReservationResponse response = reservationMapper.toReservationResponse(res);
            if (ReservationStatus.WAITING.equals(res.getStatus()) || ReservationStatus.UNPROCESSED.equals(res.getStatus())) {
                response.setEstimatedAvailableDate(calculateEstimatedAvailableDate(res.getBook().getBookId()));
            }
            return response;
        }).collect(java.util.stream.Collectors.toList());
    }

    private LocalDate calculateEstimatedAvailableDate(String bookId) {
        java.util.List<DetailBorrowingSlip> activeSlips = detailBorrowingSlipRepository
                .findByCopy_Book_BookIdAndActualReturnDateIsNullOrderByExpectedReturnDateAsc(bookId);
        LocalDate today = LocalDate.now();
        for (DetailBorrowingSlip slip : activeSlips) {
            if (!slip.getExpectedReturnDate().isBefore(today)) {
                return slip.getExpectedReturnDate().plusDays(1);
            }
        }
        if (!activeSlips.isEmpty()) {
            return today.plusDays(1);
        }
        return null;
    }

    public ReservationResponse reserveBook(String username, ReservationRequest request) {
        return transactionTemplate.execute(status -> {
            Book book = bookRepository.findByIdForUpdate(request.getBookId())
                    .orElseThrow(() -> new AppException(ErrorCode.BOOK_NOT_FOUND));
            Reader reader = getReaderByUsernameForUpdate(username);
            ensureActive(reader);
            if (reader.getMembershipExpiry().isBefore(LocalDate.now())) {
                throw new AppException(ErrorCode.MEMBERSHIP_EXPIRED);
            }
            if (!fineNoticeRepository.findUnpaidByReaderForUpdate(reader.getReaderId()).isEmpty()) {
                throw new AppException(ErrorCode.READER_HAS_UNPAID_FINE);
            }

            List<BookCopy> copies = bookCopyRepository.findByBookIdForUpdate(book.getBookId());
            if (copies.stream().anyMatch(copy -> BookCopyStatus.AVAILABLE.equals(copy.getStatus()))) {
                throw new AppException(ErrorCode.BOOK_STILL_AVAILABLE);
            }

            List<String> activeStatuses = List.of(
                    ReservationStatus.UNPROCESSED,
                    ReservationStatus.WAITING,
                    ReservationStatus.PROCESSED);
            if (!reservationRepository.findConflictsForUpdate(
                    reader.getReaderId(), book.getBookId(), activeStatuses).isEmpty()) {
                throw new AppException(ErrorCode.RESERVATION_EXISTED);
            }

            Reservation reservation = reservationRepository.save(Reservation.builder()
                    .reservationId(generateUniqueReservationId())
                    .reader(reader)
                    .book(book)
                    .reservationDate(LocalDate.now())
                    .status(ReservationStatus.UNPROCESSED)
                    .build());
            createNotification(reader.getUser(), "Đặt trước sách",
                    "Đặt trước sách \"" + book.getBookName() + "\" thành công. "
                            + "Bạn sẽ được thông báo khi sách sẵn sàng để nhận.", "RESERVATION");
            log.info("Reservation created: {} (reader: {}, book: {})",
                    reservation.getReservationId(), reader.getReaderId(), book.getBookId());
            return reservationMapper.toReservationResponse(reservation);
        });
    }

    public DetailBorrowingSlipResponse renewBorrowing(String username, String detailId) {
        return transactionTemplate.execute(status -> {
            DetailBorrowingSlip snapshot = detailBorrowingSlipRepository.findById(detailId)
                    .orElseThrow(() -> new AppException(ErrorCode.DETAIL_BORROWING_NOT_FOUND));
            bookRepository.findByIdForUpdate(snapshot.getCopy().getBook().getBookId())
                    .orElseThrow(() -> new AppException(ErrorCode.BOOK_NOT_FOUND));
            Reader reader = getReaderByUsernameForUpdate(username);
            ensureActive(reader);
            DetailBorrowingSlip detail = detailBorrowingSlipRepository.findByIdForUpdate(detailId)
                    .orElseThrow(() -> new AppException(ErrorCode.DETAIL_BORROWING_NOT_FOUND));
            if (!detail.getBorrowingSlip().getReader().getReaderId().equals(reader.getReaderId())) {
                throw new AppException(ErrorCode.BORROWING_NOT_OWNED);
            }
            if (detail.getActualReturnDate() != null) {
                throw new AppException(ErrorCode.BOOK_ALREADY_RETURNED);
            }
            if (detail.getExpectedReturnDate().isBefore(LocalDate.now())) {
                throw new AppException(ErrorCode.BORROWING_OVERDUE);
            }

            Book book = detail.getCopy().getBook();
            List<String> waitingStatuses =
                    List.of(ReservationStatus.UNPROCESSED, ReservationStatus.WAITING);
            if (!reservationRepository.findOtherReadersWaitingForUpdate(
                    reader.getReaderId(), book.getBookId(), waitingStatuses).isEmpty()) {
                throw new AppException(ErrorCode.BOOK_RESERVED_BY_OTHERS);
            }
            if ("PENDING".equals(detail.getRenewalStatus())) {
                throw new AppException(ErrorCode.RENEWAL_ALREADY_REQUESTED);
            }
            detail.setRenewalStatus("PENDING");
            DetailBorrowingSlip saved = detailBorrowingSlipRepository.save(detail);
            log.info("Renewal request submitted for detail: {}", detailId);
            return DetailBorrowingSlipResponse.builder()
                    .detailId(saved.getDetailId())
                    .borrowingId(saved.getBorrowingSlip().getBorrowingId())
                    .copyId(saved.getCopy().getCopyId())
                    .bookId(book.getBookId())
                    .bookName(book.getBookName())
                    .expectedReturnDate(saved.getExpectedReturnDate())
                    .actualReturnDate(saved.getActualReturnDate())
                    .renewalStatus(saved.getRenewalStatus())
                    .build();
        });
    }

    /**
     * Hủy đặt trước và nhả một bản sao Reserved nếu yêu cầu đã được xử lý.
     */
    public ReservationResponse cancelReservation(String username, String reservationId) {
        return transactionTemplate.execute(status -> {
            Reservation snapshot = reservationRepository.findById(reservationId)
                    .orElseThrow(() -> new AppException(ErrorCode.RESERVATION_NOT_FOUND));
            bookRepository.findByIdForUpdate(snapshot.getBook().getBookId())
                    .orElseThrow(() -> new AppException(ErrorCode.BOOK_NOT_FOUND));
            Reader reader = getReaderByUsernameForUpdate(username);
            ensureActive(reader);
            Reservation reservation = reservationRepository.findByIdForUpdate(reservationId)
                    .orElseThrow(() -> new AppException(ErrorCode.RESERVATION_NOT_FOUND));
            if (!reservation.getReader().getReaderId().equals(reader.getReaderId())) {
                throw new AppException(ErrorCode.RESERVATION_NOT_FOUND);
            }
            if (ReservationStatus.CANCELLED.equals(reservation.getStatus())
                    || ReservationStatus.COMPLETED.equals(reservation.getStatus())) {
                throw new AppException(ErrorCode.RESERVATION_ALREADY_CLOSED);
            }

            if (ReservationStatus.PROCESSED.equals(reservation.getStatus())) {
                BookCopy reservedCopy = bookCopyRepository
                        .findFirstByBook_BookIdAndStatusOrderByCopyIdAsc(
                                reservation.getBook().getBookId(), BookCopyStatus.RESERVED)
                        .orElseThrow(() -> new AppException(ErrorCode.RESERVATION_NOT_AVAILABLE));
                reservedCopy.setStatus(BookCopyStatus.AVAILABLE);
                bookCopyRepository.save(reservedCopy);
            }

            reservation.setStatus(ReservationStatus.CANCELLED);
            Reservation saved = reservationRepository.save(reservation);
            log.info("Reservation cancelled: {} by reader {}", reservationId, reader.getReaderId());
            return reservationMapper.toReservationResponse(saved);
        });
    }

    /**
     * Chỉ chủ sở hữu thông báo mới được đánh dấu đã đọc.
     */
    public void markNotificationAsRead(String username, String notificationId) {
        transactionTemplate.executeWithoutResult(status -> {
            Reader reader = getReaderByUsernameForUpdate(username);
            ensureActive(reader);
            Notification notification = notificationRepository
                    .findOwnedByUserForUpdate(notificationId, reader.getUser().getUserId())
                    .orElseThrow(() -> new AppException(ErrorCode.NOTIFICATION_NOT_FOUND));
            notification.setRead(true);
            notificationRepository.save(notification);
        });
    }

        public java.util.List<me.ihqqq.library_management.dto.response.FineNoticeResponse> getMyFines(String username) {
        Reader reader = getReaderByUsername(username);
        return fineNoticeRepository.findByDetail_BorrowingSlip_Reader_ReaderIdOrderByPaidStatusAscFineIdAsc(reader.getReaderId())
                .stream()
                .map(fine -> me.ihqqq.library_management.dto.response.FineNoticeResponse.builder()
                        .fineId(fine.getFineId())
                        .detailId(fine.getDetail().getDetailId())
                        .borrowingId(fine.getDetail().getBorrowingSlip().getBorrowingId())
                        .readerId(fine.getDetail().getBorrowingSlip().getReader().getReaderId())
                        .readerName(fine.getDetail().getBorrowingSlip().getReader().getReaderName())
                        .finePrice(fine.getFinePrice())
                        .reason(fine.getReason())
                        .paidStatus(fine.isPaidStatus())
                        .paidDate(fine.getPaidDate())
                        .build())
                .toList();
    }

    private Reader getReaderByUsername(String username) {
        return readerRepository.findByUser_Username(username)
                .orElseThrow(() -> new AppException(ErrorCode.READER_NOT_FOUND));
    }

    private Reader getReaderByUsernameForUpdate(String username) {
        return readerRepository.findByUsernameForUpdate(username)
                .orElseThrow(() -> new AppException(ErrorCode.READER_NOT_FOUND));
    }

    private void ensureActive(Reader reader) {
        if (!reader.getUser().isActive()) {
            throw new AppException(ErrorCode.USER_INACTIVE);
        }
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



