package me.ihqqq.library_management.repository;

import me.ihqqq.library_management.entity.SystemLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SystemLogRepository extends JpaRepository<SystemLog, String> {

    List<SystemLog> findTop100ByOrderByLogDateDesc();
}