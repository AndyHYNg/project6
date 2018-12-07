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
    // note: check this.dbRef
    if (this.populateGroupDBRef) {
      this.populateGroupDBRef.off();
    }

    if (this.userGroupDBRef) {
      this.userGroupDBRef.off();
    }

    if (this.userDBRef) {
      this.userDBRef.off();
    }
  }

  createRoom = async e => {
    // ES7's async, page will wait until user has performed any action by the sweet alert prompt before proceeding
    e.preventDefault();
    const value = await swal("Type the group name you want to create:", {
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

  joinRoom = async e => {
    // ES7's async, page will wait until user has performed any action by the sweet alert prompt before proceeding
    e.preventDefault();
    const value = await swal("Type the group name you want to join:", {
      content: "input",
      buttons: {
        cancel: true,
        confirm: true
      }
    });

    this.joinUserGroupDBRef = firebase.database().ref(`/userGroups/`);

    this.joinUserGroupDBRef.on("value", snapshot => {
      // console.log(snapshot.val());
      const groupDB = snapshot.val();
      for (let group in groupDB) {
        console.log(groupDB[group]);
        if (value === groupDB[group].groupID) {
          // console.log("YOU FOUND ME", this.state.user);
          this.joinSpecificGroupDBRef = firebase
            .database()
            .ref(`/userGroups/${group}/users/`);
          const joinUserObject = {};
          joinUserObject[this.state.user.displayName] = this.state.user.uid;
          this.joinSpecificGroupDBRef.push(joinUserObject);
          return;
        }
      }
    });

    // this.joinSpecificRoomDBRef = firebase.database().ref(`userGroups/`)
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
          {/* MOAR NOTE: upon removing a group, we only want to remove the user who chose to remove from their dashboard, need to test once the group has no members */}
          <button onClick={this.createRoom} className="dashboardOption">
            <h3>Add Group</h3>
            <i className="fas fa-plus" />
          </button>
          <button onClick={this.joinRoom} className="dashboardOption">
            <h3>Join Group</h3>
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
