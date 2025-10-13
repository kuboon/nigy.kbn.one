import { Handlers } from "fresh/server.ts";
import { requireUser } from "../../lib/auth.ts";
import { kv } from "../../lib/kv.ts";
import { getMeet, listMembers } from "../../lib/meet.ts";
import { userMeetsKey } from "../../lib/keys.ts";

export const handler: Handlers = {
  async GET(req) {
    const auth = await requireUser(req);
    if (auth instanceof Response) return auth;
    const meetsEntry = await kv.get<string[]>(userMeetsKey(auth.userId));
    const meetIds = meetsEntry.value ?? [];
    const results = await Promise.all(meetIds.map((id) => getMeet(id)));
    const meets = await Promise.all(results.map(async (meet) => {
      if (!meet) return null;
      const participants = await listMembers(meet.id);
      return {
        meet,
        participants,
      };
    }));
    const filtered = meets.filter((value): value is NonNullable<typeof value> =>
      value !== null
    );
    return Response.json({ meets: filtered });
  },
};
