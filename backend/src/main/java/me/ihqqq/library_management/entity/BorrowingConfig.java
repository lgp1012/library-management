package me.ihqqq.library_management.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "borrowing_config")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BorrowingConfig {

    @Id
    @Column(name = "config_id", length = 10)
    String configId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "config_by_user_id")
    User configByUser;

    @Column(name = "max_borrow_days", nullable = false)
    Integer maxBorrowDays;

    @Column(name = "max_books_per_reader", nullable = false)
    Integer maxBooksPerReader;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    LocalDateTime updatedAt;
}
