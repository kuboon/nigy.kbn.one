import { requireUser } from "../../lib/auth.ts";
import { kv } from "../../lib/kv.ts";
import { getMeet, listMembers } from "../../lib/meet.ts";
import { userMeetsKey } from "../../lib/keys.ts";
import { define } from "../../util.ts";

type MeetWithParticipants = {
  meet: NonNullable<Awaited<ReturnType<typeof getMeet>>>;
  participants: Awaited<ReturnType<typeof listMembers>>;
};

export const handler = define.handlers({
  async GET(ctx) {
    const req = ctx.req;
    const auth = await requireUser(req);
    if (auth instanceof Response) return auth;
    const meetsEntry = await kv.get<string[]>(userMeetsKey(auth.userId));
    const meetIds = meetsEntry.value ?? ([] as string[]);
    const meets: MeetWithParticipants[] = [];
    for (const id of meetIds) {
      const meet = await getMeet(id);
      if (!meet) continue;
      const participants = await listMembers(meet.id);
      meets.push({ meet, participants });
    }
    return Response.json({ meets });
  },
});
