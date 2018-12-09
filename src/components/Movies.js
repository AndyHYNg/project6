import React, { Component } from "react";
import { Route, Link, withRouter } from "react-router-dom";

class RenderMovies extends Component {
  render() {
    return (
      // SF SAT updated div to section
      <section className="movieContainer">
        {/* SF SAT added wrapper class and moved clearfix here */}
        <div className="wrapper clearfix">
          {this.props.movies.map(movie => {
            // console.log(movie);
            return (
              <div key={movie.id} className="movieCard clearfix">
                <div className="imageContainer">
                  <Link
                    to={`/group/${this.props.match.params.group_id}/movie/${
                      movie.id
                      }`}
                  >
                    <img
                      src={`http://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                      alt={movie.overview}
                    />
                  </Link>
                </div>
                {/* SF SAT put buttons in a container */}
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
              </div>
            );
          })}
        </div>
      </section>
    );
  }
}

export default withRouter(RenderMovies);
