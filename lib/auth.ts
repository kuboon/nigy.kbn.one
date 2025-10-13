import { kv } from "./kv.ts";
import { errorResponse } from "./http.ts";
import { userEmailIndexKey, userKey } from "./keys.ts";
import { User } from "./types.ts";

export interface AuthUser {
  userId: string;
  email: string;
  displayName: string;
}

export type Authenticated = AuthUser | Response;

export async function requireUser(req: Request): Promise<Authenticated> {
  const userId = req.headers.get("x-user-id");
  if (!userId) {
    return errorResponse(401, "Missing X-User-Id header");
  }
  const email = req.headers.get("x-user-email") ?? `${userId}@example.test`;
  const displayName = req.headers.get("x-user-display-name") ?? userId;
  const key = userKey(userId);
  const existing = await kv.get<User>(key);
  if (!existing.value) {
    const now = new Date().toISOString();
    const user: User = {
      userId,
      email,
      displayName,
      createdAt: now,
    };
    await kv.set(key, user);
    await kv.set(userEmailIndexKey(email), userId);
  }
  return { userId, email, displayName };
}
