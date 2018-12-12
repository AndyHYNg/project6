import React from "react";
import Particles from "react-particles-js";

const particleStyle = {
  particles: {
    number: {
      value: 50,
      density: {
        enable: true,
        value_area: 800
      }
    },
    move: {
      enable: true,
      speed: 1.4,
      direction: "none",
      random: true,
      straight: false,
      out_mode: "out"
    }
  }
};

// Login will only render if the user is not logged in, as depicted in App.js 's render method
const Login = props => {
  return (
    <div>
      <div className="login">
        <Particles className="particles" params={particleStyle} />
        <div className="wrapper loginContainer">
          <h1>Radflix</h1>
          <React.Fragment>
            <button onClick={props.logIn}>Login</button>
            <button onClick={props.logInGuest}>Guest</button>
          </React.Fragment>
        </div>
      </div>
    </div>
  );
};

export default Login;
