package com.server.TIMS.operations.application;

import com.server.TIMS.audit.application.AuditService;
import com.server.TIMS.operations.api.OperationalDtos;
import com.server.TIMS.operations.domain.OperationalModule;
import com.server.TIMS.operations.repository.OperationalRecordRepository;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class OperationalRecordServiceTest {
    @Test
    void rejectsDuplicateModuleReference() {
        OperationalRecordRepository records = mock(OperationalRecordRepository.class);
        when(records.existsByModuleAndReferenceIgnoreCase(OperationalModule.ADMISSIONS, "APP-1")).thenReturn(true);
        OperationalRecordService service = new OperationalRecordService(records, mock(AuditService.class));
        var request = new OperationalDtos.CreateRequest("APP-1", "Application", "Applicant", "August intake", com.server.TIMS.operations.domain.OperationalStatus.UNDER_REVIEW, null);

        assertThatThrownBy(() -> service.create(OperationalModule.ADMISSIONS, request))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessage("Reference is already in use for this module");
    }
}
