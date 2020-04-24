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
  updateTaskIcon(){
    if(this.state.icon == "circle") {return <div className="taskDivCheck"></div>}
    if(this.state.icon == "tick") {
        return (<img 
        src="../../images/tick.svg"
        alt="tick sign"
        className="taskDivTick"
      />)
      
    }
  }

  render() {
    this.input = React.createRef();
    let div = this.updateTaskIcon()
    return (
      <div className="taskDiv" onMouseOver={console.log('over')}> 
        <div
          className="taskIconContainer"
          onMouseOver={(_) => this.setState({icon:'tick'})}
          onMouseLeave={(_) => this.setState({icon:'circle'})}
        >
          {div}
        </div>
        <div className="taskInputContainer">
        <input 
          type="text"
          ref={this.input}
          name=""
          value={this.props.taskArrayElement.value}
          onChange={(e) => this.props.changeElement(e.target.value)}
          onKeyDown={(e) => this.props.addNewTask(e)}
          className="textAreaTaskDiv"
        /></div>
      </div>
    );
  }
}
