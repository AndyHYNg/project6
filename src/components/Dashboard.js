import React, { Component } from "react";
import firebase from "../firebase";
import swal from "sweetalert";
import DashboardGroup from "./DashboardGroup";

const uuidv4 = require("uuid/v4");

class Dashboard extends Component {
  // constructor() {
  //   super();
  //   this.state = {
  //     groups: {},
  //     // joinGroupFirebaseKey: "",
  //     user: null
  //   };
  // }

  // populates a snapshot of the logged in user's group db
  componentDidMount() {
    // if user logged in and is not a guest
    if (this.props.userState && !this.props.userState.isAnonymous) {
      this.populateGroupDBRef = firebase
        .database()
        .ref(`uid/${this.props.userState.uid}/groups`);
      this.populateGroupDBRef.on("value", snapshot => {
        this.props.getJoinedGroups(snapshot.val());
      });
    }
    // if user logged is a guest
    else if (this.props.userState.isAnonymous) {
      // because each guest has a uid on each login, we grab all the group DB refs and build a new Object containing all guest DBs from the snapshot to parse it through this.props.getJoinedGroups
      this.rawGroupDBRef = firebase.database().ref(`userGroups`);
      this.rawGroupDBRef.on("value", rawSnapshot => {
        const rawGroupDB = rawSnapshot.val();
        const newGuestGroupDBRef = Object.entries(rawGroupDB)
          .filter(groupDB => {
            return groupDB[1].isGuestRoom;
          })
          .reduce((newObj, firebaseKey) => {
            newObj[firebaseKey[0]] = rawGroupDB[firebaseKey[0]];
            return newObj;
          }, {});
        this.props.getJoinedGroups(newGuestGroupDBRef);
      });
    }
  }

  componentWillUnmount() {
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

    if (this.joinSpecificGroupDBRef) {
      this.joinSpecificGroupDBRef.off();
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

      this.userDBRef.push(newGroupObject);
      this.userDBRef.off();

      const newUserGroupObject = {
        name: value,
        movies: [],
        users: {},
        isGuestRoom: false,
        groupID: newKey
      };

      if (this.props.userState.displayName === null) {
        newUserGroupObject.isGuestRoom = true;
      }

      this.userGroupDBRef = firebase.database().ref(`userGroups/`);
      const userGroupDBKey = this.userGroupDBRef.push(newUserGroupObject).key;
      this.userGroupDBRef.off();

      this.specificGroupDBRef = firebase
        .database()
        .ref(`userGroups/${userGroupDBKey}/users`);
      const joinUserObject = {};
      joinUserObject[this.props.userState.uid] =
        this.props.userState.displayName || this.props.guestName;
      this.specificGroupDBRef.push(joinUserObject);
      this.specificGroupDBRef.off();

      this.populateGroupDBRef = firebase
        .database()
        .ref(`uid/${this.props.userState.uid}/groups`);
      this.populateGroupDBRef.once("value", snapshot => {
        this.props.getJoinedGroups(snapshot.val());
      });

      swal(
        "Group created!",
        `You have created a new group: ${value}`,
        "success"
      );
    } else if (value === "") {
      swal("Error 1001", `Invalid group name, please try again.`, "error");
    }
  };

  // for refactoring purposes later on
  joinUserInfotoGroupDB = firebaseDBRef => {
    const joinUserObject = {};
    joinUserObject[this.props.userState.uid] =
      this.props.userState.displayName || this.props.guestName;
    firebaseDBRef.push(joinUserObject);
  };

