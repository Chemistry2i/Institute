package com.server.ACMIS.identity.repository;

import com.server.ACMIS.identity.domain.Permission;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PermissionRepository extends JpaRepository<Permission, String> {
}
