package com.server.TIMS.audit.application;

import com.server.TIMS.audit.domain.AuditEvent;
import com.server.TIMS.audit.repository.AuditEventRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class AuditService {
    private final AuditEventRepository events;

    public AuditService(AuditEventRepository events) {
        this.events = events;
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void record(UUID actorUserId, String action, String resource, String resourceId, String details) {
        events.save(new AuditEvent(actorUserId, action, resource, resourceId, details));
    }
}
