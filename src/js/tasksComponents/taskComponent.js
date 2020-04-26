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
    if (e.keyCode == 13) this.addTask(i);
    
    else if (e.keyCode == 8 && e.target.value == "") {
        taskDivs[i - 1] = {
          checked: false,
          value: "",
          focus: false,
          remove: true,
        };
        e.preventDefault()
        
    }
    else if (e.keyCode == 38 && i != 1)  taskDivs[i - 2].focus = true;

    else if (e.keyCode == 40 && i != taskDivs.length)   taskDivs[i].focus = true;
    
    else return
    
    this.setState({ taskDivs });
  }

checkedTask(i){
  let taskDivs = this.state.taskDivs;
  taskDivs[i].checked = (taskDivs[i].checked== true) ? false:true;
  this.setState({ taskDivs });
  
}
modifyTaskAfterAnimation(KeyName,i){
  let taskDivs = this.state.taskDivs;
  let checkedDivs = this.state.checkedTaskDivs;
  if(KeyName == "newlyAdded") taskDivs[i].newlyAdded = false;
  if(KeyName == "remove") {
    if (i == 0 && taskDivs.length > 1) taskDivs[i+1].focus = true;
    else if (i > 0) taskDivs[i - 1].focus = true;
    taskDivs.splice(i , 1);
    console.log(taskDivs)
  }
  if(KeyName == "checked" && taskDivs[i].checked == true) {
    console.log(taskDivs[i])
    if (i == 0 && taskDivs.length > 1) taskDivs[i+1].focus = true;
    else if (i > 0) taskDivs[i - 1].focus = true;
     checkedDivs.push(taskDivs[i].value)
     taskDivs.splice(i , 1)
  }

  this.setState({ taskDivs });
  this.setState({checkedDivs})
}

  render() {
    let allTaskDivs = this.state.taskDivs.map((taskDiv, i) => {
      let onChanged = (value, isFocus) => {
        let { taskDivs } = this.state;
        if ((value || value === "") && !taskDivs[i].checked)  taskDivs[i].value = value;
        if(!isFocus || value != '') taskDivs[i].newlyAdded = false
        taskDivs.forEach((element) => {
          element.focus = false;
        });
        taskDivs[i].focus = isFocus
        this.setState({ taskDivs });
      };

      return (  
        <TaskDiv
          taskArrayElement={taskDiv}
          key={i}
          // keys={i}
          changeElement={onChanged}
          manageTasks={(e) => this.checkKeyPress(e, i + 1)}
          clickedTick={()=>this.checkedTask(i)}
          changeElementKey={(value)=>this.modifyTaskAfterAnimation(value,i)}
          />
      );
    });

    return (
      <div className="tasksComponentContainer">
        <Newtask
          enterNewTask={(e) =>{if(e.keyCode ==13){this.addTask(0, e.target.value);
            e.target.value = "";
            }}}
          plusNewTask={(_) => this.addTask(0)}
        />
        {allTaskDivs}
        {/* <TaskDiv/> */}
      </div>
    );
  }
}
