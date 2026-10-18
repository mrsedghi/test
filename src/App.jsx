import axios from "axios";
import { useEffect, useState } from "react";
import Header from "./components/Header";
import HeroSlider from "./components/HeroSlider";
import Pagination from "./components/Pagination";
import { useNavigate } from "react-router-dom";

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  let navigate = useNavigate();

  const [page, setPage] = useState(1);

  let url = `https://moviesapi.ir/api/v1/movies?page=${page}`;

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    axios
      .get(url)
      .then((res) => {
        if (!cancelled) {
          setData(res.data);
          setError(null);
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [url]);

  const movies = data?.data ?? [];

  return (
    <>
      <Header />

      {/* pass movies + loading down */}
      <HeroSlider movies={movies} loading={loading} />

      <div className="container mx-auto px-4 mt-8 pb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Movies</h2>
          <span className="badge badge-ghost">
            {loading ? "..." : `${movies.length} results`}
          </span>
        </div>

        {error && (
          <div className="alert alert-error mb-6">
            <span>Failed to load movies. Please try again.</span>
          </div>
        )}

        {loading ? (
          /* grid skeleton */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="card bg-base-100 shadow-sm overflow-hidden animate-pulse"
              >
                <div className="aspect-[2/3] w-full bg-base-300" />
                <div className="card-body p-3 gap-2">
                  <div className="h-4 w-3/4 rounded bg-base-300" />
                  <div className="h-3 w-1/3 rounded bg-base-300" />
                </div>
              </div>
            ))}
          </div>
        ) : movies.length ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {movies.map((movie) => (
              <div
                key={movie.id ?? movie.title}
                className="card bg-base-100 shadow-sm overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                onClick={() => navigate(`/movie/${movie.id}`)}
              >
                <figure className="relative aspect-[2/3] overflow-hidden bg-base-300">
                  <img
                    src={movie.poster}
                    alt={`${movie.title} poster`}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="badge badge-warning badge-sm absolute top-2 right-2 gap-1 font-semibold shadow-md">
                    ★ {movie.imdb_rating}
                  </div>
                </figure>

                <div className="card-body p-3 gap-2">
                  <h2 className="card-title block text-sm sm:text-base leading-snug">
                    <span className="line-clamp-2" title={movie.title}>
                      {movie.title}
                    </span>
                  </h2>

                  <div className="badge badge-soft badge-accent badge-sm">
                    {movie.year}
                  </div>

                  <div className="card-actions justify-start gap-1 mt-auto">
                    {(movie.genres ?? []).slice(0, 3).map((genre) => (
                      <div
                        key={genre}
                        className="badge badge-outline badge-xs sm:badge-sm"
                      >
                        {genre}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 opacity-60">
            <p className="text-lg">No movies found 🎬</p>
          </div>
        )}
      </div>

      <Pagination
        page={page}
        total={25}
        loading={loading}
        onChange={(next) => {
          setPage(next);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />
    </>
  );
}

export default App;
