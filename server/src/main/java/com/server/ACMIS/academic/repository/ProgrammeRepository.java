package com.server.ACMIS.academic.repository;

import com.server.ACMIS.academic.domain.Programme;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ProgrammeRepository extends JpaRepository<Programme, UUID> {
    boolean existsByCodeIgnoreCase(String code);
}
