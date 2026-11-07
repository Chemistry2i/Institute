package com.server.TIMS.institution.api;

import com.server.TIMS.institution.application.InstitutionService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/institutions")
public class InstitutionController {
    private final InstitutionService institutionService;

    public InstitutionController(InstitutionService institutionService) {
        this.institutionService = institutionService;
    }

    @PostMapping
    @PreAuthorize("hasAuthority('institution:write')")
    public InstitutionDtos.Response create(@Valid @RequestBody InstitutionDtos.CreateRequest request) {
        return institutionService.create(request);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('institution:read')")
    public InstitutionDtos.Response get(@PathVariable UUID id) {
        return institutionService.get(id);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('institution:write')")
    public InstitutionDtos.Response update(@PathVariable UUID id, @Valid @RequestBody InstitutionDtos.UpdateRequest request) {
        return institutionService.update(id, request);
    }
}
