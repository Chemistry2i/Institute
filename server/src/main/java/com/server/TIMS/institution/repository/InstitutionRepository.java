package com.server.TIMS.institution.repository;

import com.server.TIMS.institution.domain.Institution;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface InstitutionRepository extends JpaRepository<Institution, UUID> {
    boolean existsByCodeIgnoreCase(String code);
}
