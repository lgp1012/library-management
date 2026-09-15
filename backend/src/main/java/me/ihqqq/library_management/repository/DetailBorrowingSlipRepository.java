package me.ihqqq.library_management.repository;

import jakarta.persistence.LockModeType;
import me.ihqqq.library_management.entity.DetailBorrowingSlip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface DetailBorrowingSlipRepository extends JpaRepository<DetailBorrowingSlip, String> {

    boolean existsByCopy_CopyIdAndActualReturnDateIsNull(String copyId);
    long countByBorrowingSlip_Reader_ReaderIdAndActualReturnDateIsNull(String readerId);
    List<DetailBorrowingSlip> findByBorrowingSlip_Reader_ReaderIdAndActualReturnDateIsNull(String readerId);
    List<DetailBorrowingSlip> findByCopy_CopyIdAndActualReturnDateIsNull(String copyId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<DetailBorrowingSlip> findFirstByCopy_CopyIdAndActualReturnDateIsNullOrderByDetailIdAsc(String copyId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
            select detail from DetailBorrowingSlip detail
            join fetch detail.borrowingSlip slip
            join fetch detail.copy copy
            join fetch copy.book
            where detail.detailId = :detailId
            """)
    Optional<DetailBorrowingSlip> findByIdForUpdate(@Param("detailId") String detailId);
}
