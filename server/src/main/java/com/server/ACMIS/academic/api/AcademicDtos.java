package com.server.ACMIS.academic.api;

import com.server.ACMIS.academic.domain.Semester;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.util.UUID;

public final class AcademicDtos {
    private AcademicDtos() {}

    public record CreateProgrammeRequest(@NotBlank @Size(max = 20) String code, @NotBlank @Size(max = 150) String name,
                                         @NotBlank @Size(max = 100) String faculty, @Positive int durationYears,
                                         @Positive int totalCredits) {}
    public record ProgrammeResponse(UUID id, String code, String name, String faculty, int durationYears, int totalCredits, boolean active) {}
    public record CreateCourseRequest(@NotBlank @Size(max = 20) String code, @NotBlank @Size(max = 150) String title,
                                      @Positive int creditUnits, @NotNull UUID programmeId) {}
    public record CourseResponse(UUID id, String code, String title, int creditUnits, UUID programmeId, boolean active) {}
    public record CreatePeriodRequest(@NotBlank @Size(min = 4, max = 9) String academicYear, @NotNull Semester semester,
                                      @NotNull LocalDate startsOn, @NotNull LocalDate endsOn, boolean active) {}
    public record PeriodResponse(UUID id, String academicYear, Semester semester, LocalDate startsOn, LocalDate endsOn, boolean active) {}
}
