import React from "react";
import "./taskDiv.css";

export class TaskDiv extends React.Component {
  constructor(props) {
    super();
    this.state = {
      icon: props.checkedList ? "tick" : "circle",
    };
    this.input = React.createRef();
    this.wholeDiv = React.createRef();
  }
  componentDidUpdate() {
    if (
      this.props.taskArrayElement.subset != -1 &&
      this.props.taskArrayElement.icon == "" &&
      this.state.icon != "circle"
    ) {
      this.setState({ icon: "circle" });
    } else if (
      this.props.taskArrayElement.subset != -1 &&
      this.props.taskArrayElement.icon == "tick" &&
      this.state.icon != "tick"
    ) {
      this.setState({ icon: "tick" });
    }
    if (
      this.props.taskArrayElement.dragging &&
      this.props.taskArrayElement.height != 0 &&
      this.wholeDiv.current.style.height != 0 + "px"
    ) {
      this.Animation(this.wholeDiv.current,"backward",0.3,0)
      this.props.setHeight(0);
    }

    if (
      this.props.taskArrayElement.height == 0 &&
      (!this.props.taskArrayElement.dragging || this.props.taskArrayElement.dragging === false)
    ) {
      this.setHeight(this.input.current);
    }
    if (this.props.taskArrayElement.focus == true) {
      this.input.current.focus();
    }
    if (this.props.taskArrayElement.newlyAdded == true) {
      this.Animation(this.wholeDiv.current, "forward", 0.4, 0);
      setTimeout(() => {
        this.props.changeElementKey("newlyAdded");
      }, 300);
    }
    if (this.props.taskArrayElement.checked == true && this.props.checkedList != true)
      this.removeAfterAnimation(this.wholeDiv.current, "checked", 0.35, 0.2);
    else if (this.props.taskArrayElement.remove == true)
      this.removeAfterAnimation(this.wholeDiv.current, "remove", 0.3, 0.2);
    if (this.props.taskArrayElement.unchecked == true && this.props.checkedList == true)
      this.removeAfterAnimation(this.wholeDiv.current, "unchecked", 0.25, 0.1);
  }
  componentDidMount() {
    this.setHeight(this.input.current);
    if (this.props.taskArrayElement.focus == true) {
      this.input.current.focus();
    }
  }
  Animation(element, direction, time, delay) {
    if (direction == "forward")
      return TweenMax.fromTo(
        element,
        { height: 0, opacity: 0 },
        {
          duration: time,
          height: this.props.taskArrayElement.height,
          opacity: 1,
          delay: delay,
        }
      );
    else if (direction == "backward") {
     if(element.blur) element.blur();
      return TweenMax.fromTo(
        element,
        { height: this.props.taskArrayElement.height, opacity: 1 },
        { duration: time, height: "0", opacity: 0, delay: delay }
      );
    }
  }
  removeAfterAnimation(element, keyName, duration, delay) {
    this.Animation(element, "backward", duration, delay);
    setTimeout(() => {
      if (element) this.Animation(element, "forward", 0.01);
      this.props.changeElementKey(keyName);
    }, (duration + delay) * 1000);
  }

  setIcon(mouseEnter) {
    if (this.props.taskArrayElement.checked == true && this.props.checkedList == true)
      return this.setState({ icon: "tick" });
    if (this.props.taskArrayElement.unchecked || this.props.taskArrayElement.checked) return;
    else if (mouseEnter && this.state.icon == "circle") {
      this.props.hoveredIcon(true);
      return this.setState({ icon: "tick" });
    } else if (!mouseEnter && this.state.icon == "tick") {
      this.props.hoveredIcon(false);
      return this.setState({ icon: "circle" });
    }
  }
  setHeight(e) {
    e.style.height = "auto";
    e.style.height = e.scrollHeight + "px";
    if (e.clientHeight != this.props.taskArrayElement.height && e.clientHeight > 0)
      this.props.setHeight(e.clientHeight + 22);
  }
  tickAnimation() {
    let animationDivs = (
      <div className="tickAnimtionDivs">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    );
    if (this.props.taskArrayElement.checked && !this.props.checkedList) return animationDivs;
  }

