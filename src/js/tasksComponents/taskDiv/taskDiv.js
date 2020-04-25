import React from "react";
import "./taskDiv.css";

export class TaskDiv extends React.Component {
  constructor() {
    super();
    this.state = {
      icon: "circle",
      newlyAdded:false
    };
    // this.myTween = TimelineLite({paused: true});
  }
  componentDidUpdate() {
    if (this.props.taskArrayElement.focus == true) {
      this.input.current.focus();
    }if(this.props.taskArrayElement.newlyAdded== true){
      TweenMax.fromTo(this.wholeDiv.current, { height: 0,opacity:0}, {duration: 0.4, height: '3rem',opacity:1});
    }
    if(this.props.taskArrayElement.remove == true){
      TweenMax.fromTo(this.wholeDiv.current, { height: '3rem',opacity:1}, {duration: 0.4, height: "0",opacity:0});
      setTimeout(() => {
       this.props.changeElement(false,true)
       if(this.wholeDiv.current)
       TweenMax.fromTo(this.wholeDiv.current, { height: '3rem',opacity:1}, {duration: 0.1, height: '3rem',opacity:1},);
      }, 400);

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
    this.wholeDiv = React.createRef();
    
    return (
      <div ref={this.wholeDiv}
        className={this.props.taskArrayElement.newlyAdded == true ? "taskDiv newElement":"taskDiv" }
        style={{
          borderBottom: this.props.taskArrayElement.focus == true ? "2px solid rgb(66,133,244)" : "none",
          backgroundColor:this.props.taskArrayElement.focus == true ?" rgba(212, 211, 211, 0.1)":'transparent'
        }}
      >
        <div
          className="taskIconContainer"
          onMouseOver={(_) => this.setState({ icon: "tick" })}
          onMouseLeave={(_) => this.setState({ icon: "circle" })}
          onClick={this.props.clickedTick}
        >
          {div}
        </div>
        <div className="taskInputContainer" onClick={(e)=>this.props.changeElement(false,true)}>
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
            style={{textDecoration:this.props.taskArrayElement.checked==true ? "line-through":"none"}}
          />
        </div>
      </div>
    );
  }
}
