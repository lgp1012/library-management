package me.ihqqq.library_management.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.Nationalized;

@Entity
@Table(name = "shelves")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Shelf {

    @Id
    @Column(name = "shelf_id", length = 10)
    String shelfId;

    @Nationalized
    @Column(name = "shelf_name", length = 100, nullable = false)
    String shelfName;

    @Column(name = "position", length = 100)
    String position;
}
