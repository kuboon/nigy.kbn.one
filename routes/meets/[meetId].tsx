import { Head } from "fresh/runtime.ts";
import { Handlers, PageProps } from "fresh/server.ts";
import { errorResponse } from "../../lib/http.ts";
import { getMeet, listMembers } from "../../lib/meet.ts";
import { Meet, Membership } from "../../lib/types.ts";

interface MeetOverviewData {
  meet: Meet;
  participants: Membership[];
}

function formatDateTime(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function computeStage(meet: Meet) {
  const now = Date.now();
  const startAt = new Date(meet.startAt).getTime();
  const endAt = new Date(meet.endAt).getTime();
  const uploadsCloseAt = new Date(meet.uploadsCloseAt).getTime();
  const purgeAt = new Date(meet.purgeAt).getTime();

  if (!Number.isFinite(startAt) || !Number.isFinite(endAt)) {
    return { label: "Scheduled", detail: "Awaiting accurate timing data." };
  }

  if (now < startAt) {
    return {
      label: "Upcoming",
      detail: "Members can prepare and review details.",
    };
  }
  if (now <= endAt) {
    return {
      label: "In progress",
      detail: "Uploads and chat are open until the close window.",
    };
  }
  if (now < uploadsCloseAt) {
    return {
      label: "Post-meet",
      detail: "Uploads remain open until the closing deadline.",
    };
  }
  if (now < purgeAt) {
    return {
      label: "Archive",
      detail: "Read-only window before automatic purge.",
    };
  }
  return {
    label: "Purged",
    detail: "Retention window elapsed; data scheduled for deletion.",
  };
}

function ParticipantCard({ participant }: { participant: Membership }) {
  return (
    <li class="rounded-xl border border-emerald-200 bg-white/80 p-4 shadow-sm">
      <div class="flex items-baseline justify-between gap-2">
        <p class="text-lg font-semibold text-slate-900">
          {participant.displayName || "Unnamed participant"}
        </p>
        <span class="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
          {participant.role}
        </span>
      </div>
      <p class="mt-1 text-xs text-slate-500">
        Joined {formatDateTime(participant.createdAt)}
      </p>
      <p class="mt-3 text-sm text-slate-700">
        {participant.bio
          ? participant.bio
          : <span class="italic text-slate-400">No bio provided.</span>}
      </p>
    </li>
  );
}

export const handler: Handlers<MeetOverviewData> = {
  async GET(_req, ctx) {
    const meetId = ctx.params.meetId;
    const meet = await getMeet(meetId);
    if (!meet) {
      return errorResponse(404, "Meet not found");
    }
    const participants = await listMembers(meetId);
    participants.sort((a, b) => {
      if (a.role === b.role) return a.displayName.localeCompare(b.displayName);
      return a.role === "owner" ? -1 : 1;
    });
    return ctx.render({ meet, participants });
  },
};

export default function MeetOverview(
  { data }: PageProps<MeetOverviewData>,
) {
  const { meet, participants } = data;
  const stage = computeStage(meet);
  const memberCount = participants.length;
  const capacityReached = memberCount >= meet.capacity;
  const capacityClass = capacityReached
    ? "bg-rose-100 text-rose-700"
    : "bg-emerald-100 text-emerald-700";

  return (
    <>
      <Head>
        <title>{meet.title} · meet hub</title>
        <meta
          name="description"
          content={`Overview for ${meet.title} meet including schedule and participants.`}
        />
      </Head>
      <main class="min-h-screen bg-gradient-to-br from-emerald-100 via-white to-emerald-200">
        <div class="mx-auto flex max-w-4xl flex-col gap-10 px-4 py-14">
          <section class="rounded-3xl bg-white/90 p-10 shadow-lg backdrop-blur">
            <div class="flex flex-col gap-4">
              <span class="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-600">
                Meet overview
              </span>
              <h1 class="text-4xl font-bold text-slate-900">{meet.title}</h1>
              {meet.description && (
                <p class="text-base text-slate-600">{meet.description}</p>
              )}
            </div>
            <dl class="mt-8 grid gap-4 sm:grid-cols-2">
              <div class="rounded-2xl bg-slate-900/90 p-5 text-slate-100 shadow-md">
                <dt class="text-xs font-semibold uppercase tracking-wide text-emerald-200">
                  Stage
                </dt>
                <dd class="mt-1 text-lg font-semibold">{stage.label}</dd>
                <p class="mt-2 text-sm text-slate-200">{stage.detail}</p>
              </div>
              <div class={`rounded-2xl p-5 shadow-md ${capacityClass}`}>
                <dt class="text-xs font-semibold uppercase tracking-wide">
                  Capacity
                </dt>
                <dd class="mt-1 text-lg font-semibold">
                  {memberCount} / {meet.capacity} members
                </dd>
                <p class="mt-2 text-sm">
                  {capacityReached
                    ? "No additional members can join unless capacity is increased."
                    : "Invitations remain valid until the meet reaches capacity."}
                </p>
              </div>
              <div class="rounded-2xl border border-emerald-100 bg-white/70 p-5 shadow-sm">
                <dt class="text-xs font-semibold uppercase tracking-wide text-emerald-600">
                  Schedule
                </dt>
                <dd class="mt-2 text-sm text-slate-700">
                  <span class="block font-semibold text-slate-900">Starts</span>
                  <span>{formatDateTime(meet.startAt)}</span>
                </dd>
                <dd class="mt-2 text-sm text-slate-700">
                  <span class="block font-semibold text-slate-900">Ends</span>
                  <span>{formatDateTime(meet.endAt)}</span>
                </dd>
              </div>
              <div class="rounded-2xl border border-emerald-100 bg-white/70 p-5 shadow-sm">
                <dt class="text-xs font-semibold uppercase tracking-wide text-emerald-600">
                  Lifecycle
                </dt>
                <dd class="mt-2 text-sm text-slate-700">
                  <span class="block font-semibold text-slate-900">
                    Uploads close
                  </span>
                  <span>{formatDateTime(meet.uploadsCloseAt)}</span>
                </dd>
                <dd class="mt-2 text-sm text-slate-700">
                  <span class="block font-semibold text-slate-900">
                    Purge scheduled
                  </span>
                  <span>{formatDateTime(meet.purgeAt)}</span>
                </dd>
              </div>
            </dl>
            {meet.location && (
              <div class="mt-8 rounded-2xl border border-emerald-100 bg-white/70 p-5 shadow-sm">
                <h2 class="text-sm font-semibold uppercase tracking-wide text-emerald-600">
                  Location
                </h2>
                <p class="mt-2 text-base text-slate-700">{meet.location}</p>
              </div>
            )}
          </section>

          <section class="flex flex-col gap-5">
            <header>
              <h2 class="text-2xl font-semibold text-slate-900">
                Participants
              </h2>
              <p class="text-sm text-slate-600">
                Members inherit their per-meet profile, including display names
                and bios.
              </p>
            </header>
            {participants.length === 0
              ? (
                <p class="rounded-2xl border border-dashed border-emerald-300 bg-white/70 p-8 text-center text-sm text-slate-500">
                  No participants yet. Share an invitation link to start filling
                  the roster.
                </p>
              )
              : (
                <ul class="grid gap-4 md:grid-cols-2">
                  {participants.map((participant) => (
                    <ParticipantCard participant={participant} />
                  ))}
                </ul>
              )}
          </section>
        </div>
      </main>
    </>
  );
}
