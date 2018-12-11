import React, { Component } from "react";
import firebase from "../firebase";
// withRouter is a higher-order component (component inside a component)
import { Link, withRouter } from "react-router-dom";
import RenderMovies from "./Movies";

class Group extends Component {
  componentDidMount() {
    this.populateGroupMoviesDBRef = firebase.database().ref(`userGroups/`);
    this.populateGroupMoviesDBRef.on("value", snapshot => {
      Object.entries(snapshot.val()).forEach(group => {
        if (group[1].groupID === this.props.match.params.group_id) {
          this.props.getCurrGroup(group[1]);
          // this.props.getMovieCollectionArray(group[1].movies);
          this.props.getMovieArray(group[1].movies);
          this.props.getGroupFirebaseKey(group[0]);
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

  renderGroupMembers = usersObject => {
    const usersArray = Object.entries(usersObject || {}).map(user => {
      return Object.values(user[1]);
    });
    const flattenArray = usersArray.reduce((acc, val) => acc.concat(val), []);
    return <p>{flattenArray.join(", ")}</p>;
  };


  sortMovies = e => {
    let currentSortArray = this.props.currGroupMovies;
    if (e.target.value === "highestCount") {
      currentSortArray.sort((a, b) => {
        return b.count - a.count;
      });
    } else if (e.target.value === "lowestCount") {
      currentSortArray.sort((a, b) => {
        return a.count - b.count;
      })
    }
    this.props.updateMovieArray(currentSortArray);
  }

  render() {
    return (
      <div>
        <header className="pageHeader">
          <div className="wrapper headerContent clearfix">
            <p>Group</p>
            <h2 className="groupName">
              <span className="underline">{this.props.currGroup.name}</span>
            </h2>
            <h3 className="groupDetails">Group ID:</h3>
            <p>{this.props.match.params.group_id}</p>
            <h3 className="groupDetails">Group Members:</h3>
            {this.renderGroupMembers(this.props.currGroup.users)}
            {/* SF SAT moved link to header, added container and p class */}
            <Link to={`/group/${this.props.match.params.group_id}/search`}>
              <div className="searchLink clearfix">
                <i className="fas fa-search" aria-hidden="true" />
                <p>Search for movies to add to this group</p>
              </div>
            </Link>
            <i className="fas fa-angle-double-down" aria-label="Scroll down."></i>
            <Link to={`/dashboard`}>
              <button className="backButton">
                Return to dashboard
              </button>
            </Link>
          </div>
        </header>
        <section>
          <div className="formContainer">
            <div className="wrapper genreSelector">
              <form action="" onChange={this.props.handleChange}>
                <select name="movieGenre" id="genres">
                  <option value="All">All</option>
                  <option value="Action">Action</option>
                  <option value="Adventure">Adventure</option>
                  <option value="Animation">Animation</option>
                  <option value="Comedy">Comedy</option>
                  <option value="Crime">Crime</option>
                  <option value="Documentary">Documentary</option>
                  <option value="Drama">Drama</option>
                  <option value="Family">Family</option>
                  <option value="Fantasy">Fantasy</option>
                  <option value="History">History</option>
                  <option value="Horror">Horror</option>
                  <option value="Music">Music</option>
                  <option value="Mystery">Mystery</option>
                  <option value="Romance">Romance</option>
                  <option value="Science Fiction">Science Fiction</option>
                  <option value="TV Movie">TV Movie</option>
                  <option value="Thriller">Thriller</option>
                  <option value="War">War</option>
                  <option value="Western">Western</option>
                </select>
              </form>
            </div>
            <div className="sortByCount">
              <form action="" onChange={this.sortMovies}>
                <label htmlFor="sort" className="visuallyHidden">Sort by highest or lowest movie count</label>
                <select name="movieLikeCount" id="count">
                  <option value="highestCount">Most Popular</option>
                  <option value="lowestCount">Least Popular</option>
                </select>
              </form>
            </div>
          </div>
        </section>
        <RenderMovies
          movies={this.props.currGroupMovies}
          removeMovie={this.props.removeMovie}
        />
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
