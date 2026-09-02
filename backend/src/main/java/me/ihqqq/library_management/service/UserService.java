package me.ihqqq.library_management.service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import me.ihqqq.library_management.constant.PredefinedRole;
import me.ihqqq.library_management.dto.request.ChangePasswordRequest;
import me.ihqqq.library_management.dto.request.UserCreationRequest;
import me.ihqqq.library_management.dto.request.UserUpdateRequest;
import me.ihqqq.library_management.dto.response.UserResponse;
import me.ihqqq.library_management.entity.Role;
import me.ihqqq.library_management.entity.User;
import me.ihqqq.library_management.exception.AppException;
import me.ihqqq.library_management.exception.ErrorCode;
import me.ihqqq.library_management.mapper.UserMapper;
import me.ihqqq.library_management.repository.RoleRepository;
import me.ihqqq.library_management.repository.UserRepository;
import me.ihqqq.library_management.util.IdGenerator;
import me.ihqqq.library_management.util.PasswordUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class UserService {

    UserRepository userRepository;
    RoleRepository roleRepository;
    UserMapper userMapper;

    /**
     * Lấy tất cả users.
     */
    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(userMapper::toUserResponse)
                .toList();
    }

    /**
     * Lấy một user theo id.
     */
    @Transactional(readOnly = true)
    public UserResponse getUserById(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        return userMapper.toUserResponse(user);
    }

    /**
     * Lấy thông tin của chính user đang đăng nhập (username lấy từ JWT subject).
     */
    @Transactional(readOnly = true)
    public UserResponse getCurrentUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        return userMapper.toUserResponse(user);
    }

    @Transactional
    public UserResponse createUser(UserCreationRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new AppException(ErrorCode.USERNAME_EXISTED);
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new AppException(ErrorCode.EMAIL_EXISTED);
        }

        Role role = resolveRole(request.getRoleId());

        User user = User.builder()
                .userId(generateUniqueUserId())
                .username(request.getUsername())
                .passwordHash(PasswordUtils.hash(request.getPassword()))
                .email(request.getEmail())
                .active(true)
                .role(role)
                .build();

        User saved = userRepository.save(user);
        log.info("User created: {} (id: {})", saved.getUsername(), saved.getUserId());

        return userMapper.toUserResponse(saved);
    }


    @Transactional
    public UserResponse updateUser(String id, UserUpdateRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        if (request.getEmail() != null && !request.getEmail().equals(user.getEmail())) {
            if (userRepository.existsByEmail(request.getEmail())) {
                throw new AppException(ErrorCode.EMAIL_EXISTED);
            }
            user.setEmail(request.getEmail());
        }

        if (request.getIsActive() != null) {
            user.setActive(request.getIsActive());
        }

        if (request.getRoleId() != null) {
            user.setRole(resolveRole(request.getRoleId()));
        }

        User saved = userRepository.save(user);
        log.info("User updated: {} (id: {})", saved.getUsername(), id);

        return userMapper.toUserResponse(saved);
    }

    /**
     * Đổi mật khẩu: kiểm tra mật khẩu cũ trước khi lưu mật khẩu mới.
     */
    @Transactional
    public void changePassword(String id, ChangePasswordRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        if (!PasswordUtils.matches(request.getOldPassword(), user.getPasswordHash())) {
            throw new AppException(ErrorCode.INVALID_PASSWORD);
        }

        user.setPasswordHash(PasswordUtils.hash(request.getNewPassword()));
        userRepository.save(user);
        log.info("Password changed for user: {}", id);
    }

    /**
     * Đổi mật khẩu của chính user đang đăng nhập (username lấy từ JWT subject).
     */
    @Transactional
    public void changePasswordSelf(String username, ChangePasswordRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        if (!PasswordUtils.matches(request.getOldPassword(), user.getPasswordHash())) {
            throw new AppException(ErrorCode.INVALID_PASSWORD);
        }

        user.setPasswordHash(PasswordUtils.hash(request.getNewPassword()));
        userRepository.save(user);
        log.info("Password self-changed for user: {}", username);
    }

    /**
     * Ghi nhận thời điểm đăng nhập gần nhất — gọi sau khi xác thực thành công.
     */
    @Transactional
    public void recordLogin(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);
    }

    /**
     * Xóa user.
     */
    @Transactional
    public void deleteUser(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        userRepository.delete(user);
        log.warn("User deleted: {} (id: {})", user.getUsername(), id);
    }

    private Role resolveRole(Integer roleId) {
        if (roleId != null) {
            return roleRepository.findById(roleId)
                    .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND));
        }
        return roleRepository.findByRoleNameIgnoreCase(PredefinedRole.READER_ROLE)
                .orElse(null);
    }

    private String generateUniqueUserId() {
        String id;
        do {
            id = IdGenerator.generateUserId();
        } while (userRepository.existsById(id));
        return id;
    }
}