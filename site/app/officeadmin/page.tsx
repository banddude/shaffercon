import type { Metadata } from "next";
import Link from "next/link";
import snapshot from "./generated/system-snapshot.json";

export const metadata: Metadata = {
  title: "OfficeAdmin System Map",
  description: "Generated system map and progress surface for AIVA and OfficeAdmin.",
  robots: {
    index: false,
    follow: false,
  },
};

function StatCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string | number | null;
  detail?: string;
}) {
  return (
    <div className="rounded-[1.5rem] border border-[var(--section-border)] bg-[rgba(255,255,255,0.03)] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.15)]">
      <div className="text-[0.72rem] uppercase tracking-[0.18em] text-[var(--secondary)]">
        {label}
      </div>
      <div className="mt-3 text-3xl font-semibold tracking-tight text-[var(--text)]">
        {value ?? "Unknown"}
      </div>
      {detail ? (
        <div className="mt-2 text-sm leading-6 text-[var(--secondary)]">{detail}</div>
      ) : null}
    </div>
  );
}

function Section({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-[var(--section-border)] py-14 first:border-t-0">
      <div className="mb-8 max-w-3xl">
        <div className="text-[0.72rem] uppercase tracking-[0.22em] text-[var(--primary)]">
          {eyebrow}
        </div>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--text)] sm:text-4xl">
          {title}
        </h2>
        {description ? (
          <p className="mt-4 text-base leading-7 text-[var(--secondary)]">{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

export default function OfficeAdminPage() {
  return (
    <main
      className="min-h-screen"
      style={{
        background:
          "radial-gradient(circle at top left, rgba(43,127,189,0.22), transparent 28%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.08), transparent 22%), linear-gradient(180deg, #05070b 0%, #0b1017 55%, #05070b 100%)",
      }}
    >
      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-12">
        <div className="overflow-hidden rounded-[2rem] border border-[rgba(255,255,255,0.08)] bg-[rgba(6,10,16,0.78)] shadow-[0_30px_120px_rgba(0,0,0,0.45)] backdrop-blur-xl">
          <section className="relative overflow-hidden px-6 py-16 sm:px-8 lg:px-12">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(43,127,189,0.12),transparent_38%,rgba(255,255,255,0.04))]" />
            <div className="relative z-10 grid gap-10 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
              <div>
                <div className="inline-flex items-center rounded-full border border-[rgba(255,255,255,0.12)] px-3 py-1 text-[0.72rem] uppercase tracking-[0.2em] text-[var(--primary)]">
                  OfficeAdmin System Surface
                </div>
                <h1 className="mt-6 max-w-4xl font-serif text-5xl leading-[0.95] tracking-tight text-white sm:text-6xl">
                  One place to see the shape of the system, without maintaining a second system.
                </h1>
                <p className="mt-6 max-w-3xl text-lg leading-8 text-[rgba(255,255,255,0.76)]">
                  This route is generated from docs, code, repos, and key local paths that the build can actually inspect. It is meant to become the fast re-entry surface for you and collaborators.
                </p>
              </div>

              <div className="rounded-[1.5rem] border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.03)] p-5">
                <div className="text-[0.72rem] uppercase tracking-[0.18em] text-[var(--secondary)]">
                  Snapshot
                </div>
                <div className="mt-3 text-xl font-semibold text-[var(--text)]">
                  {new Date(snapshot.generatedAt).toLocaleString()}
                </div>
                <div className="mt-2 text-sm leading-6 text-[var(--secondary)]">
                  Host: {snapshot.generatedFromHost}
                </div>
                <div className="mt-4 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(0,0,0,0.18)] p-4 text-sm leading-6 text-[var(--secondary)]">
                  {snapshot.northStar.note}
                </div>
              </div>
            </div>

            <div className="relative z-10 mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
              <StatCard
                label="Modules"
                value={snapshot.summary.moduleCount}
                detail="Observed module directories under .aiva"
              />
              <StatCard
                label="Docs Tracked"
                value={snapshot.summary.docsTracked}
                detail="Docs with frontmatter available to the generator"
              />
              <StatCard
                label="Stale Docs"
                value={snapshot.summary.staleDocs}
                detail="Docs older than 30 days by last verified date"
              />
              <StatCard
                label="Dirty Repos"
                value={snapshot.summary.dirtyRepos}
                detail="Repos with modified or untracked files"
              />
              <StatCard
                label="Latest Memory Note"
                value={snapshot.summary.latestMemoryNote}
                detail="Most recently touched note under mikeshaffer memory"
              />
            </div>
          </section>

          <div className="px-6 pb-8 sm:px-8 lg:px-12">
            <Section
              eyebrow="North Star"
              title="Ownership model"
              description="This is the current clean framing of what should own what, so the system can grow without becoming unreadable."
            >
              <div className="grid gap-4 lg:grid-cols-2">
                {snapshot.authorityMap.map((item) => (
                  <div
                    key={item.domain}
                    className="rounded-[1.5rem] border border-[var(--section-border)] bg-[rgba(255,255,255,0.03)] p-6"
                  >
                    <div className="text-[0.72rem] uppercase tracking-[0.18em] text-[var(--primary)]">
                      {item.domain}
                    </div>
                    <div className="mt-3 text-2xl font-semibold text-[var(--text)]">{item.authority}</div>
                    <div className="mt-3 text-sm leading-7 text-[var(--secondary)]">
                      Mirror: {item.mirror}
                    </div>
                    <div className="mt-2 text-sm leading-7 text-[var(--secondary)]">{item.notes}</div>
                  </div>
                ))}
              </div>
            </Section>

            <Section
              eyebrow="Observed Roots"
              title="System roots and attached stores"
              description="These are the major locations the generator knows to inspect right now."
            >
              <div className="grid gap-4 lg:grid-cols-2">
                {snapshot.roots.map((root) => (
                  <div
                    key={root.name}
                    className="rounded-[1.5rem] border border-[var(--section-border)] bg-[rgba(255,255,255,0.03)] p-6"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="text-xl font-semibold text-[var(--text)]">{root.name}</h3>
                      <span className="rounded-full border border-[rgba(255,255,255,0.12)] px-3 py-1 text-xs uppercase tracking-[0.15em] text-[var(--secondary)]">
                        {root.present ? root.kind : "missing"}
                      </span>
                    </div>
                    <div className="mt-3 text-xs uppercase tracking-[0.15em] text-[var(--secondary)]">
                      location label: {root.locationLabel}
                    </div>
                    <p className="mt-3 text-sm leading-7 text-[var(--secondary)]">{root.purpose}</p>
                  </div>
                ))}
              </div>
            </Section>

            <Section
              eyebrow="Repo Health"
              title="Working tree status"
              description="This is the fast answer to what changed and where risk may be hiding."
            >
              <div className="grid gap-4 lg:grid-cols-3">
                {snapshot.repos.map((repo) => (
                  <div
                    key={repo.name}
                    className="rounded-[1.5rem] border border-[var(--section-border)] bg-[rgba(255,255,255,0.03)] p-6"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="text-xl font-semibold text-[var(--text)]">{repo.name}</h3>
                      <span
                        className="rounded-full px-3 py-1 text-xs uppercase tracking-[0.15em]"
                        style={{
                          background: repo.dirty ? "rgba(255,127,80,0.14)" : "rgba(114,255,184,0.12)",
                          color: repo.dirty ? "#ffb18e" : "#9cf2c7",
                        }}
                      >
                        {repo.dirty ? "dirty" : "clean"}
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-7 text-[var(--secondary)]">{repo.role}</p>
                    <dl className="mt-5 space-y-2 text-sm text-[var(--secondary)]">
                      <div className="flex justify-between gap-4">
                        <dt>Branch</dt>
                        <dd className="font-mono text-[var(--text)]">{repo.branch || "n/a"}</dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt>Modified</dt>
                        <dd className="text-[var(--text)]">{repo.modifiedCount}</dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt>Untracked</dt>
                        <dd className="text-[var(--text)]">{repo.untrackedCount}</dd>
                      </div>
                    </dl>
                    <div className="mt-4 border-t border-[var(--section-border)] pt-4 text-sm leading-6 text-[var(--secondary)]">
                      Last observed commit date: {repo.lastCommitDate || "unknown"}
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            <Section
              eyebrow="Archives"
              title="Cold storage and mirrors"
              description="These are the backup and archive surfaces the generator currently checks."
            >
              <div className="grid gap-4 lg:grid-cols-2">
                {snapshot.archives.map((archive) => (
                  <div
                    key={archive.name}
                    className="rounded-[1.5rem] border border-[var(--section-border)] bg-[rgba(255,255,255,0.03)] p-6"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="text-xl font-semibold text-[var(--text)]">{archive.name}</h3>
                      <span className="text-sm text-[var(--secondary)]">{archive.size || "unknown size"}</span>
                    </div>
                    <div className="mt-3 text-xs uppercase tracking-[0.15em] text-[var(--secondary)]">
                      location label: {archive.locationLabel}
                    </div>
                    <p className="mt-3 text-sm leading-7 text-[var(--secondary)]">{archive.role}</p>
                  </div>
                ))}
              </div>
            </Section>

            <Section
              eyebrow="Canonical Inputs"
              title="What this route is reading"
              description="This keeps the page honest. If it is not reading something, it cannot pretend to know it."
            >
              <div className="grid gap-3 md:grid-cols-2">
                {snapshot.sourceFiles.map((source) => (
                  <div
                    key={source.label}
                    className="rounded-[1.2rem] border border-[var(--section-border)] bg-[rgba(255,255,255,0.02)] px-5 py-4"
                  >
                    <div className="text-sm font-semibold text-[var(--text)]">{source.label}</div>
                    <div className="mt-2 text-xs uppercase tracking-[0.15em] text-[var(--secondary)]">
                      location label: {source.locationLabel}
                    </div>
                    <div className="mt-2 text-xs uppercase tracking-[0.15em] text-[var(--secondary)]">
                      {source.present ? "present" : "missing"}
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            <Section
              eyebrow="Recent Memory"
              title="Latest notes and system thinking"
              description="Useful for fast re-entry after time away."
            >
              <div className="grid gap-4">
                {snapshot.recentNotes.map((note) => (
                  <div
                    key={note.name}
                    className="rounded-[1.5rem] border border-[var(--section-border)] bg-[rgba(255,255,255,0.03)] p-6"
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <h3 className="text-lg font-semibold text-[var(--text)]">{note.name}</h3>
                      <div className="text-sm text-[var(--secondary)]">
                        {note.modifiedAt ? new Date(note.modifiedAt).toLocaleString() : "unknown"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            <Section
              eyebrow="Verification"
              title="Most stale docs in the indexed set"
              description="A quick way to spot where your written system model is drifting from reality."
            >
              <div className="overflow-hidden rounded-[1.5rem] border border-[var(--section-border)]">
                <div className="grid grid-cols-[1.3fr_1fr_0.8fr_0.8fr] gap-4 border-b border-[var(--section-border)] bg-[rgba(255,255,255,0.04)] px-5 py-4 text-xs uppercase tracking-[0.16em] text-[var(--secondary)]">
                  <div>Doc</div>
                  <div>Status</div>
                  <div>Verified</div>
                  <div>Confidence</div>
                </div>
                {snapshot.docs.map((doc) => (
                  <div
                    key={doc.title}
                    className="grid grid-cols-[1.3fr_1fr_0.8fr_0.8fr] gap-4 border-b border-[var(--section-border)] px-5 py-4 text-sm last:border-b-0"
                  >
                    <div className="font-semibold text-[var(--text)]">{doc.title}</div>
                    <div className="text-[var(--secondary)]">{doc.status || "unknown"}</div>
                    <div className="text-[var(--secondary)]">
                      {doc.lastVerified || "unknown"}
                      {typeof doc.ageDays === "number" ? `, ${doc.ageDays}d ago` : ""}
                    </div>
                    <div className="text-[var(--secondary)]">{doc.confidence || "unknown"}</div>
                  </div>
                ))}
              </div>
            </Section>

            <section className="border-t border-[var(--section-border)] py-10">
              <div className="flex flex-col gap-4 rounded-[1.5rem] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-[0.72rem] uppercase tracking-[0.18em] text-[var(--primary)]">
                    Next step
                  </div>
                  <div className="mt-2 text-xl font-semibold text-[var(--text)]">
                    Extend the generator, not the wiki.
                  </div>
                  <p className="mt-2 max-w-3xl text-sm leading-7 text-[var(--secondary)]">
                    The right next moves are to add more machine readable sources, call logs, archive retrieval health, and a clearer authority table, not to hand write status by hand.
                  </p>
                </div>
                <Link
                  href="/"
                  className="inline-flex items-center justify-center rounded-full border border-[rgba(255,255,255,0.12)] px-5 py-3 text-sm font-medium text-[var(--text)] transition hover:border-[var(--primary)] hover:text-[var(--primary)]"
                >
                  Back to site
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
