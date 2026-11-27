-- Keep this schema portable; adapt date/index syntax only if the selected DaaS requires it.
CREATE TABLE residents (
  id VARCHAR(36) NOT NULL PRIMARY KEY,
  resident_number VARCHAR(32) NOT NULL UNIQUE,
  first_name VARCHAR(100) NOT NULL,
  middle_name VARCHAR(100) NULL,
  last_name VARCHAR(100) NOT NULL,
  extension_name VARCHAR(20) NULL,
  birth_date DATE NOT NULL,
  sex VARCHAR(8) NOT NULL,
  civil_status VARCHAR(16) NOT NULL,
  house_lot_no VARCHAR(80) NOT NULL,
  street VARCHAR(120) NOT NULL,
  subdivision VARCHAR(120) NULL,
  barangay VARCHAR(120) NOT NULL,
  city VARCHAR(120) NOT NULL,
  province VARCHAR(120) NOT NULL,
  zip_code VARCHAR(12) NULL,
  email VARCHAR(254) NULL,
  mobile_number VARCHAR(32) NULL,
  created_by VARCHAR(36) NULL,
  updated_by VARCHAR(36) NULL,
  created_at_ms BIGINT NOT NULL,
  updated_at_ms BIGINT NOT NULL,
  archived_at_ms BIGINT NULL,
  CONSTRAINT chk_residents_sex
    CHECK (sex IN ('Male', 'Female')),
  CONSTRAINT chk_residents_civil_status
    CHECK (civil_status IN ('Single', 'Married', 'Widowed', 'Separated', 'Divorced')),
  CONSTRAINT fk_residents_created_by
    FOREIGN KEY (created_by) REFERENCES admin_users (id)
    ON DELETE SET NULL,
  CONSTRAINT fk_residents_updated_by
    FOREIGN KEY (updated_by) REFERENCES admin_users (id)
    ON DELETE SET NULL
);

CREATE INDEX idx_residents_name
  ON residents (last_name, first_name);

CREATE INDEX idx_residents_barangay
  ON residents (barangay);
