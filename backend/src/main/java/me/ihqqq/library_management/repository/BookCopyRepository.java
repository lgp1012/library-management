package me.ihqqq.library_management.repository;

import me.ihqqq.library_management.entity.BookCopy;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookCopyRepository extends JpaRepository<BookCopy, String> {

    long countByBook_BookIdAndStatus(String bookId, String status);
    long countByShelf_ShelfId(String shelfId);

    List<BookCopy> findByBook_BookId(String bookId);
    boolean existsByBook_BookId(String bookId);
}
