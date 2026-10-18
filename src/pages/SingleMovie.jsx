// src/pages/SingleMovie.jsx
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Icon } from "@iconify/react";
import Header from "../components/Header";

const API = "https://moviesapi.ir/api/v1/movies";

/* small helper: "1,738,596" → "1.7M" */
function compactNumber(value) {
  const n = Number(String(value ?? "").replace(/,/g, ""));
  if (!Number.isFinite(n) || n === 0) return null;
  if (n >= 1_000_000)
    return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  return String(n);
}

function SingleMovie() {
  const { id } = useParams();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const controller = new AbortController();
    let cancelled = false;

    setLoading(true);
    setError("");

    axios
      .get(`${API}/${id}`, { signal: controller.signal })
      .then((res) => {
        if (!cancelled) setMovie(res.data);
      })
      .catch((err) => {
        if (cancelled || axios.isCancel(err)) return;
        setError(
          err.response?.status === 404
            ? "This movie could not be found."
            : "Something went wrong while loading this movie.",
        );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [id]);

  /* ────────────────────────── loading ────────────────────────── */
  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid animate-pulse gap-8 md:grid-cols-[280px_1fr]">
          <div className="aspect-[2/3] rounded-2xl bg-base-300/70" />
          <div className="space-y-3">
            <div className="h-9 w-3/4 rounded bg-base-300/70" />
            <div className="h-5 w-1/3 rounded bg-base-300/50" />
            <div className="h-4 w-2/3 rounded bg-base-300/40" />
            <div className="mt-6 h-28 rounded bg-base-300/40" />
            <div className="h-4 w-1/2 rounded bg-base-300/40" />
            <div className="h-4 w-2/5 rounded bg-base-300/40" />
          </div>
        </div>
      </div>
    );
  }

  /* ─────────────────────────── error ─────────────────────────── */
  if (error || !movie) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-3 px-4 py-24 text-center">
        <Icon
          icon="mdi:movie-off-outline"
          className="text-6xl text-base-content/30"
        />
        <h1 className="text-xl font-bold">Oops!</h1>
        <p className="text-sm text-base-content/60">
          {error || "Movie not found."}
        </p>
        <Link to="/" className="btn btn-primary btn-sm mt-2 gap-2">
          <Icon icon="mdi:arrow-left" />
          Back to home
        </Link>
      </div>
    );
  }

  /* ────────────────────────── content ────────────────────────── */
  const screenshots = (movie.images ?? []).filter(Boolean);
  const votes = compactNumber(movie.imdb_votes);

  // rows for the "information" table — empty ones get filtered out
  const facts = [
    ["Director", movie.director],
    ["Writer", movie.writer],
    ["Actors", movie.actors],
    ["Country", movie.country],
    ["Released", movie.released],
    ["Runtime", movie.runtime],
    ["Type", movie.type],
    ["Awards", movie.awards],
  ].filter(([, v]) => v);

  return (
    <>
      <Header />
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* back link */}
        <Link
          to="/"
          className="btn btn-ghost btn-sm mb-6 gap-2 text-base-content/70"
        >
          <Icon icon="mdi:arrow-left" />
          Back
        </Link>

        {/* ── hero: poster + summary ───────────────────────────── */}
        <div className="grid gap-8 md:grid-cols-[280px_1fr]">
          {/* poster */}
          <figure className="overflow-hidden rounded-2xl bg-base-200 shadow-xl ring-1 ring-base-300">
            <img
              src={movie.poster}
              alt={`${movie.title} poster`}
              className="aspect-[2/3] w-full object-cover"
            />
          </figure>

          {/* summary */}
          <div className="min-w-0">
            <h1 className="text-2xl font-extrabold leading-tight sm:text-3xl">
              {movie.title}
            </h1>

            {/* year • rated • runtime */}
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-base-content/60">
              {movie.year && <span>{movie.year}</span>}
              {movie.rated && (
                <span className="badge badge-outline badge-sm">
                  {movie.rated}
                </span>
              )}
              {movie.runtime && (
                <span className="inline-flex items-center gap-1">
                  <Icon icon="mdi:clock-outline" />
                  {movie.runtime}
                </span>
              )}
              {movie.type && <span className="capitalize">{movie.type}</span>}
            </div>

            {/* ratings row */}
            <div className="mt-5 flex flex-wrap gap-3">
              {/* IMDb */}
              <a
                href={`https://www.imdb.com/title/${movie.imdb_id}/`}
                target="_blank"
                rel="noreferrer noopener"
                className="group flex items-center gap-3 rounded-xl border border-base-300 bg-base-200/50 px-4 py-2 transition-colors hover:border-primary/50 hover:bg-base-200"
              >
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#f5c518] text-black">
                  <Icon icon="simple-icons:imdb" className="text-xl" />
                </span>
                <span className="flex flex-col leading-tight">
                  <span className="text-xs text-base-content/50">IMDb</span>
                  <span className="text-base font-bold">
                    {movie.imdb_rating}
                    <span className="text-xs font-normal text-base-content/50">
                      {" "}
                      / 10
                    </span>
                  </span>
                </span>
                {votes && (
                  <span className="ml-2 border-l border-base-300 pl-3 text-xs text-base-content/50">
                    {votes} votes
                  </span>
                )}
              </a>

              {/* Metascore */}
              {movie.metascore && (
                <div className="flex items-center gap-3 rounded-xl border border-base-300 bg-base-200/50 px-4 py-2">
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-success/15 text-success">
                    <Icon icon="mdi:chart-box-outline" className="text-xl" />
                  </span>
                  <span className="flex flex-col leading-tight">
                    <span className="text-xs text-base-content/50">
                      Metascore
                    </span>
                    <span className="text-base font-bold">
                      {movie.metascore}
                    </span>
                  </span>
                </div>
              )}
            </div>

            {/* genres */}
            {movie.genres?.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {movie.genres.map((g) => (
                  <span key={g} className="badge badge-primary badge-outline">
                    {g}
                  </span>
                ))}
              </div>
            )}

            {/* plot */}
            {movie.plot && (
              <p className="mt-4 max-w-2xl leading-relaxed text-base-content/80">
                {movie.plot}
              </p>
            )}

            {/* awards callout */}
            {movie.awards && (
              <div className="mt-4 inline-flex items-start gap-2 rounded-xl border border-warning/30 bg-warning/10 px-3 py-2 text-sm text-warning-content/80">
                <Icon
                  icon="mdi:trophy-outline"
                  className="mt-0.5 shrink-0 text-lg text-warning"
                />
                <span>{movie.awards}</span>
              </div>
            )}
          </div>
        </div>

        {/* ── information table ────────────────────────────────── */}
        {facts.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-4 text-lg font-bold">Information</h2>
            <dl className="overflow-hidden rounded-2xl border border-base-300">
              {facts.map(([label, value], i) => (
                <div
                  key={label}
                  className={`grid gap-1 px-4 py-3 sm:grid-cols-[140px_1fr] ${
                    i % 2 === 0 ? "bg-base-200/40" : ""
                  }`}
                >
                  <dt className="text-sm font-semibold text-base-content/50">
                    {label}
                  </dt>
                  <dd className="text-sm text-base-content/80">{value}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {/* ── screenshots ──────────────────────────────────────── */}
        {screenshots.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-4 text-lg font-bold">Screenshots</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {screenshots.map((src, i) => (
                <a
                  key={src}
                  href={src}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="group relative overflow-hidden rounded-xl ring-1 ring-base-300"
                >
                  <img
                    src={src}
                    alt={`${movie.title} screenshot ${i + 1}`}
                    loading="lazy"
                    className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <span className="absolute inset-0 grid place-items-center bg-black/0 opacity-0 transition-all group-hover:bg-black/30 group-hover:opacity-100">
                    <Icon
                      icon="mdi:magnify-plus-outline"
                      className="text-3xl text-white"
                    />
                  </span>
                </a>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}

export default SingleMovie;
