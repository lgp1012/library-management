package me.ihqqq.library_management.repository;

import me.ihqqq.library_management.entity.BookCopy;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookCopyRepository extends JpaRepository<BookCopy, String> {

    long countByBook_BookIdAndStatus(String bookId, String status);
}
