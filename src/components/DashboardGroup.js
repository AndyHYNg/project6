import React, { Component } from "react";
import firebase, { auth, provider } from "../firebase";
import { Route, Link } from "react-router-dom";
import swal from "sweetalert";

const DashboardGroup = props => {
  return (
    <div className="dashboardContainer clearfix">
      {Object.entries(props.groups).map(group => {
        return (
          <div className="dashboardOption">
            <Link
              to={`/group/${group[1].groupID}`}
              style={{ textDecoration: "none" }}
            >
              <h3>{group[1].name}</h3>
              <p>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                Tenetur impedit autem et doloribus explicabo quod temporibus
                eligendi quam commodi quis.
              </p>
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardGroup;
