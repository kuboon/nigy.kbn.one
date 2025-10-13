import { kv } from "./kv.ts";
import {
  inviteLookupKey,
  meetInviteKey,
  meetInvitePrefix,
  meetKey,
  meetMembershipKey,
  meetMembershipPrefix,
  userMeetsKey,
} from "./keys.ts";
import { Invitation, Meet, Membership } from "./types.ts";

const DAY = 24 * 60 * 60 * 1000;

export function computeLifecycle(startAtIso: string) {
  const start = new Date(startAtIso);
  if (Number.isNaN(start.getTime())) {
    throw new Error("Invalid startAt timestamp");
  }
  const uploadsCloseAt = new Date(start.getTime() + 14 * DAY).toISOString();
  const purgeAt = new Date(start.getTime() + 28 * DAY).toISOString();
  return { uploadsCloseAt, purgeAt };
}

export async function listMembers(meetId: string): Promise<Membership[]> {
  const list = kv.list<Membership>({
    prefix: meetMembershipPrefix(meetId),
  });
  const members: Membership[] = [];
  for await (const entry of list) {
    if (entry.value) members.push(entry.value);
  }
  return members;
}

export async function countMembers(meetId: string): Promise<number> {
  let count = 0;
  const iter = kv.list<Membership>({ prefix: meetMembershipPrefix(meetId) });
  for await (const entry of iter) {
    if (entry.value) count++;
  }
  return count;
}

export async function saveMembership(
  membership: Membership & { meetId: string },
) {
  const { meetId, ...rest } = membership;
  await kv.set(meetMembershipKey(meetId, membership.userId), rest);
}

export async function getMembership(meetId: string, userId: string) {
  const entry = await kv.get<Membership>(meetMembershipKey(meetId, userId));
  return entry.value ?? null;
}

export async function appendUserMeet(userId: string, meetId: string) {
  const key = userMeetsKey(userId);
  const existing = await kv.get<string[]>(key);
  const meets = existing.value ?? [];
  if (!meets.includes(meetId)) {
    meets.push(meetId);
    await kv.set(key, meets);
  }
}

export async function removeUserMeet(userId: string, meetId: string) {
  const key = userMeetsKey(userId);
  const existing = await kv.get<string[]>(key);
  const meets = existing.value ?? [];
  const next = meets.filter((id) => id !== meetId);
  await kv.set(key, next);
}

export async function getMeet(meetId: string): Promise<Meet | null> {
  const entry = await kv.get<Meet>(meetKey(meetId));
  return entry.value ?? null;
}

export async function saveMeet(meet: Meet) {
  await kv.set(meetKey(meet.id), meet);
}

export async function saveInvitation(invite: Invitation) {
  await kv.set(meetInviteKey(invite.meetId, invite.token), invite);
  await kv.set(inviteLookupKey(invite.token), {
    meetId: invite.meetId,
  });
}

export async function getInvitationByToken(token: string) {
  const pointer = await kv.get<{ meetId: string }>(inviteLookupKey(token));
  if (!pointer.value) return null;
  const inviteEntry = await kv.get<Invitation>(
    meetInviteKey(pointer.value.meetId, token),
  );
  if (!inviteEntry.value) return null;
  return inviteEntry.value;
}

export async function revokeInvitation(meetId: string, token: string) {
  const inviteKey = meetInviteKey(meetId, token);
  const inviteEntry = await kv.get<Invitation>(inviteKey);
  if (!inviteEntry.value) return null;
  const updated: Invitation = { ...inviteEntry.value, isRevoked: true };
  await kv.set(inviteKey, updated);
  await kv.set(inviteLookupKey(token), { meetId });
  return updated;
}

export async function listInvitations(meetId: string) {
  const iter = kv.list<Invitation>({ prefix: meetInvitePrefix(meetId) });
  const invites: Invitation[] = [];
  for await (const entry of iter) {
    if (entry.value) invites.push(entry.value);
  }
  return invites;
}
