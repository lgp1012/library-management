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

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "fine_notices")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FineNotice {

    @Id
    @Column(name = "fine_id", length = 10)
    String fineId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "detail_id", nullable = false)
    DetailBorrowingSlip detail;

    @Column(name = "collected_by_employee_id", length = 10)
    String collectedByEmployeeId;

    @Column(name = "fine_price", precision = 12, scale = 2, nullable = false)
    BigDecimal finePrice;

    @Nationalized
    @Column(name = "reason", length = 500)
    String reason;

    @Column(name = "paid_status", nullable = false)
    @Builder.Default
    boolean paidStatus = false;

    @Column(name = "paid_date")
    LocalDate paidDate;
}