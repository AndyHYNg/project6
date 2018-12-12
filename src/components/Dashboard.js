import React, { Component } from "react";
import firebase from "../firebase";
import swal from "sweetalert";
import DashboardGroup from "./DashboardGroup";

const chance = require("chance").Chance();

class Dashboard extends Component {
  // populates a snapshot of the logged in user's group Db
  componentDidMount() {
    // if user logged in and is not a guest
    if (this.props.userState && !this.props.userState.isAnonymous) {
      this.populateGroupDbRef = firebase
        .database()
        .ref(`uid/${this.props.userState.uid}/groups`);
      this.populateGroupDbRef.on("value", snapshot => {
        this.props.getJoinedGroups(snapshot.val());
      });
    }
    // if user logged is a guest
    else if (this.props.userState.isAnonymous) {
      // because each guest has a uid on each login, we grab all the group Db refs and build a new Object containing all guest Dbs from the snapshot to parse it through this.props.getJoinedGroups
      this.rawGroupDbRef = firebase.database().ref(`userGroups`);
      this.rawGroupDbRef.on("value", rawSnapshot => {
        const rawGroupDb = rawSnapshot.val() || {};
        const newGuestGroupDbRef = Object.entries(rawGroupDb)
          .filter(groupDb => {
            return groupDb[1].isGuestRoom;
          })
          .reduce((newObj, firebaseKey) => {
            newObj[firebaseKey[0]] = rawGroupDb[firebaseKey[0]];
            return newObj;
          }, {});
        this.props.getJoinedGroups(newGuestGroupDbRef);
      });
    }
  }

