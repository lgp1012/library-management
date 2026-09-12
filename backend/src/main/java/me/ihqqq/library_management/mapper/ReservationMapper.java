package me.ihqqq.library_management.mapper;

import me.ihqqq.library_management.dto.response.ReservationResponse;
import me.ihqqq.library_management.entity.Reservation;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ReservationMapper {

    @Mapping(target = "bookId", source = "book.bookId")
    @Mapping(target = "bookName", source = "book.bookName")
    ReservationResponse toReservationResponse(Reservation reservation);
}
