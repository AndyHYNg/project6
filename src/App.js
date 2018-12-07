// REACT COMPONENTS
import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect
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
        this.setState({ user }, () => {
          return <Redirect to="/dashboard" />;
        });
      } else {
        return <Redirect to="/" />;
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
      // setState can take in a second argument that is a callback function after it finished set state
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
        <div className="App">
          <Login
            logIn={this.logIn}
            logInGuest={this.logInGuest}
            userState={this.state.user}
          />
          {this.state.user ? (
            <div>
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
              <nav>
                <Link to="/dashboard">Dashboard</Link>
              </nav>
              {/* <SearchMovies /> */}
            </div>
          ) : null}
        </div>
      </Router>
    );
  }
}

export default App;
