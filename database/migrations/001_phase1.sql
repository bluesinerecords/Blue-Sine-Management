CREATE EXTENSION IF NOT EXISTS citext;
CREATE EXTENSION IF NOT EXISTS btree_gist;

CREATE TABLE IF NOT EXISTS businesses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  legal_name text NOT NULL,
  trading_name text NOT NULL,
  business_type text,
  country_code char(2) NOT NULL DEFAULT 'ZA',
  province text,
  city text,
  website text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS business_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL UNIQUE REFERENCES businesses(id) ON DELETE CASCADE,
  currency char(3) NOT NULL DEFAULT 'ZAR',
  timezone text NOT NULL DEFAULT 'Africa/Johannesburg',
  vat_enabled boolean NOT NULL DEFAULT false,
  vat_rate numeric(8,4),
  business_hours jsonb NOT NULL DEFAULT '{"days":[1,2,3,4,5,6],"open":"09:00","close":"19:00"}',
  automation_settings jsonb NOT NULL DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES businesses(id),
  display_name text NOT NULL,
  email citext,
  phone_e164 text,
  whatsapp_e164 text,
  communication_status text NOT NULL DEFAULT 'active',
  marketing_opt_in boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz
);

CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES businesses(id),
  name text NOT NULL,
  category text NOT NULL,
  duration_minutes integer,
  active boolean NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS service_prices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES businesses(id),
  service_id uuid NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  amount numeric(14,2) NOT NULL CHECK (amount >= 0),
  currency char(3) NOT NULL DEFAULT 'ZAR',
  effective_from timestamptz NOT NULL DEFAULT now(),
  effective_to timestamptz,
  active boolean NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES businesses(id),
  name text NOT NULL,
  email citext,
  phone_e164 text,
  whatsapp_e164 text,
  source text,
  source_url text,
  status text NOT NULL DEFAULT 'New',
  score integer NOT NULL DEFAULT 0 CHECK (score BETWEEN 0 AND 100),
  do_not_contact boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS studios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES businesses(id),
  name text NOT NULL,
  active boolean NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES businesses(id),
  customer_id uuid NOT NULL REFERENCES customers(id),
  service_id uuid NOT NULL REFERENCES services(id),
  studio_id uuid NOT NULL REFERENCES studios(id),
  starts_at timestamptz NOT NULL,
  ends_at timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'Pending',
  payment_status text NOT NULL DEFAULT 'Unpaid',
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT booking_time_order CHECK (ends_at > starts_at),
  CONSTRAINT no_studio_double_booking EXCLUDE USING gist (studio_id WITH =, tstzrange(starts_at, ends_at, '[)') WITH &&) WHERE (status NOT IN ('Cancelled'))
);

CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES businesses(id),
  customer_id uuid NOT NULL REFERENCES customers(id),
  name text NOT NULL,
  status text NOT NULL DEFAULT 'Idea',
  progress_percent integer NOT NULL DEFAULT 0 CHECK (progress_percent BETWEEN 0 AND 100),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS songs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES businesses(id),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title text NOT NULL,
  status text NOT NULL DEFAULT 'Idea',
  isrc text,
  iswc text
);

CREATE TABLE IF NOT EXISTS quotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES businesses(id),
  customer_id uuid NOT NULL REFERENCES customers(id),
  quote_number text NOT NULL,
  status text NOT NULL DEFAULT 'Draft',
  subtotal numeric(14,2) NOT NULL DEFAULT 0,
  discount_total numeric(14,2) NOT NULL DEFAULT 0,
  vat_total numeric(14,2) NOT NULL DEFAULT 0,
  total numeric(14,2) NOT NULL DEFAULT 0,
  valid_until date NOT NULL,
  UNIQUE (tenant_id, quote_number)
);

CREATE TABLE IF NOT EXISTS invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES businesses(id),
  customer_id uuid NOT NULL REFERENCES customers(id),
  invoice_number text NOT NULL,
  status text NOT NULL DEFAULT 'Draft',
  total numeric(14,2) NOT NULL DEFAULT 0,
  amount_paid numeric(14,2) NOT NULL DEFAULT 0,
  due_date date NOT NULL,
  UNIQUE (tenant_id, invoice_number)
);

CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES businesses(id),
  invoice_id uuid NOT NULL REFERENCES invoices(id),
  provider text NOT NULL,
  provider_reference text,
  amount numeric(14,2) NOT NULL CHECK (amount > 0),
  status text NOT NULL DEFAULT 'Pending',
  verified_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES businesses(id),
  actor_type text NOT NULL,
  actor_id uuid,
  action text NOT NULL,
  entity_type text,
  entity_id uuid,
  details jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS customers_tenant_idx ON customers(tenant_id);
CREATE INDEX IF NOT EXISTS leads_tenant_status_idx ON leads(tenant_id, status);
CREATE INDEX IF NOT EXISTS bookings_tenant_start_idx ON bookings(tenant_id, starts_at);
CREATE INDEX IF NOT EXISTS invoices_tenant_status_idx ON invoices(tenant_id, status);
CREATE INDEX IF NOT EXISTS audit_logs_tenant_created_idx ON audit_logs(tenant_id, created_at DESC);
