import React, { Component } from "react";
import firebase, { auth, provider } from "../firebase";
import { Route, Link } from 'react-router-dom';
import App from '../App';

class Login extends Component {
    constructor() {
        super();
        this.state = {
            user: null
        }
    }

    logIn = () => {
        auth.signInWithPopup(provider).then(result => {
            // setState can take in a second argument that is a callback function after it finished set state
            this.setState({
                user: result.user
            });
        })
    };

    render() {
        return (
            <div>
                <h1>Welcome to Bilbo dragon's drag n drop cinemacrew</h1>
                <button onClick={this.logIn}>Login</button>
                <Route path="/dashboard" component={App} />
                <button>Guest</button>
            </div>
        )
    }
}

export default Login;