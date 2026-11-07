package com.server.ACMIS.institution.api;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public final class InstitutionDtos {
    private InstitutionDtos() {}

    public record CreateRequest(@NotBlank @Size(max = 150) String name,
                                @NotBlank @Size(max = 30) String code,
                                @NotBlank String timezone,
                                @NotBlank @Pattern(regexp = "[A-Z]{3}") String currency) {}
    public record UpdateRequest(@NotBlank @Size(max = 150) String name,
                                @NotBlank String timezone,
                                @NotBlank @Pattern(regexp = "[A-Z]{3}") String currency) {}
    public record Response(UUID id, String name, String code, String timezone, String currency, boolean active) {}
}
