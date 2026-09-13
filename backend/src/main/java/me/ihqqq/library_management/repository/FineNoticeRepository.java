package me.ihqqq.library_management.repository;

import me.ihqqq.library_management.entity.FineNotice;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FineNoticeRepository extends JpaRepository<FineNotice, String> {

    List<FineNotice> findByDetail_BorrowingSlip_Reader_ReaderIdOrderByPaidStatusAscFineIdAsc(String readerId);

    boolean existsByDetail_BorrowingSlip_Reader_ReaderIdAndPaidStatusFalse(String readerId);

    boolean existsByDetail_Copy_Book_BookId(String bookId);
}