  joinRoom = async e => {
    // ES7's async, page will wait until user has performed any action by the sweet alert prompt before proceeding
    e.preventDefault();
    this.roomID = await swal("Type the group name you want to join:", {
      content: "input",
      buttons: {
        cancel: true,
        confirm: true
      }
    });

    if (this.roomID !== null && this.roomID !== "") {
      let foundRoom = false;
      this.groupFirebaseKey = "";
      this.joinUserGroupDBRef = firebase.database().ref(`/userGroups/`);

      // we use .once to read the snapshot data once, otherwise it will result in infinite loop for the for...in + if statement below
      this.joinUserGroupDBRef.once("value", snapshot => {
        // console.log(snapshot.val());
        const groupDB = snapshot.val();
        for (let group in groupDB) {
          if (this.roomID === groupDB[group].groupID) {
            foundRoom = true;
            if (
              (groupDB[group].isGuestRoom &&
                this.props.userState.isAnonymous) ||
              (!groupDB[group].isGuestRoom && !this.props.userState.isAnonymous)
            ) {
              this.joinSpecificGroupDBRef = firebase
                .database()
                .ref(`/userGroups/${group}/users/`);
              const joinUserObject = {};
              joinUserObject[this.props.userState.uid] =
                this.props.userState.displayName || this.props.guestName;
              this.joinSpecificGroupDBRef.push(joinUserObject);
              this.joinSpecificGroupDBRef.off();

              this.userDBRef = firebase
                .database()
                .ref(`uid/${this.props.userState.uid}/groups/`);

              const newGroupObject = {
                name: groupDB[group].name,
                groupID: this.roomID
              };

              this.userDBRef.push(newGroupObject);
              this.userDBRef.off();
            } else {
              swal(
                "Error 9000",
                "You do not have the privileges to join the group.",
                "error"
              );
            }
          }
        }
        // if user logged in and is not a guest
        if (this.props.userState && !this.props.userState.isAnonymous) {
          this.populateGroupDBRef = firebase
            .database()
            .ref(`uid/${this.props.userState.uid}/groups`);
          this.populateGroupDBRef.on("value", snapshot => {
            this.props.getJoinedGroups(snapshot.val());
          });
        }
        // if user logged is a guest
        else if (this.props.userState.isAnonymous) {
          // because each guest has a uid on each login, we grab all the group DB refs and build a new Object containing all guest DBs from the snapshot to parse it through this.props.getJoinedGroups
          this.rawGroupDBRef = firebase.database().ref(`userGroups`);
          this.rawGroupDBRef.on("value", rawSnapshot => {
            const rawGroupDB = rawSnapshot.val();
            const newGuestGroupDBRef = Object.entries(rawGroupDB)
              .filter(groupDB => {
                return groupDB[1].isGuestRoom;
              })
              .reduce((newObj, firebaseKey) => {
                newObj[firebaseKey[0]] = rawGroupDB[firebaseKey[0]];
                return newObj;
              }, {});
            this.props.getJoinedGroups(newGuestGroupDBRef);
          });
        }
      });
      // if (!foundRoom) {
      //   swal(
      //     "Error 8999",
      //     "Cannot find group - the group does not exist.",
      //     "error"
      //   );
      // }
    }

    // this.joinSpecificRoomDBRef = firebase.database().ref(`userGroups/`)
  };

  // this.props.userState contains our user information after authentication

  render() {
    return (
      <section className="dashboard">
        <header className="pageHeader">
          <button onClick={this.props.logOut} className="backButton">
            Logout
          </button>
          <div className="wrapper headerContent">
            <p>Welcome</p>
            <h2 className="userName">
              <span className="underline">
                {this.props.userState.displayName || this.props.guestName}
              </span>
            </h2>
            <p>Your personal movie dashboard</p>
            <div className="instructions">
              <ul>
                <li>Create a new group & invite your friends to build your favourite
                movies collection</li>
                <li>Looking to join an existing group? Enter the group ID</li>
              </ul>
            </div>
          </div>
        </header>
        <div className="wrapper clearfix dashboardGroupContainer">
          <h3><span className="underline">Your groups</span></h3>
          {/* Component render for all the user's groups  */}
          <DashboardGroup
            removeGroup={this.props.removeGroup}
            groups={this.props.joinedGroups}
          />
          {/* MOAR NOTE: upon removing a group, we only want to remove the user who chose to remove from their dashboard, need to test once the group has no members */}
          <button onClick={this.createRoom} className="dashboardButton">
            <h3>Add Group</h3>
            <i className="fas fa-plus" />
          </button>
          {!this.props.userState.isAnonymous ? (
            <button onClick={this.joinRoom} className="dashboardButton">
              <h3>Join Group</h3>
              <i className="fas fa-plus" />
            </button>
          ) : null}
        </div>
      </section>
    );
  }
}

export default Dashboard;
