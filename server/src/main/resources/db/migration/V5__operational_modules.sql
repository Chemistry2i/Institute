CREATE TABLE operational_records (
    id CHAR(36) NOT NULL,
    module VARCHAR(30) NOT NULL,
    reference VARCHAR(40) NOT NULL,
    title VARCHAR(180) NOT NULL,
    subject VARCHAR(180) NOT NULL,
    context VARCHAR(180),
    status VARCHAR(30) NOT NULL,
    amount DECIMAL(19,2),
    created_at TIMESTAMP NOT NULL,
    CONSTRAINT pk_operational_records PRIMARY KEY (id),
    CONSTRAINT uq_operational_records_module_reference UNIQUE (module, reference)
);

CREATE INDEX ix_operational_records_module_status ON operational_records (module, status);
CREATE INDEX ix_operational_records_created_at ON operational_records (created_at);
