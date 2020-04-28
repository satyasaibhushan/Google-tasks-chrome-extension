import React from "react";
import Newtask from "./newTask/newTask";
import { TaskDiv } from "./taskDiv/taskDiv";
import { CheckedDivTotal } from "./checkedDivTotal/checkedDivContainer";

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
uncheckedTask(i){
  let checkedTaskDivs = this.state.checkedTaskDivs;
  checkedTaskDivs[i].unchecked = (checkedTaskDivs[i].unchecked== true) ? false:true;
  this.setState({ checkedTaskDivs });
}
modifyTaskAfterAnimation(KeyName,i,isFromCheckedList){
  let taskDivs = this.state.taskDivs;
  let checkedTaskDivs = this.state.checkedTaskDivs;
  if(KeyName == "newlyAdded") taskDivs[i].newlyAdded = false;
  if(KeyName == "remove") {
    if (i == 0 && taskDivs.length > 1) taskDivs[i+1].focus = true;
    else if (i > 0) taskDivs[i - 1].focus = true;
    taskDivs.splice(i , 1);
    // console.log(taskDivs)
  }
  if(KeyName == "checked" && taskDivs[i].checked == true) {
    // console.log(taskDivs[i])
    if (i == 0 && taskDivs.length > 1) taskDivs[i+1].focus = true;
    else if (i > 0) taskDivs[i - 1].focus = true;
    taskDivs[i].newlyAdded=true;
     checkedTaskDivs.unshift(taskDivs[i])
     taskDivs.splice(i , 1)
  }

  this.setState({ taskDivs });
  this.setState({checkedTaskDivs})
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
          checkedList = {false}
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
        <div style={{paddingBottom:'1rem',flex: '1 0 auto'}}>    
          {allTaskDivs}</div>
        <CheckedDivTotal 
          checkedList={this.state.checkedTaskDivs}
          tasksList={this.state.taskDivs}
          // hey={console.log(this.state.checkedTaskDivs)}
          changeElementKey={(value,i)=>this.modifyTaskAfterAnimation(value,i,true)}
          clickedTick={(i)=>this.uncheckedTask(i)}
          changeCheckedArray={(array)=>this.setState({checkedTaskDivs:array})}
          changeTaskArray={(array)=>this.setState({taskDivs:array})}
        /> 
      </div>
    );
  }
}
