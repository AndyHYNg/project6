import React from "react";

const RenderMovies = props => {
  return (
    <div className="clearfix">
      {props.movies.map(movie => {
        // console.log(movie);
        return (
          <div key={movie.id} className="movieCard clearfix">
            <div className="imageContainer">
              <img
                src={`http://image.tmdb.org/t/p/w300/${movie.poster_path}`}
                alt={movie.overview}
              />
            </div>
            <h2>{movie.title}</h2>
            <p>{movie.release_date}</p>
            <div>
              <button>
                <i class="fas fa-star" />
              </button>
              <button>
                <i class="fas fa-eye" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RenderMovies;
