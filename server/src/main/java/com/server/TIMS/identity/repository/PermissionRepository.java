package com.server.TIMS.identity.repository;

import com.server.TIMS.identity.domain.Permission;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PermissionRepository extends JpaRepository<Permission, String> {
}
