import React, { Component } from "react";
import firebase, { auth, provider } from "../firebase";
// withRouter is a higher-order component (component inside a component)
import { Route, Link, withRouter } from "react-router-dom";
import axios from "axios";
import RenderMovies from "./Movies";
import SearchMovies from "./SearchMovies";

class Group extends Component {
  constructor() {
    super();
    this.state = {
      group: {}
    };
  }

  componentDidMount() {
    this.populateGroupMoviesDBRef = firebase.database().ref(`userGroups/`);
    this.populateGroupMoviesDBRef.on("value", snapshot => {
      console.log(this.props.match.params.group_id);
      Object.entries(snapshot.val()).map(group => {
        if (group[1].groupID === this.props.match.params.group_id) {
          this.setState({
            group: group[1]
          });
        }
      });
      //   console.log(currSnapShot);
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
  }

  // this component will get the snapshot of added movies from the firebase db
  // pass the movies state as a prop in SearchMovies for checking purposes (running count, etc.)

  render() {
    return (
      <div>
        {/* {console.log(this.props.match.params.group_id)} */}
        <h3>Group name</h3>
        <SearchMovies />
        {/* {console.log(window.location.href)} */}
        {/* <Link to={`/${}`}>
          <i className="fas fa-search" />
        </Link> */}
      </div>
    );
  }
}

// we need to add withRouter here to initiate
// withRouter has to be used in conjunction with Route render
export default withRouter(Group);
