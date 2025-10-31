import { Head } from "fresh/runtime";

const endpoints = [
  {
    method: "POST",
    path: "/meets",
    description: "Create a new meet and auto-enrol the owner.",
  },
  {
    method: "POST",
    path: "/meets/:id/invitations",
    description: "Issue a shareable invitation link for the meet owner.",
  },
  {
    method: "DELETE",
    path: "/meets/:id/invitations/:token",
    description: "Revoke an existing invitation token.",
  },
  {
    method: "GET",
    path: "/invites/:token",
    description: "Inspect the meet details behind an invitation token.",
  },
  {
    method: "POST",
    path: "/invites/:token/accept",
    description: "Join the meet referenced by the token (capacity aware).",
  },
];

function EndpointRow(
  { method, path, description }: typeof endpoints[number],
) {
  return (
    <div class="rounded-xl border border-green-200 bg-white/80 p-4 shadow-sm">
      <div class="flex flex-wrap items-baseline gap-2">
        <span class="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold uppercase tracking-wide text-emerald-700">
          {method}
        </span>
        <code class="text-lg font-semibold text-slate-700">{path}</code>
      </div>
      <p class="mt-2 text-sm text-slate-600">{description}</p>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <Head>
        <title>meet hub · Invitations API</title>
      </Head>
      <main class="min-h-screen bg-gradient-to-br from-emerald-100 via-white to-emerald-200">
        <div class="mx-auto flex max-w-4xl flex-col gap-12 px-4 py-16">
          <section class="flex flex-col gap-6 rounded-3xl bg-white/90 p-10 shadow-lg backdrop-blur">
            <div class="flex flex-col gap-2">
              <span class="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-600">
                meet hub
              </span>
              <h1 class="text-4xl font-bold text-slate-900 sm:text-5xl">
                Build ephemeral meetups with invites in minutes
              </h1>
              <p class="text-base text-slate-600">
                This reference implementation covers the core lifecycle until
                invitations. Use the documented HTTP endpoints to create meets,
                invite collaborators, and let guests join before the upload
                window closes fourteen days after the start time.
              </p>
            </div>
            <div class="grid gap-4 text-sm text-slate-700 sm:grid-cols-3">
              <div>
                <h2 class="text-lg font-semibold text-slate-900">Lifecycle</h2>
                <p>Uploads close after 14 days; records purge after 28 days.</p>
              </div>
              <div>
                <h2 class="text-lg font-semibold text-slate-900">Roles</h2>
                <p>
                  Owners manage meets and invitations, members can join and
                  view.
                </p>
              </div>
              <div>
                <h2 class="text-lg font-semibold text-slate-900">Capacity</h2>
                <p>
                  Meets accept between 1 and 50 members with automatic checks.
                </p>
              </div>
            </div>
          </section>

          <section class="flex flex-col gap-6">
            <header class="flex flex-col gap-2">
              <h2 class="text-2xl font-semibold text-slate-900">
                Invitation-focused endpoints
              </h2>
              <p class="text-sm text-slate-600">
                All requests expect <code>X-User-Id</code>{" "}
                headers for authentication. Optional <code>X-User-Email</code>
                {" "}
                and
                <code>X-User-Display-Name</code>{" "}
                headers seed user metadata on first use.
              </p>
            </header>
            <div class="grid gap-4 md:grid-cols-2">
              {endpoints.map((endpoint, idx) => (
                <EndpointRow key={idx} {...endpoint} />
              ))}
            </div>
          </section>

          <section class="rounded-3xl bg-slate-900 p-8 text-slate-100 shadow-lg">
            <h2 class="text-2xl font-semibold">Quickstart</h2>
            <ol class="mt-4 list-decimal space-y-2 pl-5 text-sm text-slate-200">
              <li>
                <span class="font-semibold">Create a meet</span> with
                <code class="mx-1">POST /meets</code>{" "}
                supplying title, start/end timestamps, and capacity.
              </li>
              <li>
                <span class="font-semibold">Issue invitations</span> via
                <code class="mx-1">POST /meets/:id/invitations</code>{" "}
                and share the generated link.
              </li>
              <li>
                <span class="font-semibold">Guests accept</span> through
                <code class="mx-1">POST /invites/:token/accept</code>, which
                enforces capacity and revocation rules automatically.
              </li>
            </ol>
          </section>
        </div>
      </main>
    </>
  );
}
