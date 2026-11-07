package com.server.ACMIS.audit.domain;

import com.server.ACMIS.common.domain.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "audit_events")
public class AuditEvent extends BaseEntity {
    @Column(name = "actor_user_id", length = 36)
    private UUID actorUserId;

    @Column(nullable = false, length = 80)
    private String action;

    @Column(nullable = false, length = 80)
    private String resource;

    @Column(name = "resource_id", length = 80)
    private String resourceId;

    @Column(nullable = false, length = 2000)
    private String details;

    @Column(name = "occurred_at", nullable = false)
    private Instant occurredAt;

    protected AuditEvent() {
    }

    public AuditEvent(UUID actorUserId, String action, String resource, String resourceId, String details) {
        this.actorUserId = actorUserId;
        this.action = action;
        this.resource = resource;
        this.resourceId = resourceId;
        this.details = details;
        this.occurredAt = Instant.now();
    }
}
