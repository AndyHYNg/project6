import React, { Component } from "react";
import firebase, { auth, provider } from "../firebase";
import { Route, Link } from "react-router-dom";
import swal from "sweetalert";
import Group from "./Group";

class DashboardGroup extends Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    return (
      <div className="dashboardContainer clearfix">
        {/* for each group in groups props... */}
        {Object.entries(this.props.groups).map(group => {
          return (
            // enclose each dashboard group render with a link that routes to the group page in Group.js
            <Link
              key={group[1].groupID}
              to={`/group/${group[1].groupID}`}
              style={{ textDecoration: "none" }}
            >
              <div className="dashboardOption">
                <h3>{group[1].name}</h3>
                {/* SF SAT changes here */}
                <h4>Collaborators</h4>
                <ul>
                  <li>Group member 1</li>
                  <li>Group member 1</li>
                </ul>
                {/* SF SAT changes end */}
              </div>
            </Link>
          );
        })}
      </div>
    );
  }
}

export default DashboardGroup;
