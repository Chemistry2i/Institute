package com.server.ACMIS.registration.domain;

import com.server.ACMIS.common.domain.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.UUID;

@Entity
@Table(name = "course_registrations")
public class CourseRegistration extends BaseEntity {
    @Column(name = "student_id", nullable = false, length = 36)
    @JdbcTypeCode(SqlTypes.CHAR)
    private UUID studentId;

    @Column(name = "course_unit_id", nullable = false, length = 36)
    @JdbcTypeCode(SqlTypes.CHAR)
    private UUID courseUnitId;

    @Column(name = "academic_period_id", nullable = false, length = 36)
    @JdbcTypeCode(SqlTypes.CHAR)
    private UUID academicPeriodId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private RegistrationStatus status = RegistrationStatus.REGISTERED;

    protected CourseRegistration() {
    }

    public CourseRegistration(UUID studentId, UUID courseUnitId, UUID academicPeriodId) {
        this.studentId = studentId;
        this.courseUnitId = courseUnitId;
        this.academicPeriodId = academicPeriodId;
    }

    public UUID getStudentId() { return studentId; }
    public UUID getCourseUnitId() { return courseUnitId; }
    public UUID getAcademicPeriodId() { return academicPeriodId; }
    public RegistrationStatus getStatus() { return status; }
}
