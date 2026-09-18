import pg from 'pg';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const migrationsDir = path.resolve(process.cwd(), '../../database/migrations');

export async function migrate() {
  await pool.query('CREATE EXTENSION IF NOT EXISTS pgcrypto');
  const files = (await readdir(migrationsDir)).filter((file) => file.endsWith('.sql')).sort();
  await pool.query('CREATE TABLE IF NOT EXISTS schema_migrations (version text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())');
  for (const file of files) {
    const version = file.replace(/\.sql$/, '');
    const existing = await pool.query('SELECT 1 FROM schema_migrations WHERE version = $1', [version]);
    if (existing.rowCount) continue;
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query(await readFile(path.join(migrationsDir, file), 'utf8'));
      await client.query('INSERT INTO schema_migrations (version) VALUES ($1) ON CONFLICT DO NOTHING', [version]);
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}

if (process.argv[1]?.includes('migrate')) migrate().then(() => pool.end()).catch(async (error) => { console.error(error); await pool.end(); process.exit(1); });
