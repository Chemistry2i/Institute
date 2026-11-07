package com.server.TIMS.student.domain;

import com.server.TIMS.common.domain.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;

import java.util.UUID;

@Entity
@Table(name = "students")
public class Student extends BaseEntity {
    @Column(name = "student_number", nullable = false, unique = true, length = 30)
    private String studentNumber;

    @Column(name = "first_name", nullable = false, length = 80)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 80)
    private String lastName;

    @Column(nullable = false, unique = true, length = 180)
    private String email;

    @Column(name = "programme_id", nullable = false, length = 36)
    private UUID programmeId;

    @Column(name = "admission_year", nullable = false)
    private int admissionYear;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private StudentStatus status = StudentStatus.ACTIVE;

    protected Student() {
    }

    public Student(String studentNumber, String firstName, String lastName, String email, UUID programmeId, int admissionYear) {
        this.studentNumber = studentNumber;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.programmeId = programmeId;
        this.admissionYear = admissionYear;
    }

    public String getStudentNumber() { return studentNumber; }
    public String getFirstName() { return firstName; }
    public String getLastName() { return lastName; }
    public String getEmail() { return email; }
    public UUID getProgrammeId() { return programmeId; }
    public int getAdmissionYear() { return admissionYear; }
    public StudentStatus getStatus() { return status; }

    public void changeStatus(StudentStatus status) {
        this.status = status;
    }
}
