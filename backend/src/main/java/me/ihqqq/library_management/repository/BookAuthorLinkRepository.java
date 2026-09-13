package me.ihqqq.library_management.repository;

import me.ihqqq.library_management.entity.Book;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;

public interface BookAuthorLinkRepository extends Repository<Book, String> {

    @Query(value = "SELECT COUNT(*) FROM book_author WHERE author_id = :authorId", nativeQuery = true)
    long countByAuthorId(@Param("authorId") String authorId);
}