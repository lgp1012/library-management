package me.ihqqq.library_management.service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import me.ihqqq.library_management.dto.request.RoleRequest;
import me.ihqqq.library_management.dto.response.RoleResponse;
import me.ihqqq.library_management.entity.Role;
import me.ihqqq.library_management.exception.AppException;
import me.ihqqq.library_management.exception.ErrorCode;
import me.ihqqq.library_management.mapper.RoleMapper;
import me.ihqqq.library_management.repository.RoleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class RoleService {

    RoleRepository roleRepository;
    RoleMapper roleMapper;


    @Transactional(readOnly = true)
    public List<RoleResponse> getAllRoles() {
        return roleRepository.findAll().stream()
                .map(roleMapper::toRoleResponse)
                .toList();
    }


    @Transactional(readOnly = true)
    public RoleResponse getRoleById(Integer id) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND));
        return roleMapper.toRoleResponse(role);
    }


    @Transactional
    public RoleResponse createRole(RoleRequest request) {
        if (roleRepository.existsByRoleName(request.getRoleName())) {
            throw new AppException(ErrorCode.ROLE_NAME_EXISTED);
        }

        Role role = roleMapper.toRole(request);
        Role saved = roleRepository.save(role);
        log.info("Role created: {} (id: {})", saved.getRoleName(), saved.getRoleId());

        return roleMapper.toRoleResponse(saved);
    }


    @Transactional
    public RoleResponse updateRole(Integer id, RoleRequest request) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND));

        if (!role.getRoleName().equals(request.getRoleName())
                && roleRepository.existsByRoleName(request.getRoleName())) {
            throw new AppException(ErrorCode.ROLE_NAME_EXISTED);
        }

        roleMapper.updateRole(role, request);
        Role saved = roleRepository.save(role);

        log.info("Role updated: {} (id: {})", saved.getRoleName(), id);
        return roleMapper.toRoleResponse(saved);
    }


    @Transactional
    public void deleteRole(Integer id) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND));

        if (!role.getUsers().isEmpty()) {
            throw new AppException(ErrorCode.ROLE_IN_USE);
        }

        roleRepository.delete(role);
        log.warn("Role deleted: {} (id: {})", role.getRoleName(), id);
    }
}