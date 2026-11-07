package com.server.TIMS.identity.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "permissions")
public class Permission {
    @Id
    @Column(nullable = false, length = 100)
    private String code;

    @Column(nullable = false, length = 180)
    private String description;

    protected Permission() {
    }

    public Permission(String code, String description) {
        this.code = code;
        this.description = description;
    }

    public String getCode() { return code; }
    public String getDescription() { return description; }
}
