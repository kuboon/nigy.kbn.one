import { errorResponse } from "@/lib/http.ts";
import { getInvitationByToken, getMeet } from "@/lib/meet.ts";
import { define } from "@/util.ts";

function invitationStatus(invitation: {
  expiresAt?: string;
  isRevoked: boolean;
}) {
  const now = new Date();
  const expiresAt = invitation.expiresAt
    ? new Date(invitation.expiresAt)
    : undefined;
  const isExpired = expiresAt ? expiresAt.getTime() <= now.getTime() : false;
  const isActive = !invitation.isRevoked && !isExpired;
  return { isExpired, isActive };
}

export const handler = define.handlers({
  async GET(ctx) {
    const token = ctx.params.token;
    const invitation = await getInvitationByToken(token);
    if (!invitation) return errorResponse(404, "Invitation not found");
    const meet = await getMeet(invitation.meetId);
    if (!meet) return errorResponse(404, "Meet not found");
    const status = invitationStatus(invitation);
    return Response.json({
      invitation: { ...invitation, ...status },
      meet: {
        id: meet.id,
        title: meet.title,
        description: meet.description,
        location: meet.location,
        startAt: meet.startAt,
        endAt: meet.endAt,
        capacity: meet.capacity,
        uploadsCloseAt: meet.uploadsCloseAt,
      },
    });
  },
});
