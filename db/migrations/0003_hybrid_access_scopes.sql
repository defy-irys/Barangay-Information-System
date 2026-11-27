CREATE TABLE barangay_scopes (
  id VARCHAR(36) NOT NULL PRIMARY KEY,
  scope_code VARCHAR(64) NOT NULL UNIQUE,
  display_name VARCHAR(120) NOT NULL,
  is_active SMALLINT NOT NULL DEFAULT 1,
  created_at_ms BIGINT NOT NULL,
  updated_at_ms BIGINT NOT NULL,
  CONSTRAINT chk_barangay_scopes_active
    CHECK (is_active IN (0, 1))
);

CREATE TABLE admin_user_scopes (
  user_id VARCHAR(36) NOT NULL,
  scope_id VARCHAR(36) NOT NULL,
  is_active SMALLINT NOT NULL DEFAULT 1,
  granted_at_ms BIGINT NOT NULL,
  granted_by VARCHAR(36) NULL,
  PRIMARY KEY (user_id, scope_id),
  CONSTRAINT chk_admin_user_scopes_active
    CHECK (is_active IN (0, 1)),
  CONSTRAINT fk_admin_user_scopes_user
    FOREIGN KEY (user_id) REFERENCES admin_users (id)
    ON DELETE CASCADE,
  CONSTRAINT fk_admin_user_scopes_scope
    FOREIGN KEY (scope_id) REFERENCES barangay_scopes (id),
  CONSTRAINT fk_admin_user_scopes_granted_by
    FOREIGN KEY (granted_by) REFERENCES admin_users (id)
    ON DELETE SET NULL
);

CREATE INDEX idx_admin_user_scopes_active
  ON admin_user_scopes (user_id, is_active, scope_id);

CREATE TABLE resident_scope_assignments (
  resident_id VARCHAR(36) NOT NULL PRIMARY KEY,
  scope_id VARCHAR(36) NOT NULL,
  assigned_at_ms BIGINT NOT NULL,
  assigned_by VARCHAR(36) NULL,
  CONSTRAINT fk_resident_scope_assignments_resident
    FOREIGN KEY (resident_id) REFERENCES residents (id)
    ON DELETE CASCADE,
  CONSTRAINT fk_resident_scope_assignments_scope
    FOREIGN KEY (scope_id) REFERENCES barangay_scopes (id),
  CONSTRAINT fk_resident_scope_assignments_assigned_by
    FOREIGN KEY (assigned_by) REFERENCES admin_users (id)
    ON DELETE SET NULL
);

CREATE INDEX idx_resident_scope_assignments_scope
  ON resident_scope_assignments (scope_id, resident_id);
