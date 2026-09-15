package me.ihqqq.library_management.repository;

import jakarta.persistence.LockModeType;
import me.ihqqq.library_management.entity.BookCopy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface BookCopyRepository extends JpaRepository<BookCopy, String> {

    long countByBook_BookIdAndStatus(String bookId, String status);
    long countByShelf_ShelfId(String shelfId);

    List<BookCopy> findByBook_BookId(String bookId);
    boolean existsByBook_BookId(String bookId);
    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.data.jpa.repository.Query(value = "DELETE FROM book_copies WHERE book_id = :bookId", nativeQuery = true)
    void deleteCopiesByBookId(@Param("bookId") String bookId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select copy from BookCopy copy where copy.copyId = :copyId")
    Optional<BookCopy> findByIdForUpdate(@Param("copyId") String copyId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<BookCopy> findFirstByBook_BookIdAndStatusOrderByCopyIdAsc(String bookId, String status);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select copy from BookCopy copy where copy.book.bookId = :bookId order by copy.copyId")
    List<BookCopy> findByBookIdForUpdate(@Param("bookId") String bookId);
}
