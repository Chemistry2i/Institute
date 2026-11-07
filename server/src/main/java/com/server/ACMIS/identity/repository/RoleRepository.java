package com.server.ACMIS.identity.repository;

import com.server.ACMIS.identity.domain.Role;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Role, String> {
}
