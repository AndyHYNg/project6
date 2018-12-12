import React, { Component } from "react";
import { Link } from "react-router-dom";

class DashboardGroup extends Component {
  render() {
    return (
      <div className="dashboardContainer clearfix">
        {/* for each group in groups props... */}
        {Object.entries(this.props.groups).map(group => {
          return (
            // enclose each dashboard group render with a link that routes to the group page in Group.js
            <div key={group[1].groupID} className="dashboardLink">
              <Link
                to={`/group/${group[1].groupID}`}
                style={{
                  textDecoration: "none",
                  position: "relative",
                  zIndex: "5"
                }}
              >
                <div key={group[1].groupID} className="dashboardOption">
                  <h3>{group[1].name}</h3>
                </div>
              </Link>
              <button
                onClick={() => this.props.removeGroup(group)}
                className="removeMovie"
              >
                <i className="far fa-times-circle" />
              </button>
            </div>
          );
        })}
      </div>
    );
  }
}

export default DashboardGroup;
