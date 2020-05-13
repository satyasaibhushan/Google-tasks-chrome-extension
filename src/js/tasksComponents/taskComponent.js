import React from "react";
import Newtask from "./newTask/newTask";
import { TaskDiv } from "./taskDiv/taskDiv";
import { CheckedDivTotal } from "./checkedDivTotal/checkedDivContainer";
import { TaskListSelector } from "./taskListSelector/taskListSelector"
import { ReactSortable } from "react-sortablejs"
import "./taskComponent.css";


// import _ from "../tasksComponents/dragTasks/dragTasks"
import api from "../tasksComponents/tasks.api"


export class TaskComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      taskList: [
        { name: "List 1", taskDivs: [], checkedDivs: [] },
      ],
      taskListIndex: 0,
      count:0,
    };
  }

  componentDidUpdate(){
    if(this.props.gapiAvailable && this.state.count ==0) {
      api.listTaskLists()
      .then(x=> {x.forEach(ele=>{
        let taskList = this.state.taskList;
        let taskListElement = {name:ele.title,taskDivs:[],checkedDivs:[]}
        api.listTasks(ele.id)
        .then(task=>{
          console.log(task)
          task.forEach(element=>{
            if(element.status == 'needsAction')
          taskListElement.taskDivs.push({checked: false,
            value: element.title,
            focus: false,
            newlyAdded: false,
            height: 0,
            subset:-1})
            if(element.status == 'completed')
          taskListElement.checkedDivs.push({checked: true,
            value: element.title,
            focus: false,
            newlyAdded: false,
            height: 0,
            subset:-1})  
        })})
        taskList.push(taskListElement)
        this.setState({ taskList })
        })})
      this.setState({count:1})
    }
  }
  addTask(i, value = "",isSubset = false,isBefore = true) {
    let taskList = this.state.taskList;
    let taskDivs = taskList[this.state.taskListIndex].taskDivs;
    taskDivs.forEach((element) => {
      element.focus = false;
      element.newlyAdded = false;
    });
    if(taskDivs[i-1] && taskDivs[i-1].subset!=-1) isSubset = true
    let taskDiv={
      checked: false,
      value: value,
      focus: true,
      newlyAdded: true,
      height: 0,
      subset:isSubset ? i-1 :-1
    } 
    if(!isBefore){taskDivs.splice(i-1,1,{checked: false,
      value: '',
      focus: false,
      newlyAdded: false,
      height: 0,
      subset:-1})}
    taskDivs.splice(i, 0,taskDiv);
    this.setState({ taskList });
  }

  checkKeyPress(e, i) {
    let taskList = this.state.taskList;
    let taskDivs = taskList[this.state.taskListIndex].taskDivs;
    if (e.keyCode == 13) {
      e.preventDefault();
      if(e.metaKey){
        this.addTask(i,'',true)
      }
      else if(e.target.selectionEnd == 0 && e.target.value !=''){
        this.addTask(i,e.target.value,false,false)
      }
      else
      this.addTask(i);
    } else if (e.keyCode == 8 && e.target.value == "") {
      taskDivs[i - 1].remove = true
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
    }
    if (KeyName == "checked" && taskDivs[i].checked == true ) {
      if (i == 0 && taskDivs.length > 1) taskDivs[i + 1].focus = true;
      else if (i > 0) taskDivs[i - 1].focus = true;
      taskDivs[i].newlyAdded = true;
      if(taskDivs[i].value!='')
      checkedTaskDivs.unshift(taskDivs[i]);
      taskDivs.splice(i, 1);
    }

    this.setState({ taskList });
  }
  setHeight(value, i,isFromCheckedList = false) {
    // console.log(value)
    let taskList = this.state.taskList;
    if(!isFromCheckedList){
    let taskDivs = taskList[this.state.taskListIndex].taskDivs;
    taskDivs[i].height = value;}
    else{
      let checkedDivs = taskList[this.state.taskListIndex].checkedDivs;
      checkedDivs[i].height = value;}
    this.setState({ taskList });
  }

  render() {

    let allTaskDivs = () => {
      if (this.state.taskListIndex != -1)
        return this.state.taskList[this.state.taskListIndex].taskDivs.map(
          (taskDiv, i) => {
            let onChanged = (value, isFocus) => {
              let taskList = this.state.taskList;
              let taskDivs = taskList[this.state.taskListIndex].taskDivs;
              taskDivs.forEach(element => {
                
              });
              if ((value || value === "") && !taskDiv.checked)
                taskDiv.value = value;
              taskDivs.forEach((element) => {
                element.focus = false;
              });
              taskDiv.focus = isFocus;
              this.setState({ taskList });
            };
            return (
              <TaskDiv
                taskArrayElement={taskDiv}
                key={i}
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
        <div className='taskDivsContainer' style={{ paddingBottom: "1rem", flex: "1 0 auto" }}>
        {allTaskDivs()}
        </div>
        <CheckedDivTotal
          checkedList={this.state.taskList[this.state.taskListIndex].checkedDivs}
          tasksList={this.state.taskList[this.state.taskListIndex].taskDivs}
          clickedTick={(i) => this.uncheckedTask(i)}
          setHeight={(value,i) => this.setHeight(value, i,true)}
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
