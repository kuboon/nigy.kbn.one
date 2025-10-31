import { Head } from "fresh/runtime";

const highlights = [
  {
    title: "Share time-boxed moments",
    description:
      "Organise pop-up gatherings with automatic clean-up after each event.",
  },
  {
    title: "Invite in seconds",
    description:
      "Issue secure links, track responses, and stay in control of membership.",
  },
  {
    title: "Chat and capture",
    description:
      "Keep the conversation and photos in one place for the first 14 days.",
  },
];

const sellingPoints = [
  {
    title: "Designed for ephemeral meets",
    body:
      "Automatic retention windows keep attention on the moment while ensuring data expires on schedule.",
  },
  {
    title: "Roles that scale with trust",
    body:
      "Owners curate the guest list, while members enjoy streamlined access without extra setup.",
  },
  {
    title: "No-app onboarding",
    body:
      "Share a link, pick a display name, and start collaborating instantly on any device.",
  },
];

const timeline = [
  {
    label: "Plan",
    details:
      "Create a meet with timing, place, and capacity in under a minute.",
  },
  {
    label: "Share",
    details:
      "Send invitation links that can be revoked or replaced whenever plans change.",
  },
  {
    label: "Enjoy",
    details:
      "Chat, share photos, and wrap things up together before the window closes.",
  },
];

export default function Home() {
  return (
    <>
      <Head>
        <title>meet hub · ephemeral meetups with invites</title>
      </Head>
      <main class="min-h-screen bg-gradient-to-br from-emerald-100 via-white to-emerald-200">
        <div class="mx-auto flex max-w-6xl flex-col gap-20 px-6 py-20">
          <section class="grid gap-12 rounded-[32px] bg-white/90 p-12 shadow-xl backdrop-blur lg:grid-cols-[1.15fr,0.85fr] lg:items-center">
            <div class="flex flex-col gap-8">
              <div class="space-y-4">
                <span class="rounded-full bg-emerald-100 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-emerald-700">
                  meet hub
                </span>
                <h1 class="text-4xl font-bold leading-tight text-slate-900 sm:text-5xl">
                  Gather fast, share freely, and let the moment fade on its own.
                </h1>
                <p class="text-lg text-slate-600">
                  meet hub is the easiest way to spin up a private space for
                  your pop-up meetups. Invite friends, share updates, and keep
                  the momentum without the clutter.
                </p>
              </div>
              <div class="flex flex-wrap gap-4">
                <a
                  href="/me"
                  class="inline-flex items-center justify-center rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/30 transition hover:bg-emerald-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
                >
                  Sign In
                </a>
                <a
                  href="/me"
                  class="inline-flex items-center justify-center rounded-full border border-emerald-200 px-6 py-3 text-sm font-semibold text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200"
                >
                  Sign Up
                </a>
              </div>
              <dl class="grid gap-6 sm:grid-cols-3">
                {highlights.map((highlight) => (
                  <div
                    class="rounded-2xl border border-emerald-50 bg-emerald-50/60 p-5 shadow-sm"
                    key={highlight.title}
                  >
                    <dt class="text-sm font-semibold uppercase tracking-wide text-emerald-700">
                      {highlight.title}
                    </dt>
                    <dd class="mt-2 text-sm text-slate-600">
                      {highlight.description}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
            <div class="relative">
              <div class="absolute inset-0 -translate-x-6 rounded-[28px] bg-emerald-500/10 blur-3xl" />
              <div class="relative flex flex-col gap-4 rounded-[24px] border border-emerald-100 bg-white p-6 shadow-lg">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-xs uppercase tracking-[0.25em] text-emerald-500">
                      Upcoming meet
                    </p>
                    <p class="text-xl font-semibold text-slate-900">
                      Team Jam Session
                    </p>
                  </div>
                  <span class="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                    12 seats left
                  </span>
                </div>
                <div class="space-y-3 text-sm text-slate-600">
                  <p>
                    <span class="font-semibold text-slate-900">When:</span>{" "}
                    Sat, 17 Aug · 14:00 — 17:00
                  </p>
                  <p>
                    <span class="font-semibold text-slate-900">Where:</span>
                    {" "}
                    Riverside Studio, Hall B
                  </p>
                  <p>
                    <span class="font-semibold text-slate-900">Who:</span>{" "}
                    Owners, members, and guests with a link
                  </p>
                </div>
                <div class="rounded-2xl bg-slate-900 px-5 py-4 text-slate-100">
                  <p class="text-xs uppercase tracking-[0.25em] text-emerald-200">
                    Live feed
                  </p>
                  <p class="mt-2 text-sm text-slate-200">
                    “Can someone bring a portable speaker? I’ll handle snacks!”
                  </p>
                </div>
                <div class="flex items-center justify-between text-xs text-slate-500">
                  <span>Uploads close in 13 days</span>
                  <span>Auto-cleanup on 31 Aug</span>
                </div>
              </div>
            </div>
          </section>

          <section class="grid gap-12 lg:grid-cols-[0.9fr,1.1fr] lg:items-center">
            <div class="space-y-6">
              <h2 class="text-3xl font-semibold text-slate-900">
                Everything you need for a meet that stays on schedule.
              </h2>
              <p class="text-base text-slate-600">
                Your meet hub keeps roles, invitations, and memories in sync. No
                extra apps required—just a focused space that opens when you
                need it and wraps up on time.
              </p>
              <dl class="space-y-5">
                {sellingPoints.map((point) => (
                  <div
                    class="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm"
                    key={point.title}
                  >
                    <dt class="text-lg font-semibold text-slate-900">
                      {point.title}
                    </dt>
                    <dd class="mt-2 text-sm text-slate-600">{point.body}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div class="rounded-[32px] border border-slate-200 bg-white/90 p-8 shadow-xl">
              <h3 class="text-xl font-semibold text-slate-900">
                How meet hub works
              </h3>
              <ol class="mt-6 space-y-6">
                {timeline.map((item, index) => (
                  <li class="flex gap-4" key={item.label}>
                    <span class="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-sm font-semibold text-white">
                      {index + 1}
                    </span>
                    <div class="space-y-1">
                      <p class="text-base font-semibold text-slate-900">
                        {item.label}
                      </p>
                      <p class="text-sm text-slate-600">{item.details}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          <section class="rounded-[32px] bg-slate-900 px-10 py-12 text-slate-100 shadow-2xl">
            <div class="flex flex-col gap-6 text-center">
              <h2 class="text-3xl font-semibold">
                Ready for your next meetup?
              </h2>
              <p class="text-base text-slate-300">
                Create a space, share the link, and let the memories happen—meet
                hub takes care of the rest.
              </p>
              <div class="flex flex-wrap items-center justify-center gap-4">
                <a
                  href="/me"
                  class="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg transition hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                >
                  Sign In
                </a>
                <a
                  href="/me"
                  class="inline-flex items-center justify-center rounded-full border border-white/60 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                >
                  Sign Up
                </a>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
