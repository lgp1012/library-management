package me.ihqqq.library_management.repository;

import me.ihqqq.library_management.entity.Publisher;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PublisherRepository extends JpaRepository<Publisher, String> {

    boolean existsByPublisherNameIgnoreCase(String publisherName);

    boolean existsByPublisherNameIgnoreCaseAndPublisherIdNot(String publisherName, String publisherId);
}