import { Handlers } from "fresh/server.ts";
import { requireUser } from "../../../../../lib/auth.ts";
import { errorResponse } from "../../../../../lib/http.ts";
import {
  getMeet,
  getMembership,
  revokeInvitation,
} from "../../../../../lib/meet.ts";

export const handler: Handlers = {
  async DELETE(req, ctx) {
    const auth = await requireUser(req);
    if (auth instanceof Response) return auth;
    const meetId = ctx.params.meetId;
    const token = ctx.params.token;
    const meet = await getMeet(meetId);
    if (!meet) return errorResponse(404, "Meet not found");
    if (meet.ownerId !== auth.userId) {
      return errorResponse(403, "Only the owner can revoke invites");
    }
    const membership = await getMembership(meetId, auth.userId);
    if (!membership || membership.role !== "owner") {
      return errorResponse(403, "Only the owner can revoke invites");
    }
    const revoked = await revokeInvitation(meetId, token);
    if (!revoked) {
      return errorResponse(404, "Invitation not found");
    }
    return Response.json({ invitation: revoked });
  },
};
