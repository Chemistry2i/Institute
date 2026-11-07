package com.server.ACMIS.academic.domain;

import com.server.ACMIS.common.domain.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "programmes")
public class Programme extends BaseEntity {
    @Column(nullable = false, unique = true, length = 20)
    private String code;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(nullable = false, length = 100)
    private String faculty;

    @Column(name = "duration_years", nullable = false)
    private int durationYears;

    @Column(name = "total_credits", nullable = false)
    private int totalCredits;

    @Column(nullable = false)
    private boolean active = true;

    protected Programme() {
    }

    public Programme(String code, String name, String faculty, int durationYears, int totalCredits) {
        this.code = code;
        this.name = name;
        this.faculty = faculty;
        this.durationYears = durationYears;
        this.totalCredits = totalCredits;
    }

    public String getCode() { return code; }
    public String getName() { return name; }
    public String getFaculty() { return faculty; }
    public int getDurationYears() { return durationYears; }
    public int getTotalCredits() { return totalCredits; }
    public boolean isActive() { return active; }
}
