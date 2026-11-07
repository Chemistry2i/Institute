package com.server.ACMIS.academic.application;

import com.server.ACMIS.academic.api.AcademicDtos;
import com.server.ACMIS.academic.domain.AcademicPeriod;
import com.server.ACMIS.academic.domain.CourseUnit;
import com.server.ACMIS.academic.domain.Programme;
import com.server.ACMIS.academic.repository.AcademicPeriodRepository;
import com.server.ACMIS.academic.repository.CourseUnitRepository;
import com.server.ACMIS.academic.repository.ProgrammeRepository;
import com.server.ACMIS.audit.application.AuditService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class AcademicService {
    private final ProgrammeRepository programmes;
    private final CourseUnitRepository courses;
    private final AcademicPeriodRepository periods;
    private final AuditService auditService;

    public AcademicService(ProgrammeRepository programmes, CourseUnitRepository courses, AcademicPeriodRepository periods, AuditService auditService) {
        this.programmes = programmes;
        this.courses = courses;
        this.periods = periods;
        this.auditService = auditService;
    }

    @Transactional
    public AcademicDtos.ProgrammeResponse createProgramme(AcademicDtos.CreateProgrammeRequest request) {
        if (programmes.existsByCodeIgnoreCase(request.code())) {
            throw new IllegalArgumentException("Programme code is already in use");
        }
        Programme programme = programmes.save(new Programme(request.code(), request.name(), request.faculty(), request.durationYears(), request.totalCredits()));
        auditService.record(null, "CREATE", "PROGRAMME", programme.getId().toString(), "Programme created");
        return toResponse(programme);
    }

    @Transactional(readOnly = true)
    public List<AcademicDtos.ProgrammeResponse> programmes() {
        return programmes.findAll().stream().map(this::toResponse).toList();
    }

    @Transactional
    public AcademicDtos.CourseResponse createCourse(AcademicDtos.CreateCourseRequest request) {
        if (courses.existsByCodeIgnoreCase(request.code())) {
            throw new IllegalArgumentException("Course unit code is already in use");
        }
        if (!programmes.existsById(request.programmeId())) {
            throw new IllegalArgumentException("Programme not found");
        }
        CourseUnit course = courses.save(new CourseUnit(request.code(), request.title(), request.creditUnits(), request.programmeId()));
        auditService.record(null, "CREATE", "COURSE_UNIT", course.getId().toString(), "Course unit created");
        return toResponse(course);
    }

    @Transactional(readOnly = true)
    public List<AcademicDtos.CourseResponse> courses(UUID programmeId) {
        return courses.findAll().stream().filter(course -> programmeId == null || programmeId.equals(course.getProgrammeId())).map(this::toResponse).toList();
    }

    @Transactional
    public AcademicDtos.PeriodResponse createPeriod(AcademicDtos.CreatePeriodRequest request) {
        if (periods.existsByAcademicYearAndSemester(request.academicYear(), request.semester())) {
            throw new IllegalArgumentException("Academic period already exists");
        }
        AcademicPeriod period = periods.save(new AcademicPeriod(request.academicYear(), request.semester(), request.startsOn(), request.endsOn(), request.active()));
        auditService.record(null, "CREATE", "ACADEMIC_PERIOD", period.getId().toString(), "Academic period created");
        return toResponse(period);
    }

    @Transactional(readOnly = true)
    public List<AcademicDtos.PeriodResponse> periods() {
        return periods.findAll().stream().map(this::toResponse).toList();
    }

    private AcademicDtos.ProgrammeResponse toResponse(Programme programme) {
        return new AcademicDtos.ProgrammeResponse(programme.getId(), programme.getCode(), programme.getName(), programme.getFaculty(), programme.getDurationYears(), programme.getTotalCredits(), programme.isActive());
    }

    private AcademicDtos.CourseResponse toResponse(CourseUnit course) {
        return new AcademicDtos.CourseResponse(course.getId(), course.getCode(), course.getTitle(), course.getCreditUnits(), course.getProgrammeId(), course.isActive());
    }

    private AcademicDtos.PeriodResponse toResponse(AcademicPeriod period) {
        return new AcademicDtos.PeriodResponse(period.getId(), period.getAcademicYear(), period.getSemester(), period.getStartsOn(), period.getEndsOn(), period.isActive());
    }
}
