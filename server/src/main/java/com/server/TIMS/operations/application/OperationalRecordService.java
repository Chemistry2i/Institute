package com.server.TIMS.operations.application;

import com.server.TIMS.audit.application.AuditService;
import com.server.TIMS.operations.api.OperationalDtos;
import com.server.TIMS.operations.domain.OperationalModule;
import com.server.TIMS.operations.domain.OperationalRecord;
import com.server.TIMS.operations.domain.OperationalStatus;
import com.server.TIMS.operations.repository.OperationalRecordRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
public class OperationalRecordService {
    private final OperationalRecordRepository records;
    private final AuditService auditService;

    public OperationalRecordService(OperationalRecordRepository records, AuditService auditService) {
        this.records = records;
        this.auditService = auditService;
    }

    @Transactional
    public OperationalDtos.Response create(OperationalModule module, OperationalDtos.CreateRequest request) {
        if (records.existsByModuleAndReferenceIgnoreCase(module, request.reference())) {
            throw new IllegalArgumentException("Reference is already in use for this module");
        }
        OperationalRecord record = records.save(new OperationalRecord(module, request.reference(), request.title(), request.subject(), request.context(), request.status(), request.amount()));
        auditService.record(null, "CREATE", module.name(), record.getId().toString(), "Operational record created");
        return toResponse(record);
    }

    @Transactional(readOnly = true)
    public Page<OperationalDtos.Response> search(OperationalModule module, String query, Pageable pageable) {
        if (query == null || query.isBlank()) {
            return records.findAll((root, criteriaQuery, criteriaBuilder) -> criteriaBuilder.equal(root.get("module"), module), pageable).map(this::toResponse);
        }
        return records.findByModuleAndReferenceContainingIgnoreCaseOrModuleAndTitleContainingIgnoreCaseOrModuleAndSubjectContainingIgnoreCase(module, query, module, query, module, query, pageable).map(this::toResponse);
    }

    @Transactional
    public OperationalDtos.Response changeStatus(UUID id, OperationalStatus status) {
        OperationalRecord record = records.findById(id).orElseThrow(() -> new IllegalArgumentException("Operational record not found"));
        record.changeStatus(status);
        auditService.record(null, "STATUS_CHANGE", record.getModule().name(), id.toString(), "Operational status changed to " + status);
        return toResponse(record);
    }

    @Transactional(readOnly = true)
    public List<OperationalDtos.Summary> summaries() {
        return Arrays.stream(OperationalModule.values()).map(module -> new OperationalDtos.Summary(
            module,
            records.countByModule(module),
            records.countByModuleAndStatus(module, OperationalStatus.NEEDS_ATTENTION),
            records.countByModuleAndStatus(module, OperationalStatus.APPROVED) + records.countByModuleAndStatus(module, OperationalStatus.PUBLISHED)
        )).toList();
    }

    private OperationalDtos.Response toResponse(OperationalRecord record) {
        return new OperationalDtos.Response(record.getId(), record.getModule(), record.getReference(), record.getTitle(), record.getSubject(), record.getContext(), record.getStatus(), record.getAmount(), record.getCreatedAt());
    }
}
