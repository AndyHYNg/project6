// REACT COMPONENTS
import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
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
      currGroupMovies: []
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
        user: null
      });
    });
    // return <Redirect to="/" />;
  };

  // RESTRUCTURE CHANGES START HERE

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
      currGroupMovies: movieArray
    });
  };

  render() {
    return (
      <Router>
        {/* Switch manages and renders all Routes exclusively */}
        <Switch>
          {/* If user is logged in... */}
          {this.state.user ? (
            <React.Fragment>
              {/* Automatically redirect to Dashboard render */}
              <Redirect from="/" to="/dashboard" />
              {/* All Routes inside the Switch and is active if user is logged in */}
              {/* <Route
                exact
                path="/"
                render={() => (
                  <Login
                    logIn={this.logIn}
                    logInGuest={this.logInGuest}
                    userState={this.state.user}
                  />
                )}
              /> */}
              <Route
                path="/dashboard"
                render={() => (
                  <Dashboard
                    logOut={this.logOut}
                    userState={this.state.user}
                    joinedGroups={this.state.joinedGroups}
                    getJoinedGroups={this.getJoinedGroups}
                  />
                )}
              />
              <Route
                path="/group/:group_id/search"
                render={() => <SearchMovies />}
              />
              <Route
                exact
                path="/group/:group_id"
                render={() => (
                  <Group
                    getCurrGroup={this.getCurrGroup}
                    currGroup={this.state.currGroup}
                    currGroupMovies={this.state.currGroupMovies}
                    getMovieArray={this.getMovieArray}
                  />
                )}
              />
              <Route
                exact
                path="/group/:group_id/movie/:movie_id"
                render={() => <MovieDetails />}
              />
            </React.Fragment>
          ) : (
            // If user isn't logged in, redirect link back to root and render the Login component
            <React.Fragment>
              <Redirect to="/" />
              <Login
                logIn={this.logIn}
                logInGuest={this.logInGuest}
                userState={this.state.user}
              />
            </React.Fragment>
          )}
        </Switch>
      </Router>
    );
  }
}

export default App;
