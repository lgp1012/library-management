package me.ihqqq.library_management.repository;

import me.ihqqq.library_management.entity.FineConfig;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FineConfigRepository extends JpaRepository<FineConfig, String> {

    Optional<FineConfig> findTopByOrderByUpdatedAtDesc();

    Optional<FineConfig> findByFineTypeIgnoreCase(String fineType);
 
    boolean existsByFineTypeIgnoreCase(String fineType);

    boolean existsByFineTypeIgnoreCaseAndConfigIdNot(String fineType, String configId);
}