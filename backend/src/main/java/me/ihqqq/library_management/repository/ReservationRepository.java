package me.ihqqq.library_management.repository;

import me.ihqqq.library_management.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, String> {

    boolean existsByReader_ReaderIdAndBook_BookIdAndStatusNot(String readerId, String bookId, String status);

    boolean existsByReader_ReaderIdAndStatusNot(String readerId, String status);

    boolean existsByBook_BookIdAndStatus(String bookId, String status);

    List<Reservation> findByReader_ReaderIdOrderByReservationDateDesc(String readerId);

    List<Reservation> findByStatusOrderByReservationDateAsc(String status);
    boolean existsByBook_BookIdAndStatusNot(String bookId, String status);
}
