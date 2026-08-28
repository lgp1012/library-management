package me.ihqqq.library_management.mapper;

import me.ihqqq.library_management.dto.response.UserResponse;
import me.ihqqq.library_management.entity.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = RoleMapper.class)
public interface UserMapper {

    UserResponse toUserResponse(User user);
}