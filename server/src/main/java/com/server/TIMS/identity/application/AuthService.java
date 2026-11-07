package com.server.TIMS.identity.application;

import com.server.TIMS.audit.application.AuditService;
import com.server.TIMS.identity.api.AuthDtos;
import com.server.TIMS.identity.domain.UserAccount;
import com.server.TIMS.identity.repository.UserAccountRepository;
import com.server.TIMS.security.JwtService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {
    private final AuthenticationManager authenticationManager;
    private final UserAccountRepository users;
    private final JwtService jwtService;
    private final AuditService auditService;
    private final long tokenTtlSeconds;

    public AuthService(AuthenticationManager authenticationManager, UserAccountRepository users, JwtService jwtService, AuditService auditService,
                       @Value("${app.security.access-token-ttl:PT15M}") java.time.Duration tokenTtl) {
        this.authenticationManager = authenticationManager;
        this.users = users;
        this.jwtService = jwtService;
        this.auditService = auditService;
        this.tokenTtlSeconds = tokenTtl.toSeconds();
    }

    @Transactional(readOnly = true)
    public AuthDtos.LoginResponse login(AuthDtos.LoginRequest request) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.email(), request.password()));
        UserAccount user = users.findByEmailIgnoreCase(request.email()).orElseThrow();
        auditService.record(user.getId(), "LOGIN", "USER_ACCOUNT", user.getId().toString(), "Successful authentication");
        return new AuthDtos.LoginResponse(jwtService.issue(user.getId(), user.getEmail()), "Bearer", tokenTtlSeconds);
    }

    @Transactional(readOnly = true)
    public AuthDtos.CurrentUser currentUser(String email) {
        UserAccount user = users.findByEmailIgnoreCase(email).orElseThrow();
        return new AuthDtos.CurrentUser(user.getId(), user.getEmail(), user.getFirstName(), user.getLastName(),
            user.getRoles().stream().map(role -> role.getName()).collect(java.util.stream.Collectors.toUnmodifiableSet()), user.getInstitutionId());
    }
}
