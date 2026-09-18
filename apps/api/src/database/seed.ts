import pg from 'pg';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

export async function seed() {
  const business = await pool.query(`INSERT INTO businesses (legal_name, trading_name, business_type, country_code, province, city, website)
    VALUES ('Blue Sine Music Studios (Pty) Ltd', 'Blue Sine Music Studios', 'Private Company (Pty) Ltd', 'ZA', 'KwaZulu-Natal', 'Kokstad', 'bluesinemusicstudios.co.za')
    ON CONFLICT DO NOTHING RETURNING id`);
  const existing = await pool.query(`SELECT id FROM businesses WHERE trading_name = 'Blue Sine Music Studios' LIMIT 1`);
  const businessId = business.rows[0]?.id ?? existing.rows[0].id;
  await pool.query('INSERT INTO business_settings (business_id) VALUES ($1) ON CONFLICT (business_id) DO NOTHING', [businessId]);
  await pool.query('INSERT INTO studios (tenant_id, name) SELECT $1, $2 WHERE NOT EXISTS (SELECT 1 FROM studios WHERE tenant_id = $1 AND name = $2)', [businessId, 'Main Studio']);
  const services = [
    ['Recording — 1 hour', 'Recording', 60, 200], ['Recording — 1 hour 30 minutes', 'Recording', 90, 250],
    ['Advanced Mixing & Mastering', 'Mixing & Mastering', 90, 500], ['Ready-made Beat', 'Beats', null, 400],
    ['Custom Beat', 'Beats', 90, 600], ['Studio Hire', 'Studio Hire', 90, 300],
  ] as const;
  for (const [name, category, duration, amount] of services) {
    const service = await pool.query('INSERT INTO services (tenant_id, name, category, duration_minutes) SELECT $1, $2, $3, $4 WHERE NOT EXISTS (SELECT 1 FROM services WHERE tenant_id = $1 AND name = $2) RETURNING id', [businessId, name, category, duration]);
    const serviceId = service.rows[0]?.id ?? (await pool.query('SELECT id FROM services WHERE tenant_id = $1 AND name = $2', [businessId, name])).rows[0].id;
    await pool.query('INSERT INTO service_prices (tenant_id, service_id, amount) SELECT $1, $2, $3 WHERE NOT EXISTS (SELECT 1 FROM service_prices WHERE tenant_id = $1 AND service_id = $2 AND active = true)', [businessId, serviceId, amount]);
  }
  await pool.end();
}

if (process.argv[1]?.includes('seed')) seed().catch((error) => { console.error(error); process.exit(1); });
