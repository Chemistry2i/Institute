package com.server.ACMIS.identity.application;

import com.server.ACMIS.identity.domain.UserAccount;
import com.server.ACMIS.identity.repository.UserAccountRepository;
import com.server.ACMIS.audit.application.AuditService;
import com.server.ACMIS.security.JwtService;
import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.AuthenticationManager;

import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class AuthServiceTest {
    @Test
    void loginIssuesBearerTokenForAuthenticatedUser() {
        AuthenticationManager authenticationManager = mock(AuthenticationManager.class);
        UserAccountRepository users = mock(UserAccountRepository.class);
        JwtService jwtService = mock(JwtService.class);
        AuditService auditService = mock(AuditService.class);
        UserAccount user = new UserAccount("admin@example.com", "hash", "System", "Admin", null);
        UUID userId = user.getId();
        when(users.findByEmailIgnoreCase("admin@example.com")).thenReturn(Optional.of(user));
        when(jwtService.issue(userId, "admin@example.com")).thenReturn("token");

        AuthService service = new AuthService(authenticationManager, users, jwtService, auditService, java.time.Duration.ofMinutes(15));
        var response = service.login(new com.server.ACMIS.identity.api.AuthDtos.LoginRequest("admin@example.com", "password"));

        assertThat(response.accessToken()).isEqualTo("token");
        assertThat(response.tokenType()).isEqualTo("Bearer");
        assertThat(response.expiresInSeconds()).isEqualTo(900);
        org.mockito.Mockito.verify(authenticationManager).authenticate(any());
    }
}
