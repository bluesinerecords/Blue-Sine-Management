import pg from 'pg';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

export async function seed() {
  const business = await pool.query(`INSERT INTO businesses (legal_name, trading_name, business_type, province, city, website) VALUES ('Blue Sine Music Studios (Pty) Ltd', 'Blue Sine Music Studios', 'Private Company (Pty) Ltd', 'KwaZulu-Natal', 'Kokstad', 'bluesinemusicstudios.co.za') RETURNING id`);
  const businessId = business.rows[0].id;
  await pool.query('INSERT INTO business_settings (business_id) VALUES ($1)', [businessId]);
  const services = [
    ['Recording — 1 hour', 'Recording', 60, 200],
    ['Recording — 1 hour 30 minutes', 'Recording', 90, 250],
    ['Advanced Mixing & Mastering', 'Mixing & Mastering', 90, 500],
    ['Ready-made Beat', 'Beats', null, 400],
    ['Custom Beat', 'Beats', 90, 600],
    ['Studio Hire', 'Studio Hire', 90, 300],
  ];
  for (const [name, category, duration, amount] of services) {
    const service = await pool.query('INSERT INTO services (tenant_id, name, category, duration_minutes) VALUES ($1, $2, $3, $4) RETURNING id', [businessId, name, category, duration]);
    await pool.query('INSERT INTO service_prices (tenant_id, service_id, amount) VALUES ($1, $2, $3)', [businessId, service.rows[0].id, amount]);
  }
  await pool.end();
}

if (process.argv[1]?.includes('seed')) seed().catch((error) => { console.error(error); process.exit(1); });
