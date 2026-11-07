package com.server.ACMIS.academic.repository;

import com.server.ACMIS.academic.domain.AcademicPeriod;
import com.server.ACMIS.academic.domain.Semester;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface AcademicPeriodRepository extends JpaRepository<AcademicPeriod, UUID> {
    boolean existsByAcademicYearAndSemester(String academicYear, Semester semester);
}
