import React, { Component } from "react";
import firebase, { auth, provider } from "../firebase";
import { Route, Link } from 'react-router-dom';

class Dashboard extends Component {
    render() {
        return (
            <header>
                <h1>Welcome Bitches</h1>
            </header>
        )
    }
}

export default Dashboard;