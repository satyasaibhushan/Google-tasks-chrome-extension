import React from "react";
import "./taskDivStyles.css";

export class TaskDiv extends React.Component {
  constructor() {
    super();
    this.state = {
      icon: "circle",
    };
  }
  componentDidUpdate() {
    if (this.props.taskArrayElement.focus == true) {
      this.input.current.focus();
    }
  }
  componentDidMount() {
    if (this.props.taskArrayElement.focus == true) {
      this.input.current.focus();
    }
  }
  updateTaskIcon() {
    if (this.state.icon == "circle") {
      return <div className="taskDivCheck"></div>;
    }
    if (this.state.icon == "tick") {
      return (
        <img
          src="../../images/tick.svg"
          alt="tick sign"
          className="taskDivTick"
        />
      );
    }
  }

  render() {
    this.input = React.createRef();
    let div = this.updateTaskIcon();

    return (
      <div
        className="taskDiv" 
        style={{
          borderBottom: this.props.taskArrayElement.focus == true ? "2px solid rgb(66,133,244)" : "none",
          backgroundColor:this.props.taskArrayElement.focus == true ?" rgba(212, 211, 211, 0.1)":'transparent'
        }}
      >
        <div
          className="taskIconContainer"
          onMouseOver={(_) => this.setState({ icon: "tick" })}
          onMouseLeave={(_) => this.setState({ icon: "circle" })}
        >
          {div}
        </div>
        <div className="taskInputContainer">
          <input
            type="text"
            ref={this.input}
            name=""
            value={this.props.taskArrayElement.value}
            onChange={(e) => this.props.changeElement(e.target.value,true)}
            onKeyDown={(e) => this.props.addNewTask(e)}
            className="textAreaTaskDiv"
            onFocusCapture={(e)=>this.props.changeElement(e.target.value,true)} 
            onBlurCapture={(e)=>this.props.changeElement(e.target.value,false)} 
          />
        </div>
      </div>
    );
  }
}
