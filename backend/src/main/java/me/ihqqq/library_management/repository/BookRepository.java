package me.ihqqq.library_management.repository;

import jakarta.persistence.LockModeType;
import me.ihqqq.library_management.entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface BookRepository extends JpaRepository<Book, String> {
    long countByPublisher_PublisherId(String publisherId);

    boolean existsByBookNameIgnoreCase(String bookName);
    boolean existsByBookNameIgnoreCaseAndBookIdNot(String bookName, String bookId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select book from Book book where book.bookId = :bookId")
    Optional<Book> findByIdForUpdate(@Param("bookId") String bookId);
}