  componentWillUnmount() {
    // turn off all DbRefs called in this component after any sort of re-routing
    if (this.populateGroupDbRef) {
      this.populateGroupDbRef.off();
    }

    if (this.rawGroupDbRef) {
      this.rawGroupDbRef.off();
    }

    if (this.userDbRef) {
      this.userDbRef.off();
    }

    if (this.userGroupDbRef) {
      this.userGroupDbRef.off();
    }

    if (this.specificGroupDbRef) {
      this.specificGroupDbRef.off();
    }

    if (this.joinSpecificGroupDbRef) {
      this.joinSpecificGroupDbRef.off();
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
      // creates necessary Db nodes (in user's Db and usergroup Db)

      swal(`Group name: ${value}`);
      const newKey = chance.string({
        length: 12,
        pool: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
      });

      this.userDbRef = firebase
        .database()
        .ref(`uid/${this.props.userState.uid}/groups/`);

      const newGroupObject = {
        name: value,
        groupId: newKey
      };

      this.userDbRef.push(newGroupObject);
      this.userDbRef.off();

      const newUserGroupObject = {
        name: value,
        movies: [],
        users: {},
        isGuestRoom: false,
        groupId: newKey
      };

      // if user is a guest, mark the room as a guest room
      if (this.props.userState.isAnonymous) {
        newUserGroupObject.isGuestRoom = true;
      }

      // pushes the new group information and get the firebase key associated with it
      this.userGroupDbRef = firebase.database().ref(`userGroups/`);
      const userGroupDbKey = this.userGroupDbRef.push(newUserGroupObject).key;
      this.userGroupDbRef.off();

      // append's user information to that group's users node
      this.specificGroupDbRef = firebase
        .database()
        .ref(`userGroups/${userGroupDbKey}/users`);
      const joinUserObject = {};
      joinUserObject[this.props.userState.uid] =
        this.props.userState.displayName || this.props.guestName;
      this.specificGroupDbRef.push(joinUserObject);
      this.specificGroupDbRef.off();

      // get a snapshot of the joined groups to trigger the re-render
      this.populateGroupDbRef = firebase
        .database()
        .ref(`uid/${this.props.userState.uid}/groups`);
      this.populateGroupDbRef.once("value", snapshot => {
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

  // below is for refactoring purposes later on

  // joinUserInfotoGroupDb = firebaseDbRef => {
  //   const joinUserObject = {};
  //   joinUserObject[this.props.userState.uid] =
  //     this.props.userState.displayName || this.props.guestName;
  //   firebaseDbRef.push(joinUserObject);
  // };

  joinRoom = async e => {
    // ES7's async, page will wait until user has performed any action by the sweet alert prompt before proceeding
    e.preventDefault();
    this.roomId = await swal("Type the group name you want to join:", {
      content: "input",
      buttons: {
        cancel: true,
        confirm: true
      }
    });

    this.foundRoom = false;

    // check to see if the roomId provided is not empty
    if (this.roomId !== null && this.roomId !== "") {
      this.groupFirebaseKey = "";
      this.joinUserGroupDbRef = firebase.database().ref(`/userGroups/`);

      // we use .once to read the snapshot data once, otherwise it will result in infinite loop for the for...in + if statement below
      this.joinUserGroupDbRef.once("value", snapshot => {
        const groupDb = snapshot.val();
        for (let group in groupDb) {
          // if the provided roomId matches the groupId of the group node we're looking in the firebase Db...
          if (this.roomId === groupDb[group].groupId) {
            this.foundRoom = true;
            // only do the code below if the group is not a guest room and the logged in user is not a guest
            // append user to the group's user's node and add a reference of the group information to the logged in user's node in firebase
            if (
              (groupDb[group].isGuestRoom &&
                this.props.userState.isAnonymous) ||
              (!groupDb[group].isGuestRoom && !this.props.userState.isAnonymous)
            ) {
              this.joinSpecificGroupDbRef = firebase
                .database()
                .ref(`/userGroups/${group}/users/`);

              // checking if the user joining is already joined (*insert galaxy brain meme here...*)
              const groupUsers = Object.values(groupDb[group].users);
              const checkDuplicateUser = groupUsers.filter(user =>
                Object.keys(user)[0].includes(this.props.userState.uid)
              );
              if (checkDuplicateUser.length !== 0) {
                return swal(
                  "Error 9999",
                  "You are already in this group. Nice try, ya wizard.",
                  "error"
                );
              }

              const joinUserObject = {};
              joinUserObject[this.props.userState.uid] =
                this.props.userState.displayName || this.props.guestName;
              this.joinSpecificGroupDbRef.push(joinUserObject);
              this.joinSpecificGroupDbRef.off();

              this.userDbRef = firebase
                .database()
                .ref(`uid/${this.props.userState.uid}/groups/`);

              const newGroupObject = {
                name: groupDb[group].name,
                groupId: this.roomId
              };

              this.userDbRef.push(newGroupObject);
              this.userDbRef.off();

              return swal(
                "Group joined!",
                `You have created a new group: ${groupDb[group].name}`,
                "success"
              );
            } else {
              // if the logged in user is trying to join a guest room and vice versa, return an error
              return swal(
                "Error 9000",
                "You do not have the privileges to join the group.",
                "error"
              );
            }
          }
        }

        // following code below will get a snapshot of the joined groups to re-render the page to reflect the changes above
        if (this.props.userState && !this.props.userState.isAnonymous) {
          this.populateGroupDbRef = firebase
            .database()
            .ref(`uid/${this.props.userState.uid}/groups`);
          this.populateGroupDbRef.on("value", snapshot => {
            this.props.getJoinedGroups(snapshot.val());
          });
        } else if (this.props.userState.isAnonymous) {
          this.rawGroupDbRef = firebase.database().ref(`userGroups`);
          this.rawGroupDbRef.on("value", rawSnapshot => {
            const rawGroupDb = rawSnapshot.val();
            const newGuestGroupDbRef = Object.entries(rawGroupDb)
              .filter(groupDb => {
                return groupDb[1].isGuestRoom;
              })
              .reduce((newObj, firebaseKey) => {
                newObj[firebaseKey[0]] = rawGroupDb[firebaseKey[0]];
                return newObj;
              }, {});
            this.props.getJoinedGroups(newGuestGroupDbRef);
          });
        }
      });
      if (!this.foundRoom) {
        return swal(
          "Error 80",
          "The group you tried to join does not exist.",
          "error"
        );
      }
    }
    if (this.roomId === "") {
      return swal(
        "Please enter a group ID.",
        "Please enter a group ID to join a group.",
        "info"
      );
    }
  };

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
                <li>
                  Create a new group & invite your friends to build your
                  favourite movies collection
                </li>
                {!this.props.userState.isAnonymous ? (
                  <li>Looking to join an existing group? Enter the group ID</li>
                ) : null}
              </ul>
            </div>
          </div>
        </header>
        <div className="wrapper clearfix dashboardGroupContainer">
          <h3>
            <span className="underline">Your groups</span>
          </h3>
          {/* Component render for all the user's groups  */}
          <DashboardGroup
            removeGroup={this.props.removeGroup}
            groups={this.props.joinedGroups}
          />
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
