import 'server-only';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';

export type User = {
  userId: number;
  tenantId: number;
  email: string;
  permissions: string[];
};

const secret = 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6';
const ttl = 60 * 60 * 24 * 7; // 7 days

export async function getSession() {
  const cookieStore = await cookies();
  return getIronSession<{ token: string }>(cookieStore, {
    password: secret,
    cookieName: 'auth',
    ttl,
    cookieOptions: {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: (ttl === 0 ? 214748647 : ttl) - 60,
      path: '/',
    },
  });
}

export async function saveSession(token: string) {
  const session = await getSession();
  session.token = token;
  await session.save();
}

export function destroySession() {}

export function getUser() {}
