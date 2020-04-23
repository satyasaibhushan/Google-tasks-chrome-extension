import React from "react";
import Newtask from "./newTask/newTask";
import { TaskDiv } from "./taskDiv/taskDiv";

export class TaskComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      taskDivs: [],
      focus:0,
    };
  }

  addTask(i) {
    let taskDivs = this.state.taskDivs;
    taskDivs.splice(i, 0, { checked: false, value: "" });
    this.setState({ taskDivs });
    console.log(taskDivs);
  }
  checkEnter(e,i){
    if(e.keyCode == 13){
      this.addTask(i)
    }
  }

  render() {
    let allTaskDivs = this.state.taskDivs.map((taskDiv, i) => {
      let onChange = (value) => {
        let { taskDivs } = this.state;
        taskDivs[i].value = value;
        this.setState({ taskDivs });
        console.log(this.state)
      };

      return (
        <TaskDiv
          taskArrayElement={taskDiv}
          key={i}
          changeElement={onChange}
          addNewTask={(e)=>this.checkEnter(e,i+1)}
          
        />
      );
    });

    return (
      <div
        style={{ width: "20rem", height: "25rem", backgroundColor: "white" }} >
        <Newtask enterNewTask={(e)=>this.checkEnter(e,0)} plusNewTask={_=>this.addTask(0)} />
        {allTaskDivs}
        {/* <TaskDiv/> */}
      </div>
    );
  }
}
