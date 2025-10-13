import { Handlers } from "fresh/server.ts";
import { requireUser } from "../../../../lib/auth.ts";
import { errorResponse } from "../../../../lib/http.ts";
import {
  getMeet,
  getMembership,
  listInvitations,
  saveInvitation,
} from "../../../../lib/meet.ts";

function parseExpiresAt(value: unknown): string | undefined | Response {
  if (value === undefined || value === null || value === "") return undefined;
  if (typeof value !== "string") {
    return errorResponse(400, "expiresAt must be an ISO string");
  }
  const expires = new Date(value);
  if (Number.isNaN(expires.getTime())) {
    return errorResponse(400, "expiresAt must be an ISO string");
  }
  return expires.toISOString();
}

export const handler: Handlers = {
  async POST(req, ctx) {
    const auth = await requireUser(req);
    if (auth instanceof Response) return auth;
    const meetId = ctx.params.meetId;
    const meet = await getMeet(meetId);
    if (!meet) return errorResponse(404, "Meet not found");
    if (meet.ownerId !== auth.userId) {
      return errorResponse(403, "Only the owner can issue invites");
    }
    let payload: Record<string, unknown> = {};
    if (req.headers.get("content-length") !== "0") {
      try {
        payload = await req.json();
      } catch (_error) {
        return errorResponse(400, "Invalid JSON body");
      }
    }
    const expiresAt = parseExpiresAt(payload.expiresAt);
    if (expiresAt instanceof Response) return expiresAt;
    const token = crypto.randomUUID();
    const now = new Date().toISOString();
    const invitation = {
      token,
      meetId,
      expiresAt,
      isRevoked: false,
      createdAt: now,
    };
    await saveInvitation(invitation);
    const url = new URL(req.url);
    url.pathname = `/invites/${token}`;
    return Response.json({
      invitation,
      url: url.toString(),
    }, { status: 201 });
  },

  async GET(req, ctx) {
    const auth = await requireUser(req);
    if (auth instanceof Response) return auth;
    const meetId = ctx.params.meetId;
    const meet = await getMeet(meetId);
    if (!meet) return errorResponse(404, "Meet not found");
    const membership = await getMembership(meetId, auth.userId);
    if (!membership || membership.role !== "owner") {
      return errorResponse(403, "Only the owner can view invites");
    }
    const invitations = await listInvitations(meetId);
    return Response.json({ invitations });
  },
};
