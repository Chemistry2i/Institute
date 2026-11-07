package com.server.TIMS.student.application;

import com.server.TIMS.audit.application.AuditService;
import com.server.TIMS.student.api.StudentDtos;
import com.server.TIMS.student.domain.Student;
import com.server.TIMS.student.domain.StudentStatus;
import com.server.TIMS.student.repository.StudentRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class StudentService {
    private final StudentRepository students;
    private final AuditService auditService;

    public StudentService(StudentRepository students, AuditService auditService) {
        this.students = students;
        this.auditService = auditService;
    }

    @Transactional
    public StudentDtos.Response create(StudentDtos.CreateRequest request) {
        if (students.existsByStudentNumberIgnoreCase(request.studentNumber())) {
            throw new IllegalArgumentException("Student number is already in use");
        }
        if (students.existsByEmailIgnoreCase(request.email())) {
            throw new IllegalArgumentException("Student email is already in use");
        }
        Student student = students.save(new Student(request.studentNumber(), request.firstName(), request.lastName(), request.email(), request.programmeId(), request.admissionYear()));
        auditService.record(null, "CREATE", "STUDENT", student.getId().toString(), "Student record created");
        return toResponse(student);
    }

    @Transactional(readOnly = true)
    public Page<StudentDtos.Response> search(String query, Pageable pageable) {
        Page<Student> result = query == null || query.isBlank()
            ? students.findAll(pageable)
            : students.findByStudentNumberContainingIgnoreCaseOrFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(query, query, query, pageable);
        return result.map(this::toResponse);
    }

    @Transactional
    public StudentDtos.Response changeStatus(UUID id, StudentStatus status) {
        Student student = students.findById(id).orElseThrow(() -> new IllegalArgumentException("Student not found"));
        student.changeStatus(status);
        auditService.record(null, "STATUS_CHANGE", "STUDENT", id.toString(), "Student status changed to " + status);
        return toResponse(student);
    }

    private StudentDtos.Response toResponse(Student student) {
        return new StudentDtos.Response(student.getId(), student.getStudentNumber(), student.getFirstName(), student.getLastName(), student.getEmail(), student.getProgrammeId(), student.getAdmissionYear(), student.getStatus());
    }
}
