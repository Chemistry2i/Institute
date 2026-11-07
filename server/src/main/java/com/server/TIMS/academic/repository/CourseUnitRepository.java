package com.server.TIMS.academic.repository;

import com.server.TIMS.academic.domain.CourseUnit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface CourseUnitRepository extends JpaRepository<CourseUnit, UUID> {
    boolean existsByCodeIgnoreCase(String code);
}
