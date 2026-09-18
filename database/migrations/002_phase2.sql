CREATE TABLE IF NOT EXISTS schema_migrations (
  version text PRIMARY KEY,
  applied_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS app_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  email citext NOT NULL,
  display_name text NOT NULL,
  password_hash text NOT NULL,
  role text NOT NULL DEFAULT 'Owner',
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, email)
);

CREATE TABLE IF NOT EXISTS sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
  token_hash text NOT NULL UNIQUE,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS quote_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES businesses(id),
  quote_id uuid NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,
  service_id uuid REFERENCES services(id),
  description text NOT NULL,
  quantity numeric(12,3) NOT NULL CHECK (quantity > 0),
  unit_price numeric(14,2) NOT NULL CHECK (unit_price >= 0),
  discount_amount numeric(14,2) NOT NULL DEFAULT 0 CHECK (discount_amount >= 0)
);

CREATE TABLE IF NOT EXISTS invoice_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES businesses(id),
  invoice_id uuid NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  service_id uuid REFERENCES services(id),
  description text NOT NULL,
  quantity numeric(12,3) NOT NULL CHECK (quantity > 0),
  unit_price numeric(14,2) NOT NULL CHECK (unit_price >= 0),
  discount_amount numeric(14,2) NOT NULL DEFAULT 0 CHECK (discount_amount >= 0)
);

CREATE TABLE IF NOT EXISTS project_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES businesses(id),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  song_id uuid REFERENCES songs(id) ON DELETE CASCADE,
  name text NOT NULL,
  status text NOT NULL DEFAULT 'Todo',
  due_at timestamptz,
  completed_at timestamptz
);

CREATE TABLE IF NOT EXISTS recording_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES businesses(id),
  booking_id uuid REFERENCES bookings(id),
  project_id uuid REFERENCES projects(id),
  song_id uuid REFERENCES songs(id),
  status text NOT NULL DEFAULT 'Scheduled',
  notes text,
  completed_at timestamptz
);

CREATE TABLE IF NOT EXISTS follow_ups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES businesses(id),
  customer_id uuid REFERENCES customers(id),
  lead_id uuid REFERENCES leads(id),
  trigger_type text NOT NULL,
  scheduled_at timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'Pending',
  message text,
  sent_at timestamptz
);

CREATE TABLE IF NOT EXISTS outbox_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES businesses(id),
  event_type text NOT NULL,
  aggregate_type text NOT NULL,
  aggregate_id uuid,
  payload jsonb NOT NULL DEFAULT '{}',
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS app_users_tenant_email_idx ON app_users(tenant_id, email);
CREATE INDEX IF NOT EXISTS sessions_expires_idx ON sessions(expires_at);
CREATE INDEX IF NOT EXISTS quote_items_quote_idx ON quote_items(tenant_id, quote_id);
CREATE INDEX IF NOT EXISTS invoice_items_invoice_idx ON invoice_items(tenant_id, invoice_id);
CREATE INDEX IF NOT EXISTS follow_ups_due_idx ON follow_ups(tenant_id, status, scheduled_at);
CREATE INDEX IF NOT EXISTS outbox_unpublished_idx ON outbox_events(published_at) WHERE published_at IS NULL;

INSERT INTO schema_migrations (version) VALUES ('001_phase1') ON CONFLICT DO NOTHING;
INSERT INTO schema_migrations (version) VALUES ('002_phase2') ON CONFLICT DO NOTHING;
