import { Sparkles, Search } from "lucide-react";

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#2A0A12] via-[#1A0A0B] to-paper px-5 py-20">
        <div className="mx-auto max-w-6xl">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-stub/80 px-4 py-1.5 text-sm text-ink2">
            <Sparkles size={14} className="text-flame" />
            Your cinema, organised.
          </span>

          <h1 className="font-display max-w-2xl text-5xl font-extrabold leading-[1.05] tracking-tight text-ink sm:text-6xl">
            Every story
            <br />
            worth <span className="text-flame">watching.</span>
          </h1>

          <p className="mt-5 max-w-xl text-base text-ink2">
            Search thousands of films, build your personal watchlist, and rate
            every movie you've experienced — all in one beautifully simple place.
          </p>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="mt-8 flex max-w-xl items-center gap-2 rounded-full border border-line bg-stub/80 p-1.5 pl-4"
          >
            <Search size={18} className="text-ink2" />
            <input
              type="text"
              placeholder="Search for Interstellar, Leo, Dune…"
              className="focus-ring flex-1 bg-transparent py-2 text-sm text-ink placeholder:text-ink2/70"
            />
            <button
              type="submit"
              className="bg-flame focus-ring rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      {/*
        MEMBER 2 SCOPE: "Trending Now" section, genre filter pills, and
        movie result cards render below this line. Match the dark-card +
        bg-flame "Add to Watchlist" button style established above so the
        page reads as one cohesive design.
      */}
      <section className="mx-auto max-w-6xl px-5 py-12">
        <div className="rounded-2xl border border-dashed border-line bg-stub/40 px-6 py-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-ink2">
            Trending Now — genre filters + movie cards go here
          </p>
          <p className="mt-1 text-sm text-ink2/70">
            (Member 2 — Movie Search &amp; Watchlist UI)
          </p>
        </div>
      </section>
    </div>
  );
}
