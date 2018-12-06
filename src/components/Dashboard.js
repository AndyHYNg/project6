import React, { Component } from "react";
import firebase, { auth, provider } from "../firebase";
import { Route, Link } from "react-router-dom";
import swal from "sweetalert";

class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
      groups: {}
    };
  }

  handleClick = async e => {
    e.preventDefault();
    const value = await swal("Type the group name:", {
      content: "input",
      buttons: {
        cancel: true,
        confirm: true
      }
    });

    if (value !== null && value !== "") {
      swal(`Group name: ${value}`);
    }
  };

  render() {
    return (
      <section className="dashboard">
        <div className="wrapper">
          <h2>Welcome Bitches</h2>
          <div className="dashboardContainer clearfix">
            <div className="dashboardOption">
              <Link to="/group" style={{ textDecoration: "none" }}>
                <h3>Box 1</h3>
                <p>
                  Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                  Tenetur impedit autem et doloribus explicabo quod temporibus
                  eligendi quam commodi quis.
                </p>
              </Link>
            </div>
            <button onClick={this.handleClick} className="dashboardOption">
              <h3>Add Group</h3>
              <i class="fas fa-plus" />
            </button>
            <div className="dashboardOption">
              <div className="dashboardOptionContent">
                <h3>Box 3</h3>
                <p>
                  Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                  Tenetur impedit autem et doloribus explicabo quod temporibus
                  eligendi quam commodi quis.
                </p>
              </div>
            </div>
            <div className="dashboardOption">
              <div className="dashboardOptionContent">
                <h3>Box 4</h3>
                <p>
                  Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                  Tenetur impedit autem et doloribus explicabo quod temporibus
                  eligendi quam commodi quis.
                </p>
              </div>
            </div>
            <div className="dashboardOption">
              <div className="dashboardOptionContent">
                <h3>Box 5</h3>
                <p>
                  Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                  Tenetur impedit autem et doloribus explicabo quod temporibus
                  eligendi quam commodi quis.
                </p>
              </div>
            </div>
            <div className="dashboardOption">
              <div className="dashboardOptionContent">
                <h3>Box 6</h3>
                <p>
                  Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                  Tenetur impedit autem et doloribus explicabo quod temporibus
                  eligendi quam commodi quis.
                </p>
              </div>
            </div>
          </div>
        </div>
        <button onClick={this.props.logOut}>Logout</button>
      </section>
    );
  }
}

export default Dashboard;
