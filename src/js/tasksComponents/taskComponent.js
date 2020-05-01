import React from "react";
import Newtask from "./newTask/newTask";
import { TaskDiv } from "./taskDiv/taskDiv";
import { CheckedDivTotal } from "./checkedDivTotal/checkedDivContainer";
import { TaskListSelector } from "./taskListSelector/taskListSelector"

import "./taskComponent.css";
export class TaskComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      taskList: [
        { name: "List 1", taskDivs: [], checkedDivs: [] },
        { name: "List 2", taskDivs: [], checkedDivs: [] },
        { name: "List 3", taskDivs: [], checkedDivs: [] },
        { name: "List listed", taskDivs: [], checkedDivs: [] },
      ],
      taskListIndex: 0,
    };
  }

  addTask(i, value = "") {
    let taskList = this.state.taskList;
    let taskDivs = taskList[this.state.taskListIndex].taskDivs;
    taskDivs.forEach((element) => {
      element.focus = false;
      element.newlyAdded = false;
    });
    taskDivs.splice(i, 0, {
      checked: false,
      value: value,
      focus: true,
      newlyAdded: true,
      height: 0,
    });
    this.setState({ taskList });
  }

  checkKeyPress(e, i) {
    let taskList = this.state.taskList;
    let taskDivs = taskList[this.state.taskListIndex].taskDivs;
    if (e.keyCode == 13) {
      e.preventDefault();
      this.addTask(i);
    } else if (e.keyCode == 8 && e.target.value == "") {
      taskDivs[i - 1] = {
        checked: false,
        value: "",
        focus: false,
        remove: true,
      };
      e.preventDefault();
    } else if (e.keyCode == 38 && i != 1 && e.target.selectionEnd == 0)
      taskDivs[i - 2].focus = true;
    else if (
      e.keyCode == 40 &&
      i != taskDivs.length &&
      e.target.selectionEnd == e.target.value.length
    )
      taskDivs[i].focus = true;
    else return;

    this.setState({ taskList });
  }

  checkedTask(i) {
    let taskList = this.state.taskList;
    let taskDivs = taskList[this.state.taskListIndex].taskDivs;
    if (taskDivs[i].value == "") {
      taskDivs[i].checked = true;
      taskDivs[i].remove = true;

      console.log("deleted empty task");
    } else {
      taskDivs[i].checked = taskDivs[i].checked == true ? false : true;
      console.log("1 task Completed");
    }
    this.setState({ taskList });
  }
  uncheckedTask(i) {
    let taskList = this.state.taskList;
    let checkedTaskDivs = taskList[this.state.taskListIndex].checkedDivs;
    checkedTaskDivs[i].unchecked =
      checkedTaskDivs[i].unchecked == true ? false : true;
    console.log("1 task marked incomplete");
    this.setState({ taskList });
  }
  modifyTaskAfterAnimation(KeyName, i) {
    let taskList = this.state.taskList;
    let taskDivs = taskList[this.state.taskListIndex].taskDivs;
    let checkedTaskDivs = taskList[this.state.taskListIndex].checkedDivs;
    if (KeyName == "newlyAdded") taskDivs[i].newlyAdded = false;
    if (KeyName == "remove") {
      if (i == 0 && taskDivs.length > 1) taskDivs[i + 1].focus = true;
      else if (i > 0) taskDivs[i - 1].focus = true;
      taskDivs.splice(i, 1);
      // console.log(taskDivs)
    }
    if (KeyName == "checked" && taskDivs[i].checked == true ) {
      // console.log(taskDivs[i])
      if (i == 0 && taskDivs.length > 1) taskDivs[i + 1].focus = true;
      else if (i > 0) taskDivs[i - 1].focus = true;
      taskDivs[i].newlyAdded = true;
      if(taskDivs[i].value!='')
      checkedTaskDivs.unshift(taskDivs[i]);
      taskDivs.splice(i, 1);
    }

    this.setState({ taskList });
  }
  setHeight(value, i) {
    let taskList = this.state.taskList;
    let taskDivs = taskList[this.state.taskListIndex].taskDivs;
    taskDivs[i].height = value;
    this.setState({ taskList });
  }

  render() {
    // console.log(this.state.taskListIndex,this.state.taskList[this.state.taskListIndex])
    let allTaskDivs = () => {
      if (this.state.taskListIndex != -1)
        return this.state.taskList[this.state.taskListIndex].taskDivs.map(
          (taskDiv, i) => {
            let onChanged = (value, isFocus) => {
              let taskList = this.state.taskList;
              let taskDivs = taskList[this.state.taskListIndex].taskDivs;
              if ((value || value === "") && !taskDivs[i].checked)
                taskDivs[i].value = value;
              if (!isFocus || value != "") taskDivs[i].newlyAdded = false;
              taskDivs.forEach((element) => {
                element.focus = false;
              });
              taskDivs[i].focus = isFocus;
              this.setState({ taskList });
            };
            return (
              <TaskDiv
                taskArrayElement={taskDiv}
                key={i}
                // keys={i}
                changeElement={onChanged}
                manageTasks={(e) => this.checkKeyPress(e, i + 1)}
                clickedTick={() => this.checkedTask(i)}
                setHeight={(value) => this.setHeight(value, i)}
                changeElementKey={(value) =>
                  this.modifyTaskAfterAnimation(value, i)
                }
                checkedList={false}
              />
            );
          }
        );
    };

    return (
      <div className="tasksComponentContainer">
        <TaskListSelector
         listNames={this.state.taskList.map(element=>element.name)}
         selectedList={this.state.taskListIndex}
         selectedOption={(index)=>{if(index!=-1)this.setState({taskListIndex:index})}}
        />
        <Newtask
          enterNewTask={(e) => {
            if (e.keyCode == 13) {
              e.preventDefault();
              this.addTask(0, e.target.value);
              e.target.value = "";
            }
          }}
          plusNewTask={(_) => this.addTask(0)}
        />
        <div style={{ paddingBottom: "1rem", flex: "1 0 auto" }}>
          {allTaskDivs()}
        </div>
        <CheckedDivTotal
          checkedList={this.state.taskList[this.state.taskListIndex].checkedDivs}
          tasksList={this.state.taskList[this.state.taskListIndex].taskDivs}
          // hey={console.log(this.state.checkedTaskDivs)}
          clickedTick={(i) => this.uncheckedTask(i)}
          changeCheckedArray={(array) => {
            let taskList = this.state.taskList;
            let checkedTaskDivs =
              taskList[this.state.taskListIndex].checkedDivs;
            checkedTaskDivs = array;
            this.setState({ taskList });
          }}
          changeTaskArray={(array) => {
            let taskList = this.state.taskList;
            let TaskDivs = taskList[this.state.taskListIndex].taskDivs;
            TaskDivs = array;
            this.setState({ taskList });
          }}
        />
      </div>
    );
  }
}
