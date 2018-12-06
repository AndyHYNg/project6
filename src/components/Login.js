import React, { Component } from "react";
import { Redirect } from "react-router";

// note: it's possible we need to make this a stateful component with the user state in here so we can have the login persist under ComponentDidMount

const Login = props => {
  // if user is already logged in...
  return props.userState ? (
    // redirect to (similar to Link, but it's automatic) dashboard
    <Redirect to="/dashboard/" />
  ) : (
    // otherwise, render login page
    <div className="login">
      <div className="wrapper">
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
  );
};

export default Login;
