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

// STYLES
import "./App.scss";

// METHODS
import firebase, { auth, provider } from "./firebase";

class App extends Component {
  constructor() {
    super();
    this.state = {
      user: null
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

  // logOutGuest = () => {
  //   this.setState({
  //     user: null
  //   });
  // };

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
                  <Dashboard logOut={this.logOut} userState={this.state.user} />
                )}
              />
              <Route
                path="/group/:group_id/search"
                render={() => <SearchMovies />}
              />
              <Route path="/group/:group_id" render={() => <Group />} />
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
