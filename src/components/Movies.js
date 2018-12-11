import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";

class RenderMovies extends Component {
  render() {
    return (
      <section className="movieContainer">
        {
          (!this.props.match.path.endsWith("search") && this.props.movies.length !== 0) ?
            (
              <div className="wrapper formContainer clearfix">
                <div className="sortByCount">
                  <form action="" onChange={this.props.sortMovies}>
                    <label htmlFor="sort" className="visuallyHidden">Sort by highest or lowest movie count</label>
                    <select name="movieLikeCount" id="count">
                      <option value="highestCount" defaultValue={true}>Most Popular</option>
                      <option value="lowestCount">Least Popular</option>
                    </select>
                  </form>
                </div>
                <div className="genreSelector">
                  <form action="" onChange={this.props.handleChange}>
                    <select name="movieGenre" id="genres">
                      <option value="All" defaultValue={true}>All</option>
                      <option value="Action">Action</option>
                      <option value="Adventure">Adventure</option>
                      <option value="Animation">Animation</option>
                      <option value="Comedy">Comedy</option>
                      <option value="Crime">Crime</option>
                      <option value="Documentary">Documentary</option>
                      <option value="Drama">Drama</option>
                      <option value="Family">Family</option>
                      <option value="Fantasy">Fantasy</option>
                      <option value="History">History</option>
                      <option value="Horror">Horror</option>
                      <option value="Music">Music</option>
                      <option value="Mystery">Mystery</option>
                      <option value="Romance">Romance</option>
                      <option value="Science Fiction">Science Fiction</option>
                      <option value="TV Movie">TV Movie</option>
                      <option value="Thriller">Thriller</option>
                      <option value="War">War</option>
                      <option value="Western">Western</option>
                    </select>
                  </form>
                </div>
              </div>
            )
            : null
        }
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
                      <i className="fas fa-star" aria-label="Save movie to favourites." />
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
                          {movie.count} <i className="fas fa-thumbs-up" aria-label="Number of people who liked this movie." />
                        </p>
                      </div>
                      <button onClick={() => this.props.removeMovie(movie)}>
                        <i className="far fa-times-circle" aria-label="Delete this movie from group." />
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
