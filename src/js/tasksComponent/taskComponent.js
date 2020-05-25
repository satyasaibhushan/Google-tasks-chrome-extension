import React from "react";
import Newtask from "./newTask/newTask";
import { CheckedDivTotal } from "./checkedDivTotal/checkedDivContainer";
import { TaskListSelector } from "./taskListSelector/taskListSelector";
import updateTaskList from "../functionalities/taskListFunctionalities";
import TotalTaskDivs from "../functionalities/taskDivConstruction";
import manageApi from "../functionalities/apiManagement";
import MessageBox from './messageBox/messageBox';
import "./taskComponent.css";


export class TaskComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      taskList: [],
      taskListIndex: -1,
      count: 0,
      message:{showMessage:false,message:'hi there How are you',msgChange:false},
    };
  }

  componentDidUpdate() {
    manageApi.showAll(this)
  }

  render() {
  let  listTasks=(isFromCheckedList = false)=>{
      if(isFromCheckedList) return this.state.taskList[this.state.taskListIndex].checkedDivs
      return this.state.taskList[this.state.taskListIndex].taskDivs
    }
  let  setTaskList=(divs,isFromCheckedList  = false)=>{
      let taskList = this.state.taskList;
     if(isFromCheckedList) taskList[this.state.taskListIndex].checkedDivs = divs;
     else taskList[this.state.taskListIndex].taskDivs = divs;
      this.setState({ taskList });
    }
    return (
      <div className="tasksComponentContainer">
        <TaskListSelector
          listNames={this.state.taskList.map((element) => element.name)}
          selectedList={this.state.taskListIndex}
          selectedOption={(index) => {
            if (index != -1) this.setState({ taskListIndex: index });
          }}
          clickedOptions={(_) => {}}
        />
        <Newtask
          enterNewTask={(e) => {
            if (e.keyCode == 13) {
              e.preventDefault();
              updateTaskList.addTask(listTasks(),(taskDivs) => setTaskList(taskDivs),this.state.taskList[this.state.taskListIndex].id, 0, -1, e.target.value);
              e.target.value = "";
            }
          }}
          plusNewTask={(_) => updateTaskList.addTask(listTasks(),(taskDivs) => setTaskList(taskDivs),this.state.taskList[this.state.taskListIndex].id, 0, -1)}
        />
        <div
          className="taskDivsContainer"
          style={{ paddingBottom: "1rem", flex: "1 0 auto" }}
        >
          {this.state.taskListIndex != -1 ? (
            <TotalTaskDivs
              taskComponent={this}
              taskListId={this.state.taskList[this.state.taskListIndex].id}
              taskDivs={this.state.taskList[this.state.taskListIndex].taskDivs}
              checkedDivs = {this.state.taskList[this.state.taskListIndex].checkedDivs}
              setTaskList={(taskDivs) => setTaskList(taskDivs)}
              setCheckedDivs={(checkedDivs) => setTaskList(checkedDivs,true)}
              setMessage={(message)=>{console.log('hig');
              this.setState({message:{showMessage:true,message:message,msgChange:!this.state.message.msgChange}}) }}
            />
          ) : (
            ""
          )}
        </div>
        {this.state.message.showMessage ?
           <MessageBox
             isVisible={this.state.message.showMessage}
             message={this.state.message.message}
             msgChange={this.state.message.msgChange}
             clickedUndo={_=>console.log('undo to be done')}
          /> : ''}
        <CheckedDivTotal
          checkedList={this.state.taskListIndex == -1
              ? ""
              : this.state.taskList[this.state.taskListIndex].checkedDivs
          }
          tasksList={this.state.taskListIndex == -1
              ? ""
              : this.state.taskList[this.state.taskListIndex].taskDivs
          }
          taskList={this.state.taskListIndex == -1
              ? ""
              : this.state.taskList[this.state.taskListIndex]
          }
          clickedTick={(i) => updateTaskList.uncheckedTask(this.state.taskList[this.state.taskListIndex].checkedDivs,(checkedDivs) => setTaskList(checkedDivs,true), i)}
          setHeight={(value, i) =>
            updateTaskList.setHeight(listTasks(true),(checkedDivs) => setTaskList(checkedDivs,true),value,i,-1,true)
          }
          changeCheckedArray={(array) => setTaskList(array,true)}
          changeTaskArray={(array) => setTaskList(array)}
        />
      </div>
    );
  }
}
