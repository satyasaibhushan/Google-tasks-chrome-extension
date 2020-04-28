import React from "react";
import "./taskDiv.css";

export class TaskDiv extends React.Component {
  constructor(props) {
    super();
    this.state = {
      icon: props.checkedList ? "tick" :"circle",
      newlyAdded: false,
    };
  }
  componentDidUpdate() {
    if (this.props.taskArrayElement.focus == true) {
      this.input.current.focus();
    }
    if (this.props.taskArrayElement.newlyAdded == true) {
      this.Animation(this.wholeDiv.current, "forward", 0.4,0);
      this.props.changeElementKey("newlyAdded");
    }
    if (this.props.taskArrayElement.remove == true) {
      this.Animation(this.wholeDiv.current, "backward", 0.25,0);
      setTimeout(() => {
        this.props.changeElementKey("remove");
        if (this.wholeDiv.current)
          this.Animation(this.wholeDiv.current, "forward", 0.01,0);
      }, 250);
    }
    if (this.props.taskArrayElement.checked == true && this.props.checkedList!=true){
      this.Animation(this.wholeDiv.current, "backward", 0.25,0.10);
      setTimeout(() => {
        this.props.changeElementKey("checked");
        if (this.wholeDiv.current)
          this.Animation(this.wholeDiv.current, "forward", 0.01);
      }, 400);
    }
    if (this.props.taskArrayElement.unchecked == true && this.props.checkedList==true){
      // console.log(this.props.taskArrayElement)
      this.Animation(this.wholeDiv.current, "backward", 0.25,0.10);
      setTimeout(() => {
        this.props.changeElementKey("unchecked");
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
  Animation(element, direction, time,delay) {
    if (direction == "forward")
      return TweenMax.fromTo(
        element,
        { height: 0, opacity: 0 },
        { duration: time, height: "3rem", opacity: 1 , delay:delay}
      );
    else if (direction == "backward")
      return TweenMax.fromTo(
        element,
        { height: "3rem", opacity: 1 },
        { duration: time, height: "0", opacity: 0 , delay:delay}
      );
  }

 setIcon(mouseEnter){
  //  console.log(this.state.icon)
  if(this.props.taskArrayElement.unchecked==true  ) return
  if(this.props.taskArrayElement.checked==true && this.props.checkedList == true) return this.setState({ icon: "tick" })
  if(this.props.taskArrayElement.checked==true ) return 
  else if(mouseEnter&& this.state.icon =="circle") return this.setState({ icon: "tick" })
  else if (!mouseEnter && this.state.icon =="tick") return this.setState({ icon: "circle" })
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
          onClick={_ =>{ this.props.clickedTick()}}
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
            readOnly = {this.props.checkedList}
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
              textDecoration: 
                this.props.checkedList == true? "line-through": "none",  
            }}
          />
        </div>
      </div>
    );
  }
}
