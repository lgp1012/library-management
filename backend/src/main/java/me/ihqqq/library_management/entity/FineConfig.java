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
import org.hibernate.annotations.Nationalized;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "fine_config")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FineConfig {

    @Id
    @Column(name = "config_id", length = 10)
    String configId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "confiig_by_user_id")
    User configByUser;

    @Nationalized
    @Column(name = "fine_type", length = 100, nullable = false)
    String fineType;

    @Column(name = "finerate_per_day", precision = 12, scale = 2, nullable = false)
    BigDecimal fineRatePerDay;

    @Nationalized
    @Column(name = "description_fine", length = 500)
    String descriptionFine;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    LocalDateTime updatedAt;
}