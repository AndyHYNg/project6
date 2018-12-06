import React, { Component } from "react";
import firebase, { auth, provider } from "../firebase";
import { Route, Link } from "react-router-dom";
import axios from "axios";
import RenderMovies from "./Movies";

class Group extends Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    return (
      <div>
        <h3>Group name</h3>
        {console.log(this.props.groups)}
        {/* <Link to="/">
          <i className="fas fa-search" />
        </Link> */}
      </div>
    );
  }
}

export default Group;
