package com.server.TIMS.academic.api;

import com.server.TIMS.academic.application.AcademicService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/academics")
public class AcademicController {
    private final AcademicService academicService;

    public AcademicController(AcademicService academicService) {
        this.academicService = academicService;
    }

    @PostMapping("/programmes")
    @PreAuthorize("hasAuthority('academic:write')")
    public AcademicDtos.ProgrammeResponse createProgramme(@Valid @RequestBody AcademicDtos.CreateProgrammeRequest request) {
        return academicService.createProgramme(request);
    }

    @GetMapping("/programmes")
    @PreAuthorize("hasAuthority('academic:read')")
    public List<AcademicDtos.ProgrammeResponse> programmes() {
        return academicService.programmes();
    }

    @PostMapping("/courses")
    @PreAuthorize("hasAuthority('academic:write')")
    public AcademicDtos.CourseResponse createCourse(@Valid @RequestBody AcademicDtos.CreateCourseRequest request) {
        return academicService.createCourse(request);
    }

    @GetMapping("/courses")
    @PreAuthorize("hasAuthority('academic:read')")
    public List<AcademicDtos.CourseResponse> courses(@RequestParam(required = false) UUID programmeId) {
        return academicService.courses(programmeId);
    }

    @PostMapping("/periods")
    @PreAuthorize("hasAuthority('academic:write')")
    public AcademicDtos.PeriodResponse createPeriod(@Valid @RequestBody AcademicDtos.CreatePeriodRequest request) {
        return academicService.createPeriod(request);
    }

    @GetMapping("/periods")
    @PreAuthorize("hasAuthority('academic:read')")
    public List<AcademicDtos.PeriodResponse> periods() {
        return academicService.periods();
    }
}
