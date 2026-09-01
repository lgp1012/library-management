package me.ihqqq.library_management.mapper;

import me.ihqqq.library_management.constant.PredefinedRole;
import me.ihqqq.library_management.dto.response.RoleResponse;
import me.ihqqq.library_management.dto.response.UserResponse;
import me.ihqqq.library_management.entity.User;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring", uses = RoleMapper.class)
public interface UserMapper {

    UserResponse toUserResponse(User user);

    @AfterMapping
    default void setDefaultRoleIfMissing(User user, @MappingTarget UserResponse response) {
        if (response.getRole() == null) {
            response.setRole(RoleResponse.builder()
                    .roleName(PredefinedRole.READER_ROLE)
                    .build());
        }
    }
}