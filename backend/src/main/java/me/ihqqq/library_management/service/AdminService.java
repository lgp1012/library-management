package me.ihqqq.library_management.service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import me.ihqqq.library_management.constant.PredefinedRole;
import me.ihqqq.library_management.dto.request.AuthorRequest;
import me.ihqqq.library_management.dto.request.BorrowingConfigRequest;
import me.ihqqq.library_management.dto.request.CategoryRequest;
import me.ihqqq.library_management.dto.request.EmployeeCreationRequest;
import me.ihqqq.library_management.dto.request.FineConfigRequest;
import me.ihqqq.library_management.dto.request.PublisherRequest;
import me.ihqqq.library_management.dto.request.ShelfRequest;
import me.ihqqq.library_management.dto.response.AuthorResponse;
import me.ihqqq.library_management.dto.response.BorrowingConfigResponse;
import me.ihqqq.library_management.dto.response.CategoryResponse;
import me.ihqqq.library_management.dto.response.EmployeeResponse;
import me.ihqqq.library_management.dto.response.FineConfigResponse;
import me.ihqqq.library_management.dto.response.PublisherResponse;
import me.ihqqq.library_management.dto.response.ShelfResponse;
import me.ihqqq.library_management.dto.response.SystemLogResponse;
import me.ihqqq.library_management.entity.Author;
import me.ihqqq.library_management.entity.BorrowingConfig;
import me.ihqqq.library_management.entity.Category;
import me.ihqqq.library_management.entity.Employee;
import me.ihqqq.library_management.entity.FineConfig;
import me.ihqqq.library_management.entity.Publisher;
import me.ihqqq.library_management.entity.Role;
import me.ihqqq.library_management.entity.Shelf;
import me.ihqqq.library_management.entity.SystemLog;
import me.ihqqq.library_management.entity.User;
import me.ihqqq.library_management.exception.AppException;
import me.ihqqq.library_management.exception.ErrorCode;
import me.ihqqq.library_management.repository.AuthorRepository;
import me.ihqqq.library_management.repository.BookAuthorLinkRepository;
import me.ihqqq.library_management.repository.BookCategoryLinkRepository;
import me.ihqqq.library_management.repository.BookCopyRepository;
import me.ihqqq.library_management.repository.BookRepository;
import me.ihqqq.library_management.repository.BorrowingConfigRepository;
import me.ihqqq.library_management.repository.CategoryRepository;
import me.ihqqq.library_management.repository.EmployeeRepository;
import me.ihqqq.library_management.repository.FineConfigRepository;
import me.ihqqq.library_management.repository.PublisherRepository;
import me.ihqqq.library_management.repository.RoleRepository;
import me.ihqqq.library_management.repository.ShelfRepository;
import me.ihqqq.library_management.repository.SystemLogRepository;
import me.ihqqq.library_management.repository.UserRepository;
import me.ihqqq.library_management.util.IdGenerator;
import me.ihqqq.library_management.util.PasswordUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AdminService {

    UserRepository userRepository;
    RoleRepository roleRepository;
    EmployeeRepository employeeRepository;
    BorrowingConfigRepository borrowingConfigRepository;
    FineConfigRepository fineConfigRepository;
    SystemLogRepository systemLogRepository;
    CategoryRepository categoryRepository;
    AuthorRepository authorRepository;
    PublisherRepository publisherRepository;
    ShelfRepository shelfRepository;
    BookRepository bookRepository;
    BookCopyRepository bookCopyRepository;
    BookAuthorLinkRepository bookAuthorLinkRepository;
    BookCategoryLinkRepository bookCategoryLinkRepository;

    @Transactional(readOnly = true)
    public List<EmployeeResponse> getEmployees() {
        return employeeRepository.findAll().stream().map(this::toEmployeeResponse).toList();
    }

    @Transactional
    public EmployeeResponse createEmployee(EmployeeCreationRequest request, String adminUsername) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new AppException(ErrorCode.USERNAME_EXISTED);
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new AppException(ErrorCode.EMAIL_EXISTED);
        }

        Role employeeRole = roleRepository.findByRoleNameIgnoreCase(PredefinedRole.EMPLOYEE_ROLE)
                .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND));
        User user = userRepository.save(User.builder()
                .userId(generateUserId())
                .username(request.getUsername())
                .passwordHash(PasswordUtils.hash(request.getPassword()))
                .email(request.getEmail())
                .active(true)
                .role(employeeRole)
                .build());

        Employee employee = employeeRepository.save(Employee.builder()
                .employeeId(generateEmployeeId())
                .employeeName(request.getEmployeeName())
                .phoneNumber(request.getPhoneNumber())
                .address(request.getAddress())
                .user(user)
                .build());

        writeLog(adminUsername, "Created employee account " + employee.getEmployeeId());
        return toEmployeeResponse(employee);
    }

    @Transactional
    public void deactivateEmployee(String employeeId, String adminUsername) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new AppException(ErrorCode.EMPLOYEE_NOT_FOUND));
        User user = employee.getUser();
        if (!user.isActive()) {
            throw new AppException(ErrorCode.EMPLOYEE_ALREADY_INACTIVE);
        }

        user.setActive(false);
        userRepository.save(user);
        writeLog(adminUsername, "Deactivated employee account " + employeeId);
    }

    @Transactional(readOnly = true)
    public BorrowingConfigResponse getBorrowingConfig() {
        return borrowingConfigRepository.findTopByOrderByUpdatedAtDesc()
                .map(this::toBorrowingConfigResponse)
                .orElseThrow(() -> new AppException(ErrorCode.BORROWING_CONFIG_NOT_FOUND));
    }

    @Transactional
    public BorrowingConfigResponse updateBorrowingConfig(
            BorrowingConfigRequest request,
            String adminUsername
    ) {
        User admin = findUser(adminUsername);
        BorrowingConfig config = borrowingConfigRepository.findTopByOrderByUpdatedAtDesc()
                .orElseGet(() -> BorrowingConfig.builder()
                        .configId(generateBorrowingConfigId())
                        .build());
        config.setMaxBorrowDays(request.getMaxBorrowDays());
        config.setMaxBooksPerReader(request.getMaxBooksPerReader());
        config.setConfigByUser(admin);
        BorrowingConfig saved = borrowingConfigRepository.save(config);

        writeLog(adminUsername, "Updated borrowing configuration " + saved.getConfigId());
        return toBorrowingConfigResponse(saved);
    }

    @Transactional(readOnly = true)
    public FineConfigResponse getFineConfig() {
        return fineConfigRepository.findTopByOrderByUpdatedAtDesc()
                .map(this::toFineConfigResponse)
                .orElseThrow(() -> new AppException(ErrorCode.FINE_CONFIG_NOT_FOUND));
    }

    @Transactional
    public FineConfigResponse updateFineConfig(FineConfigRequest request, String adminUsername) {
        User admin = findUser(adminUsername);
        FineConfig config = fineConfigRepository.findTopByOrderByUpdatedAtDesc()
                .orElseGet(() -> FineConfig.builder()
                        .configId(generateFineConfigId())
                        .build());
        config.setFineType(request.getFineType());
        config.setFineRatePerDay(request.getFineRatePerDay());
        config.setDescriptionFine(request.getDescriptionFine());
        config.setConfigByUser(admin);
        FineConfig saved = fineConfigRepository.save(config);

        writeLog(adminUsername, "Updated fine configuration " + saved.getConfigId());
        return toFineConfigResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<CategoryResponse> getCategories() {
        return categoryRepository.findAll().stream().map(this::toCategoryResponse).toList();
    }

    @Transactional
    public CategoryResponse createCategory(CategoryRequest request, String adminUsername) {
        if (categoryRepository.existsByCategoryNameIgnoreCase(request.getCategoryName())) {
            throw new AppException(ErrorCode.CATEGORY_NAME_EXISTED);
        }
        Category category = categoryRepository.save(Category.builder()
                .categoryId(generateCategoryId())
                .categoryName(request.getCategoryName())
                .build());
        writeLog(adminUsername, "Created category " + category.getCategoryId());
        return toCategoryResponse(category);
    }

    @Transactional
    public CategoryResponse updateCategory(String categoryId, CategoryRequest request, String adminUsername) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));
        if (categoryRepository.existsByCategoryNameIgnoreCaseAndCategoryIdNot(
                request.getCategoryName(), categoryId)) {
            throw new AppException(ErrorCode.CATEGORY_NAME_EXISTED);
        }
        category.setCategoryName(request.getCategoryName());
        Category saved = categoryRepository.save(category);
        writeLog(adminUsername, "Updated category " + categoryId);
        return toCategoryResponse(saved);
    }

    @Transactional
    public void deleteCategory(String categoryId, String adminUsername) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));
        if (bookCategoryLinkRepository.countByCategoryId(categoryId) > 0) {
            throw new AppException(ErrorCode.CATEGORY_IN_USE);
        }
        categoryRepository.delete(category);
        writeLog(adminUsername, "Deleted category " + categoryId);
    }

    @Transactional(readOnly = true)
    public List<AuthorResponse> getAuthors() {
        return authorRepository.findAll().stream().map(this::toAuthorResponse).toList();
    }

    @Transactional
    public AuthorResponse createAuthor(AuthorRequest request, String adminUsername) {
        if (authorRepository.existsByAuthorNameIgnoreCase(request.getAuthorName())) {
            throw new AppException(ErrorCode.AUTHOR_NAME_EXISTED);
        }
        Author author = authorRepository.save(Author.builder()
                .authorId(generateAuthorId())
                .authorName(request.getAuthorName())
                .birthday(request.getBirthday())
                .nationality(request.getNationality())
                .build());
        writeLog(adminUsername, "Created author " + author.getAuthorId());
        return toAuthorResponse(author);
    }

    @Transactional
    public AuthorResponse updateAuthor(String authorId, AuthorRequest request, String adminUsername) {
        Author author = authorRepository.findById(authorId)
                .orElseThrow(() -> new AppException(ErrorCode.AUTHOR_NOT_FOUND));
        if (authorRepository.existsByAuthorNameIgnoreCaseAndAuthorIdNot(request.getAuthorName(), authorId)) {
            throw new AppException(ErrorCode.AUTHOR_NAME_EXISTED);
        }
        author.setAuthorName(request.getAuthorName());
        author.setBirthday(request.getBirthday());
        author.setNationality(request.getNationality());
        Author saved = authorRepository.save(author);
        writeLog(adminUsername, "Updated author " + authorId);
        return toAuthorResponse(saved);
    }

    @Transactional
    public void deleteAuthor(String authorId, String adminUsername) {
        Author author = authorRepository.findById(authorId)
                .orElseThrow(() -> new AppException(ErrorCode.AUTHOR_NOT_FOUND));
        if (bookAuthorLinkRepository.countByAuthorId(authorId) > 0) {
            throw new AppException(ErrorCode.AUTHOR_IN_USE);
        }
        authorRepository.delete(author);
        writeLog(adminUsername, "Deleted author " + authorId);
    }

    @Transactional(readOnly = true)
    public List<PublisherResponse> getPublishers() {
        return publisherRepository.findAll().stream().map(this::toPublisherResponse).toList();
    }

    @Transactional
    public PublisherResponse createPublisher(PublisherRequest request, String adminUsername) {
        if (publisherRepository.existsByPublisherNameIgnoreCase(request.getPublisherName())) {
            throw new AppException(ErrorCode.PUBLISHER_NAME_EXISTED);
        }
        Publisher publisher = publisherRepository.save(Publisher.builder()
                .publisherId(generatePublisherId())
                .publisherName(request.getPublisherName())
                .build());
        writeLog(adminUsername, "Created publisher " + publisher.getPublisherId());
        return toPublisherResponse(publisher);
    }

    @Transactional
    public PublisherResponse updatePublisher(
            String publisherId,
            PublisherRequest request,
            String adminUsername
    ) {
        Publisher publisher = publisherRepository.findById(publisherId)
                .orElseThrow(() -> new AppException(ErrorCode.PUBLISHER_NOT_FOUND));
        if (publisherRepository.existsByPublisherNameIgnoreCaseAndPublisherIdNot(
                request.getPublisherName(), publisherId)) {
            throw new AppException(ErrorCode.PUBLISHER_NAME_EXISTED);
        }
        publisher.setPublisherName(request.getPublisherName());
        Publisher saved = publisherRepository.save(publisher);
        writeLog(adminUsername, "Updated publisher " + publisherId);
        return toPublisherResponse(saved);
    }

    @Transactional
    public void deletePublisher(String publisherId, String adminUsername) {
        Publisher publisher = publisherRepository.findById(publisherId)
                .orElseThrow(() -> new AppException(ErrorCode.PUBLISHER_NOT_FOUND));
        if (bookRepository.countByPublisher_PublisherId(publisherId) > 0) {
            throw new AppException(ErrorCode.PUBLISHER_IN_USE);
        }
        publisherRepository.delete(publisher);
        writeLog(adminUsername, "Deleted publisher " + publisherId);
    }

    @Transactional(readOnly = true)
    public List<ShelfResponse> getShelves() {
        return shelfRepository.findAll().stream().map(this::toShelfResponse).toList();
    }

    @Transactional
    public ShelfResponse createShelf(ShelfRequest request, String adminUsername) {
        if (shelfRepository.existsByShelfNameIgnoreCase(request.getShelfName())) {
            throw new AppException(ErrorCode.SHELF_NAME_EXISTED);
        }
        Shelf shelf = shelfRepository.save(Shelf.builder()
                .shelfId(generateShelfId())
                .shelfName(request.getShelfName())
                .position(request.getPosition())
                .build());
        writeLog(adminUsername, "Created shelf " + shelf.getShelfId());
        return toShelfResponse(shelf);
    }

    @Transactional
    public ShelfResponse updateShelf(String shelfId, ShelfRequest request, String adminUsername) {
        Shelf shelf = shelfRepository.findById(shelfId)
                .orElseThrow(() -> new AppException(ErrorCode.SHELF_NOT_FOUND));
        if (shelfRepository.existsByShelfNameIgnoreCaseAndShelfIdNot(request.getShelfName(), shelfId)) {
            throw new AppException(ErrorCode.SHELF_NAME_EXISTED);
        }
        shelf.setShelfName(request.getShelfName());
        shelf.setPosition(request.getPosition());
        Shelf saved = shelfRepository.save(shelf);
        writeLog(adminUsername, "Updated shelf " + shelfId);
        return toShelfResponse(saved);
    }

    @Transactional
    public void deleteShelf(String shelfId, String adminUsername) {
        Shelf shelf = shelfRepository.findById(shelfId)
                .orElseThrow(() -> new AppException(ErrorCode.SHELF_NOT_FOUND));
        if (bookCopyRepository.countByShelf_ShelfId(shelfId) > 0) {
            throw new AppException(ErrorCode.SHELF_IN_USE);
        }
        shelfRepository.delete(shelf);
        writeLog(adminUsername, "Deleted shelf " + shelfId);
    }

    @Transactional(readOnly = true)
    public List<SystemLogResponse> getSystemLogs() {
        return systemLogRepository.findTop100ByOrderByLogDateDesc().stream()
                .map(log -> SystemLogResponse.builder()
                        .logId(log.getLogId())
                        .createdByUserId(log.getCreatedByUser().getUserId())
                        .logMessage(log.getLogMessage())
                        .logDate(log.getLogDate())
                        .build())
                .toList();
    }

    private User findUser(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
    }

    private void writeLog(String adminUsername, String message) {
        User admin = findUser(adminUsername);
        systemLogRepository.save(SystemLog.builder()
                .logId(generateLogId())
                .createdByUser(admin)
                .logMessage(message)
                .build());
    }

    private EmployeeResponse toEmployeeResponse(Employee employee) {
        User user = employee.getUser();
        return EmployeeResponse.builder()
                .employeeId(employee.getEmployeeId())
                .employeeName(employee.getEmployeeName())
                .phoneNumber(employee.getPhoneNumber())
                .address(employee.getAddress())
                .userId(user.getUserId())
                .username(user.getUsername())
                .email(user.getEmail())
                .active(user.isActive())
                .build();
    }

    private BorrowingConfigResponse toBorrowingConfigResponse(BorrowingConfig config) {
        return BorrowingConfigResponse.builder()
                .configId(config.getConfigId())
                .configByUserId(config.getConfigByUser() == null ? null : config.getConfigByUser().getUserId())
                .maxBorrowDays(config.getMaxBorrowDays())
                .maxBooksPerReader(config.getMaxBooksPerReader())
                .updatedAt(config.getUpdatedAt())
                .build();
    }

    private FineConfigResponse toFineConfigResponse(FineConfig config) {
        return FineConfigResponse.builder()
                .configId(config.getConfigId())
                .configByUserId(config.getConfigByUser() == null ? null : config.getConfigByUser().getUserId())
                .fineType(config.getFineType())
                .fineRatePerDay(config.getFineRatePerDay())
                .descriptionFine(config.getDescriptionFine())
                .updatedAt(config.getUpdatedAt())
                .build();
    }

    private CategoryResponse toCategoryResponse(Category category) {
        return CategoryResponse.builder()
                .categoryId(category.getCategoryId())
                .categoryName(category.getCategoryName())
                .build();
    }

    private AuthorResponse toAuthorResponse(Author author) {
        return AuthorResponse.builder()
                .authorId(author.getAuthorId())
                .authorName(author.getAuthorName())
                .birthday(author.getBirthday())
                .nationality(author.getNationality())
                .build();
    }

    private PublisherResponse toPublisherResponse(Publisher publisher) {
        return PublisherResponse.builder()
                .publisherId(publisher.getPublisherId())
                .publisherName(publisher.getPublisherName())
                .build();
    }

    private ShelfResponse toShelfResponse(Shelf shelf) {
        return ShelfResponse.builder()
                .shelfId(shelf.getShelfId())
                .shelfName(shelf.getShelfName())
                .position(shelf.getPosition())
                .build();
    }

    private String generateUserId() {
        String id;
        do {
            id = IdGenerator.generateUserId();
        } while (userRepository.existsById(id));
        return id;
    }

    private String generateEmployeeId() {
        String id;
        do {
            id = IdGenerator.generateEmployeeId();
        } while (employeeRepository.existsById(id));
        return id;
    }

    private String generateCategoryId() {
        String id;
        do {
            id = IdGenerator.generateCategoryId();
        } while (categoryRepository.existsById(id));
        return id;
    }

    private String generateAuthorId() {
        String id;
        do {
            id = IdGenerator.generateAuthorId();
        } while (authorRepository.existsById(id));
        return id;
    }

    private String generatePublisherId() {
        String id;
        do {
            id = IdGenerator.generatePublisherId();
        } while (publisherRepository.existsById(id));
        return id;
    }

    private String generateShelfId() {
        String id;
        do {
            id = IdGenerator.generateShelfId();
        } while (shelfRepository.existsById(id));
        return id;
    }

    private String generateBorrowingConfigId() {
        String id;
        do {
            id = IdGenerator.generateBorrowingConfigId();
        } while (borrowingConfigRepository.existsById(id));
        return id;
    }

    private String generateFineConfigId() {
        String id;
        do {
            id = IdGenerator.generateFineConfigId();
        } while (fineConfigRepository.existsById(id));
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