  render() {
    return (
      <div
        ref={this.wholeDiv}
        className={this.props.taskArrayElement.newlyAdded == true ? "taskDiv newElement" : "taskDiv"}
        style={{
          backgroundColor:
            this.props.taskArrayElement.focus == true ? " rgba(212, 211, 211, 0.1)" : "transparent",
          height: this.props.taskArrayElement.height,
          opacity: this.props.taskArrayElement.height == 0 ? 0 : "",
          zIndex: 1,
        }}
        onClick={e => {
          this.input.current.focus();
          if (!this.props.taskArrayElement.focus)
            this.input.current.setSelectionRange(
              this.input.current.value.length,
              this.input.current.value.length
            );
          this.props.changeElement(false, true);
        }}
      >
        {(this.props.taskArrayElement.collapsed == -1 || this.props.taskArrayElement.collapsed == 1) &&
        !this.props.checkedList ? (
          <div
            onClick={this.props.clickedCollapseIcon}
            className={
              this.props.taskArrayElement.collapsed == -1
                ? "collapseIcon unCollapsed"
                : "collapseIcon collapsed"
            }
          ></div>
        ) : (
          ""
        )}
        <div
          className="taskIconContainer"
          onMouseOver={_ => this.setIcon(true)}
          onMouseLeave={_ => this.setIcon(false)}
          onClick={_ => {
            if (!this.props.taskArrayElement.checked || this.props.checkedList) this.props.clickedTick();
          }}
          style={{
            transform:
              this.props.taskArrayElement.subset != -1
                ? !this.props.checkedList
                  ? "translate(2.3rem,-50%)"
                  : "translate(0,-50%)"
                : "translate(0,-50%)",
          }}
        >
          <div
            className="taskDivCheck"
            style={{
              opacity: this.state.icon == "circle" ? 1 : 0,
              height: this.state.icon == "circle" ? "1.2rem" : 0,
            }}
          ></div>
          <img
            src="../../images/tick.svg"
            alt="tick sign"
            className="taskDivTick"
            style={{
              opacity: this.state.icon == "tick" ? 1 : 0,
              height: this.state.icon == "tick" ? "1.2rem" : 0,
            }}
          />
          {this.tickAnimation()}
        </div>
        <div className="taskInputContainer">
          <textarea
            rows="1"
            type="text"
            ref={this.input}
            name=""
            value={this.props.taskArrayElement.value}
            readOnly={this.props.checkedList}
            onChange={e => {
              if (this.props.taskArrayElement.remove == true) e.preventDefault();
              else this.props.changeElement(e.target.value, true);
            }}
            onKeyDown={e => {
              if (this.props.taskArrayElement.remove == true) e.preventDefault();
              else this.props.manageTasks(e);
            }}
            className="textAreaTaskDiv"
            onFocus={e => {
              if (!this.props.taskArrayElement.focus) e.target.blur();
              this.setHeight(e.target);
            }}
            onMouseUp={e => {
              e.target.focus();
              if (!this.props.taskArrayElement.focus)
                e.target.setSelectionRange(e.target.value.length, e.target.value.length);
              this.props.changeElement(e.target.value, true);
            }}
            onBlurCapture={e => {
              this.props.changeElement(e.target.value, false);
              this.setHeight(e.target, "blur");
            }}
            onInput={e => {
              this.setHeight(e.target);
            }}
            style={{
              textDecoration: this.props.taskArrayElement.checked == true ? "line-through" : "none",
              height: this.props ? this.props.taskArrayElement.height - 22 : "",
              transform:
                this.props.taskArrayElement.subset != -1
                  ? !this.props.checkedList
                    ? "translate(2.3rem,-50%)"
                    : "translate(0,-50%)"
                  : "translate(0,-50%)",
              width:
                this.props.taskArrayElement.subset != -1
                  ? !this.props.checkedList
                    ? "12.7rem"
                    : "15rem"
                  : "15rem",
              zIndex: this.props.taskArrayElement.focus ? 0 : -2,
            }}
          ></textarea>
        </div>
        <span
          className="bottomBorder"
          style={{
            transform:
              (this.props.taskArrayElement.focus &&
                !(this.props.taskArrayElement.newlyAdded || this.props.taskArrayElement.remove)) ||
              this.props.taskArrayElement.draggingOver==1||this.props.taskArrayElement.draggingOver==-1
                ? "scaleX(1)"
                : "scaleX(0)",
            top:this.props.taskArrayElement.draggingOver ==1 ?0: this.props.taskArrayElement.height,
          }}
        ></span>
      </div>
    );
  }
}
