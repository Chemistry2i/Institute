package com.server.ACMIS.security;

import com.server.ACMIS.identity.domain.UserAccount;
import com.server.ACMIS.identity.repository.UserAccountRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.stream.Stream;
import java.util.UUID;

@Service
public class UserAccountDetailsService implements UserDetailsService {
    private final UserAccountRepository users;

    public UserAccountDetailsService(UserAccountRepository users) {
        this.users = users;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserAccount account = users.findByEmailIgnoreCase(username)
            .orElseThrow(() -> new UsernameNotFoundException("Invalid credentials"));
        var authorities = account.getRoles().stream().flatMap(role -> Stream.concat(
            Stream.of(new SimpleGrantedAuthority("ROLE_" + role.getName())),
            role.getPermissions().stream().map(permission -> new SimpleGrantedAuthority(permission.getCode()))
        )).toList();
        return User.withUsername(account.getEmail())
            .password(account.getPasswordHash())
            .authorities(authorities)
            .disabled(!account.isActive())
            .build();
    }

    public UserDetails loadById(UUID userId) throws UsernameNotFoundException {
        UserAccount account = users.findById(userId)
            .orElseThrow(() -> new UsernameNotFoundException("Invalid credentials"));
        return loadUserByUsername(account.getEmail());
    }
}
