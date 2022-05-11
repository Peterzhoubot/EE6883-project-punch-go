import React, { Component } from "react";
import "./App.css";
import {Route, HashRouter} from "react-router-dom";
import createpunching from "./createpunching";
import home from "./home";
import allpunchings from "./allpunchings";
import punching_detail from "./punching_detail";
import my_launch_punchings from "./my_launch_punchings";
import my_launch_punching_detail from "./my_launch_punching_detail";
import my_joined_punchings from "./my_joined_punchings";
import my_joined_punching_detail from "./my_joined_punching_detail";
class App extends React.Component {
    render() {
    return (
        <HashRouter>
          <div>
              <Route path="/" component={home} exact />
            <Route exact path="/home" component={home} />
            <Route exact path="/createpunching" component={createpunching} />
            <Route exact path="/allpunchings" component={allpunchings} />
              <Route exact path="/punching_detail/:id" component={punching_detail} />
            <Route exact path="/my_launch_punchings" component={my_launch_punchings} />
              <Route exact path="/my_launch_punching_detail/:id" component={my_launch_punching_detail} />
              <Route exact path="/my_joined_punchings" component={my_joined_punchings} />
              <Route exact path="/my_joined_punching_detail/:id" component={my_joined_punching_detail} />
          </div>
        </HashRouter>
    );
  }
}

export default App;
