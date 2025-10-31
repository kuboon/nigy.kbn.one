import { requireUser } from "@/lib/auth.ts";
import { errorResponse } from "@/lib/http.ts";
import {
  appendUserMeet,
  countMembers,
  getInvitationByToken,
  getMeet,
  getMembership,
  saveMembership,
} from "@/lib/meet.ts";
import { define } from "@/util.ts";

function ensureActiveInvitation(invitation: {
  expiresAt?: string;
  isRevoked: boolean;
}) {
  if (invitation.isRevoked) {
    return errorResponse(410, "Invitation has been revoked");
  }
  if (invitation.expiresAt) {
    const expires = new Date(invitation.expiresAt);
    if (Number.isNaN(expires.getTime())) {
      return errorResponse(500, "Invitation expiry is invalid");
    }
    if (expires.getTime() <= Date.now()) {
      return errorResponse(410, "Invitation has expired");
    }
  }
  return true;
}

export const handler = define.handlers({
  async POST(ctx) {
    const req = ctx.req;
    const auth = await requireUser(req);
    if (auth instanceof Response) return auth;
    const token = ctx.params.token;
    const invitation = await getInvitationByToken(token);
    if (!invitation) return errorResponse(404, "Invitation not found");
    const meet = await getMeet(invitation.meetId);
    if (!meet) return errorResponse(404, "Meet not found");
    const active = ensureActiveInvitation(invitation);
    if (active !== true) return active;
    const existing = await getMembership(meet.id, auth.userId);
    if (existing) {
      return Response.json({
        membership: { ...existing, meetId: meet.id },
        alreadyMember: true,
      });
    }
    const currentCount = await countMembers(meet.id);
    if (currentCount >= meet.capacity) {
      return errorResponse(409, "Meet is at capacity");
    }
    const membership = {
      meetId: meet.id,
      userId: auth.userId,
      role: "member" as const,
      displayName: auth.displayName,
      bio: "",
      createdAt: new Date().toISOString(),
    };
    await saveMembership(membership);
    await appendUserMeet(auth.userId, meet.id);
    return Response.json({ membership });
  },
});
