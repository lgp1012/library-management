package me.ihqqq.library_management.repository;

import jakarta.persistence.LockModeType;
import me.ihqqq.library_management.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface NotificationRepository extends JpaRepository<Notification, String> {

    List<Notification> findByCreatedByUser_UserIdOrderByCreatedAtDesc(String userId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
            select notification from Notification notification
            where notification.notificationId = :notificationId
              and notification.createdByUser.userId = :userId
            """)
    Optional<Notification> findOwnedByUserForUpdate(@Param("notificationId") String notificationId,
                                                    @Param("userId") String userId);
}
