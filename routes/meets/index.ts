import { requireUser } from "../../lib/auth.ts";
import { errorResponse } from "../../lib/http.ts";
import {
  appendUserMeet,
  computeLifecycle,
  saveMeet,
  saveMembership,
} from "../../lib/meet.ts";
import { Meet, Membership } from "../../lib/types.ts";
import { define } from "../../util.ts";

function validateCapacity(capacity: unknown): number | Response {
  if (typeof capacity !== "number" || !Number.isFinite(capacity)) {
    return errorResponse(400, "capacity must be a number");
  }
  const rounded = Math.floor(capacity);
  if (rounded < 1 || rounded > 50) {
    return errorResponse(400, "capacity must be between 1 and 50");
  }
  return rounded;
}

function requireString(field: unknown, name: string): string | Response {
  if (typeof field !== "string" || field.trim().length === 0) {
    return errorResponse(400, `${name} is required`);
  }
  return field;
}

export const handler = define.handlers({
  async POST(ctx) {
    const req = ctx.req;
    const auth = await requireUser(req);
    if (auth instanceof Response) return auth;
    let payload: Record<string, unknown>;
    try {
      payload = await req.json();
    } catch (error) {
      console.error("Failed to parse JSON", error);
      return errorResponse(400, "Invalid JSON body");
    }
    const title = requireString(payload.title, "title");
    if (title instanceof Response) return title;
    const startAt = requireString(payload.startAt, "startAt");
    if (startAt instanceof Response) return startAt;
    const endAt = requireString(payload.endAt, "endAt");
    if (endAt instanceof Response) return endAt;
    const capacity = validateCapacity(payload.capacity);
    if (capacity instanceof Response) return capacity;

    let uploadsCloseAt: string;
    let purgeAt: string;
    try {
      const lifecycle = computeLifecycle(startAt);
      uploadsCloseAt = lifecycle.uploadsCloseAt;
      purgeAt = lifecycle.purgeAt;
    } catch (_error) {
      return errorResponse(400, "startAt must be a valid ISO date string");
    }
    const now = new Date().toISOString();
    const meetId = crypto.randomUUID();
    const meet: Meet = {
      id: meetId,
      ownerId: auth.userId,
      title,
      description: typeof payload.description === "string"
        ? payload.description
        : undefined,
      location: typeof payload.location === "string"
        ? payload.location
        : undefined,
      startAt,
      endAt,
      capacity,
      uploadsCloseAt,
      purgeAt,
      createdAt: now,
      updatedAt: now,
    };
    await saveMeet(meet);
    const membership: Membership & { meetId: string } = {
      meetId,
      userId: auth.userId,
      role: "owner",
      displayName: auth.displayName,
      bio: "",
      createdAt: now,
    };
    await saveMembership(membership);
    await appendUserMeet(auth.userId, meetId);
    return Response.json({ meet });
  },
});
