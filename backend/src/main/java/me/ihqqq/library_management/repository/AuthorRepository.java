package me.ihqqq.library_management.repository;

import me.ihqqq.library_management.entity.Author;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuthorRepository extends JpaRepository<Author, String> {

    boolean existsByAuthorNameIgnoreCase(String authorName);

    boolean existsByAuthorNameIgnoreCaseAndAuthorIdNot(String authorName, String authorId);
}