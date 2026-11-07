package com.server.ACMIS.registration.application;

import com.server.ACMIS.academic.domain.CourseUnit;
import com.server.ACMIS.academic.domain.AcademicPeriod;
import com.server.ACMIS.academic.repository.AcademicPeriodRepository;
import com.server.ACMIS.academic.repository.CourseUnitRepository;
import com.server.ACMIS.audit.application.AuditService;
import com.server.ACMIS.registration.api.RegistrationDtos;
import com.server.ACMIS.registration.domain.CourseRegistration;
import com.server.ACMIS.registration.domain.RegistrationStatus;
import com.server.ACMIS.registration.repository.CourseRegistrationRepository;
import com.server.ACMIS.student.domain.Student;
import com.server.ACMIS.student.domain.StudentStatus;
import com.server.ACMIS.student.repository.StudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class RegistrationService {
    private static final int MAX_CREDIT_LOAD = 30;
    private final CourseRegistrationRepository registrations;
    private final StudentRepository students;
    private final CourseUnitRepository courses;
    private final AcademicPeriodRepository periods;
    private final AuditService auditService;

    public RegistrationService(CourseRegistrationRepository registrations, StudentRepository students, CourseUnitRepository courses, AcademicPeriodRepository periods, AuditService auditService) {
        this.registrations = registrations;
        this.students = students;
        this.courses = courses;
        this.periods = periods;
        this.auditService = auditService;
    }

    @Transactional
    public RegistrationDtos.Response register(RegistrationDtos.CreateRequest request) {
        Student student = students.findById(request.studentId()).orElseThrow(() -> new IllegalArgumentException("Student not found"));
        if (student.getStatus() != StudentStatus.ACTIVE) {
            throw new IllegalArgumentException("Only active students may register courses");
        }
        CourseUnit course = courses.findById(request.courseUnitId()).orElseThrow(() -> new IllegalArgumentException("Course unit not found"));
        AcademicPeriod period = periods.findById(request.academicPeriodId()).orElseThrow(() -> new IllegalArgumentException("Academic period not found"));
        if (!period.isActive()) {
            throw new IllegalArgumentException("Course registration is closed for this academic period");
        }
        if (registrations.existsByStudentIdAndCourseUnitIdAndAcademicPeriodIdAndStatus(request.studentId(), request.courseUnitId(), request.academicPeriodId(), RegistrationStatus.REGISTERED)) {
            throw new IllegalArgumentException("Student is already registered for this course unit");
        }
        int currentCredits = registrations.findByStudentIdAndAcademicPeriodIdAndStatus(request.studentId(), request.academicPeriodId(), RegistrationStatus.REGISTERED)
            .stream().mapToInt(registration -> courses.findById(registration.getCourseUnitId()).map(CourseUnit::getCreditUnits).orElse(0)).sum();
        if (currentCredits + course.getCreditUnits() > MAX_CREDIT_LOAD) {
            throw new IllegalArgumentException("Registration exceeds the 30-credit semester limit");
        }
        CourseRegistration registration = registrations.save(new CourseRegistration(request.studentId(), request.courseUnitId(), request.academicPeriodId()));
        auditService.record(null, "REGISTER", "COURSE_REGISTRATION", registration.getId().toString(), "Course unit registered");
        return toResponse(registration);
    }

    @Transactional(readOnly = true)
    public java.util.List<RegistrationDtos.Response> studentRegistrations(UUID studentId, UUID academicPeriodId) {
        return registrations.findByStudentIdAndAcademicPeriodIdAndStatus(studentId, academicPeriodId, RegistrationStatus.REGISTERED).stream().map(this::toResponse).toList();
    }

    private RegistrationDtos.Response toResponse(CourseRegistration registration) {
        return new RegistrationDtos.Response(registration.getId(), registration.getStudentId(), registration.getCourseUnitId(), registration.getAcademicPeriodId(), registration.getStatus());
    }
}
