import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";

class RenderMovies extends Component {
  render() {
    return (
      <section className="movieContainer">
        <div className="wrapper clearfix">
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
                      src={`http://image.tmdb.org/t/p/w500/${
                        movie.poster_path
                        }`}
                      alt={movie.overview}
                    />
                  </Link>
                </div>
                {this.props.match.path.endsWith("search") ? (
                  // if the url path ends with "search", render the favourite/watchlist buttons
                  <div className="favButtonContainer">
                    <button
                      value="favourite"
                      onClick={() => this.props.favouriteMovie(movie)}
                      className="buttonFavourite"
                    >
                      <i className="fas fa-star" />
                    </button>
                  </div>
                ) : (
                    // otherwise, render the remove movie button
                    <div className="buttonContainer">
                      {/* <button
                      value="favourite"
                      onClick={() => this.props.favouriteMovie(movie)}
                    >
                      <i className="fas fa-star" />
                    </button> */}
                      <div className="runningCountContainer">
                        <p>
                          {movie.count} <i className="fas fa-thumbs-up" />
                        </p>
                      </div>
                      <button onClick={() => this.props.removeMovie(movie)}>
                        <i className="far fa-times-circle" />
                      </button>
                    </div>
                  )}
              </div>
            );
          })}
        </div>
      </section>
    );
  }
}

export default withRouter(RenderMovies);
