import React from "react";
import Newtask from "./newTask/newTask";
import { CheckedDivTotal } from "./checkedDivTotal/checkedDivContainer";
import { TaskListSelector } from "./taskListSelector/taskListSelector";
import updateTaskList from "./functionalities/taskListFunctionalities";
import TotalTaskDivs from "./functionalities/taskDivConstruction";
import manageApi from "./functionalities/apiManagement";
import Modal from "./modal/modal";
import "./taskComponent.css";


export class TaskComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      taskList: [],
      taskListIndex: -1,
      count: 0,
      isModalOpen: false,
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
          clickedOptions={(_) =>
            this.setState({ isModalOpen: !this.state.isModalOpen })
          }
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
        <Modal
          text={"Hello there! Testing header"}
          inputValue={
            "Can't change betterdgh asdfjghsa  fjahsg sadf ldjkfhaskdfh "
          }
          isInput={true}
          isOpened={this.state.isModalOpen}
          clickedClose={(_) =>
            this.setState({ isModalOpen: !this.state.isModalOpen })
          }
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
            />
          ) : (
            ""
          )}
        </div>
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
