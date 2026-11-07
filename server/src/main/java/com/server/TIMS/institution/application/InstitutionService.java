package com.server.TIMS.institution.application;

import com.server.TIMS.audit.application.AuditService;
import com.server.TIMS.institution.api.InstitutionDtos;
import com.server.TIMS.institution.domain.Institution;
import com.server.TIMS.institution.repository.InstitutionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class InstitutionService {
    private final InstitutionRepository institutions;
    private final AuditService auditService;

    public InstitutionService(InstitutionRepository institutions, AuditService auditService) {
        this.institutions = institutions;
        this.auditService = auditService;
    }

    @Transactional
    public InstitutionDtos.Response create(InstitutionDtos.CreateRequest request) {
        if (institutions.existsByCodeIgnoreCase(request.code())) {
            throw new IllegalArgumentException("Institution code is already in use");
        }
        Institution institution = institutions.save(new Institution(request.name(), request.code(), request.timezone(), request.currency()));
        auditService.record(null, "CREATE", "INSTITUTION", institution.getId().toString(), "Institution created");
        return toResponse(institution);
    }

    @Transactional(readOnly = true)
    public InstitutionDtos.Response get(UUID id) {
        return institutions.findById(id).map(this::toResponse)
            .orElseThrow(() -> new IllegalArgumentException("Institution not found"));
    }

    @Transactional
    public InstitutionDtos.Response update(UUID id, InstitutionDtos.UpdateRequest request) {
        Institution institution = institutions.findById(id).orElseThrow(() -> new IllegalArgumentException("Institution not found"));
        institution.update(request.name(), request.timezone(), request.currency());
        return toResponse(institution);
    }

    private InstitutionDtos.Response toResponse(Institution institution) {
        return new InstitutionDtos.Response(institution.getId(), institution.getName(), institution.getCode(), institution.getTimezone(), institution.getCurrency(), institution.isActive());
    }
}
