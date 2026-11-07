package com.server.ACMIS.operations.api;

import com.server.ACMIS.operations.domain.OperationalModule;
import com.server.ACMIS.operations.domain.OperationalStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public final class OperationalDtos {
    private OperationalDtos() {}

    public record CreateRequest(@NotBlank @Size(max = 40) String reference,
                                @NotBlank @Size(max = 180) String title,
                                @NotBlank @Size(max = 180) String subject,
                                @Size(max = 180) String context,
                                @NotNull OperationalStatus status,
                                BigDecimal amount) {}
    public record StatusRequest(@NotNull OperationalStatus status) {}
    public record Response(UUID id, OperationalModule module, String reference, String title, String subject,
                           String context, OperationalStatus status, BigDecimal amount, Instant createdAt) {}
    public record Summary(OperationalModule module, long total, long needsAttention, long approvedOrPublished) {}
}
