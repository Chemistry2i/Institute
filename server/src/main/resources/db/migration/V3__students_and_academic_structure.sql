CREATE TABLE programmes (
    id CHAR(36) NOT NULL,
    code VARCHAR(20) NOT NULL,
    name VARCHAR(150) NOT NULL,
    faculty VARCHAR(100) NOT NULL,
    duration_years INT NOT NULL,
    total_credits INT NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT pk_programmes PRIMARY KEY (id),
    CONSTRAINT uq_programmes_code UNIQUE (code)
);

CREATE TABLE course_units (
    id CHAR(36) NOT NULL,
    code VARCHAR(20) NOT NULL,
    title VARCHAR(150) NOT NULL,
    credit_units INT NOT NULL,
    programme_id CHAR(36) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT pk_course_units PRIMARY KEY (id),
    CONSTRAINT uq_course_units_code UNIQUE (code),
    CONSTRAINT fk_course_units_programme FOREIGN KEY (programme_id) REFERENCES programmes (id)
);

CREATE TABLE academic_periods (
    id CHAR(36) NOT NULL,
    academic_year VARCHAR(9) NOT NULL,
    semester VARCHAR(20) NOT NULL,
    starts_on DATE NOT NULL,
    ends_on DATE NOT NULL,
    active BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT pk_academic_periods PRIMARY KEY (id),
    CONSTRAINT uq_academic_periods_period UNIQUE (academic_year, semester)
);

CREATE TABLE students (
    id CHAR(36) NOT NULL,
    student_number VARCHAR(30) NOT NULL,
    first_name VARCHAR(80) NOT NULL,
    last_name VARCHAR(80) NOT NULL,
    email VARCHAR(180) NOT NULL,
    programme_id CHAR(36) NOT NULL,
    admission_year INT NOT NULL,
    status VARCHAR(20) NOT NULL,
    CONSTRAINT pk_students PRIMARY KEY (id),
    CONSTRAINT uq_students_number UNIQUE (student_number),
    CONSTRAINT uq_students_email UNIQUE (email),
    CONSTRAINT fk_students_programme FOREIGN KEY (programme_id) REFERENCES programmes (id)
);

CREATE INDEX ix_students_programme ON students (programme_id);
