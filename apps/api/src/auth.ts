import { createHash, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import type { FastifyReply, FastifyRequest } from 'fastify';

export type AuthUser = { id: string; tenantId: string; email: string; role: string };
export function hashPassword(password: string) { const salt = randomBytes(16).toString('hex'); return `${salt}:${scryptSync(password, salt, 64).toString('hex')}`; }
export function verifyPassword(password: string, stored: string) { const [salt, hash] = stored.split(':'); if (!salt || !hash) return false; const actual = scryptSync(password, salt, 64); return timingSafeEqual(actual, Buffer.from(hash, 'hex')); }
export function hashToken(token: string) { return createHash('sha256').update(token).digest('hex'); }
export async function requireAuth(request: FastifyRequest, reply: FastifyReply) {
  const token = request.cookies.session;
  if (!token) return reply.code(401).send({ error: 'Authentication required' });
  const result = await (request.server as any).db.query('SELECT u.id, u.tenant_id AS "tenantId", u.email, u.role FROM sessions s JOIN app_users u ON u.id = s.user_id WHERE s.token_hash = $1 AND s.expires_at > now() AND u.active = true', [hashToken(token)]);
  if (!result.rows[0]) return reply.code(401).send({ error: 'Session expired' });
  (request as any).user = result.rows[0] as AuthUser;
}
