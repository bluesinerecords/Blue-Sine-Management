import 'dotenv/config';
import Fastify from 'fastify';
import cookie from '@fastify/cookie';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import sensible from '@fastify/sensible';
import pg from 'pg';
import { registerPhase2Routes } from './routes.js';

export const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

export function buildServer() {
  const app = Fastify({ logger: true });
  (app as any).db = pool;
  app.register(cookie);
  app.register(cors, { origin: true, credentials: true });
  app.register(helmet);
  app.register(sensible);
  app.get('/health', async () => ({ status: 'ok', service: 'blue-sine-api' }));
  registerPhase2Routes(app, pool);
  return app;
}

if (process.env.NODE_ENV !== 'test') {
  buildServer().listen({ port: Number(process.env.PORT ?? 4000), host: '0.0.0.0' })
    .catch((error) => { console.error(error); process.exit(1); });
}
