package me.ihqqq.library_management.repository;

import me.ihqqq.library_management.entity.BorrowingSlip;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BorrowingSlipRepository extends JpaRepository<BorrowingSlip, String> {

    List<BorrowingSlip> findByReader_ReaderIdOrderByBorrowDateDesc(String readerId);
}