import React, { Component } from "react";
import { Route, Link, withRouter } from "react-router-dom";

class RenderMovies extends Component {
  render() {
    return (
      <div className="clearfix">
        {this.props.movies.map(movie => {
          return (
            <div key={movie.id} className="movieCard clearfix">
              <div className="imageContainer">
                <Link
                  to={`/group/${this.props.match.params.group_id}/movie/${
                    movie.id
                  }`}
                >
                  <img
                    src={`http://image.tmdb.org/t/p/w300/${movie.poster_path}`}
                    alt={movie.overview}
                  />
                </Link>
                <button
                  value="favourite"
                  onClick={() => this.props.favouriteMovie(movie)}
                >
                  <i className="fas fa-star" />
                </button>
                <button value="watchlist">
                  <i className="fas fa-eye" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}

export default withRouter(RenderMovies);
