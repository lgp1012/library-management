package me.ihqqq.library_management.repository;

import me.ihqqq.library_management.entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookRepository extends JpaRepository<Book, String> {
    long countByPublisher_PublisherId(String publisherId);

    boolean existsByBookNameIgnoreCase(String bookName);
    boolean existsByBookNameIgnoreCaseAndBookIdNot(String bookName, String bookId);
}
