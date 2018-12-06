import React, { Component } from "react";
import firebase, { auth, provider } from "../firebase";
import { Route, Link } from 'react-router-dom';

class Dashboard extends Component {
    render() {
        return (
            <section className="dashboard">
                <div className="wrapper">
                    <h2>Welcome Bitches</h2>
                    <div className="dashboardContainer clearfix">
                        <div className="dashboardOption">
                            <h3>Box 1</h3>
                            <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Tenetur impedit autem et doloribus explicabo quod temporibus eligendi quam commodi quis.</p>
                        </div>
                        <div className="dashboardOption">
                            <h3>Box 2</h3>
                            <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Tenetur impedit autem et doloribus explicabo quod temporibus eligendi quam commodi quis.</p>
                        </div>
                        <div className="dashboardOption">
                            <h3>Box 3</h3>
                            <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Tenetur impedit autem et doloribus explicabo quod temporibus eligendi quam commodi quis.</p>
                        </div>
                        <div className="dashboardOption">
                            <h3>Box 4</h3>
                            <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Tenetur impedit autem et doloribus explicabo quod temporibus eligendi quam commodi quis.</p>
                        </div>
                        <div className="dashboardOption">
                            <h3>Box 5</h3>
                            <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Tenetur impedit autem et doloribus explicabo quod temporibus eligendi quam commodi quis.</p>
                        </div>
                        <div className="dashboardOption">
                            <h3>Box 6</h3>
                            <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Tenetur impedit autem et doloribus explicabo quod temporibus eligendi quam commodi quis.</p>
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}

export default Dashboard;