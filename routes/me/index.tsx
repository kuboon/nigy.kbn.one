import { Head } from "fresh/runtime";

const demoUser = {
  name: "Casey Rivers",
  email: "casey@example.com",
};

const upcomingMeets = [
  {
    id: "team-jam",
    title: "Team Jam Session",
    date: "Sat, 17 Aug",
    time: "14:00 — 17:00",
    location: "Riverside Studio, Hall B",
    role: "Owner",
    seats: "12 of 24 seats left",
    description: "Sync the setlist, finalise equipment, and align arrivals.",
  },
  {
    id: "sunrise-ride",
    title: "Sunrise Ride & Roast",
    date: "Sun, 25 Aug",
    time: "05:30 — 09:00",
    location: "Trailhead Café",
    role: "Member",
    seats: "3 of 12 seats left",
    description:
      "Meet at the café, split into pace groups, and warm up together.",
  },
];

const highlights = [
  {
    title: "Invitations",
    value: "2 pending",
    description: "Resend or revoke invites with a couple of taps.",
  },
  {
    title: "Uploads",
    value: "13 photos",
    description: "Add memories during the 14-day sharing window.",
  },
  {
    title: "Exports",
    value: "1 ready",
    description: "Download everything before the archive closes.",
  },
];

function MeetCard(
  { title, date, time, location, role, seats, description }:
    typeof upcomingMeets[number],
) {
  return (
    <article class="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-md">
      <header class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p class="text-xs uppercase tracking-[0.3em] text-emerald-500">
            {role}
          </p>
          <h3 class="text-xl font-semibold text-slate-900">{title}</h3>
        </div>
        <span class="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
          {seats}
        </span>
      </header>
      <div class="space-y-2 text-sm text-slate-600">
        <p>
          <span class="font-semibold text-slate-900">When:</span> {date} ·{" "}
          {time}
        </p>
        <p>
          <span class="font-semibold text-slate-900">Where:</span> {location}
        </p>
        <p>{description}</p>
      </div>
      <div class="flex flex-wrap gap-3 text-sm">
        <button
          type="button"
          class="inline-flex items-center justify-center rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-emerald-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
        >
          Open meet
        </button>
        <button
          type="button"
          class="inline-flex items-center justify-center rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
        >
          Manage invites
        </button>
      </div>
    </article>
  );
}

export default function Dashboard() {
  return (
    <>
      <Head>
        <title>meet hub · your meets</title>
      </Head>
      <main class="min-h-screen bg-gradient-to-br from-slate-100 via-white to-emerald-50">
        <div class="mx-auto flex max-w-6xl flex-col gap-16 px-6 py-16">
          <header class="flex flex-col gap-6 rounded-[32px] bg-slate-900 px-10 py-12 text-slate-100 shadow-2xl">
            <div class="flex flex-wrap items-start justify-between gap-6">
              <div class="space-y-2">
                <p class="text-xs uppercase tracking-[0.3em] text-emerald-300">
                  Signed in as
                </p>
                <h1 class="text-3xl font-semibold">{demoUser.name}</h1>
                <p class="text-sm text-slate-300">{demoUser.email}</p>
              </div>
              <div class="flex flex-wrap gap-3">
                <button
                  type="button"
                  class="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-900 shadow-lg transition hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                >
                  Create meet
                </button>
                <button
                  type="button"
                  class="inline-flex items-center justify-center rounded-full border border-white/60 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-100 transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                >
                  View exports
                </button>
              </div>
            </div>
            <div class="grid gap-4 sm:grid-cols-3">
              {highlights.map((item) => (
                <div
                  class="rounded-2xl border border-white/20 bg-white/10 p-5"
                  key={item.title}
                >
                  <p class="text-xs uppercase tracking-[0.3em] text-emerald-200">
                    {item.title}
                  </p>
                  <p class="mt-2 text-xl font-semibold text-white">
                    {item.value}
                  </p>
                  <p class="mt-1 text-xs text-slate-200">{item.description}</p>
                </div>
              ))}
            </div>
          </header>

          <section class="flex flex-col gap-8">
            <div class="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 class="text-2xl font-semibold text-slate-900">
                  Upcoming meets
                </h2>
                <p class="text-sm text-slate-600">
                  Track roles, manage members, and keep tabs on the upload
                  window.
                </p>
              </div>
              <button
                type="button"
                class="inline-flex items-center justify-center rounded-full border border-emerald-200 px-5 py-2 text-xs font-semibold uppercase tracking-wide text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200"
              >
                Refresh list
              </button>
            </div>
            <div class="grid gap-6 md:grid-cols-2">
              {upcomingMeets.map((meet) => (
                <MeetCard
                  key={meet.id}
                  {...meet}
                />
              ))}
            </div>
          </section>

          <section class="rounded-[28px] border border-slate-200 bg-white/80 p-8 shadow-xl">
            <h2 class="text-2xl font-semibold text-slate-900">
              Need to invite someone new?
            </h2>
            <p class="mt-2 text-sm text-slate-600">
              Issue a fresh invitation link, set a capacity, and share it
              instantly. meet hub keeps the guest list tidy and revocable.
            </p>
            <div class="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                class="inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-emerald-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
              >
                Issue invitation
              </button>
              <button
                type="button"
                class="inline-flex items-center justify-center rounded-full border border-slate-300 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
              >
                Manage members
              </button>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
