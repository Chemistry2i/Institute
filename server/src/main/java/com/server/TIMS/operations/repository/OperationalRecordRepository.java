package com.server.TIMS.operations.repository;

import com.server.TIMS.operations.domain.OperationalModule;
import com.server.TIMS.operations.domain.OperationalRecord;
import com.server.TIMS.operations.domain.OperationalStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.UUID;

public interface OperationalRecordRepository extends JpaRepository<OperationalRecord, UUID>, JpaSpecificationExecutor<OperationalRecord> {
    Page<OperationalRecord> findByModuleAndReferenceContainingIgnoreCaseOrModuleAndTitleContainingIgnoreCaseOrModuleAndSubjectContainingIgnoreCase(OperationalModule module, String reference, OperationalModule sameModule, String title, OperationalModule thirdModule, String subject, Pageable pageable);
    boolean existsByModuleAndReferenceIgnoreCase(OperationalModule module, String reference);
    long countByModule(OperationalModule module);
    long countByModuleAndStatus(OperationalModule module, OperationalStatus status);
}
