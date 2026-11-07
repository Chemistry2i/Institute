CREATE TABLE course_registrations (
    id CHAR(36) NOT NULL,
    student_id CHAR(36) NOT NULL,
    course_unit_id CHAR(36) NOT NULL,
    academic_period_id CHAR(36) NOT NULL,
    status VARCHAR(20) NOT NULL,
    CONSTRAINT pk_course_registrations PRIMARY KEY (id),
    CONSTRAINT uq_course_registrations_entry UNIQUE (student_id, course_unit_id, academic_period_id),
    CONSTRAINT fk_course_registrations_student FOREIGN KEY (student_id) REFERENCES students (id),
    CONSTRAINT fk_course_registrations_course FOREIGN KEY (course_unit_id) REFERENCES course_units (id),
    CONSTRAINT fk_course_registrations_period FOREIGN KEY (academic_period_id) REFERENCES academic_periods (id)
);

CREATE INDEX ix_course_registrations_student_period ON course_registrations (student_id, academic_period_id);
