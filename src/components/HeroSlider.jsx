// HeroSlider.jsx
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Autoplay,
  EffectFade,
  Keyboard,
  Navigation,
  Pagination,
} from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";

const PlayIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="size-5"
  >
    <path d="M8 5.14v13.72a1 1 0 0 0 1.5.86l11-6.86a1 1 0 0 0 0-1.72l-11-6.86A1 1 0 0 0 8 5.14Z" />
  </svg>
);

const InfoIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    className="size-5"
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5M12 8h.01" strokeLinecap="round" />
  </svg>
);

const ChevronLeft = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className="size-5"
  >
    <path d="m15 18-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChevronRight = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className="size-5"
  >
    <path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function HeroSkeleton() {
  return (
    <div className="relative h-[75vh] min-h-[560px] w-full animate-pulse bg-base-200">
      <div className="mx-auto flex h-full max-w-7xl items-center px-4">
        <div className="w-full max-w-xl space-y-4">
          <div className="h-6 w-40 rounded-full bg-base-300" />
          <div className="h-12 w-3/4 rounded-lg bg-base-300" />
          <div className="h-4 w-full rounded bg-base-300" />
          <div className="h-4 w-5/6 rounded bg-base-300" />
          <div className="flex gap-3 pt-4">
            <div className="h-12 w-36 rounded-xl bg-base-300" />
            <div className="h-12 w-32 rounded-xl bg-base-300" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* --- Creative cinematic background built from the movie poster --- */
function PosterBackdrop({ movie }) {
  const p = movie.poster;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* 1. base: heavily blurred + saturated poster */}
      <img
        src={p}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full scale-110 object-cover blur-2xl saturate-150"
      />

      {/* 2. diagonal poster panel blended into background */}
      <div
        className="absolute -right-20 top-0 hidden h-full w-[55%] md:block"
        style={{ clipPath: "polygon(22% 0, 100% 0, 100% 100%, 0% 100%)" }}
      >
        <img
          src={p}
          alt=""
          aria-hidden="true"
          className="h-full w-full scale-110 object-cover opacity-40 blur-md"
        />
      </div>

      {/* 3. colored mesh glow pulled from the poster */}
      <div className="absolute -left-40 top-1/4 h-[420px] w-[420px] rounded-full bg-primary/30 blur-[120px]" />
      <div className="absolute right-0 bottom-0 h-[380px] w-[380px] rounded-full bg-secondary/25 blur-[120px]" />
      <div className="absolute left-1/3 -top-24 h-[300px] w-[300px] rounded-full bg-accent/20 blur-[100px]" />

      {/* 4. readability gradients (bottom + left) */}
      <div className="absolute inset-0 bg-gradient-to-t from-base-100 via-base-100/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-base-100 via-base-100/70 to-transparent md:via-base-100/40" />

      {/* 5. faint film-strip stripes on the far right */}
      <div
        className="absolute inset-y-0 right-0 hidden w-40 opacity-[0.08] md:block"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent 0 22px, currentColor 22px 24px)",
          color: "var(--fallback-bc,oklch(var(--bc)))",
        }}
      />

      {/* 6. grain texture */}
      <div
        className="absolute inset-0 opacity-[0.06] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* 7. vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 30% 40%, transparent 40%, rgba(0,0,0,0.55) 100%)",
        }}
      />
    </div>
  );
}

/* --- Fanned poster stack for the right column --- */
function PosterStack({ movie, slides }) {
  // take the current + next two posters for the stack
  const others = slides.filter((m) => m.id !== movie.id).slice(0, 2);
  const stack = [movie, ...others];

  return (
    <div className="relative mx-auto h-[420px] w-[280px]">
      {/* halo */}
      <div className="absolute -inset-8 rounded-[2rem] bg-primary/25 blur-3xl" />

      {stack.map((m, i) => {
        const isFront = i === 0;
        return (
          <img
            key={m.id ?? m.title}
            src={m.poster}
            alt={isFront ? `${m.title} poster` : ""}
            aria-hidden={!isFront}
            loading="lazy"
            className={`absolute inset-0 h-full w-full rounded-2xl object-cover ring-1 ring-base-content/10 shadow-2xl transition-all duration-700 ease-out ${
              isFront
                ? "z-30 translate-x-0 translate-y-0 -rotate-2 hover:-rotate-1 hover:scale-[1.03]"
                : i === 1
                  ? "z-20 translate-x-6 translate-y-6 rotate-3 opacity-80"
                  : "z-10 translate-x-12 translate-y-12 rotate-6 opacity-50"
            }`}
          />
        );
      })}

      {/* floating rating chip on the front poster */}
      <div className="absolute -left-3 top-6 z-40 rotate-[-6deg]">
        <div className="badge badge-warning gap-1 border-none font-bold shadow-lg">
          ★ {movie.imdb_rating}
        </div>
      </div>
    </div>
  );
}

