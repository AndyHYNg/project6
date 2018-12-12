import React, { Component } from "react";
import axios from "axios";
import { withRouter } from "react-router-dom";
import firebase from "../firebase";
import MovieGenres from "../components/MovieGenres";
import MovieCast from "../components/MovieCast";
import ReactPlayer from "react-player";

// MOVIEDETAILS COMPONENT CONTAINS THE FOLLOWING HELPING FUNCTION:
// favouriteMovie

class MovieDetails extends Component {
  // create a state to hold the response from the API
  constructor() {
    super();
    this.state = {
      movie: {},
      video: {},
      cast: []
    };
  }

  componentDidMount() {
    axios({
      url: `https://api.themoviedb.org/3/movie/${
        this.props.match.params.movie_id
      }`,
      params: {
        api_key: `f012df5d63927931e82fe659a8aaa3ac`,
        language: `en-US`
      }
    }).then(response => {
      const results = response.data;
      // save the API data in state
      this.setState({ movie: results });
    });

    // Axios call to get trailer url
    axios({
      url: `https://api.themoviedb.org/3/movie/${
        this.props.match.params.movie_id
      }/videos`,
      params: {
        api_key: `f012df5d63927931e82fe659a8aaa3ac`,
        language: `en-US`
      }
    }).then(response => {
      // if no URL key exists from this axios call, set to empty string before putting to state
      if (response.data.results[0].key === undefined) {
        const videoResponse = "";
        this.setState({ video: videoResponse });
      } else {
        const videoResponse = response.data.results[0].key;
        this.setState({ video: videoResponse });
      }
    });

    // Axios call to get movie cast
    axios({
      url: `https://api.themoviedb.org/3/movie/${
        this.props.match.params.movie_id
      }/credits`,
      params: {
        api_key: `f012df5d63927931e82fe659a8aaa3ac`
      }
    }).then(response => {
      const castResults = response.data.cast;
      this.setState({ cast: castResults });
    });

    this.populateGroupMoviesDBRef = firebase.database().ref(`userGroups/`);
    this.populateGroupMoviesDBRef.on("value", snapshot => {
      Object.entries(snapshot.val()).map(group => {
        if (group[1].groupID === this.props.match.params.group_id) {
          this.firebaseKey = group[0];
        }
      });
    });
  }

  componentWillUnmount() {
    // turn off all dbRefs called in this component after any sort of re-routing
    if (this.populateGroupMoviesDBRef) {
      this.populateGroupMoviesDBRef.off();
    }
    if (this.specificGroup) {
      this.specificGroup.off();
    }
  }

  favouriteMovie = movieObject => {
    this.specificGroup = firebase
      .database()
      .ref(`userGroups/${this.firebaseKey}/movies`);
    this.specificGroup.push(movieObject);
  };

  render() {
    return (
      <section className="movieDetails">
        <div className="pageHeader">
          <header className="wrapper headerContent">
            <h2>
              <span className="underline">{this.state.movie.title}</span>
            </h2>
            <h3>{this.state.movie.tagline}</h3>
            <button onClick={this.props.history.goBack} className="backButton">
              Go back
            </button>
          </header>
        </div>
        <div className="movieContent">
          <div className="wrapper clearfix movieContentContainer">
            <div className="poster">
              <img
                src={`http://image.tmdb.org/t/p/w500/${
                  this.state.movie.poster_path
                }`}
                alt=""
              />
            </div>
            <div className="additionalInfo">
              <div className="description">
                <h4>
                  <span className="underline">Description</span>
                </h4>
                <p>{this.state.movie.overview}</p>
              </div>

              <div className="cast">
                <h4>
                  <span className="underline">Cast</span>
                </h4>
                <MovieCast cast={this.state.cast} />
              </div>

              <div className="genres">
                <h4>
                  <span className="underline">Genres</span>
                </h4>
                <MovieGenres movie={this.state.movie} />
              </div>
            </div>

            {/* render ReactPlayer component if the movie has a trailer URL */}
            {this.state.video.length === undefined ? null : (
              <div className="trailerContainer">
                <h4>
                  <span className="underline">Trailer</span>
                </h4>
                <div className="trailer">
                  <ReactPlayer
                    className="trailerVideo"
                    width="100%"
                    height="100%"
                    url={`https://www.youtube.com/watch?v=${this.state.video}`}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }
}

export default withRouter(MovieDetails);
