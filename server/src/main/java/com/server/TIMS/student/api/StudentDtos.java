package com.server.TIMS.student.api;

import com.server.TIMS.student.domain.StudentStatus;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public final class StudentDtos {
    private StudentDtos() {}

    public record CreateRequest(@NotBlank @Size(max = 30) String studentNumber,
                                @NotBlank @Size(max = 80) String firstName,
                                @NotBlank @Size(max = 80) String lastName,
                                @NotBlank @Email String email,
                                @NotNull UUID programmeId,
                                @Positive int admissionYear) {}
    public record StatusRequest(@NotNull StudentStatus status) {}
    public record Response(UUID id, String studentNumber, String firstName, String lastName, String email,
                           UUID programmeId, int admissionYear, StudentStatus status) {}
}
