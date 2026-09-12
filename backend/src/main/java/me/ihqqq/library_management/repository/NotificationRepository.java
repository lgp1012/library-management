package me.ihqqq.library_management.repository;

import me.ihqqq.library_management.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, String> {

    List<Notification> findByCreatedByUser_UserIdOrderByCreatedAtDesc(String userId);
}
