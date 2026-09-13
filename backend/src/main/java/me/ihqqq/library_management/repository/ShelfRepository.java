package me.ihqqq.library_management.repository;

import me.ihqqq.library_management.entity.Shelf;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ShelfRepository extends JpaRepository<Shelf, String> {

    boolean existsByShelfNameIgnoreCase(String shelfName);

    boolean existsByShelfNameIgnoreCaseAndShelfIdNot(String shelfName, String shelfId);
}