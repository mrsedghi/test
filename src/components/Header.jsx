import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";

const GENRE_ICONS = {
  Crime: "mdi:police-badge-outline",
  Drama: "mdi:drama-masks",
  Action: "mdi:fire",
  Biography: "mdi:book-account-outline",
  History: "mdi:bank-outline",
  Adventure: "mdi:compass-outline",
  Fantasy: "mdi:magic-staff",
  Western: "fa-solid:hat-cowboy",
  Comedy: "mdi:emoticon-happy-outline",
  "Sci-Fi": "mdi:ufo-outline",
  Mystery: "mdi:magnify-scan",
  Thriller: "mdi:knife-military",
  Family: "mdi:account-group-outline",
  War: "mdi:tank",
  Animation: "mdi:palette-outline",
  Romance: "mdi:heart-outline",
  Horror: "mdi:ghost-outline",
  Music: "mdi:music-note-eighth",
  "Film-Noir": "mdi:movie-open-star-outline",
  Musical: "mdi:theater",
  Sport: "mdi:basketball",
};

const getGenreIcon = (name) => GENRE_ICONS[name] || "mdi:movie-roll";

const NAV_LINKS = [
  { label: "Home", href: "#", icon: "mdi:home-outline" },
  { label: "About", href: "#", icon: "mdi:information-outline" },
  { label: "Contact", href: "#", icon: "mdi:email-outline" },
];

