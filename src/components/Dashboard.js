import React, { Component } from "react";
import firebase, { auth, provider } from "../firebase";
import { Route, Link } from "react-router-dom";
import swal from "sweetalert";
import DashboardGroup from "./DashboardGroup";

const uuidv4 = require("uuid/v4");

class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
      groups: {},
      user: null
    };
  }

  // populates a snapshot of the logged in user's group db
  componentDidMount() {
    if (this.props.userState) {
      this.setState(
        {
          user: this.props.userState
        },
        () => {
          this.populateGroupDBRef = firebase
            .database()
            .ref(`uid/${this.state.user.uid}/groups`);
          this.populateGroupDBRef.on("value", snapshot => {
            this.setState({
              groups: snapshot.val() || {}
            });
          });
        }
      );
    }
  }

  componentWillUnmount() {
    // this is called when a component leaves the page
    // in our single page app with one component, it will never be called
    // if we were rerouting to a different view, it would be called when the route changed.

    // turn off all dbRefs called in this component after any sort of re-routing
    if (this.dbRef) {
      this.populateGroupDBRef.off();
      this.userGroupDBRef.off();
      this.userDBRef.off();
    }
  }

  handleClick = async e => {
    // ES7's async, page will wait until user has performed any action by the sweet alert prompt before proceeding
    e.preventDefault();
    const value = await swal("Type the group name:", {
      content: "input",
      buttons: {
        cancel: true,
        confirm: true
      }
    });

    // if the input text of the sweet alert is NOT empty of null (created by pressing Cancel button)...
    if (value !== null && value !== "") {
      // creates necessary db nodes (in user's db and usergroup db)
      swal(`Group name: ${value}`);
      const newKey = uuidv4();
      this.userDBRef = firebase
        .database()
        .ref(`uid/${this.props.userState.uid}/groups/`);
      const newGroupObject = {
        name: value,
        groupID: newKey
      };

      const newUserGroupObject = {
        name: value,
        movies: [],
        users: [],
        groupID: newKey
      };
      const userObject = {};
      userObject[this.props.userState.displayName] = this.props.userState.uid;
      newUserGroupObject.users.push(userObject);
      console.log(newUserGroupObject);
      //   console.log(userDBRef);
      //   userDBRef.on("value", snapshot => {
      //     console.log(snapshot.val());
      //   });
      this.userDBRef.push(newGroupObject);
      this.userGroupDBRef = firebase.database().ref(`userGroups/`);
      this.userGroupDBRef.push(newUserGroupObject);

      //   const newKey = userDBRef.push(value).key;
      //   userGroupDBRef.child(newKey);
    }
  };

  // this.props.userState contains our user information after authentication

  render() {
    return (
      <section className="dashboard">
        <div className="wrapper clearfix">
          <h2>Welcome {this.props.userState.displayName}</h2>
          {/* Component render for all the user's groups  */}
          <DashboardGroup groups={this.state.groups} />
          {/* last box is a button that will allow user to create a new group */}
          {/* NOTE: will need to also be able to join user to an existing group created by a user */}
          <button onClick={this.handleClick} className="dashboardOption">
            <h3>Add Group</h3>
            <i className="fas fa-plus" />
          </button>
          <button onClick={this.props.logOut} className="logOutButton">
            Logout
          </button>
        </div>
      </section>
    );
  }
}

export default Dashboard;
