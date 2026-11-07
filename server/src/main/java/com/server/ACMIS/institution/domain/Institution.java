package com.server.ACMIS.institution.domain;

import com.server.ACMIS.common.domain.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "institutions")
public class Institution extends BaseEntity {
    @Column(nullable = false, length = 150)
    private String name;

    @Column(nullable = false, unique = true, length = 30)
    private String code;

    @Column(nullable = false, length = 60)
    private String timezone;

    @Column(nullable = false, length = 3)
    private String currency;

    @Column(nullable = false)
    private boolean active = true;

    protected Institution() {
    }

    public Institution(String name, String code, String timezone, String currency) {
        this.name = name;
        this.code = code;
        this.timezone = timezone;
        this.currency = currency;
    }

    public String getName() { return name; }
    public String getCode() { return code; }
    public String getTimezone() { return timezone; }
    public String getCurrency() { return currency; }
    public boolean isActive() { return active; }

    public void update(String name, String timezone, String currency) {
        this.name = name;
        this.timezone = timezone;
        this.currency = currency;
    }
}
