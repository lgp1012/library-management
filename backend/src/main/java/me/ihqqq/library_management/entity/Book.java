package me.ihqqq.library_management.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.Nationalized;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "books")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Book {

    @Id
    @Column(name = "book_id", length = 10)
    String bookId;

    @Nationalized
    @Column(name = "book_name", length = 100, nullable = false)
    String bookName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "publisher_id")
    Publisher publisher;

    @Column(name = "year")
    Integer year;

    @Column(name = "description", columnDefinition = "NVARCHAR(MAX)")
    String description;

    @ManyToMany
    @JoinTable(
            name = "book_author",
            joinColumns = @JoinColumn(name = "book_id"),
            inverseJoinColumns = @JoinColumn(name = "author_id")
    )
    @Builder.Default
    Set<Author> authors = new HashSet<>();
    @ManyToMany
    @JoinTable(
            name = "book_category",
            joinColumns = @JoinColumn(name = "book_id"),
            inverseJoinColumns = @JoinColumn(name = "category_id")
    )
    @Builder.Default
    Set<Category> categories = new HashSet<>();
}
