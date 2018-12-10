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
            <React.Fragment>
              <div className="dashboardOption">
                <Link
                  key={group[1].groupID}
                  to={`/group/${group[1].groupID}`}
                  style={{ textDecoration: "none" }}
                >
                  <h3>{group[1].name}</h3>
                  {/* SF SAT changes here */}
                  <h4>Collaborators</h4>
                  <ul>
                    <li>Group member 1</li>
                    <li>Group member 1</li>
                  </ul>
                  {/* SF SAT changes end */}
                </Link>
                <button onClick={() => this.props.removeGroup(group)} className="removeMovie">
                  <i className="far fa-times-circle"></i>
                </button>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    );
  }
}

export default DashboardGroup;
