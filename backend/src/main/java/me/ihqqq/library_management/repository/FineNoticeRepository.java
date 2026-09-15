package me.ihqqq.library_management.repository;

import jakarta.persistence.LockModeType;
import me.ihqqq.library_management.entity.FineNotice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface FineNoticeRepository extends JpaRepository<FineNotice, String> {

    List<FineNotice> findByDetail_BorrowingSlip_Reader_ReaderIdOrderByPaidStatusAscFineIdAsc(String readerId);

    boolean existsByDetail_BorrowingSlip_Reader_ReaderIdAndPaidStatusFalse(String readerId);

    boolean existsByDetail_Copy_Book_BookId(String bookId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select fine from FineNotice fine where fine.fineId = :fineId")
    Optional<FineNotice> findByIdForUpdate(@Param("fineId") String fineId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
            select fine from FineNotice fine
            where fine.detail.borrowingSlip.reader.readerId = :readerId
              and fine.paidStatus = false
            """)
    List<FineNotice> findUnpaidByReaderForUpdate(@Param("readerId") String readerId);
}