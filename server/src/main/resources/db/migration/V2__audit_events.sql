CREATE TABLE audit_events (
    id CHAR(36) NOT NULL,
    actor_user_id CHAR(36),
    action VARCHAR(80) NOT NULL,
    resource VARCHAR(80) NOT NULL,
    resource_id VARCHAR(80),
    details VARCHAR(2000) NOT NULL,
    occurred_at TIMESTAMP NOT NULL,
    CONSTRAINT pk_audit_events PRIMARY KEY (id),
    CONSTRAINT fk_audit_events_actor FOREIGN KEY (actor_user_id) REFERENCES user_accounts (id)
);

CREATE INDEX ix_audit_events_occurred_at ON audit_events (occurred_at);
CREATE INDEX ix_audit_events_actor ON audit_events (actor_user_id);
