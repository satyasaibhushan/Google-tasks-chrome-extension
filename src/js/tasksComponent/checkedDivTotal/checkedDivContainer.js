import React from "react";
import "./checkedDivContainer.css";
import { TaskDiv } from "../taskDiv/taskDiv";
import api from "../../functionalities/tasks.api";

export class CheckedDivTotal extends React.Component {
  constructor(props) {
    super();
    this.state = {
      opened: false,
    };
    this.checkedDivs = React.createRef();
  }

  changeElementKey(keyName, i) {
    let checkedArray = this.props.checkedList;
    let tasksArray = this.props.tasksList;
    let taskList = this.props.taskList;
    if (keyName == "newlyAdded" && checkedArray[i].newlyAdded == true) checkedArray[i].newlyAdded = false;
    else if (keyName == "unchecked" && checkedArray[i].unchecked == true) {
      checkedArray[i].newlyAdded = true;
      checkedArray[i].checked = false;
      checkedArray[i].unchecked = false;
      checkedArray[i].icon = "";
      api.updateTask({
        taskListId: taskList.id,
        taskId: checkedArray[i].id,
        title: checkedArray[i].value,
        status: "needsAction",
      });
      if (checkedArray[i].parentId) {
        let index = tasksArray.map(item => item.id).indexOf(checkedArray[i].parentId);

        if (index != -1) {
          checkedArray[i].subset = index;
          tasksArray[index].collapsed = -1;
          tasksArray[index].children.unshift(checkedArray[i]);
        } else {
          delete checkedArray[i].parentId;
          checkedArray[i].subset = -1;
          tasksArray.unshift(checkedArray[i]);
        }
      } else tasksArray.unshift(checkedArray[i]);
      checkedArray.splice(i, 1);
    }
    else if(keyName == 'remove' && checkedArray[i].remove == true){
      api.deleteTask(this.props.taskList.id, checkedArray[i].id);
      checkedArray.splice(i, 1);
      this.props.setMessage('1 Checked task deleted ')
    }
    this.props.changeCheckedArray(checkedArray);
    this.props.changeTaskArray(tasksArray);
  }
  removeClick(i) {
    let checkedArray = this.props.checkedList;
    if(checkedArray[i])
    checkedArray[i].focus = false;
    this.props.changeCheckedArray(checkedArray);
  }
  openingAnimaton() {
    TweenMax.fromTo(this.checkedDivs.current, { scaleY: 1, opacity: 0 }, { duration: 0.5, opacity: 1 });
  }

  allCheckedDivs(checkedList) {
    if (this.props.taskList != "")
      return checkedList.map((checkedItem, i) => {
        return (
          <TaskDiv
            taskArrayElement={checkedItem}
            key={i}
            changeElement={_ => this.removeClick(i)}
            manageTasks={_ => console.log("Please write a complaint about this")}
            clickedTick={_ => this.props.clickedTick(i)}
            setHeight={value => this.props.setHeight(value, i)}
            changeElementKey={value => this.changeElementKey(value, i)}
            clickedDelete={_ => {
              checkedItem.remove = true
              // 
            }}
            checkedList={true}
          />
        );
      });
  }
  render() {
    return (
      <div className="chekedDivContainer">
        <div
          className={this.props.checkedList.length == 0 ? "chekedDivsWrapper " : "chekedDivsWrapper opened"}
          onClick={_ => {
            this.setState({ opened: this.state.opened ? false : true });
            this.openingAnimaton();
          }}>
          Completed ({this.props.checkedList.length})<i className={this.state.opened ? "down" : "up"}></i>
        </div>
        <div
          ref={this.checkedDivs}
          className={this.state.opened ? "chekedDivs opened" : "chekedDivs"}
          style={{
            display: this.state.opened ? "block" : "none",
          }}>
          {this.allCheckedDivs(this.props.checkedList)}
        </div>
      </div>
    );
  }
}
