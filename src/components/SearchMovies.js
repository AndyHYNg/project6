import React, { Component } from "react";
import firebase, { auth, provider } from "../firebase";
import { Route, Link, withRouter } from "react-router-dom";
import axios from "axios";
import RenderMovies from "./Movies";

class SearchMovies extends Component {
  constructor() {
    super();
    this.state = {
      movies: [],
      searchTerm: "",
      searchParam: ""
      // genreId: []
    };
  }

  // this is necessary so we can do a check for running count here
  componentDidMount() {
    this.populateGroupMoviesDBRef = firebase.database().ref(`userGroups/`);
    this.populateGroupMoviesDBRef.on("value", snapshot => {
      console.log(this.props.match.params.group_id);
      Object.entries(snapshot.val()).map(group => {
        if (group[1].groupID === this.props.match.params.group_id) {
          this.firebaseKey = group[0];
          // this.props.getCurrGroup(group[1]);
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

  // this handle click manages firebase db event listeners
  // handleClick = e => {
  //   // console.log(e.target.value);
  //   if (e.target.value === "favourite") {

  //   }
  // };

  favouriteMovie = movieObject => {
    this.specificGroup = firebase
      .database()
      .ref(`userGroups/${this.firebaseKey}/movies`);
    this.specificGroup.push(movieObject);
  };

  handleChange = e => {
    this.setState({
      [e.target.id]: e.target.value
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    // console.log('handleSubmit');
    // clears the search term and THEN use a callback function to get the movies from the API
    this.setState(
      {
        searchParam: this.state.searchTerm,
        searchTerm: "",
        movies: []
      },
      () => {
        this.getMovies(e);
      }
    );
  };

  getMovies = () => {
    axios
      .get("https://api.themoviedb.org/3/search/movie", {
        params: {
          api_key: "0613920bcfda4651982add49adcb7163",
          language: "en-US",
          sort_by: "popularity.desc",
          query: this.state.searchParam
        }
      })
      .then(res => {
        const filteredResults = res.data.results.filter(
          movie => movie.poster_path !== null && movie.genre_ids !== []
        );

        const idArray = filteredResults.map(id => {
          return id;
        });

        // this.setState({
        //     movies: filteredResults
        // })
        // console.log(filteredResults);
        return idArray;
        // this.getMovieId(filteredResults);
        // console.log(filteredResults);
        // const filteredMovieIds = this.getMovieId(filteredResults);
        // console.log(filteredMovieIds);

        // this.setState(
        //     {
        //         movies: filteredMovieIds
        //     }
        // );
        // console.log(filteredResults);
      })
      .then(idArray => {
        console.log(idArray);
        this.getMovieId(idArray);
      });
  };

  movieIdCall = id => {
    return axios.get(`https://api.themoviedb.org/3/movie/${id}`, {
      params: {
        api_key: "0613920bcfda4651982add49adcb7163",
        language: "en-US"
      }
    });
  };

  getMovieId = array => {
    // Working version (not great)
    array.forEach(movie => {
      axios
        .get(`https://api.themoviedb.org/3/movie/${movie.id}`, {
          params: {
            api_key: "0613920bcfda4651982add49adcb7163",
            language: "en-US"
          }
        })
        .then(results => {
          // console.log(results.data);
          // console.log(results.data);
          const movieIdArray = this.state.movies;
          const thisMovie = results.data;
          movieIdArray.push(thisMovie);
          this.setState({
            movies: movieIdArray
          });
          console.log(this.state.movies);
          // console.log(movieIdArray);
          // return results.data;
        });
    });
    console.log(this.state.movies);
    // this.setState({
    //     movies: movieIdArray
    // })
    console.log(this.state.movies);
    // return movieIdArray;
    console.log(this.state.movies);
  };

  render() {
    return (
      <div>
        <h1>Movies</h1>
        <form onSubmit={this.handleSubmit} action="">
          <label htmlFor="searchTerm">Search for a Movie!</label>
          <input
            value={this.state.searchTerm}
            onChange={this.handleChange}
            id="searchTerm"
            type="text"
          />
          <input type="submit" />
        </form>
        <RenderMovies
          // handleClick={this.handleClick}
          favouriteMovie={this.favouriteMovie}
          movies={this.state.movies}
        />
      </div>
    );
  }
}

export default withRouter(SearchMovies);

// getGenre = () => {
//     axios
//         .get("https://api.themoviedb.org/3/genre/movie/list", {
//             params: {
//                 api_key: "0613920bcfda4651982add49adcb7163",
//                 language: "en-US"
//             }
//         })
//         .then(res => {
//             // console.log(res);
//             const genreId = res.data.genres;
//             // console.log(res.data.genres);
//             this.setState({
//                 genreId
//             });
//             // go through each movie and assign it to the variable currentMovie
//             this.state.movies.forEach(movie => {
//                 const currentMovie = movie;

//                 // go through the genre array in each movie and assign it to the variable currentGenre
//                 movie.genre_ids.forEach(genre => {
//                     // console.log(genre);
//                     const currentGenre = genre;
//                     // console.log(currentGenre);

//                     // go through the list of genres from the axios call and check if the id matches the id of the currentGenre
//                     this.state.genreId.forEach(genre => {
//                         if (genre.id === currentGenre) {
//                             // console.log(currentMovie.genre_ids.indexOf(currentGenre));

//                             // go back to the currentMovie object and get the indexOf the matching currentGenre of the list of genres
//                             const indexOfGenre = currentMovie.genre_ids.indexOf(
//                                 currentGenre
//                             );
//                             //reassign the genre_id number to its matching genre name
//                             currentMovie.genre_ids[indexOfGenre] = genre.name;
//                             // console.log(currentMovie);
//                             // return currentMovie.genre_ids.indexOf(currentGenre);
//                         }
//                     });
//                 });
//             });
//         });
// };
