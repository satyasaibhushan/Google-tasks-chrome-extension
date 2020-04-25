import React from "react";
import Newtask from "./newTask/newTask";
import { TaskDiv } from "./taskDiv/taskDiv";

import "./taskComponent.css";

export class TaskComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      taskDivs: [],
      checkedTaskDivs: []
    };
  }

  addTask(i, value = "") {
    let taskDivs = this.state.taskDivs;
    taskDivs.forEach((element) => {
      element.focus = false;
      element.newlyAdded = false
    });
    taskDivs.splice(i, 0, { checked: false, value: value, focus: true,newlyAdded: true });
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
        e.preventDefault()
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
checkedTask(i){
  let taskDivs = this.state.taskDivs;
  taskDivs[i].checked = (taskDivs[i].checked== true) ? false:true;
  
  this.setState({ taskDivs });
}
  render() {
    let allTaskDivs = this.state.taskDivs.map((taskDiv, i) => {
      let onChanged = (value, isFocus) => {
        let { taskDivs } = this.state;
        if(taskDivs[i].remove == true) {
          if (i == 0 && taskDivs.length > 1) taskDivs[i+1].focus = true;
          else if (i > 0) taskDivs[i - 1].focus = true;
          taskDivs.splice(i , 1);
        }
        else{
        if (value || value === "") if(!taskDivs[i].checked) taskDivs[i].value = value;
        taskDivs.forEach((element) => {
          element.focus = false;
        });
        if(!isFocus || value != '') taskDivs[i].newlyAdded = false
        if (isFocus) taskDivs[i].focus = true;
        else taskDivs[i].focus = false;
      }
        this.setState({ taskDivs });
      };

      return (  
        <TaskDiv
          taskArrayElement={taskDiv}
          key={i}
          keys={i}
          changeElement={onChanged}
          addNewTask={(e) => this.checkKeyPress(e, i + 1)}
          clickedTick={()=>this.checkedTask(i)}
          />
      );
    });

    return (
      <div className="tasksComponentContainer">
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
