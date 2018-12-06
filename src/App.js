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
          // create reference specific to user
          // this.dbRef creates the ref in the the constructor state (allowable since it still resides in setState)
          this.dbRef = firebase.database().ref(`/${this.state.user.uid}`);

          // attaching our event listener to firebase
          this.dbRef.on("value", snapshot => {
            this.setState({
              // putting the empty object edge case in the entry point of getting snapshot is better than putting the edge cases later in the code
              diaryEntries: snapshot.val() || {}
            });
          });
        });
        return <Redirect to="/dashboard" />;
      } else {
        return <Redirect to="/" />;
      }
    });
  };

  componentWillUnmount() {
    // this is called when a component leaves the page
    // in our single page app with one component, it will never be called
    // if we were rerouting to a different view, it would be called when the route changed.
    if (this.dbRef) {
      this.dbRef.off();
    }
  }

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
              <nav>
                <Link to="/dashboard">Dashboard</Link>
              </nav>
              <SearchMovies />
            </div>
          ) : null}
        </div>
      </Router>
    );
  }
}

export default App;
