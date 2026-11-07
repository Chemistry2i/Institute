package com.server.ACMIS.academic.domain;

import com.server.ACMIS.common.domain.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.UUID;

@Entity
@Table(name = "course_units")
public class CourseUnit extends BaseEntity {
    @Column(nullable = false, unique = true, length = 20)
    private String code;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(name = "credit_units", nullable = false)
    private int creditUnits;

    @Column(name = "programme_id", nullable = false, length = 36)
    @JdbcTypeCode(SqlTypes.CHAR)
    private UUID programmeId;

    @Column(nullable = false)
    private boolean active = true;

    protected CourseUnit() {
    }

    public CourseUnit(String code, String title, int creditUnits, UUID programmeId) {
        this.code = code;
        this.title = title;
        this.creditUnits = creditUnits;
        this.programmeId = programmeId;
    }

    public String getCode() { return code; }
    public String getTitle() { return title; }
    public int getCreditUnits() { return creditUnits; }
    public UUID getProgrammeId() { return programmeId; }
    public boolean isActive() { return active; }
}
