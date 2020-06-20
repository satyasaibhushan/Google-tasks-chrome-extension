import React from "react";
import "./taskListSelector.css";
import { setCookie } from "../../functionalities/cookies";

class Dropdown extends React.Component {
  constructor() {
    super();

    this.state = {
      displayLists: false,
    };
    this.listMenu = React.createRef();
  }

  componentDidMount() {
    let listMenu = this.listMenu.current;
    let listMenuSpan = listMenu.childNodes[0];
    document.addEventListener("click", e => {
      if (this.state.displayLists && e.target != listMenuSpan && e.target != listMenu)
        this.setState({ displayLists: false });
    });
  }
  componentDidUpdate(prevProps, prevState, snapsho) {
    if (prevState != this.state) {
      this.state.displayLists
        ? document.addEventListener("keyup", this.closeLists.bind(this))
        : document.removeEventListener("keyup", this.closeLists.bind(this));
    }
  }
  closeLists(e) {
    if(e.keyCode == 27)
    this.setState({ displayLists: false });
  }

  render() {
    return (
      <div className="taskListSelector">
        <div
          className={this.state.displayLists ? "select-selected select-arrow-active" : "select-selected"}
          onClick={_ => this.setState({ displayLists: !this.state.displayLists })}
          ref={this.listMenu}>
          <span> {this.props.selectedList}</span>
        </div>
        <div
          className={this.state.displayLists ? "select-items open" : "select-items"}
          style={{ display: this.state.displayLists ? "block" : "none" }}>
          {this.props.listNames.map((list, i) => {
            return (
              <div
                key={i}
                onClick={_ => {
                  this.props.clickedList(i);
                  this.setState({ displayLists: false });
                  this.props.setCookie ? setCookie("taskListIndex", i, 2) : "";
                }}>
                {list}
                {i == this.props.selectedListIndex ? (
                  <img src="../../images/tick.svg" className="selectedListIcon" alt="" />
                ) : (
                  ""
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default Dropdown;
