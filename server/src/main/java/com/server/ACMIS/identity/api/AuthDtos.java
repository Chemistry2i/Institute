package com.server.ACMIS.identity.api;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.Set;
import java.util.UUID;

public final class AuthDtos {
    private AuthDtos() {}

    public record LoginRequest(@NotBlank @Email String email, @NotBlank String password) {}
    public record LoginResponse(String accessToken, String tokenType, long expiresInSeconds) {}
    public record CurrentUser(UUID id, String email, String firstName, String lastName, Set<String> roles, UUID institutionId) {}
}
