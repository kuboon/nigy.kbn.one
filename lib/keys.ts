export const userKey = (userId: string) => ["user", userId] as const;
export const userEmailIndexKey = (email: string) => ["email", email] as const;
export const userMeetsKey = (userId: string) =>
  ["user", userId, "meets"] as const;

export const meetKey = (meetId: string) => ["meet", meetId] as const;
export const meetMembershipKey = (meetId: string, userId: string) =>
  ["meet", meetId, "member", userId] as const;
export const meetMembershipPrefix = (meetId: string) =>
  ["meet", meetId, "member"] as const;
export const meetInviteKey = (meetId: string, token: string) =>
  ["meet", meetId, "invite", token] as const;
export const meetInvitePrefix = (meetId: string) =>
  ["meet", meetId, "invite"] as const;
export const inviteLookupKey = (token: string) => ["invite", token] as const;
