package me.ihqqq.library_management.repository;

import me.ihqqq.library_management.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EmployeeRepository extends JpaRepository<Employee, String> {

    Optional<Employee> findByUser_UserId(String userId);

    Optional<Employee> findByUser_Username(String username);
}