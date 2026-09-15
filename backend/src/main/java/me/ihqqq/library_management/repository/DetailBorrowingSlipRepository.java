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

    boolean existsByCopy_CopyId(String copyId);
    boolean existsByCopy_CopyIdAndActualReturnDateIsNull(String copyId);
    List<DetailBorrowingSlip> findByCopy_CopyId(String copyId);
    
    @org.springframework.data.jpa.repository.Modifying(flushAutomatically = true, clearAutomatically = true)
    @org.springframework.data.jpa.repository.Query("delete from DetailBorrowingSlip d where d.copy.copyId = :copyId")
    void deleteByCopy_CopyId(@org.springframework.data.repository.query.Param("copyId") String copyId);

    @org.springframework.data.jpa.repository.Query("select d.detailId from DetailBorrowingSlip d where d.copy.copyId = :copyId")
    List<String> findDetailIdsByCopyId(@org.springframework.data.repository.query.Param("copyId") String copyId);

    long countByBorrowingSlip_Reader_ReaderIdAndActualReturnDateIsNull(String readerId);
    List<DetailBorrowingSlip> findByBorrowingSlip_Reader_ReaderIdAndActualReturnDateIsNull(String readerId);
    List<DetailBorrowingSlip> findByCopy_CopyIdAndActualReturnDateIsNull(String copyId);
    List<DetailBorrowingSlip> findByActualReturnDateIsNullOrderByExpectedReturnDateAsc();
    List<DetailBorrowingSlip> findByBorrowingSlip_Reader_ReaderIdOrderByExpectedReturnDateDesc(String readerId);

    long countByCopy_Book_BookIdAndActualReturnDateIsNull(String bookId);
    List<DetailBorrowingSlip> findByCopy_Book_BookIdAndActualReturnDateIsNullOrderByExpectedReturnDateAsc(String bookId);

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
