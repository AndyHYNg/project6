import React, { Component } from "react";
import firebase from "../firebase";
import { withRouter } from "react-router-dom";
import axios from "axios";
import RenderMovies from "./Movies";
import swal from "sweetalert";
import { Link } from "react-router-dom";

const scrollToElement = require("scroll-to-element");

class SearchMovies extends Component {
  constructor() {
    super();
    this.state = {
      movies: [],
      searchTerm: "",
      searchParam: ""
    };
  }

  // this is necessary so we can do a check for running count here
  componentDidMount() {
    this.populateGroupMoviesDBRef = firebase.database().ref(`userGroups/`);
    this.populateGroupMoviesDBRef.on("value", snapshot => {
      Object.entries(snapshot.val()).forEach(group => {
        if (group[1].groupID === this.props.match.params.group_id) {
          this.firebaseKey = group[0];
          this.props.getMovieArray(group[1].movies);
        }
      });
    });
    this.setState({
      movies: this.props.searchResultMoviesCollection
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

    if (this.countSpecificMovieDBRef) {
      this.countSpecificMovieDBRef.off();
    }
  }

  // adds the selected movie to the shared group for others to see
  favouriteMovie = movieObject => {
    swal(`Movie saved to your group favourites!`, { icon: "success" });

    let foundDuplicate = false;
    this.specificGroup = firebase
      .database()
      .ref(`userGroups/${this.firebaseKey}/movies`);

    this.props.currGroupMoviesCollection.forEach(movies => {
      for (let movie in movies) {
        if (movie === "id") {
          const idArray = movies[movie];
          if (idArray === movieObject.id) {
            console.log(true);
            this.specificGroup.once("value", snapshot => {
              const movieDB = snapshot.val();
              //movie is the firebase key consisting of that specific movie object in firebase
              for (let movie in movieDB) {
                if (movieObject.id === movieDB[movie].id) {
                  foundDuplicate = true;
                  this.countSpecificMovieDBRef = firebase
                    .database()
                    .ref(
                      `userGroups/${this.firebaseKey}/movies/${movie}/count`
                    );
                  this.countSpecificMovieDBRef.once("value", countSnapshot => {
                    const count = countSnapshot.val();
                    this.countSpecificMovieDBRef.set(count + 1);
                  });
                }
              }
            });
          }
        }
      }
    });

    // if the movie in the group does not exist upon marking as favourite, set the count to 1
    if (foundDuplicate === false) {
      let newMovieObject = movieObject;
      newMovieObject.count = 1;
      this.specificGroup.push(movieObject);
    }
  };

  handleChange = e => {
    this.setState({
      [e.target.id]: e.target.value
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    scrollToElement(".movieCard", {
      offset: -99,
      duration: 700
    });
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
        // filter results that don't have a poster URL and movie genres
        const filteredResults = res.data.results.filter(
          movie => movie.poster_path !== null && movie.genre_ids !== []
        );
        const idArray = filteredResults.map(id => {
          return id;
        });
        return idArray;
      })
      .then(idArray => {
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

  // get the movie id of the assocated movie results via another API endpoint (credits to Ana Maljkovic)
  getMovieId = array => {
    array.forEach(movie => {
      axios
        .get(`https://api.themoviedb.org/3/movie/${movie.id}`, {
          params: {
            api_key: "0613920bcfda4651982add49adcb7163",
            language: "en-US"
          }
        })
        .then(results => {
          const movieIdArray = this.state.movies;
          const thisMovie = results.data;
          movieIdArray.push(thisMovie);
          this.props.getSearchResults(movieIdArray);
          this.setState({
            movies: movieIdArray
          });
        });
    });
  };

  render() {
    return (
      <div>
        <header className="pageHeader">
          <div className="wrapper headerContent">
            <h2>
              <span className="underline">Movies</span>
            </h2>
          </div>
          <Link to={`/group/${this.props.match.params.group_id}`}>
            <button className="backButton">Return to group</button>
          </Link>
        </header>
        <section className="searchBar">
          <div className="wrapper searchContainer">
            <form
              onSubmit={this.handleSubmit}
              action=""
              className="searchForm clearfix"
            >
              <label htmlFor="searchTerm">Search for a Movie!</label>
              <input
                value={this.state.searchTerm}
                onChange={this.handleChange}
                id="searchTerm"
                type="text"
              />
              <input type="submit" value="search" />
            </form>
          </div>
        </section>
        <div className="scrollTop" />
        <RenderMovies
          favouriteMovie={this.favouriteMovie}
          movies={this.state.movies}
        />
      </div>
    );
  }
}

export default withRouter(SearchMovies);
