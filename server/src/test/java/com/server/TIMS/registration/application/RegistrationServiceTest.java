package com.server.TIMS.registration.application;

import com.server.TIMS.academic.repository.AcademicPeriodRepository;
import com.server.TIMS.academic.repository.CourseUnitRepository;
import com.server.TIMS.audit.application.AuditService;
import com.server.TIMS.registration.repository.CourseRegistrationRepository;
import com.server.TIMS.student.domain.Student;
import com.server.TIMS.student.repository.StudentRepository;
import org.junit.jupiter.api.Test;

import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class RegistrationServiceTest {
    @Test
    void rejectsRegistrationForUnknownStudent() {
        CourseRegistrationRepository registrations = mock(CourseRegistrationRepository.class);
        StudentRepository students = mock(StudentRepository.class);
        CourseUnitRepository courses = mock(CourseUnitRepository.class);
        AcademicPeriodRepository periods = mock(AcademicPeriodRepository.class);
        UUID studentId = UUID.randomUUID();
        when(students.findById(studentId)).thenReturn(Optional.empty());

        RegistrationService service = new RegistrationService(registrations, students, courses, periods, mock(AuditService.class));

        assertThatThrownBy(() -> service.register(new com.server.TIMS.registration.api.RegistrationDtos.CreateRequest(studentId, UUID.randomUUID(), UUID.randomUUID())))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessage("Student not found");
    }
}
