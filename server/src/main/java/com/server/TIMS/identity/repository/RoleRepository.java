package com.server.TIMS.identity.repository;

import com.server.TIMS.identity.domain.Role;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Role, String> {
}
