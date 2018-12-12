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
import swal from "sweetalert";

const chance = require("chance").Chance();

class App extends Component {
  constructor() {
    super();
    this.state = {
      user: null,
      guestName: null,
      joinedGroups: {},
      currGroup: {},
      currGroupMovies: [],
      currGroupMoviesCollection: [],
      currGroupFilteredMovies: [],
      searchResultMoviesCollection: [],
      groupFirebaseKey: ""
    };
  }

  componentDidMount = () => {
    auth.onAuthStateChanged(user => {
      if (user) {
        this.setState({ searchResultMoviesCollection: [] });
        if (!user.isAnonymous) {
          this.setState({ user });
          // Because of conflicting firebase Db issues on AuthState for guest users, guests will not have persist login to deliver a better user experience
          // if (user.isAnonymous) {
          //   this.setState({ guestName: "Wild " + chance.animal() });
          // }
        }
      }
    });
  };

  logInGuest = () => {
    auth.signInAnonymously().then(result => {
      this.setState({
        user: result.user,
        guestName: "Wild " + chance.animal()
      });
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

  getSearchResults = searchResultsArray => {
    this.setState({
      searchResultMoviesCollection: searchResultsArray
    });
  };

  updateMovieArray = moviesObjectArray => {
    this.setState({
      currGroupMovies: moviesObjectArray,
      currGroupMoviesCollection: moviesObjectArray
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
    // this is the firebaseKey pointing the group object in the user's node in firebase
    const currentUserGroupID = groupObject[0];

    this.groupDbUserCount = [];

    // open up the group node consisting ALL of the user groups in firebase
    this.specificGroup = firebase.database().ref(`userGroups/`);
    this.specificGroup.once("value", snapshot => {
      const groupsDB = snapshot.val();

      // check each group obtained in the snapshot
      for (let group in groupsDB) {
        // finding the group matching the groupID
        if (groupObject[1].groupID === groupsDB[group].groupID) {
          // open up the specific group node in user groups pointing to the correct group
          this.removeSpecificGroupDBRef = firebase
            .database()
            .ref(`userGroups/${group}`);
          this.removeSpecificGroupDBRef.once("value", groupSnapshot => {
            this.groupDbUserCount = Object.keys(
              groupSnapshot.val().users || {}
            );

            // if you are the only one in the group, completely delete the group node (kill it with fire)
            if (
              this.groupDbUserCount.length === 0 ||
              this.state.user.isAnonymous
            ) {
              this.removeSpecificGroupDBRef.remove();
            }
          });

          // remove the specific user from the userGroup's group db (for logged in users only)

          if (!this.state.user.isAnonymous) {
            // find the user in the userGroup's group db (get firebase key pointing to the user in the usergroup's group)
            const uidUserObjectArray =
              Object.entries(groupsDB[group].users).filter(user => {
                return this.state.user.uid === Object.keys(user[1])[0];
              }) || [];

            // remove user from the userGroup's group db
            // to test remove group

            this.removeUserFromGroupDBRef = firebase
              .database()
              .ref(`userGroups/${group}/users/${uidUserObjectArray[0][0]}`);
            this.removeUserFromGroupDBRef.remove();

            // remove this joined group from the user node's joined groups info
            // only do this for non-guest users
            this.removeSpecificUserGroupDBRef = firebase
              .database()
              .ref(`uid/${this.state.user.uid}/groups/${currentUserGroupID}`);
            this.removeSpecificUserGroupDBRef.remove();
          }

          this.populateGroupDBRef = firebase
            .database()
            .ref(`uid/${this.state.user.uid}/groups`);
          this.populateGroupDBRef.on("value", snapshot => {
            this.getJoinedGroups(snapshot.val());
          });
        }

        // // if user logged in and is not a guest
        // if (this.state.user && !this.state.user.isAnonymous) {
        //   this.populateGroupDBRef = firebase
        //     .database()
        //     .ref(`uid/${this.state.user.uid}/groups`);
        //   this.populateGroupDBRef.once("value", snapshot => {
        //     this.getJoinedGroups(snapshot.val());
        //   });
        // }
        // // if user logged is a guest
        // else if (this.state.user.isAnonymous) {
        //   // because each guest has a uid on each login, we grab all the group DB refs and build a new Object containing all guest DBs from the snapshot to parse it through this.props.getJoinedGroups
        //   this.rawGroupDBRef = firebase.database().ref(`userGroups`);
        //   this.rawGroupDBRef.once("value", rawSnapshot => {
        //     const rawGroupDB = rawSnapshot.val();
        //     const newGuestGroupDBRef = Object.entries(rawGroupDB)
        //       .filter(groupDB => {
        //         return groupDB[1].isGuestRoom;
        //       })
        //       .reduce((newObj, firebaseKey) => {
        //         newObj[firebaseKey[0]] = rawGroupDB[firebaseKey[0]];
        //         return newObj;
        //       }, {});
        //     this.getJoinedGroups(newGuestGroupDBRef);
        //   });
        // }
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
    swal(`Movie removed from your group favourites!`, { icon: "success" });
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
            this.groupDBMovies.off();
          }
        }
      }
    });
    this.groupDBMovies.once("value", snapshot => {
      this.getMovieArray(snapshot.val());
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
                  guestName={this.state.guestName}
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
                  searchResultMoviesCollection={
                    this.state.searchResultMoviesCollection
                  }
                  getSearchResults={this.getSearchResults}
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
                  updateMovieArray={this.updateMovieArray}
                  userState={this.state.user}
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
