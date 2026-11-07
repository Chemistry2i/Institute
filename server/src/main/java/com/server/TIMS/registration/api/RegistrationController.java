package com.server.TIMS.registration.api;

import com.server.TIMS.registration.application.RegistrationService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/registrations")
public class RegistrationController {
    private final RegistrationService registrationService;

    public RegistrationController(RegistrationService registrationService) {
        this.registrationService = registrationService;
    }

    @PostMapping
    @PreAuthorize("hasAuthority('registration:write')")
    public RegistrationDtos.Response register(@Valid @RequestBody RegistrationDtos.CreateRequest request) {
        return registrationService.register(request);
    }

    @GetMapping("/students/{studentId}")
    @PreAuthorize("hasAuthority('registration:read')")
    public List<RegistrationDtos.Response> studentRegistrations(@PathVariable UUID studentId, @RequestParam UUID academicPeriodId) {
        return registrationService.studentRegistrations(studentId, academicPeriodId);
    }
}
