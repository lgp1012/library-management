package me.ihqqq.library_management.repository;

import me.ihqqq.library_management.entity.Book;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;

public interface BookCategoryLinkRepository extends Repository<Book, String> {

    @Query(value = "SELECT COUNT(*) FROM book_category WHERE category_id = :categoryId", nativeQuery = true)
    long countByCategoryId(@Param("categoryId") String categoryId);
}