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

  addTask(i) {
    let taskDivs = this.state.taskDivs;
    taskDivs.forEach(element =>{
      element.focus = false;
    })
    taskDivs.splice(i, 0, { checked: false, value: "",focus:true});
    this.setState({ taskDivs });
  }
  checkEnter(e,i){
    if(e.keyCode == 13){
      this.addTask(i)
    }
    if(e.keyCode== 8 && e.target.value ==""){
      if(i!=0){
        let taskDivs = this.state.taskDivs;
        taskDivs[i-1] = { checked: false, value: "",focus:false,remove:true}
        if(i==1&& taskDivs.length>1) taskDivs[i].focus=true
        else if(i>1 ) taskDivs[i-2].focus=true
        taskDivs.splice(i-1,1)
        e.preventDefault()
        this.setState({taskDivs})
      }
    }
  }

  render() {
    let allTaskDivs = this.state.taskDivs.map((taskDiv, i) => {

      let onChange = (value,isFocus) => {
        let { taskDivs } = this.state;
        taskDivs[i].value = value;
        taskDivs.forEach(element =>{element.focus = false;})
        if(isFocus)taskDivs[i].focus = true;
        else taskDivs[i].focus = false;
        this.setState({ taskDivs });
        console.log(taskDivs)
      };

      return (
        <TaskDiv
          taskArrayElement={taskDiv}
          key={i}
          keys={i}
          changeElement={onChange}
          addNewTask={(e)=>this.checkEnter(e,i+1)}
        />
      );
    });

    return (
      <div 
        style={{ width: "20rem", height: "25rem", backgroundColor: "white",overflowY:"scroll" }} >
        <Newtask enterNewTask={(e)=>this.checkEnter(e,0)} plusNewTask={_=>this.addTask(0)} />
        {allTaskDivs}
        {/* <TaskDiv/> */}
      </div>
    );
  }
}
