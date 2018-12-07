import React, { Component } from "react";
import { Redirect } from "react-router";
import Particles from "react-particles-js";

// note: it's possible we need to make this a stateful component with the user state in here so we can have the login persist under ComponentDidMount

const particleStyle = {
  particles: {
    number: {
      value: 50,
      density: {
        enable: true,
        value_area: 800
      }
    },
    // shape: {
    //   image: {
    //     src: ".../public/film.svg",
    //     width: 100,
    //     height: 100
    //   }
    // },
    // line_linked: {
    //   enable: true,
    //   distance: 60,
    //   color: "#ffffff",
    //   opacity: 0.4,
    //   width: 2
    // },
    move: {
      enable: true,
      speed: 1.4,
      direction: "none",
      random: true,
      straight: false,
      out_mode: "out"
    }
  }
}

const Login = props => {
  // if user is already logged in...
  return props.userState ? (
    // redirect to (similar to Link, but it's automatic) dashboard
    <Redirect to="/dashboard/" />
  ) : (
      // otherwise, render login page
      <div>
        <div className="login">
          <Particles className="particles" params={particleStyle} />
          <div className="wrapper loginContainer">
            <h1>Cinemacrew</h1>
            {props.userState ? (
              // with the redirect happening at the top, this shouldn't be necessary and can be set to null, can be removed later
              <React.Fragment>
                <button onClick={props.logOut}>Logout</button>
                <button onClick={props.logOutGuest}>Logout</button>
              </React.Fragment>
            ) : (
                <React.Fragment>
                  <button onClick={props.logIn}>Login</button>
                  <button onClick={props.logInGuest}>Guest</button>
                </React.Fragment>
              )}
          </div>
        </div>
      </div>
    );
};

export default Login;
