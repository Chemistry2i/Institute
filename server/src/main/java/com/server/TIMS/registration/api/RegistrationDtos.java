package com.server.TIMS.registration.api;

import com.server.TIMS.registration.domain.RegistrationStatus;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public final class RegistrationDtos {
    private RegistrationDtos() {}

    public record CreateRequest(@NotNull UUID studentId, @NotNull UUID courseUnitId, @NotNull UUID academicPeriodId) {}
    public record Response(UUID id, UUID studentId, UUID courseUnitId, UUID academicPeriodId, RegistrationStatus status) {}
}
