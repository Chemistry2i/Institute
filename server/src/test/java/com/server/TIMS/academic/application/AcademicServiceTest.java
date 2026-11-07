package com.server.TIMS.academic.application;

import com.server.TIMS.academic.api.AcademicDtos;
import com.server.TIMS.academic.repository.AcademicPeriodRepository;
import com.server.TIMS.academic.repository.CourseUnitRepository;
import com.server.TIMS.academic.repository.ProgrammeRepository;
import com.server.TIMS.audit.application.AuditService;
import org.junit.jupiter.api.Test;

import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class AcademicServiceTest {
    @Test
    void rejectsCourseForUnknownProgramme() {
        ProgrammeRepository programmes = mock(ProgrammeRepository.class);
        CourseUnitRepository courses = mock(CourseUnitRepository.class);
        AcademicPeriodRepository periods = mock(AcademicPeriodRepository.class);
        when(programmes.existsById(org.mockito.ArgumentMatchers.any())).thenReturn(false);

        AcademicService service = new AcademicService(programmes, courses, periods, mock(AuditService.class));
        var request = new AcademicDtos.CreateCourseRequest("CSC 101", "Introduction to Computing", 4, UUID.randomUUID());

        assertThatThrownBy(() -> service.createCourse(request))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessage("Programme not found");
    }
}
