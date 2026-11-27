-- Provider-neutral baseline. IDs and UTC timestamps are supplied by the application.
CREATE TABLE admin_users (
  id VARCHAR(36) NOT NULL PRIMARY KEY,
  email VARCHAR(254) NOT NULL UNIQUE,
  display_name VARCHAR(120) NOT NULL,
  password_hash VARCHAR(255) NULL,
  role VARCHAR(32) NOT NULL,
  is_active SMALLINT NOT NULL DEFAULT 1,
  created_at_ms BIGINT NOT NULL,
  updated_at_ms BIGINT NOT NULL,
  CONSTRAINT chk_admin_users_email_normalized
    CHECK (email = LOWER(email)),
  CONSTRAINT chk_admin_users_role
    CHECK (role IN (
      'system-administrator',
      'punong-barangay',
      'barangay-secretary',
      'lupon-secretary',
      'vaw-desk-officer'
    )),
  CONSTRAINT chk_admin_users_active
    CHECK (is_active IN (0, 1))
);

CREATE TABLE security_audit_events (
  id VARCHAR(36) NOT NULL PRIMARY KEY,
  actor_user_id VARCHAR(36) NULL,
  action VARCHAR(64) NOT NULL,
  resource_type VARCHAR(64) NOT NULL,
  resource_id VARCHAR(128) NULL,
  occurred_at_ms BIGINT NOT NULL,
  request_id VARCHAR(64) NULL,
  details_text VARCHAR(2048) NULL,
  CONSTRAINT fk_security_audit_events_actor
    FOREIGN KEY (actor_user_id) REFERENCES admin_users (id)
    ON DELETE SET NULL
);

CREATE INDEX idx_security_audit_events_actor_time
  ON security_audit_events (actor_user_id, occurred_at_ms);
