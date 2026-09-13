package me.ihqqq.library_management.service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import me.ihqqq.library_management.constant.BookCopyStatus;
import me.ihqqq.library_management.constant.PredefinedRole;
import me.ihqqq.library_management.constant.ReservationStatus;
import me.ihqqq.library_management.dto.request.AuthorRequest;
import me.ihqqq.library_management.dto.request.BookCopyRequest;
import me.ihqqq.library_management.dto.request.BookRequest;
import me.ihqqq.library_management.dto.request.BorrowBooksRequest;
import me.ihqqq.library_management.dto.request.FineNoticeRequest;
import me.ihqqq.library_management.dto.request.InventoryItemRequest;
import me.ihqqq.library_management.dto.request.ProcessReservationRequest;
import me.ihqqq.library_management.dto.request.ReaderAdminUpdateRequest;
import me.ihqqq.library_management.dto.request.ReaderRegistrationRequest;
import me.ihqqq.library_management.dto.request.ReturnBookRequest;
import me.ihqqq.library_management.dto.response.AuthorResponse;
import me.ihqqq.library_management.dto.response.BookCopyResponse;
import me.ihqqq.library_management.dto.response.BookResponse;
import me.ihqqq.library_management.dto.response.EmployeeOperationResponse;
import me.ihqqq.library_management.dto.response.FineNoticeResponse;
import me.ihqqq.library_management.dto.response.ReaderResponse;
import me.ihqqq.library_management.dto.response.ReservationResponse;
import me.ihqqq.library_management.entity.Author;
import me.ihqqq.library_management.entity.Book;
import me.ihqqq.library_management.entity.BookCopy;
import me.ihqqq.library_management.entity.BorrowingConfig;
import me.ihqqq.library_management.entity.BorrowingSlip;
import me.ihqqq.library_management.entity.Category;
import me.ihqqq.library_management.entity.DetailBorrowingSlip;
import me.ihqqq.library_management.entity.Employee;
import me.ihqqq.library_management.entity.FineConfig;
import me.ihqqq.library_management.entity.FineNotice;
import me.ihqqq.library_management.entity.Notification;
import me.ihqqq.library_management.entity.Publisher;
import me.ihqqq.library_management.entity.Reader;
import me.ihqqq.library_management.entity.Reservation;
import me.ihqqq.library_management.entity.Role;
import me.ihqqq.library_management.entity.Shelf;
import me.ihqqq.library_management.entity.SystemLog;
import me.ihqqq.library_management.entity.User;
import me.ihqqq.library_management.exception.AppException;
import me.ihqqq.library_management.exception.ErrorCode;
import me.ihqqq.library_management.mapper.ReaderMapper;
import me.ihqqq.library_management.mapper.ReservationMapper;
import me.ihqqq.library_management.repository.AuthorRepository;
import me.ihqqq.library_management.repository.BookCopyRepository;
import me.ihqqq.library_management.repository.BookRepository;
import me.ihqqq.library_management.repository.BorrowingConfigRepository;
import me.ihqqq.library_management.repository.BorrowingSlipRepository;
import me.ihqqq.library_management.repository.CategoryRepository;
import me.ihqqq.library_management.repository.DetailBorrowingSlipRepository;
import me.ihqqq.library_management.repository.EmployeeRepository;
import me.ihqqq.library_management.repository.FineConfigRepository;
import me.ihqqq.library_management.repository.FineNoticeRepository;
import me.ihqqq.library_management.repository.NotificationRepository;
import me.ihqqq.library_management.repository.PublisherRepository;
import me.ihqqq.library_management.repository.ReaderRepository;
import me.ihqqq.library_management.repository.ReservationRepository;
import me.ihqqq.library_management.repository.RoleRepository;
import me.ihqqq.library_management.repository.ShelfRepository;
import me.ihqqq.library_management.repository.SystemLogRepository;
import me.ihqqq.library_management.repository.UserRepository;
import me.ihqqq.library_management.util.IdGenerator;
import me.ihqqq.library_management.util.PasswordUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class EmployeeService {

    UserRepository userRepository;
    RoleRepository roleRepository;
    EmployeeRepository employeeRepository;
    ReaderRepository readerRepository;
    ReaderMapper readerMapper;
    BookRepository bookRepository;
    BookCopyRepository bookCopyRepository;
    AuthorRepository authorRepository;
    CategoryRepository categoryRepository;
    PublisherRepository publisherRepository;
    ShelfRepository shelfRepository;
    BorrowingConfigRepository borrowingConfigRepository;
    FineConfigRepository fineConfigRepository;
    BorrowingSlipRepository borrowingSlipRepository;
    DetailBorrowingSlipRepository detailBorrowingSlipRepository;
    FineNoticeRepository fineNoticeRepository;
    ReservationRepository reservationRepository;
    NotificationRepository notificationRepository;
    ReservationMapper reservationMapper;
    SystemLogRepository systemLogRepository;

    @Transactional(readOnly = true)
    public List<ReaderResponse> getReaders() {
        return readerRepository.findAll().stream().map(readerMapper::toReaderResponse).toList();
    }

    @Transactional
    public ReaderResponse createReader(ReaderRegistrationRequest request, String employeeUsername) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new AppException(ErrorCode.USERNAME_EXISTED);
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new AppException(ErrorCode.EMAIL_EXISTED);
        }
        Role readerRole = roleRepository.findByRoleNameIgnoreCase(PredefinedRole.READER_ROLE)
                .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND));
        User user = userRepository.save(User.builder()
                .userId(generateUserId())
                .username(request.getUsername())
                .passwordHash(PasswordUtils.hash(request.getPassword()))
                .email(request.getEmail())
                .active(true)
                .role(readerRole)
                .build());
        Reader reader = readerRepository.save(Reader.builder()
                .readerId(generateReaderId())
                .readerName(request.getReaderName())
                .phoneNumber(request.getPhoneNumber())
                .membershipExpiry(LocalDate.now().plusYears(1))
                .user(user)
                .build());
        writeLog(employeeUsername, "Created reader account " + reader.getReaderId());
        notifyReader(user, "Tạo tài khoản độc giả", "Tài khoản độc giả đã được tạo.", "READER");
        return readerMapper.toReaderResponse(reader);
    }

    @Transactional
    public ReaderResponse updateReader(
            String readerId,
            ReaderAdminUpdateRequest request,
            String employeeUsername
    ) {
        Reader reader = readerRepository.findById(readerId)
                .orElseThrow(() -> new AppException(ErrorCode.READER_NOT_FOUND));
        if (request.getReaderName() != null) {
            reader.setReaderName(request.getReaderName());
        }
        if (request.getPhoneNumber() != null) {
            reader.setPhoneNumber(request.getPhoneNumber());
        }
        if (request.getMembershipExpiry() != null) {
            reader.setMembershipExpiry(request.getMembershipExpiry());
        }
        if (request.getActive() != null) {
            reader.getUser().setActive(request.getActive());
        }
        Reader saved = readerRepository.save(reader);
        writeLog(employeeUsername, "Updated reader " + readerId);
        return readerMapper.toReaderResponse(saved);
    }

    @Transactional
    public void deactivateReader(String readerId, String employeeUsername) {
        Reader reader = readerRepository.findById(readerId)
                .orElseThrow(() -> new AppException(ErrorCode.READER_NOT_FOUND));
        if (fineNoticeRepository.existsByDetail_BorrowingSlip_Reader_ReaderIdAndPaidStatusFalse(readerId)) {
            throw new AppException(ErrorCode.READER_HAS_UNPAID_FINE);
        }
        if (detailBorrowingSlipRepository.countByBorrowingSlip_Reader_ReaderIdAndActualReturnDateIsNull(readerId) > 0) {
            throw new AppException(ErrorCode.READER_HAS_ACTIVE_BORROWING);
        }
        if (reservationRepository.existsByReader_ReaderIdAndStatusNot(readerId, ReservationStatus.PROCESSED)) {
            throw new AppException(ErrorCode.READER_HAS_PENDING_RESERVATION);
        }
        reader.getUser().setActive(false);
        userRepository.save(reader.getUser());
        writeLog(employeeUsername, "Deactivated reader account " + readerId);
    }

    @Transactional(readOnly = true)
    public List<BookResponse> getBooks() {
        return bookRepository.findAll().stream().map(this::toBookResponse).toList();
    }

    @Transactional
    public BookResponse createBook(BookRequest request, String employeeUsername) {
        if (bookRepository.existsByBookNameIgnoreCase(request.getBookName())) {
            throw new AppException(ErrorCode.BOOK_NAME_EXISTED);
        }
        Book book = Book.builder()
                .bookId(generateBookId())
                .bookName(request.getBookName())
                .publisher(resolvePublisher(request.getPublisherId()))
                .year(request.getYear())
                .description(request.getDescription())
                .authors(resolveAuthors(request.getAuthorIds()))
                .categories(resolveCategories(request.getCategoryIds()))
                .build();
        book = bookRepository.save(book);
        saveCopies(book, request.getCopies());
        writeLog(employeeUsername, "Created book " + book.getBookId());
        return toBookResponse(book);
    }

    @Transactional
    public BookResponse updateBook(String bookId, BookRequest request, String employeeUsername) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new AppException(ErrorCode.BOOK_NOT_FOUND));
        if (bookRepository.existsByBookNameIgnoreCaseAndBookIdNot(request.getBookName(), bookId)) {
            throw new AppException(ErrorCode.BOOK_NAME_EXISTED);
        }
        book.setBookName(request.getBookName());
        book.setPublisher(resolvePublisher(request.getPublisherId()));
        book.setYear(request.getYear());
        book.setDescription(request.getDescription());
        book.setAuthors(resolveAuthors(request.getAuthorIds()));
        book.setCategories(resolveCategories(request.getCategoryIds()));
        Book saved = bookRepository.save(book);
        saveCopies(saved, request.getCopies());
        writeLog(employeeUsername, "Updated book " + bookId);
        return toBookResponse(saved);
    }

    @Transactional
    public void deleteBook(String bookId, String employeeUsername) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new AppException(ErrorCode.BOOK_NOT_FOUND));
        if (bookCopyRepository.existsByBook_BookId(bookId)) {
            throw new AppException(ErrorCode.BOOK_HAS_COPIES);
        }
        bookRepository.delete(book);
        writeLog(employeeUsername, "Deleted book " + bookId);
    }

    @Transactional
    public BookCopyResponse updateInventory(
            InventoryItemRequest request,
            String employeeUsername
    ) {
        BookCopy copy = bookCopyRepository.findById(request.getCopyId())
                .orElseThrow(() -> new AppException(ErrorCode.COPY_NOT_FOUND));
        validateCopyStatus(request.getStatus());
        if (request.getStatus() != null) {
            copy.setStatus(request.getStatus());
        }
        if (request.getShelfId() != null) {
            copy.setShelf(shelfRepository.findById(request.getShelfId())
                    .orElseThrow(() -> new AppException(ErrorCode.SHELF_NOT_FOUND)));
        }
        BookCopy saved = bookCopyRepository.save(copy);
        writeLog(employeeUsername, "Updated inventory for copy " + saved.getCopyId());
        return toBookCopyResponse(saved);
    }

    @Transactional
    public EmployeeOperationResponse borrowBooks(
            BorrowBooksRequest request,
            String employeeUsername
    ) {
        Employee employee = findEmployeeByUsername(employeeUsername);
        Reader reader = readerRepository.findById(request.getReaderId())
                .orElseThrow(() -> new AppException(ErrorCode.READER_NOT_FOUND));
        validateReaderCanBorrow(reader);
        Set<String> uniqueCopyIds = new HashSet<>(request.getCopyIds());
        if (uniqueCopyIds.size() != request.getCopyIds().size()) {
            throw new AppException(ErrorCode.COPY_NOT_AVAILABLE);
        }
        BorrowingConfig config = borrowingConfigRepository.findTopByOrderByUpdatedAtDesc()
                .orElseThrow(() -> new AppException(ErrorCode.BORROWING_CONFIG_NOT_FOUND));
        long activeBorrowings = detailBorrowingSlipRepository
                .countByBorrowingSlip_Reader_ReaderIdAndActualReturnDateIsNull(reader.getReaderId());
        if (activeBorrowings + uniqueCopyIds.size() > config.getMaxBooksPerReader()) {
            throw new AppException(ErrorCode.BORROWING_LIMIT_REACHED);
        }

        List<BookCopy> copies = uniqueCopyIds.stream().map(id -> bookCopyRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.COPY_NOT_FOUND))).toList();
        copies.forEach(copy -> {
            if (!BookCopyStatus.AVAILABLE.equalsIgnoreCase(copy.getStatus())) {
                throw new AppException(ErrorCode.COPY_NOT_AVAILABLE);
            }
        });

        BorrowingSlip slip = borrowingSlipRepository.save(BorrowingSlip.builder()
                .borrowingId(generateBorrowingId())
                .reader(reader)
                .createdByEmployeeId(employee.getEmployeeId())
                .borrowDate(LocalDateTime.now())
                .notes(request.getNotes())
                .build());
        LocalDate expectedReturnDate = LocalDate.now().plusDays(config.getMaxBorrowDays());
        for (BookCopy copy : copies) {
            detailBorrowingSlipRepository.save(DetailBorrowingSlip.builder()
                    .detailId(generateDetailId())
                    .borrowingSlip(slip)
                    .copy(copy)
                    .expectedReturnDate(expectedReturnDate)
                    .build());
            copy.setStatus(BookCopyStatus.BORROWED);
            bookCopyRepository.save(copy);
        }
        notifyReader(reader.getUser(), "Lập phiếu mượn", "Phiếu mượn " + slip.getBorrowingId() + " đã được tạo.", "BORROWING");
        writeLog(employeeUsername, "Created borrowing slip " + slip.getBorrowingId());
        return EmployeeOperationResponse.builder()
                .operationId(slip.getBorrowingId())
                .borrowingId(slip.getBorrowingId())
                .readerId(reader.getReaderId())
                .expectedReturnDate(expectedReturnDate)
                .message("Borrowing slip created successfully")
                .build();
    }

    @Transactional
    public EmployeeOperationResponse returnBook(ReturnBookRequest request, String employeeUsername) {
        Employee employee = findEmployeeByUsername(employeeUsername);
        DetailBorrowingSlip detail = detailBorrowingSlipRepository
                .findByCopy_CopyIdAndActualReturnDateIsNull(request.getCopyId()).stream()
                .findFirst()
                .orElseThrow(() -> new AppException(ErrorCode.COPY_ALREADY_RETURNED));
        validateReturnStatus(request.getCondition());
        LocalDate today = LocalDate.now();
        detail.setActualReturnDate(today);
        detailBorrowingSlipRepository.save(detail);
        BookCopy copy = detail.getCopy();
        copy.setStatus(request.getCondition());
        bookCopyRepository.save(copy);

        String fineId = null;
        long overdueDays = Math.max(0, ChronoUnit.DAYS.between(detail.getExpectedReturnDate(), today));
        if (overdueDays > 0) {
            FineConfig config = fineConfigRepository.findTopByOrderByUpdatedAtDesc().orElse(null);
            if (config != null) {
                FineNotice fine = fineNoticeRepository.save(FineNotice.builder()
                        .fineId(generateFineId())
                        .detail(detail)
                        .finePrice(config.getFineRatePerDay().multiply(BigDecimal.valueOf(overdueDays)))
                        .reason("Late return: " + overdueDays + " day(s)")
                        .paidStatus(false)
                        .build());
                fineId = fine.getFineId();
            }
        }
        if (BookCopyStatus.LOST.equalsIgnoreCase(request.getCondition())
                || BookCopyStatus.DAMAGED.equalsIgnoreCase(request.getCondition())) {
            FineConfig config = fineConfigRepository.findTopByOrderByUpdatedAtDesc().orElse(null);
            if (config != null) {
                FineNotice fine = fineNoticeRepository.save(FineNotice.builder()
                        .fineId(generateFineId())
                        .detail(detail)
                        .finePrice(config.getFineRatePerDay())
                        .reason(request.getCondition())
                        .paidStatus(false)
                        .build());
                fineId = fine.getFineId();
            }
        }
        notifyReader(detail.getBorrowingSlip().getReader().getUser(), "Nhận trả sách",
                "Đã nhận trả bản sao " + request.getCopyId() + ".", "RETURN");
        writeLog(employeeUsername, "Returned copy " + request.getCopyId() + " by " + employee.getEmployeeId());
        return EmployeeOperationResponse.builder()
                .operationId(detail.getDetailId())
                .detailId(detail.getDetailId())
                .copyId(request.getCopyId())
                .fineId(fineId)
                .actualReturnDate(today)
                .message("Book returned successfully")
                .build();
    }

    @Transactional
    public EmployeeOperationResponse renewBorrowing(String detailId, String employeeUsername) {
        DetailBorrowingSlip detail = detailBorrowingSlipRepository.findById(detailId)
                .orElseThrow(() -> new AppException(ErrorCode.DETAIL_BORROWING_NOT_FOUND));
        if (detail.getActualReturnDate() != null) {
            throw new AppException(ErrorCode.COPY_ALREADY_RETURNED);
        }
        if (reservationRepository.existsByBook_BookIdAndStatus(
                detail.getCopy().getBook().getBookId(), ReservationStatus.WAITING)) {
            throw new AppException(ErrorCode.BOOK_RESERVED_BY_OTHERS);
        }
        BorrowingConfig config = borrowingConfigRepository.findTopByOrderByUpdatedAtDesc()
                .orElseThrow(() -> new AppException(ErrorCode.BORROWING_CONFIG_NOT_FOUND));
        LocalDate expected = detail.getExpectedReturnDate().plusDays(config.getMaxBorrowDays());
        detail.setExpectedReturnDate(expected);
        detailBorrowingSlipRepository.save(detail);
        notifyReader(detail.getBorrowingSlip().getReader().getUser(), "Gia hạn mượn sách",
                "Hạn trả mới: " + expected + ".", "BORROWING");
        writeLog(employeeUsername, "Renewed borrowing detail " + detailId);
        return EmployeeOperationResponse.builder()
                .operationId(detailId)
                .detailId(detailId)
                .expectedReturnDate(expected)
                .message("Borrowing renewed successfully")
                .build();
    }

    @Transactional(readOnly = true)
    public List<FineNoticeResponse> getFines(String readerId) {
        return fineNoticeRepository.findByDetail_BorrowingSlip_Reader_ReaderIdOrderByPaidStatusAscFineIdAsc(readerId)
                .stream().map(this::toFineResponse).toList();
    }

    @Transactional
    public FineNoticeResponse createFine(FineNoticeRequest request, String employeeUsername) {
        Employee employee = findEmployeeByUsername(employeeUsername);
        DetailBorrowingSlip detail = detailBorrowingSlipRepository.findById(request.getDetailId())
                .orElseThrow(() -> new AppException(ErrorCode.DETAIL_BORROWING_NOT_FOUND));
        FineNotice fine = fineNoticeRepository.save(FineNotice.builder()
                .fineId(generateFineId())
                .detail(detail)
                .collectedByEmployeeId(employee.getEmployeeId())
                .finePrice(request.getFinePrice())
                .reason(request.getReason())
                .paidStatus(false)
                .build());
        notifyReader(detail.getBorrowingSlip().getReader().getUser(), "Thông báo phạt",
                "Bạn có khoản phạt " + request.getFinePrice() + ".", "FINE");
        writeLog(employeeUsername, "Created fine notice " + fine.getFineId());
        return toFineResponse(fine);
    }

    @Transactional
    public FineNoticeResponse collectFine(String fineId, String employeeUsername) {
        Employee employee = findEmployeeByUsername(employeeUsername);
        FineNotice fine = fineNoticeRepository.findById(fineId)
                .orElseThrow(() -> new AppException(ErrorCode.FINE_NOT_FOUND));
        if (fine.isPaidStatus()) {
            throw new AppException(ErrorCode.FINE_ALREADY_PAID);
        }
        fine.setPaidStatus(true);
        fine.setPaidDate(LocalDate.now());
        fine.setCollectedByEmployeeId(employee.getEmployeeId());
        FineNotice saved = fineNoticeRepository.save(fine);
        notifyReader(fine.getDetail().getBorrowingSlip().getReader().getUser(), "Thanh toán tiền phạt",
                "Khoản phạt " + fineId + " đã được ghi nhận thanh toán.", "FINE");
        writeLog(employeeUsername, "Collected fine notice " + fineId);
        return toFineResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<ReservationResponse> getPendingReservations() {
        return reservationRepository.findByStatusOrderByReservationDateAsc(ReservationStatus.UNPROCESSED)
                .stream().map(reservationMapper::toReservationResponse).toList();
    }

    @Transactional
    public ReservationResponse processReservation(
            String reservationId,
            ProcessReservationRequest request,
            String employeeUsername
    ) {
        Employee employee = findEmployeeByUsername(employeeUsername);
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new AppException(ErrorCode.RESERVATION_NOT_FOUND));
        if (!reservation.getStatus().equals(ReservationStatus.UNPROCESSED)
                && !reservation.getStatus().equals(ReservationStatus.WAITING)) {
            throw new AppException(ErrorCode.RESERVATION_NOT_FOUND);
        }
        if (bookCopyRepository.countByBook_BookIdAndStatus(
                reservation.getBook().getBookId(), BookCopyStatus.AVAILABLE) == 0) {
            throw new AppException(ErrorCode.RESERVATION_NOT_AVAILABLE);
        }
        reservation.setStatus(ReservationStatus.WAITING);
        reservation.setProcessedByEmployeeId(employee.getEmployeeId());
        reservation.setExpiryDate(LocalDate.now().plusDays(request.getExpiryDays()));
        Reservation saved = reservationRepository.save(reservation);
        notifyReader(reservation.getReader().getUser(), "Sách đặt trước đã sẵn sàng",
                "Vui lòng nhận sách trước ngày " + reservation.getExpiryDate() + ".", "RESERVATION");
        writeLog(employeeUsername, "Processed reservation " + reservationId);
        return reservationMapper.toReservationResponse(saved);
    }

    @Transactional
    public int expireReservations(String employeeUsername) {
        int count = 0;
        for (Reservation reservation : reservationRepository.findAll()) {
            if ((ReservationStatus.WAITING.equals(reservation.getStatus())
                    || ReservationStatus.UNPROCESSED.equals(reservation.getStatus()))
                    && reservation.getExpiryDate() != null
                    && reservation.getExpiryDate().isBefore(LocalDate.now())) {
                reservation.setStatus(ReservationStatus.EXPIRED);
                reservationRepository.save(reservation);
                count++;
            }
        }
        if (count > 0) {
            writeLog(employeeUsername, "Expired " + count + " reservation(s)");
        }
        return count;
    }

    private void validateReaderCanBorrow(Reader reader) {
        if (!reader.getUser().isActive()) {
            throw new AppException(ErrorCode.USER_INACTIVE);
        }
        if (reader.getMembershipExpiry().isBefore(LocalDate.now())) {
            throw new AppException(ErrorCode.MEMBERSHIP_EXPIRY_INVALID);
        }
        if (fineNoticeRepository.existsByDetail_BorrowingSlip_Reader_ReaderIdAndPaidStatusFalse(
                reader.getReaderId())) {
            throw new AppException(ErrorCode.READER_HAS_UNPAID_FINE);
        }
    }

    private void saveCopies(Book book, List<BookCopyRequest> requests) {
        for (BookCopyRequest request : requests) {
            String copyId = request.getCopyId() == null || request.getCopyId().isBlank()
                    ? generateCopyId()
                    : request.getCopyId();
            BookCopy copy = bookCopyRepository.findById(copyId).orElse(null);
            if (copy != null && !copy.getBook().getBookId().equals(book.getBookId())) {
                throw new AppException(ErrorCode.COPY_ID_EXISTED);
            }
            if (copy == null) {
                copy = BookCopy.builder().copyId(copyId).book(book).build();
            }
            copy.setStatus(request.getStatus() == null ? BookCopyStatus.AVAILABLE : request.getStatus());
            validateCopyStatus(copy.getStatus());
            if (request.getShelfId() != null) {
                copy.setShelf(shelfRepository.findById(request.getShelfId())
                        .orElseThrow(() -> new AppException(ErrorCode.SHELF_NOT_FOUND)));
            }
            bookCopyRepository.save(copy);
        }
    }

    private Publisher resolvePublisher(String publisherId) {
        if (publisherId == null || publisherId.isBlank()) {
            return null;
        }
        return publisherRepository.findById(publisherId)
                .orElseThrow(() -> new AppException(ErrorCode.PUBLISHER_NOT_FOUND));
    }

    private Set<Author> resolveAuthors(List<String> ids) {
        List<Author> authors = authorRepository.findAllById(ids);
        if (authors.size() != new HashSet<>(ids).size()) {
            throw new AppException(ErrorCode.AUTHOR_NOT_FOUND);
        }
        return new HashSet<>(authors);
    }

    private Set<Category> resolveCategories(List<String> ids) {
        List<Category> categories = categoryRepository.findAllById(ids);
        if (categories.size() != new HashSet<>(ids).size()) {
            throw new AppException(ErrorCode.CATEGORY_NOT_FOUND);
        }
        return new HashSet<>(categories);
    }

    private void validateCopyStatus(String status) {
        if (status == null) {
            return;
        }
        if (!BookCopyStatus.AVAILABLE.equalsIgnoreCase(status)
                && !BookCopyStatus.BORROWED.equalsIgnoreCase(status)
                && !BookCopyStatus.LOST.equalsIgnoreCase(status)
                && !BookCopyStatus.DAMAGED.equalsIgnoreCase(status)) {
            throw new AppException(ErrorCode.INVALID_COPY_STATUS);
        }
    }

    private void validateReturnStatus(String status) {
        if (!BookCopyStatus.AVAILABLE.equalsIgnoreCase(status)
                && !BookCopyStatus.LOST.equalsIgnoreCase(status)
                && !BookCopyStatus.DAMAGED.equalsIgnoreCase(status)) {
            throw new AppException(ErrorCode.INVALID_RETURN_STATUS);
        }
    }

    private Employee findEmployeeByUsername(String username) {
        return employeeRepository.findByUser_Username(username)
                .orElseThrow(() -> new AppException(ErrorCode.EMPLOYEE_NOT_FOUND));
    }

    private User findUser(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
    }

    private void writeLog(String username, String message) {
        systemLogRepository.save(SystemLog.builder()
                .logId(generateLogId())
                .createdByUser(findUser(username))
                .logMessage(message)
                .build());
    }

    private void notifyReader(User user, String title, String message, String type) {
        notificationRepository.save(Notification.builder()
                .notificationId(generateNotificationId())
                .createdByUser(user)
                .title(title)
                .notificationMessage(message)
                .notificationType(type)
                .read(false)
                .build());
    }

    private BookResponse toBookResponse(Book book) {
        return BookResponse.builder()
                .bookId(book.getBookId())
                .bookName(book.getBookName())
                .publisherId(book.getPublisher() == null ? null : book.getPublisher().getPublisherId())
                .year(book.getYear())
                .description(book.getDescription())
                .authorIds(book.getAuthors().stream().map(Author::getAuthorId).toList())
                .categoryIds(book.getCategories().stream().map(Category::getCategoryId).toList())
                .copies(bookCopyRepository.findByBook_BookId(book.getBookId()).stream()
                        .map(this::toBookCopyResponse).toList())
                .build();
    }

    private BookCopyResponse toBookCopyResponse(BookCopy copy) {
        return BookCopyResponse.builder()
                .copyId(copy.getCopyId())
                .bookId(copy.getBook().getBookId())
                .status(copy.getStatus())
                .shelfId(copy.getShelf() == null ? null : copy.getShelf().getShelfId())
                .build();
    }

    private FineNoticeResponse toFineResponse(FineNotice fine) {
        return FineNoticeResponse.builder()
                .fineId(fine.getFineId())
                .detailId(fine.getDetail().getDetailId())
                .readerId(fine.getDetail().getBorrowingSlip().getReader().getReaderId())
                .finePrice(fine.getFinePrice())
                .reason(fine.getReason())
                .paidStatus(fine.isPaidStatus())
                .paidDate(fine.getPaidDate())
                .collectedByEmployeeId(fine.getCollectedByEmployeeId())
                .build();
    }

    private String generateUserId() {
        String id;
        do {
            id = IdGenerator.generateUserId();
        } while (userRepository.existsById(id));
        return id;
    }

    private String generateReaderId() {
        String id;
        do {
            id = IdGenerator.generateReaderId();
        } while (readerRepository.existsById(id));
        return id;
    }

    private String generateBookId() {
        String id;
        do {
            id = IdGenerator.generateBookId();
        } while (bookRepository.existsById(id));
        return id;
    }

    private String generateCopyId() {
        String id;
        do {
            id = IdGenerator.generateCopyId();
        } while (bookCopyRepository.existsById(id));
        return id;
    }

    private String generateBorrowingId() {
        String id;
        do {
            id = IdGenerator.generateBorrowingId();
        } while (borrowingSlipRepository.existsById(id));
        return id;
    }

    private String generateDetailId() {
        String id;
        do {
            id = IdGenerator.generateDetailId();
        } while (detailBorrowingSlipRepository.existsById(id));
        return id;
    }

    private String generateFineId() {
        String id;
        do {
            id = IdGenerator.generateFineId();
        } while (fineNoticeRepository.existsById(id));
        return id;
    }

    private String generateNotificationId() {
        String id;
        do {
            id = IdGenerator.generateNotificationId();
        } while (notificationRepository.existsById(id));
        return id;
    }

    private String generateLogId() {
        String id;
        do {
            id = IdGenerator.generateLogId();
        } while (systemLogRepository.existsById(id));
        return id;
    }
}