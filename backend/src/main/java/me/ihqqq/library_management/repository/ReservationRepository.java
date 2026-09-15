package me.ihqqq.library_management.repository;

import jakarta.persistence.LockModeType;
import me.ihqqq.library_management.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.Collection;

public interface ReservationRepository extends JpaRepository<Reservation, String> {

    boolean existsByReader_ReaderIdAndBook_BookIdAndStatusNot(String readerId, String bookId, String status);

    boolean existsByReader_ReaderIdAndStatusNot(String readerId, String status);

    boolean existsByBook_BookIdAndStatus(String bookId, String status);

    List<Reservation> findByReader_ReaderIdOrderByReservationDateDesc(String readerId);

    List<Reservation> findByStatusOrderByReservationDateAsc(String status);

    List<Reservation> findByStatusInOrderByReservationDateAsc(Collection<String> statuses);

    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.data.jpa.repository.Query("delete from Reservation r where r.book.bookId = :bookId")
    void deleteByBook_BookId(@org.springframework.data.repository.query.Param("bookId") String bookId);

    boolean existsByBook_BookIdAndStatusNot(String bookId, String status);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select reservation from Reservation reservation where reservation.reservationId = :reservationId")
    Optional<Reservation> findByIdForUpdate(@Param("reservationId") String reservationId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
            select reservation from Reservation reservation
            where reservation.reader.readerId = :readerId
              and reservation.book.bookId = :bookId
              and reservation.status in :statuses
            order by reservation.reservationId
            """)
    List<Reservation> findConflictsForUpdate(@Param("readerId") String readerId,
                                             @Param("bookId") String bookId,
                                             @Param("statuses") Collection<String> statuses);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
            select reservation from Reservation reservation
            where reservation.book.bookId = :bookId
              and reservation.reader.readerId <> :readerId
              and reservation.status in :statuses
            order by reservation.reservationId
            """)
    List<Reservation> findOtherReadersWaitingForUpdate(@Param("readerId") String readerId,
                                                       @Param("bookId") String bookId,
                                                       @Param("statuses") Collection<String> statuses);
}
