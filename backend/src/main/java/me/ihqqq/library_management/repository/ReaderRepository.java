package me.ihqqq.library_management.repository;

import me.ihqqq.library_management.entity.Reader;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ReaderRepository extends JpaRepository<Reader, String> {

    Optional<Reader> findByUser_Username(String username);

    Optional<Reader> findByUser_UserId(String userId);

    boolean existsByUser_UserId(String userId);

    boolean existsByUser_Email(String email);
}
