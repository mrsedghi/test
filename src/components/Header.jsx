import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";

const GENRE_ICONS = {
  // 1
  Crime: "mdi:police-badge-outline",
  // 2
  Drama: "mdi:drama-masks",
  // 3
  Action: "mdi:fire",
  // 4
  Biography: "mdi:book-account-outline",
  // 5
  History: "mdi:bank-outline",
  // 6
  Adventure: "mdi:compass-outline",
  // 7
  Fantasy: "mdi:magic-staff",
  // 8
  Western: "fa-solid:hat-cowboy",
  // 9
  Comedy: "mdi:emoticon-happy-outline",
  // 10
  "Sci-Fi": "mdi:ufo-outline",
  // 11
  Mystery: "mdi:magnify-scan",
  // 12
  Thriller: "mdi:knife-military",
  // 13
  Family: "mdi:account-group-outline",
  // 14
  War: "mdi:tank",
  // 15
  Animation: "mdi:palette-outline",
  // 16
  Romance: "mdi:heart-outline",
  // 17
  Horror: "mdi:ghost-outline",
  // 18
  Music: "mdi:music-note-eighth",
  // 19
  "Film-Noir": "mdi:movie-open-star-outline",
  // 20
  Musical: "mdi:theater",
  // 21
  Sport: "mdi:basketball",
};

const getGenreIcon = (name) => GENRE_ICONS[name] || "mdi:movie-roll";
const NAV_LINKS = [
  { label: "Home", href: "#", icon: "mdi:home-outline" },
  { label: "About", href: "#", icon: "mdi:information-outline" },
  { label: "Contact", href: "#", icon: "mdi:email-outline" },
];

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
          <label className="input input-sm hidden items-center gap-2 rounded-full border-base-300 bg-base-200/60 focus-within:border-primary md:flex md:w-56 lg:w-64">
            <Icon
              icon="mdi:magnify"
              className="text-base text-base-content/50"
            />
            <input
              type="text"
              placeholder="Search movies..."
              className="grow bg-transparent text-sm"
            />
            <kbd className="kbd kbd-xs hidden lg:inline-flex">⌘K</kbd>
          </label>

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
          <label className="input input-bordered flex items-center gap-2 rounded-full">
            <Icon icon="mdi:magnify" className="text-base-content/50" />
            <input
              type="text"
              placeholder="Search movies..."
              className="grow bg-transparent text-sm"
            />
          </label>

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
