package com.server.ACMIS.institution.repository;

import com.server.ACMIS.institution.domain.Institution;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface InstitutionRepository extends JpaRepository<Institution, UUID> {
    boolean existsByCodeIgnoreCase(String code);
}
