import React, { Component } from "react";
import axios from "axios";
import { withRouter } from "react-router-dom";
import firebase, { auth, provider } from "../firebase";
import MovieGenres from '../components/MovieGenres';
import MovieCast from '../components/MovieCast';
import ReactPlayer from 'react-player';

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
    // get the information from the API using whatever is in the URL
    // you can go into the React dev tools and see the
    axios({
      url: `https://api.themoviedb.org/3/movie/${
        this.props.match.params.movie_id
        }`,
      params: {
        api_key: `f012df5d63927931e82fe659a8aaa3ac`,
        language: `en-US`,
      }
    }).then(response => {
      const results = response.data;
      // console.log(results);
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
        language: `en-US`,
      }
    }).then(response => {
      const videoResponse = response.data.results[0].key;
      // console.log(videoResponse);
      this.setState({ video: videoResponse });
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
    // this is called when a component leaves the page
    // in our single page app with one component, it will never be called
    // if we were rerouting to a different view, it would be called when the route changed.

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
              <h4><span className="underline">Description</span></h4>
              <p>{this.state.movie.overview}</p>

              <h4><span className="underline">Genres</span></h4>
              <MovieGenres movie={this.state.movie} />

              <h4><span className="underline">Cast</span></h4>
              <MovieCast cast={this.state.cast} />
            </div>

            {(this.state.video.length === undefined) ? (
              <div className="hello">
                <p>nothing to see here</p>
              </div>
            ) : (

                <div className="trailerContainer">
                  <h4><span className="underline">Trailer</span></h4>
                  <div className="trailer">
                    <ReactPlayer className="trailerVideo" url={`https://www.youtube.com/watch?v=${this.state.video}`} />
                  </div>
                </div>
              )
            }




            {/* <div className="trailerContainer">
              <h4><span className="underline">Trailer</span></h4>
              <div className="trailer">
                  <ReactPlayer className="trailerVideo" url={`https://www.youtube.com/watch?v=${this.state.video}`} />
              </div>
            </div> */}
          </div>

          {/* <h4><span className="underline">Rent</span></h4> */}
        </div>
        {/* </div> */}
      </section >
    );
  }
}

export default withRouter(MovieDetails);