import pg from 'pg';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const migrationPath = path.resolve(process.cwd(), '../../database/migrations/001_phase1.sql');

export async function migrate() {
  const sql = await readFile(migrationPath, 'utf8');
  await pool.query('CREATE EXTENSION IF NOT EXISTS pgcrypto');
  await pool.query(sql);
}

if (process.argv[1]?.includes('migrate')) {
  migrate().then(() => pool.end()).catch(async (error) => { console.error(error); await pool.end(); process.exit(1); });
}
