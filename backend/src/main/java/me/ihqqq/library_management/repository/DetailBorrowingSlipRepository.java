package me.ihqqq.library_management.repository;

import me.ihqqq.library_management.entity.DetailBorrowingSlip;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DetailBorrowingSlipRepository extends JpaRepository<DetailBorrowingSlip, String> {
}
