import React, { Component } from "react";
import "./App.scss";
import axios from "axios";
import RenderMovies from "./components/Movies";
import firebase, { auth, provider } from "./firebase";
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import SearchMovies from './components/SearchMovies';

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

  logIn = () => {
    auth.signInWithPopup(provider).then(result => {
      // setState can take in a second argument that is a callback function after it finished set state
      this.setState({
        user: result.user
      });
    })
  };

  logOut = () => {
    auth.signOut().then(() => {
      this.setState({
        user: null
      });
    });
  };


  render() {
    return (
      <Router>
        <div className="App">
          <div className="login">
            <div className="wrapper">
              <h1>Cinemacrew</h1>
              {
                this.state.user ? (
                  <button onClick={this.logOut}>Logout</button>
                ) : (
                    <button onClick={this.logIn}>Login</button>
                  )
              }

              <button>Guest</button>
            </div>
          </div>
          {
            this.state.user ? (
              <div>
                <Route path="/dashboard" component={Dashboard} />
                <nav>
                  <Link to="/dashboard">Dashboard</Link>
                </nav>
                <SearchMovies />
              </div>
            )
              :
              (
                null
              )
          }

        </div>
      </Router>
    );
  }
}

export default App;
