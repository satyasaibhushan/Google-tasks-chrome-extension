import React from "react";
import Newtask from "./newTask/newTask";
import { TaskDiv } from "./taskDiv/taskDiv";

export class TaskComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      taskDivs: [],
    };
  }

  addTask(i, value = "") {
    let taskDivs = this.state.taskDivs;
    taskDivs.forEach((element) => {
      element.focus = false;
    });
    taskDivs.splice(i, 0, { checked: false, value: value, focus: true });
    this.setState({ taskDivs });
  }

  checkKeyPress(e, i) {
    let taskDivs = this.state.taskDivs;
    if (e.keyCode == 13) {
      if (i == 0) {
        this.addTask(i, e.target.value);
        e.target.value = "";
      } else this.addTask(i);
    }
    if (e.keyCode == 8 && e.target.value == "") {
      if (i != 0) {
        taskDivs[i - 1] = {
          checked: false,
          value: "",
          focus: false,
          remove: true,
        };
        if (i == 1 && taskDivs.length > 1) taskDivs[i].focus = true;
        else if (i > 1) taskDivs[i - 2].focus = true;
        taskDivs.splice(i - 1, 1);
        e.preventDefault();
        this.setState({ taskDivs });
      }
    }
    if (e.keyCode == 38 && i != 1) {
      taskDivs[i - 2].focus = true;
      this.setState({ taskDivs });
    }
    if (e.keyCode == 40 && i != taskDivs.length) {
      taskDivs[i].focus = true;
      this.setState({ taskDivs });
    }
  }

  render() {
    let allTaskDivs = this.state.taskDivs.map((taskDiv, i) => {
      let onChanged = (value, isFocus) => {
        let { taskDivs } = this.state;
        if (value || value === "") taskDivs[i].value = value;
        taskDivs.forEach((element) => {
          element.focus = false;
        });
        if (isFocus) taskDivs[i].focus = true;
        else taskDivs[i].focus = false;
        this.setState({ taskDivs });
      };

      return (
        <TaskDiv
          taskArrayElement={taskDiv}
          key={i}
          keys={i}
          changeElement={onChanged}
          addNewTask={(e) => this.checkKeyPress(e, i + 1)}
        />
      );
    });

    return (
      <div
        style={{
          width: "20rem",
          height: "25rem",
          backgroundColor: "white",
          overflowY: "scroll",
        }}
      >
        <Newtask
          enterNewTask={(e) => this.checkKeyPress(e, 0)}
          plusNewTask={(_) => this.addTask(0)}
        />
        {allTaskDivs}
        {/* <TaskDiv/> */}
      </div>
    );
  }
}
