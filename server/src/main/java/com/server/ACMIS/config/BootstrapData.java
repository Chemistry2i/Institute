package com.server.ACMIS.config;

import com.server.ACMIS.identity.domain.Permission;
import com.server.ACMIS.identity.domain.Role;
import com.server.ACMIS.identity.domain.UserAccount;
import com.server.ACMIS.identity.repository.PermissionRepository;
import com.server.ACMIS.identity.repository.RoleRepository;
import com.server.ACMIS.identity.repository.UserAccountRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Configuration
public class BootstrapData {
    @Bean
    CommandLineRunner seedIdentity(RoleRepository roles, PermissionRepository permissions,
                                   UserAccountRepository users, PasswordEncoder passwordEncoder,
                                   @Value("${app.bootstrap.admin-email:}") String adminEmail,
                                   @Value("${app.bootstrap.admin-password:}") String adminPassword) {
        return args -> seed(roles, permissions, users, passwordEncoder, adminEmail, adminPassword);
    }

    @Transactional
    void seed(RoleRepository roles, PermissionRepository permissions, UserAccountRepository users,
              PasswordEncoder passwordEncoder, String adminEmail, String adminPassword) {
        Map<String, String> permissionDefinitions = Map.ofEntries(
            Map.entry("institution:read", "Read institution configuration"),
            Map.entry("institution:write", "Manage institution configuration"),
            Map.entry("user:read", "Read user accounts"),
            Map.entry("user:write", "Manage user accounts"),
            Map.entry("student:read", "Read student records"),
            Map.entry("student:write", "Manage student records"),
            Map.entry("academic:read", "Read academic structure"),
            Map.entry("academic:write", "Manage academic structure"),
            Map.entry("registration:read", "Read course registrations"),
            Map.entry("registration:write", "Manage course registrations"),
            Map.entry("operations:read", "Read operational module records"),
            Map.entry("operations:write", "Manage operational module records"),
            Map.entry("reports:read", "Read institutional reports")
        );
        permissionDefinitions.forEach((code, description) -> permissions.findById(code).orElseGet(() -> permissions.save(new Permission(code, description))));

        Role administrator = roles.findById("SUPER_ADMINISTRATOR").orElseGet(() -> roles.save(new Role("SUPER_ADMINISTRATOR", "Full system administration")));
        administrator.getPermissions().addAll(permissions.findAll());
        roles.save(administrator);

        if (!adminEmail.isBlank() && !adminPassword.isBlank() && !users.existsByEmailIgnoreCase(adminEmail)) {
            UserAccount admin = new UserAccount(adminEmail.toLowerCase(), passwordEncoder.encode(adminPassword), "System", "Administrator", null);
            admin.getRoles().add(administrator);
            users.save(admin);
        }
    }
}
