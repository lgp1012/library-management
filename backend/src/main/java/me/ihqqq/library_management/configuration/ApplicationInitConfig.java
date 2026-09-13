package me.ihqqq.library_management.config;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import me.ihqqq.library_management.constant.PredefinedRole;
import me.ihqqq.library_management.entity.Role;
import me.ihqqq.library_management.entity.User;
import me.ihqqq.library_management.repository.RoleRepository;
import me.ihqqq.library_management.repository.UserRepository;
import me.ihqqq.library_management.util.IdGenerator;
import me.ihqqq.library_management.util.PasswordUtils;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


@Configuration
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ApplicationInitConfig {

    static final String ADMIN_USERNAME = "admin";
    static final String ADMIN_PASSWORD = "admin";
    static final String ADMIN_EMAIL = "admin@library-management.local";

    @Bean
    ApplicationRunner applicationRunner(UserRepository userRepository, RoleRepository roleRepository) {
        return args -> {
            Role adminRole = roleRepository.findByRoleNameIgnoreCase(PredefinedRole.ADMIN_ROLE)
                    .orElseGet(() -> {
                        log.info("Seeding role: {}", PredefinedRole.ADMIN_ROLE);
                        return roleRepository.save(Role.builder()
                                .roleName(PredefinedRole.ADMIN_ROLE)
                                .build());
                    });

            roleRepository.findByRoleNameIgnoreCase(PredefinedRole.READER_ROLE)
                    .orElseGet(() -> {
                        log.info("Seeding role: {}", PredefinedRole.READER_ROLE);
                        return roleRepository.save(Role.builder()
                                .roleName(PredefinedRole.READER_ROLE)
                                .build());
                    });

            roleRepository.findByRoleNameIgnoreCase(PredefinedRole.EMPLOYEE_ROLE)
                    .orElseGet(() -> {
                        log.info("Seeding role: {}", PredefinedRole.EMPLOYEE_ROLE);
                        return roleRepository.save(Role.builder()
                                .roleName(PredefinedRole.EMPLOYEE_ROLE)
                                .build());
                    });

            if (userRepository.findByUsername(ADMIN_USERNAME).isEmpty()) {
                String userId;
                do {
                    userId = IdGenerator.generateUserId();
                } while (userRepository.existsById(userId));

                User admin = User.builder()
                        .userId(userId)
                        .username(ADMIN_USERNAME)
                        .passwordHash(PasswordUtils.hash(ADMIN_PASSWORD))
                        .email(ADMIN_EMAIL)
                        .active(true)
                        .role(adminRole)
                        .build();

                userRepository.save(admin);
                log.warn("Default admin account created — username: '{}', password: '{}'. "
                        + "Please log in and change this password immediately.", ADMIN_USERNAME, ADMIN_PASSWORD);
            }

            log.info("Application initialization completed.");
        };
    }
}