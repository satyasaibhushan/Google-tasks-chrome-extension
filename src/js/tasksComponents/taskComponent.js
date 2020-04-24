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
    // if(e.keyCode== 8 && e.target.value ==""){
    //   if(i!=0){
    //     console.log('remove')
    //   }
    // }
  }

  render() {
    let allTaskDivs = this.state.taskDivs.map((taskDiv, i) => {

      let onChange = (value) => {
        let { taskDivs } = this.state;
        taskDivs[i].value = value;
        taskDivs.forEach(element =>{element.focus = false;})
        this.setState({ taskDivs });
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
        style={{ width: "20rem", height: "25rem", backgroundColor: "white",overflowY:"scroll" }} >
        <Newtask enterNewTask={(e)=>this.checkEnter(e,0)} plusNewTask={_=>this.addTask(0)} />
        {allTaskDivs}
        {/* <TaskDiv/> */}
      </div>
    );
  }
}
