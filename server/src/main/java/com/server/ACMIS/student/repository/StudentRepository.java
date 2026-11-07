package com.server.ACMIS.student.repository;

import com.server.ACMIS.student.domain.Student;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface StudentRepository extends JpaRepository<Student, UUID> {
    Optional<Student> findByStudentNumberIgnoreCase(String studentNumber);
    boolean existsByStudentNumberIgnoreCase(String studentNumber);
    boolean existsByEmailIgnoreCase(String email);
    Page<Student> findByStudentNumberContainingIgnoreCaseOrFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(String studentNumber, String firstName, String lastName, Pageable pageable);
}
