package com.server.TIMS.operations.domain;

import com.server.TIMS.common.domain.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "operational_records")
public class OperationalRecord extends BaseEntity {
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private OperationalModule module;

    @Column(nullable = false, length = 40)
    private String reference;

    @Column(nullable = false, length = 180)
    private String title;

    @Column(nullable = false, length = 180)
    private String subject;

    @Column(length = 180)
    private String context;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private OperationalStatus status;

    @Column(precision = 19, scale = 2)
    private BigDecimal amount;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    protected OperationalRecord() {
    }

    public OperationalRecord(OperationalModule module, String reference, String title, String subject, String context, OperationalStatus status, BigDecimal amount) {
        this.module = module;
        this.reference = reference;
        this.title = title;
        this.subject = subject;
        this.context = context;
        this.status = status;
        this.amount = amount;
    }

    @PrePersist
    void initializeCreatedAt() {
        createdAt = Instant.now();
    }

    public OperationalModule getModule() { return module; }
    public String getReference() { return reference; }
    public String getTitle() { return title; }
    public String getSubject() { return subject; }
    public String getContext() { return context; }
    public OperationalStatus getStatus() { return status; }
    public BigDecimal getAmount() { return amount; }
    public Instant getCreatedAt() { return createdAt; }

    public void changeStatus(OperationalStatus status) {
        this.status = status;
    }
}
