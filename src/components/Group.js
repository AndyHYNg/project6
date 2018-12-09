import React, { Component } from "react";
import firebase, { auth, provider } from "../firebase";
// withRouter is a higher-order component (component inside a component)
import { Route, Link, withRouter } from "react-router-dom";
import axios from "axios";
import RenderMovies from "./Movies";
import SearchMovies from "./SearchMovies";

class Group extends Component {
  componentDidMount() {
    this.populateGroupMoviesDBRef = firebase.database().ref(`userGroups/`);
    this.populateGroupMoviesDBRef.on("value", snapshot => {
      console.log(this.props.match.params.group_id);
      Object.entries(snapshot.val()).map(group => {
        if (group[1].groupID === this.props.match.params.group_id) {
          this.props.getCurrGroup(group[1]);
          this.props.getMovieArray(group[1].movies);
        }
      });
    });
  }

  componentWillUnmount() {
    // turn off all dbRefs called in this component after any sort of re-routing
    if (this.populateGroupMoviesDBRef) {
      this.populateGroupMoviesDBRef.off();
    }
  }

  render() {
    return (
      <div>
        <header className="pageHeader">
          <div className="wrapper headerContent clearfix">
            <h2>
              <span className="underline">{this.props.currGroup.name}</span>
            </h2>
            {/* SF SAT moved link to header, added container and p class */}
            <Link to={`/group/${this.props.match.params.group_id}/search`}>
              <div className="searchLink clearfix">
                <i className="fas fa-search" />
                <p>Search for movies to add</p>
              </div>
            </Link>
          </div>
        </header>
        <RenderMovies movies={this.props.currGroupMovies} />
        {/* <Link to={`/group/${this.props.match.params.group_id}/search`}>
          <i className="fas fa-search" />
        </Link> */}
      </div>
    );
  }
}

// we need to add withRouter here to initiate
// withRouter has to be used in conjunction with Route render
export default withRouter(Group);
