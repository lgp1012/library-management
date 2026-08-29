package me.ihqqq.library_management.mapper;

import me.ihqqq.library_management.dto.request.RoleRequest;
import me.ihqqq.library_management.dto.response.RoleResponse;
import me.ihqqq.library_management.entity.Role;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface RoleMapper {

    @Mapping(target = "roleId", ignore = true)
    @Mapping(target = "users", ignore = true)
    Role toRole(RoleRequest request);

    RoleResponse toRoleResponse(Role role);

    @Mapping(target = "roleId", ignore = true)
    @Mapping(target = "users", ignore = true)
    void updateRole(@MappingTarget Role role, RoleRequest request);
}