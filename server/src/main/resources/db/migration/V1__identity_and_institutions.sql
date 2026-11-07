CREATE TABLE institutions (
    id CHAR(36) NOT NULL,
    name VARCHAR(150) NOT NULL,
    code VARCHAR(30) NOT NULL,
    timezone VARCHAR(60) NOT NULL,
    currency CHAR(3) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT pk_institutions PRIMARY KEY (id),
    CONSTRAINT uq_institutions_code UNIQUE (code)
);

CREATE TABLE permissions (
    code VARCHAR(100) NOT NULL,
    description VARCHAR(180) NOT NULL,
    CONSTRAINT pk_permissions PRIMARY KEY (code)
);

CREATE TABLE roles (
    name VARCHAR(50) NOT NULL,
    description VARCHAR(150) NOT NULL,
    CONSTRAINT pk_roles PRIMARY KEY (name)
);

CREATE TABLE role_permissions (
    role_name VARCHAR(50) NOT NULL,
    permission_code VARCHAR(100) NOT NULL,
    CONSTRAINT pk_role_permissions PRIMARY KEY (role_name, permission_code),
    CONSTRAINT fk_role_permissions_role FOREIGN KEY (role_name) REFERENCES roles (name),
    CONSTRAINT fk_role_permissions_permission FOREIGN KEY (permission_code) REFERENCES permissions (code)
);

CREATE TABLE user_accounts (
    id CHAR(36) NOT NULL,
    email VARCHAR(180) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(80) NOT NULL,
    last_name VARCHAR(80) NOT NULL,
    institution_id CHAR(36),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT pk_user_accounts PRIMARY KEY (id),
    CONSTRAINT uq_user_accounts_email UNIQUE (email),
    CONSTRAINT fk_user_accounts_institution FOREIGN KEY (institution_id) REFERENCES institutions (id)
);

CREATE TABLE user_roles (
    user_id CHAR(36) NOT NULL,
    role_name VARCHAR(50) NOT NULL,
    CONSTRAINT pk_user_roles PRIMARY KEY (user_id, role_name),
    CONSTRAINT fk_user_roles_user FOREIGN KEY (user_id) REFERENCES user_accounts (id),
    CONSTRAINT fk_user_roles_role FOREIGN KEY (role_name) REFERENCES roles (name)
);

CREATE INDEX ix_user_accounts_institution ON user_accounts (institution_id);
