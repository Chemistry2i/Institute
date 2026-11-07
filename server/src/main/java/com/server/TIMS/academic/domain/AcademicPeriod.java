package com.server.TIMS.academic.domain;

import com.server.TIMS.common.domain.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;

import java.time.LocalDate;

@Entity
@Table(name = "academic_periods")
public class AcademicPeriod extends BaseEntity {
    @Column(name = "academic_year", nullable = false, length = 9)
    private String academicYear;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Semester semester;

    @Column(name = "starts_on", nullable = false)
    private LocalDate startsOn;

    @Column(name = "ends_on", nullable = false)
    private LocalDate endsOn;

    @Column(nullable = false)
    private boolean active;

    protected AcademicPeriod() {
    }

    public AcademicPeriod(String academicYear, Semester semester, LocalDate startsOn, LocalDate endsOn, boolean active) {
        if (endsOn.isBefore(startsOn)) {
            throw new IllegalArgumentException("Academic period end date must be after its start date");
        }
        this.academicYear = academicYear;
        this.semester = semester;
        this.startsOn = startsOn;
        this.endsOn = endsOn;
        this.active = active;
    }

    public String getAcademicYear() { return academicYear; }
    public Semester getSemester() { return semester; }
    public LocalDate getStartsOn() { return startsOn; }
    public LocalDate getEndsOn() { return endsOn; }
    public boolean isActive() { return active; }
}
