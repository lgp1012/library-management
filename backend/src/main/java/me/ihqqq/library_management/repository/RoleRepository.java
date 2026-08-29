package me.ihqqq.library_management.repository;

import me.ihqqq.library_management.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Integer> {

    boolean existsByRoleName(String roleName);

    Optional<Role> findByRoleName(String roleName);
}