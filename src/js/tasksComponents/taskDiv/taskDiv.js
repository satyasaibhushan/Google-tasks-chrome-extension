import React from "react";
import "./taskDiv.css";

export class TaskDiv extends React.Component {
  constructor() {
    super();
    this.state = {
      icon: "circle",
      newlyAdded: false,
    };
    // this.myTween = TimelineLite({paused: true});
  }
  componentDidUpdate() {
    if (this.props.taskArrayElement.focus == true) {
      this.input.current.focus();
    }
    if (this.props.taskArrayElement.newlyAdded == true) {
      this.Animation(this.wholeDiv.current, "forward", 0.4);
      this.props.changeClass("newlyAdded");
    }
    if (this.props.taskArrayElement.remove == true) {
      this.Animation(this.wholeDiv.current, "backward", 0.4);
      setTimeout(() => {
        this.props.changeClass("remove");
        if (this.wholeDiv.current)
          this.Animation(this.wholeDiv.current, "forward", 0.01);
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
  Animation(element, direction, time) {
    if (direction == "forward")
      return TweenMax.fromTo(
        element,
        { height: 0, opacity: 0 },
        { duration: time, height: "3rem", opacity: 1 }
      );
    else if (direction == "backward")
      return TweenMax.fromTo(
        element,
        { height: "3rem", opacity: 1 },
        { duration: time, height: "0", opacity: 0 }
      );
  }

 setIcon(mouseEnter){
   if(this.props.taskArrayElement.checked==true  ||  mouseEnter) return this.setState({ icon: "tick" })
   else if (!mouseEnter) return this.setState({ icon: "circle" })
 } 

  render() {
    this.input = React.createRef();
    let div = this.updateTaskIcon();
    this.wholeDiv = React.createRef();

    return (
      <div
        ref={this.wholeDiv}
        className={
          this.props.taskArrayElement.newlyAdded == true? "taskDiv newElement" : "taskDiv"
        }
        style={{
          borderBottom:
            this.props.taskArrayElement.focus == true? "2px solid rgb(66,133,244)": "none",
          backgroundColor:
            this.props.taskArrayElement.focus == true? " rgba(212, 211, 211, 0.1)" : "transparent",
        }}
      >
        <div
          className="taskIconContainer"
          onMouseOver={(_) => this.setIcon(true)}
          onMouseLeave={(_) => this.setIcon(false)}
          onClick={this.props.clickedTick}
        >
          {div}
        </div>
        <div
          className="taskInputContainer"
          onClick={(e) => this.props.changeElement(false, true)}
        >
          <input
            type="text"
            ref={this.input}
            name=""
            value={this.props.taskArrayElement.value}
            onChange={(e) => {
              if (this.props.taskArrayElement.remove == true)
                e.preventDefault();
              else this.props.changeElement(e.target.value, true);
            }}
            onKeyDown={(e) => {
              if (this.props.taskArrayElement.remove == true)
                e.preventDefault();
              else this.props.manageTasks(e);
            }}
            className="textAreaTaskDiv"
            onFocusCapture={(e) =>
              this.props.changeElement(e.target.value, true)
            }
            onBlurCapture={(e) =>
              this.props.changeElement(e.target.value, false)
            }
            style={{
              textDecoration:
                this.props.taskArrayElement.checked == true? "line-through": "none",
            }}
          />
        </div>
      </div>
    );
  }
}
