import React from "react";
import Newtask from "./newTask/newTask";
import { TaskDiv } from "./taskDiv/taskDiv";
import { CheckedDivTotal } from "./checkedDivTotal/checkedDivContainer";
import { TaskListSelector } from "./taskListSelector/taskListSelector";
import { ReactSortable } from "react-sortablejs";
import updateTaskList from './functionalities/taskListFunctionalities'
import manageApi from './functionalities/apiManagement'
import "./taskComponent.css";

// import _ from "../tasksComponents/dragTasks/dragTasks"
import api from "./functionalities/tasks.api";

export class TaskComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      taskList: [{ name: "List 1", taskDivs: [], checkedDivs: [] }],
      taskListIndex: 0,
      count: 0,
    };
  }

  componentDidUpdate() {
    manageApi.showAll(this,api)
  }
  setParentId(i, taskDivs) {
    let parentId;
    for (let index = i - 1; index >= 0; index--) {
      if (taskDivs[index].parentId) {
        parentId = taskDivs[index].parentId;
      } else break;
    }
    return parentId;
  }
  
  render() {
    let constructTaskDiv = (taskDiv, i, j) => {
      return (
        <TaskDiv
          taskArrayElement={taskDiv}
          key={j == -1 ? i : (i + 1) * 100 + j}
          changeElement={(value, isFocus) => {
            if ((value || value === "") && !taskDiv.checked)
              taskDiv.value = value;
            taskDiv.focus = isFocus;
          }}
          manageTasks={(e) => updateTaskList.checkKeyPress(this,e, i + 1,j)}
          clickedTick={() => updateTaskList.checkedTask(this,i,j)}
          setHeight={(value) => updateTaskList.setHeight(this,value, i,j)}
          changeElementKey={(value) =>
            updateTaskList.modifyTaskAfterAnimation(this,value, i, j)
          }
          hoveredIcon={(isTick)=>{
            let taskList = this.state.taskList
            let taskDivs=taskList[this.state.taskListIndex].taskDivs
            taskDivs[i].icon = isTick ? 'tick' : ''
            taskDivs[i].children ? taskDivs[i].children.forEach(element => {
              element.icon = isTick ? 'tick' : ''
            }): ''
            this.setState({taskList})
          }}
          checkedList={false}
        ></TaskDiv>
      );
    };
    let allTaskDivs = () => {
      if (this.state.taskListIndex != -1)
        return this.state.taskList[this.state.taskListIndex].taskDivs.map(
          (taskDiv, i) => {
            return (
              <div key={i}>
                {constructTaskDiv(taskDiv, i, -1)}
                {/* {console.log(taskDiv.children)} */}
                {taskDiv.children ? taskDiv.children.map((element, j) =>
                  constructTaskDiv(element, i, j)
                ) : ''}
              </div>
            );
          }
        );
    };

    return (
      <div className="tasksComponentContainer">
        <TaskListSelector
          listNames={this.state.taskList.map((element) => element.name)}
          selectedList={this.state.taskListIndex}
          selectedOption={(index) => {
            if (index != -1) this.setState({ taskListIndex: index });
          }}
        />
        <Newtask
          enterNewTask={(e) => {
            if (e.keyCode == 13) {
              e.preventDefault();
              updateTaskList.addTask(this,0,-1, e.target.value);
              e.target.value = "";
            }
          }}
          plusNewTask={(_) => updateTaskList.addTask(this,0,-1)}
        />
        <div
          className="taskDivsContainer"
          style={{ paddingBottom: "1rem", flex: "1 0 auto" }}
        >
          {/* {console.log(allTaskDivs())} */}
          {allTaskDivs()}
        </div>
        <CheckedDivTotal
          checkedList={
            this.state.taskList[this.state.taskListIndex].checkedDivs
          }
          tasksList={this.state.taskList[this.state.taskListIndex].taskDivs}
          clickedTick={(i) => updateTaskList.uncheckedTask(this,i)}
          setHeight={(value, i) => updateTaskList.setHeight(this,value, i, -1, true)}
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
