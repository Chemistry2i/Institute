package com.server.TIMS.registration.repository;

import com.server.TIMS.registration.domain.CourseRegistration;
import com.server.TIMS.registration.domain.RegistrationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface CourseRegistrationRepository extends JpaRepository<CourseRegistration, UUID> {
    boolean existsByStudentIdAndCourseUnitIdAndAcademicPeriodIdAndStatus(UUID studentId, UUID courseUnitId, UUID academicPeriodId, RegistrationStatus status);
    List<CourseRegistration> findByStudentIdAndAcademicPeriodIdAndStatus(UUID studentId, UUID academicPeriodId, RegistrationStatus status);
}
