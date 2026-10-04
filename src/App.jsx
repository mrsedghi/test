import axios from "axios";
import { useEffect, useState } from "react";

function App() {
  const [data, setData] = useState();
  const url = "https://moviesapi.ir/api/v1/movies?page={page}";

  useEffect(() => {
    axios.get(url).then((res) => setData(res.data));
  }, []);

  console.log(data);

  return (
    <div className="grid grid-cols-4 gap-4">
      {data &&
        data.data.map((movie) => (
          <div className="card bg-base-100 w-96 shadow-sm">
            <figure>
              <img src={movie.poster} alt="Shoes" className="w-full" />
            </figure>
            <div className="card-body">
              <h2 className="card-title">
                {movie.title}
                <div className="badge badge-warning">{movie.imdb_rating}</div>
                <div className="badge badge-soft badge-accent">
                  {movie.year}
                </div>
              </h2>

              <div className="card-actions justify-start">
                {movie.genres.map((genre) => (
                  <>
                    <div className="badge badge-outline">{genre}</div>
                  </>
                ))}
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}

export default App;
