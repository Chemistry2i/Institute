package com.server.ACMIS.operations.api;

import com.server.ACMIS.operations.application.OperationalRecordService;
import com.server.ACMIS.operations.domain.OperationalModule;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping
public class OperationalController {
    private final OperationalRecordService service;

    public OperationalController(OperationalRecordService service) {
        this.service = service;
    }

    @PostMapping({"/admissions/applications", "/examinations/results", "/finance/transactions", "/library/items", "/hr/staff", "/accommodation/allocations", "/welfare/cases", "/communications/messages"})
    @PreAuthorize("hasAuthority('operations:write')")
    public OperationalDtos.Response create(@RequestBody @Valid OperationalDtos.CreateRequest request, jakarta.servlet.http.HttpServletRequest httpRequest) {
        return service.create(moduleFromPath(httpRequest.getRequestURI()), request);
    }

    @GetMapping({"/admissions/applications", "/examinations/results", "/finance/transactions", "/library/items", "/hr/staff", "/accommodation/allocations", "/welfare/cases", "/communications/messages"})
    @PreAuthorize("hasAuthority('operations:read')")
    public Page<OperationalDtos.Response> search(@RequestParam(required = false) String query, Pageable pageable, jakarta.servlet.http.HttpServletRequest httpRequest) {
        return service.search(moduleFromPath(httpRequest.getRequestURI()), query, pageable);
    }

    @PatchMapping("/operations/{id}/status")
    @PreAuthorize("hasAuthority('operations:write')")
    public OperationalDtos.Response changeStatus(@PathVariable UUID id, @RequestBody @Valid OperationalDtos.StatusRequest request) {
        return service.changeStatus(id, request.status());
    }

    @GetMapping("/reports/operational")
    @PreAuthorize("hasAuthority('reports:read')")
    public List<OperationalDtos.Summary> summaries() {
        return service.summaries();
    }

    private OperationalModule moduleFromPath(String path) {
        if (path.contains("admissions")) return OperationalModule.ADMISSIONS;
        if (path.contains("examinations")) return OperationalModule.EXAMINATIONS;
        if (path.contains("finance")) return OperationalModule.FINANCE;
        if (path.contains("library")) return OperationalModule.LIBRARY;
        if (path.contains("hr")) return OperationalModule.HUMAN_RESOURCES;
        if (path.contains("accommodation")) return OperationalModule.ACCOMMODATION;
        if (path.contains("welfare")) return OperationalModule.WELFARE;
        return OperationalModule.COMMUNICATIONS;
    }
}
