import React from "react";
import "./taskDivStyles.css";

export class TaskDiv extends React.Component {

  render() {
    return (
      <div className="taskDiv">
        <div className="taskDivCheck"></div>
        <input
          type="text"
          name=""
          value={this.props.taskArrayElement.value}
          onChange={(e) => this.props.changeElement(e.target.value)}
          onKeyDown={(e) =>this.props.addNewTask(e)}
          className="textAreaTaskDiv"
        />
      </div>
    );
  }
}
