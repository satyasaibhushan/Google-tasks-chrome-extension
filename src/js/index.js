import React, { useState } from "react";
import { render } from "react-dom";

import "../css/styles.css";

import { TaskComponent } from "./tasksComponent/taskComponent";
import GoogleApi from "./tasksComponent/googleApi/googleApi";

class App extends React.Component {
  render() {
    return (
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            margin: "5px",
          }}
        >
          <TaskComponent gapiAvailable={this.state?.loaded} />
        </div>
        {/* {this.setState({loaded:true})} */}
        <GoogleApi onUpdateSignIn={_ => this.setState({ loaded: true })} />
      </div>
    );
  }
}

render(<App />, document.getElementById("app"));
