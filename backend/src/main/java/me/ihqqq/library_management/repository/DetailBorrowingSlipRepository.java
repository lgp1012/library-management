package me.ihqqq.library_management.repository;

import me.ihqqq.library_management.entity.DetailBorrowingSlip;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DetailBorrowingSlipRepository extends JpaRepository<DetailBorrowingSlip, String> {

    boolean existsByCopy_CopyIdAndActualReturnDateIsNull(String copyId);
    long countByBorrowingSlip_Reader_ReaderIdAndActualReturnDateIsNull(String readerId);
    List<DetailBorrowingSlip> findByBorrowingSlip_Reader_ReaderIdAndActualReturnDateIsNull(String readerId);
    List<DetailBorrowingSlip> findByCopy_CopyIdAndActualReturnDateIsNull(String copyId);
}
