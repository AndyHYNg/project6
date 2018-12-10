import React, { Component } from "react";
import { Route, Link, withRouter } from "react-router-dom";

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
                  <div className="buttonContainer">
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
                ) : (
                  // otherwise, render the remove movie button
                  <button
                    onClick={() => this.props.removeMovie(movie)}
                    className="removeMovie"
                  >
                    <i className="far fa-times-circle" />
                  </button>
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
