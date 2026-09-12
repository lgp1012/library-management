package me.ihqqq.library_management.repository;

import me.ihqqq.library_management.entity.BorrowingConfig;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BorrowingConfigRepository extends JpaRepository<BorrowingConfig, String> {

    Optional<BorrowingConfig> findTopByOrderByUpdatedAtDesc();
}
