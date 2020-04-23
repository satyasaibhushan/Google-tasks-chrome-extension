import React from "react";
import "./taskDivStyles.css";

export class TaskDiv extends React.Component {
    constructor(){
        super();
    }
  componentDidUpdate() {
    if (this.props.taskArrayElement.focus == true) {
        console.log(this.input)
      this.input.current.focus();
    }
  }
  componentDidMount() {
    if (this.props.taskArrayElement.focus == true) {
        console.log(this.input)
      this.input.current.focus();
    }
  }

  render() {
    this.input = React.createRef();
    return (
      <div className="taskDiv">
        <div className="taskDivCheck"></div>
        <input
          type="text"
          ref={this.input}
          name=""
          value={this.props.taskArrayElement.value}
          onChange={(e) => this.props.changeElement(e.target.value)}
          onKeyDown={(e) => this.props.addNewTask(e)}
          className="textAreaTaskDiv"
        />
      </div>
    );
  }
}
