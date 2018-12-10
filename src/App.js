// REACT COMPONENTS
import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from "react-router-dom";

// COMPONENTS
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import SearchMovies from "./components/SearchMovies";
import Group from "./components/Group";
import MovieDetails from "./components/MovieDetails";

// STYLES
import "./App.scss";

// METHODS
import firebase, { auth, provider } from "./firebase";

class App extends Component {
  constructor() {
    super();
    this.state = {
      user: null,
      joinedGroups: {},
      currGroup: {},
      currGroupMovies: [],
      currGroupMoviesCollection: [],
      currGroupFilteredMovies: [],
      groupFirebaseKey: ""
    };
  }

  componentDidMount = () => {
    auth.onAuthStateChanged(user => {
      if (user) {
        this.setState({ user });
      }
    });
  };

  logInGuest = () => {
    this.setState({
      user: "guest"
    });
  };

  logIn = () => {
    auth.signInWithPopup(provider).then(result => {
      this.setState({
        user: result.user
      });
    });
  };

  logOut = () => {
    auth.signOut().then(() => {
      this.setState({
        user: null,
        joinedGroups: {},
        currGroup: {},
        currGroupMovies: []
      });
    });
  };

  getGroupFirebaseKey = firebaseKey => {
    this.setState({
      groupFirebaseKey: firebaseKey
    });
  };

  getJoinedGroups = dbRefSnapshotValue => {
    this.setState({
      joinedGroups: dbRefSnapshotValue || {}
    });
  };

  getCurrGroup = group => {
    this.setState({
      currGroup: group
    });
  };

  getMovieArray = currGroupMoviesFromDB => {
    const movieArray = Object.entries(currGroupMoviesFromDB || {}).map(
      movie => {
        return movie[1];
      }
    );
    this.setState({
      currGroupMovies: movieArray,
      currGroupMoviesCollection: movieArray
    });
  };

  removeGroup = groupObject => {
    const currentUserGroupID = groupObject[0];
    console.log(currentUserGroupID);
    this.specificGroup = firebase.database().ref(`userGroups/`);
    this.specificGroup.once("value", snapshot => {
      console.log(snapshot.val());
      const groupsDB = snapshot.val();
      // console.log("movieDB", movieDB);
      //movie is the firebase key consisting of that specific movie object in firebase
      for (let group in groupsDB) {
        console.log(group);
        if (groupObject[1].groupID === groupsDB[group].groupID) {
          console.log("you found me!", group);
          this.removeSpecificGroupDBRef = firebase
            .database()
            .ref(`userGroups/${group}`);
          this.removeSpecificGroupDBRef.remove();
          this.removeSpecificUserGroupDBRef = firebase
            .database()
            .ref(`uid/${this.state.user.uid}/groups/${currentUserGroupID}`);
          this.removeSpecificUserGroupDBRef.remove();
          this.populateGroupDBRef = firebase
            .database()
            .ref(`uid/${this.state.user.uid}/groups`);
          this.populateGroupDBRef.on("value", snapshot => {
            this.getJoinedGroups(snapshot.val());
          });
        }
      }
    });
  };

  // genre filter view method (used in Group component)
  handleChange = e => {
    // if "All" is selected, set current movies to view to be all the movies added in that group
    if (e.target.value === "All") {
      this.setState({
        currGroupMovies: this.state.currGroupMoviesCollection
      });
    }
    // otherwise, check all the movies added in that group and populate a new array that matches the selected genre
    else {
      let matchedGenresMovieArray = [];
      this.state.currGroupMoviesCollection.forEach(movies => {
        // movies is an object with key-value pairs of properties about the movie
        for (let movie in movies) {
          // if the property is genre...
          if (movie === "genres") {
            const genreArray = movies[movie];
            // because a movie has multiple genres, check if any of the genre matches the selected genre, if so, append to the new array results
            genreArray.forEach(genre => {
              if (genre.name === e.target.value) {
                matchedGenresMovieArray.push(movies);
              }
            });
          }
        }
      });
      // set the current movies of that group to be displayed to the new array results
      this.setState({
        currGroupMovies: matchedGenresMovieArray
      });
    }
  };

  // remove movie method
  removeMovie = movieObject => {
    // open current group's movies from firebase db
    this.groupDBMovies = firebase
      .database()
      .ref(`userGroups/${this.state.groupFirebaseKey}/movies`);
    // check current group's movies from App's state
    this.state.currGroupMoviesCollection.forEach(movies => {
      for (let movie in movies) {
        // if the property of the movie matches "id"...
        if (movie === "id") {
          const idArray = movies[movie];
          // if the id of the selected movie to be removed is the same as the movie in the App's movie collection state...
          if (idArray === movieObject.id) {
            // get the snapshot of the group movie's db once and search through all the movies in the firebase db...
            this.groupDBMovies.once("value", snapshot => {
              const movieDB = snapshot.val();
              // movie is the firebase key consisting of that specific movie object in firebase
              for (let movieNode in movieDB) {
                // if movie id matches, remove the firebase entry of that movie node
                if (movieObject.id === movieDB[movieNode].id) {
                  this.removeSpecificMovieDBRef = firebase
                    .database()
                    .ref(
                      `userGroups/${
                        this.state.groupFirebaseKey
                      }/movies/${movieNode}`
                    );
                  this.removeSpecificMovieDBRef.remove();
                }
              }
            });
          }
        }
      }
    });
  };

  render() {
    return (
      <Router>
        {/* Switch manages and renders all Routes exclusively */}
        <Switch>
          <Route
            exact
            path="/"
            render={() =>
              this.state.user ? (
                <Redirect to="/dashboard" />
              ) : (
                <Login
                  logIn={this.logIn}
                  logInGuest={this.logInGuest}
                  userState={this.state.user}
                />
              )
            }
          />

          <Route
            path="/dashboard"
            render={() =>
              this.state.user ? (
                <Dashboard
                  logOut={this.logOut}
                  userState={this.state.user}
                  joinedGroups={this.state.joinedGroups}
                  getJoinedGroups={this.getJoinedGroups}
                  removeGroup={this.removeGroup}
                />
              ) : (
                <Redirect to="/" />
              )
            }
          />

          <Route
            path="/group/:group_id/search"
            render={() =>
              this.state.user ? (
                <SearchMovies
                  getCurrGroup={this.getCurrGroup}
                  getMovieArray={this.getMovieArray}
                  currGroupMoviesCollection={
                    this.state.currGroupMoviesCollection
                  }
                />
              ) : (
                <Redirect to="/" />
              )
            }
          />

          <Route
            exact
            path="/group/:group_id"
            render={() =>
              this.state.user ? (
                <Group
                  getCurrGroup={this.getCurrGroup}
                  currGroup={this.state.currGroup}
                  currGroupMovies={this.state.currGroupMovies}
                  getMovieArray={this.getMovieArray}
                  handleChange={this.handleChange}
                  removeMovie={this.removeMovie}
                  getGroupFirebaseKey={this.getGroupFirebaseKey}
                />
              ) : (
                <Redirect to="/" />
              )
            }
          />
          <Route
            exact
            path="/group/:group_id/movie/:movie_id"
            render={() =>
              this.state.user ? (
                <MovieDetails currGroupMovies={this.state.currGroupMovies} />
              ) : (
                <Redirect to="/" />
              )
            }
          />
        </Switch>
      </Router>
    );
  }
}

export default App;