/* ------------------------------------------------------------------ */
/*  AJAX live-search box                                              */
/* ------------------------------------------------------------------ */
function SearchBox({
  className = "",
  compact = false,
  inline = false,
  shortcut = false,
}) {
  const [term, setTerm] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  const boxRef = useRef(null);
  const inputRef = useRef(null);

  const trimmed = term.trim();
  const showPanel = open && trimmed.length >= 2;

  /* ---- debounced request (cancels the previous one) ---- */
  useEffect(() => {
    if (trimmed.length < 2) {
      setResult(null);
      setError("");
      setLoading(false);
      return;
    }

    let cancelled = false;
    const controller = new AbortController();
    setLoading(true);

    const timer = setTimeout(() => {
      axios
        .get("https://moviesapi.ir/api/v1/movies", {
          params: { q: trimmed, page: 1 }, // ← was `page={page}` before
          signal: controller.signal,
        })
        .then((res) => {
          if (cancelled) return;
          setResult(res.data);
          setError("");
        })
        .catch((err) => {
          if (cancelled || axios.isCancel(err)) return;
          setError("Could not load results. Please try again.");
          setResult(null);
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    }, 350);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      controller.abort();
    };
  }, [trimmed]);

  /* ---- close on outside click / Escape ---- */
  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        inputRef.current?.blur();
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  /* ---- ⌘K / Ctrl+K focus ---- */
  useEffect(() => {
    if (!shortcut) return;
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [shortcut]);

  const movies = Array.isArray(result) ? result : (result?.data ?? []);
  const total = result?.metadata?.total_count ?? movies.length;

  const panelClass = inline
    ? "relative mt-2 w-full overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-xl"
    : "absolute right-0 top-full z-50 mt-2 w-[22rem] origin-top-right overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-2xl";

  return (
    <div ref={boxRef} className={`relative ${className}`}>
      <label className="input input-sm flex w-full items-center gap-2 rounded-full border-base-300 bg-base-200/60 focus-within:border-primary">
        <Icon icon="mdi:magnify" className="text-base text-base-content/50" />

        <input
          ref={inputRef}
          type="text"
          value={term}
          placeholder="Search movies..."
          className="grow bg-transparent text-sm"
          autoComplete="off"
          onChange={(e) => {
            setTerm(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
        />

        {term ? (
          <button
            type="button"
            aria-label="Clear search"
            className="text-base-content/40 transition-colors hover:text-base-content"
            onClick={() => {
              setTerm("");
              setResult(null);
              inputRef.current?.focus();
            }}
          >
            <Icon icon="mdi:close-circle" className="text-base" />
          </button>
        ) : (
          !compact && <kbd className="kbd kbd-xs hidden lg:inline-flex">⌘K</kbd>
        )}
      </label>

      {showPanel && (
        <div className={panelClass}>
          {/* header */}
          <div className="flex items-center justify-between border-b border-base-300/60 px-4 py-2">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-base-content/50">
              {loading && !result ? "Searching…" : "Results"}
            </span>
            {loading ? (
              <span className="loading loading-spinner loading-xs text-primary" />
            ) : (
              total > 0 && (
                <span className="text-[11px] text-base-content/50">
                  {total} {total === 1 ? "movie" : "movies"}
                </span>
              )
            )}
          </div>

          {/* body */}
          {error ? (
            <div className="flex items-center gap-2 px-4 py-6 text-sm text-error">
              <Icon icon="mdi:alert-circle-outline" className="text-lg" />
              {error}
            </div>
          ) : loading && !result ? (
            <ul className="space-y-2 p-3">
              {[0, 1, 2].map((i) => (
                <li key={i} className="flex animate-pulse items-center gap-3">
                  <div className="h-14 w-10 shrink-0 rounded-md bg-base-300/70" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-3/4 rounded bg-base-300/70" />
                    <div className="h-2.5 w-1/2 rounded bg-base-300/50" />
                  </div>
                </li>
              ))}
            </ul>
          ) : movies.length === 0 ? (
            <div className="flex flex-col items-center gap-1 px-4 py-8 text-center">
              <Icon
                icon="mdi:movie-search-outline"
                className="text-3xl text-base-content/30"
              />
              <p className="text-sm font-medium">No movies found</p>
              <p className="text-xs text-base-content/50">
                Nothing matched “{trimmed}”
              </p>
            </div>
          ) : (
            <ul
              className={`overflow-y-auto p-2 ${
                inline ? "max-h-[45vh]" : "max-h-80"
              }`}
            >
              {movies.map((m) => (
                <li key={m.id}>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setOpen(false);
                    }}
                    className="group flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-base-200"
                  >
                    <img
                      src={m.poster}
                      alt={m.title}
                      loading="lazy"
                      className="h-14 w-10 shrink-0 rounded-md object-cover ring-1 ring-base-300"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold group-hover:text-primary">
                        {m.title}
                      </p>
                      <p className="mt-0.5 flex items-center gap-2 text-xs text-base-content/60">
                        <span>{m.year}</span>
                        <span className="inline-flex items-center gap-0.5 text-warning">
                          <Icon icon="mdi:star" className="text-sm" />
                          {m.imdb_rating}
                        </span>
                      </p>
                      <p className="truncate text-[11px] text-base-content/45">
                        {(m.genres ?? []).join(" · ")}
                      </p>
                    </div>
                    <Icon
                      icon="mdi:chevron-right"
                      className="shrink-0 text-lg text-base-content/30"
                    />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Header                                                            */
/* ------------------------------------------------------------------ */
export default function Header() {
  const URL = "https://moviesapi.ir/api/v1/genres";
  const [genres, setGenres] = useState([]);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeTimer = useRef(null);

  useEffect(() => {
    axios.get(URL).then((res) => setGenres(res.data));
  }, []);

  const list = Array.isArray(genres) ? genres : (genres?.data ?? []);

  const openMega = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMegaOpen(true);
  };
  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setMegaOpen(false), 150);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-base-300/60 bg-base-100/80 backdrop-blur-xl">
      <div className="navbar mx-auto max-w-7xl gap-2 px-4">
        {/* ── Left: mobile toggle + logo ─────────────────────── */}
        <div className="flex flex-1 items-center gap-2">
          <button
            type="button"
            aria-label="Toggle menu"
            className="btn btn-ghost btn-square lg:hidden"
            onClick={() => setMobileOpen((v) => !v)}
          >
            <Icon
              icon={mobileOpen ? "mdi:close" : "mdi:menu"}
              className="text-2xl"
            />
          </button>

          <a href="#" className="group flex items-center gap-2">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-primary to-secondary text-primary-content shadow-md transition-transform group-hover:scale-105">
              <Icon icon="mdi:movie-open" className="text-2xl" />
            </span>
            <span className="hidden flex-col leading-none sm:flex">
              <span className="text-lg font-extrabold tracking-tight">
                Movie
                <span className="text-primary">Collection</span>
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-base-content/50">
                Cinematic picks
              </span>
            </span>
          </a>
        </div>

        {/* ── Center: desktop nav ────────────────────────────── */}
        <nav className="hidden lg:flex">
          <ul className="menu menu-horizontal gap-1 px-1">
            {NAV_LINKS.slice(0, 1).map((l) => (
              <li key={l.label}>
                <a className="gap-2 font-medium">
                  <Icon icon={l.icon} className="text-lg" />
                  {l.label}
                </a>
              </li>
            ))}

            {/* Genres trigger (mega menu) */}
            <li
              onMouseEnter={openMega}
              onMouseLeave={scheduleClose}
              className="relative"
            >
              <button
                type="button"
                onClick={() => setMegaOpen((v) => !v)}
                className={`gap-2 font-medium ${megaOpen ? "active" : ""}`}
              >
                <Icon icon="mdi:shape-outline" className="text-lg" />
                Genres
                <Icon
                  icon={megaOpen ? "mdi:chevron-up" : "mdi:chevron-down"}
                  className="text-base transition-transform"
                />
              </button>
            </li>

            {NAV_LINKS.slice(1).map((l) => (
              <li key={l.label}>
                <a className="gap-2 font-medium">
                  <Icon icon={l.icon} className="text-lg" />
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* ── Right: search + theme + avatar ─────────────────── */}
        <div className="flex flex-1 items-center justify-end gap-2">
          {/* desktop live search */}
          <SearchBox shortcut className="hidden md:block md:w-56 lg:w-64" />

          <label className="swap swap-rotate btn btn-ghost btn-circle">
            <input type="checkbox" className="theme-controller" value="dim" />
            <Icon icon="mdi:weather-sunny" className="swap-off text-2xl" />
            <Icon icon="mdi:weather-night" className="swap-on text-2xl" />
          </label>

          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar online"
            >
              <div className="w-9 rounded-full ring-2 ring-primary/40 ring-offset-1 ring-offset-base-100">
                <img
                  alt="User avatar"
                  src="https://avatars.githubusercontent.com/u/62505869?v=4"
                />
              </div>
            </div>
            <ul
              tabIndex={-1}
              className="menu dropdown-content z-50 mt-3 w-56 rounded-box border border-base-300 bg-base-100 p-2 shadow-xl"
            >
              <li className="menu-title text-xs">
                <span>Signed in as</span>
              </li>
              <li>
                <a className="gap-3">
                  <Icon icon="mdi:account-outline" className="text-lg" />
                  Profile
                  <span className="badge badge-primary badge-sm ml-auto">
                    New
                  </span>
                </a>
              </li>
              <li>
                <a className="gap-3">
                  <Icon icon="mdi:cog-outline" className="text-lg" />
                  Settings
                </a>
              </li>
              <li>
                <a className="gap-3">
                  <Icon icon="mdi:heart-outline" className="text-lg" />
                  Watchlist
                </a>
              </li>
              <li>
                <a className="gap-3 text-error">
                  <Icon icon="mdi:logout" className="text-lg" />
                  Logout
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── Mega menu panel ─────────────────────────────────── */}
      <div
        onMouseEnter={openMega}
        onMouseLeave={scheduleClose}
        className={`absolute inset-x-0 top-full hidden border-b border-base-300/60 bg-base-100/95 shadow-2xl backdrop-blur-xl transition-all duration-200 lg:block ${
          megaOpen
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-2 opacity-0"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="grid gap-8 lg:grid-cols-12">
            {/* Left: intro column */}
            <div className="lg:col-span-4">
              <div className="rounded-2xl bg-gradient-to-br from-primary/10 via-secondary/10 to-transparent p-6">
                <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
                  <Icon icon="mdi:movie-filter-outline" className="text-2xl" />
                </div>
                <h3 className="text-lg font-bold">Browse by genre</h3>
                <p className="mt-1 text-sm text-base-content/60">
                  Pick a mood and we'll serve you the best of the collection —
                  curated across {list.length}+ categories.
                </p>
                <button className="btn btn-primary btn-sm mt-4 gap-2">
                  <Icon icon="mdi:shuffle-variant" />
                  Surprise me
                </button>
              </div>
            </div>

            {/* Right: genre grid */}
            <div className="lg:col-span-8">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-widest text-base-content/50">
                  All genres
                </span>
                <a className="link link-primary text-xs font-medium">
                  View all →
                </a>
              </div>

              <ul className="grid grid-cols-2 gap-1 sm:grid-cols-3 lg:grid-cols-4">
                {list.map((genre) => (
                  <li key={genre.id ?? genre.name}>
                    <a className="group flex items-center gap-3 rounded-xl px-3 py-2 transition-colors hover:bg-base-200">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-base-200 text-base-content/70 transition-colors group-hover:bg-primary/15 group-hover:text-primary">
                        <Icon
                          icon={getGenreIcon(genre.name)}
                          className="text-xl"
                        />
                      </span>
                      <span className="truncate text-sm font-medium">
                        {genre.name}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile menu ─────────────────────────────────────── */}
      <div
        className={`overflow-hidden border-t border-base-300/60 bg-base-100 lg:hidden ${
          mobileOpen ? "max-h-[80vh] overflow-y-auto" : "max-h-0"
        } transition-[max-height] duration-300`}
      >
        <div className="mx-auto max-w-7xl space-y-3 px-4 py-4">
          {/* mobile live search (inline results, so they scroll with the menu) */}
          <SearchBox compact inline />

          <ul className="menu w-full gap-1 rounded-box">
            {NAV_LINKS.map((l) => (
              <li key={l.label}>
                <a className="gap-3 font-medium">
                  <Icon icon={l.icon} className="text-lg" />
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div>
            <div className="px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-widest text-base-content/50">
              Genres
            </div>
            <div className="grid grid-cols-2 gap-1">
              {list.map((g) => (
                <a
                  key={g.id ?? g.name}
                  className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm hover:bg-base-200"
                >
                  <Icon
                    icon={getGenreIcon(g.name)}
                    className="text-lg text-base-content/60"
                  />
                  <span className="truncate">{g.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
