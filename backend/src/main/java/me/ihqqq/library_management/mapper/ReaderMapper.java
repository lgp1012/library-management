package me.ihqqq.library_management.mapper;

import me.ihqqq.library_management.dto.response.ReaderResponse;
import me.ihqqq.library_management.entity.Reader;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ReaderMapper {

    @Mapping(target = "userId", source = "user.userId")
    @Mapping(target = "username", source = "user.username")
    @Mapping(target = "email", source = "user.email")
    @Mapping(target = "active", source = "user.active")
    ReaderResponse toReaderResponse(Reader reader);
}
