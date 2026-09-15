package me.ihqqq.library_management.repository;

import jakarta.persistence.LockModeType;
import me.ihqqq.library_management.entity.Reader;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ReaderRepository extends JpaRepository<Reader, String> {

    Optional<Reader> findByUser_Username(String username);

    Optional<Reader> findByUser_UserId(String userId);

    boolean existsByUser_UserId(String userId);

    boolean existsByUser_Email(String email);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select reader from Reader reader join fetch reader.user where reader.user.username = :username")
    Optional<Reader> findByUsernameForUpdate(@Param("username") String username);
}