export default function HeroSlider({ movies = [], loading = false }) {
  const slides = [...movies]
    .sort((a, b) => Number(b.imdb_rating) - Number(a.imdb_rating))
    .slice(0, 5);

  if (loading) return <HeroSkeleton />;
  if (!slides.length) return null;

  return (
    <section className="relative w-full overflow-hidden bg-base-100">
      <style>{`
        .hero-progress { --swiper-pagination-color: currentColor; }
        .hero-progress.swiper-pagination-progressbar { top: auto; bottom: 0; height: 3px; }
      `}</style>

      <Swiper
        modules={[Autoplay, EffectFade, Keyboard, Navigation, Pagination]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={900}
        loop={slides.length > 1}
        keyboard={{ enabled: true }}
        grabCursor
        autoplay={{
          delay: 5500,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        navigation={{ prevEl: ".hero-prev", nextEl: ".hero-next" }}
        pagination={{ type: "progressbar", el: ".hero-progress" }}
      >
        {slides.map((movie) => {
          const genres = movie.genres ?? [];
          const blurb =
            movie.description ||
            movie.story ||
            `A ${genres.slice(0, 2).join(" / ") || "feature"} film from ${
              movie.year
            } — dive into the story now.`;

          return (
            <SwiperSlide key={movie.id ?? movie.title}>
              <div className="relative min-h-[600px] w-full overflow-hidden md:min-h-[680px]">
                <PosterBackdrop movie={movie} />

                {/* content */}
                <div className="relative z-10 mx-auto flex h-full min-h-[600px] max-w-7xl items-center px-4 py-16 sm:px-6 md:min-h-[680px] lg:px-8">
                  <div className="grid w-full grid-cols-1 items-center gap-10 lg:grid-cols-12">
                    {/* text side */}
                    <div className="lg:col-span-7">
                      <div className="mb-4 flex flex-wrap items-center gap-2">
                        <span className="badge badge-warning gap-1 font-semibold shadow-sm">
                          ★ {movie.imdb_rating}
                        </span>
                        <span className="badge badge-outline">
                          {movie.year}
                        </span>
                        {genres.slice(0, 2).map((g) => (
                          <span key={g} className="badge badge-ghost">
                            {g}
                          </span>
                        ))}
                      </div>

                      <h1 className="text-4xl font-extrabold leading-tight tracking-tight drop-shadow-sm sm:text-5xl lg:text-6xl">
                        {movie.title}
                      </h1>

                      <p className="mt-5 max-w-2xl text-base leading-relaxed text-base-content/70 line-clamp-3 sm:text-lg">
                        {blurb}
                      </p>

                      <div className="mt-8 flex flex-wrap items-center gap-3">
                        <button className="btn btn-primary btn-lg gap-2 shadow-lg shadow-primary/25 transition-transform hover:scale-[1.03]">
                          <PlayIcon />
                          Watch Now
                        </button>
                        <button className="btn btn-outline btn-lg gap-2 backdrop-blur-sm transition-transform hover:scale-[1.03]">
                          <InfoIcon />
                          More Info
                        </button>
                      </div>

                      <div className="mt-8 flex items-center gap-3 text-sm text-base-content/50">
                        <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-error" />
                        Streaming in HD
                      </div>
                    </div>

                    {/* poster stack */}
                    <div className="hidden lg:col-span-5 lg:block">
                      <PosterStack movie={movie} slides={slides} />
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* navigation controls */}
      <div className="pointer-events-none absolute inset-x-0 bottom-8 z-20 hidden md:block">
        <div className="mx-auto flex max-w-7xl justify-end gap-2 px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            aria-label="Previous slide"
            className="hero-prev btn btn-circle btn-sm pointer-events-auto border-base-content/10 bg-base-100/70 backdrop-blur hover:bg-base-100"
          >
            <ChevronLeft />
          </button>
          <button
            type="button"
            aria-label="Next slide"
            className="hero-next btn btn-circle btn-sm pointer-events-auto border-base-content/10 bg-base-100/70 backdrop-blur hover:bg-base-100"
          >
            <ChevronRight />
          </button>
        </div>
      </div>

      {/* autoplay progress bar */}
      <div className="hero-progress absolute bottom-0 left-0 z-20 h-[3px] w-full text-primary !bg-base-content/15" />
    </section>
  );
}
