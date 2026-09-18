import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import sensible from '@fastify/sensible';

export function buildServer() {
  const app = Fastify({ logger: true });
  app.register(cors, { origin: true, credentials: true });
  app.register(helmet);
  app.register(sensible);

  app.get('/health', async () => ({ status: 'ok', service: 'blue-sine-api' }));
  app.get('/api/v1/business', async () => ({
    tradingName: 'Blue Sine Music Studios',
    slogan: 'Creating sound. Building stars.',
    city: 'Kokstad',
    province: 'KwaZulu-Natal',
    country: 'South Africa',
    currency: 'ZAR',
    timezone: 'Africa/Johannesburg',
  }));

  return app;
}

if (process.env.NODE_ENV !== 'test') {
  const app = buildServer();
  app.listen({ port: Number(process.env.PORT ?? 4000), host: '0.0.0.0' });
}
