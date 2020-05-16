import React from "react";
import Newtask from "./newTask/newTask";
import { TaskDiv } from "./taskDiv/taskDiv";
import { CheckedDivTotal } from "./checkedDivTotal/checkedDivContainer";
import { TaskListSelector } from "./taskListSelector/taskListSelector";
import { ReactSortable } from "react-sortablejs";
import "./taskComponent.css";

// import _ from "../tasksComponents/dragTasks/dragTasks"
import api from "../tasksComponents/tasks.api";

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
    if (this.props.gapiAvailable && this.state.count == 0) {
      api.listTaskLists().then((x) => {
        x.forEach((ele) => {
          let taskList = this.state.taskList;
          let taskListElement = {
            name: ele.title,
            taskDivs: [],
            checkedDivs: [],
          };
          api.listTasks(ele.id).then((task) => {
            console.log(task);
            let attachToParent = (parentId, title, id, i) => {
              let parentIndex = task.map((ele) => ele.id).indexOf(parentId);
              taskListElement.taskDivs.push({
                checked: false,
                value: title,
                focus: false,
                newlyAdded: false,
                height: 0,
                subset: parentIndex,
                id: id,
                parentId: parentId,
              });
            };
            task.forEach((element, i) => {
              if (element.status == "needsAction" && !element.parent)
                taskListElement.taskDivs.push({
                  checked: false,
                  value: element.title,
                  focus: false,
                  newlyAdded: false,
                  height: 0,
                  subset: -1,
                  id: element.id,
                });
              else if (element.parent) {
                attachToParent(element.parent, element.title, element.id);
              }
              if (element.status == "completed")
                taskListElement.checkedDivs.push({
                  checked: true,
                  value: element.title,
                  focus: false,
                  newlyAdded: false,
                  height: 0,
                  subset: -1,
                  id: element.id,
                });
            });
          });
          taskList.push(taskListElement);
          this.setState({ taskList });
          console.log(taskList);
        });
      });
      this.setState({ count: 1 });
    }
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

  addTask(i, value = "", isMetaPressed = false, isBefore = false) {
    let taskList = this.state.taskList;
    let taskDivs = taskList[this.state.taskListIndex].taskDivs;
    if (taskDivs[i - 1] && taskDivs[i - 1].subset != -1 )
      isMetaPressed = isMetaPressed ? false : true;
    else if (taskDivs[i] && taskDivs[i].subset != -1) isMetaPressed = true;
    console.log(i);

    let taskDiv = {
      checked: false,
      value: value,
      focus: true,
      newlyAdded: true,
      height: 0,
      subset: isMetaPressed ? i - 1 : -1,
      id: "",
    };
    if (isBefore) taskDiv.focus = false;
    console.log(this.setParentId(i, taskDivs));


    if (isMetaPressed) {
      if (this.setParentId(i, taskDivs))
        taskDiv.parentId = this.setParentId(i, taskDivs);
      else taskDiv.parentId = i;

      taskDivs[i-1].children.push(taskDiv)
    } else {
      taskDiv.children = []
      if (isBefore) {
        taskDivs.splice(i - 1, 1, {
          checked: false,
          value: "",
          focus: true,
          newlyAdded: true,
          height: 0,
          id: "",
          subset: -1,
          // parentId:''
        });
        taskDiv.newlyAdded = false;
      }
      taskDivs.splice(i, 0, taskDiv);
      this.setState({ taskList });
      console.log(taskList);
    }
  }

  checkKeyPress(e, i,j) {
    let taskList = this.state.taskList;
    let taskDivs = taskList[this.state.taskListIndex].taskDivs;

    if (e.keyCode == 13) {
      e.preventDefault();
      if (e.metaKey) {
        this.addTask(i, "", true);
      } else if (e.target.selectionEnd == 0 && e.target.value != "") {
        this.addTask(i, e.target.value, false, true);
      } else this.addTask(i);
    } else if (e.keyCode == 8 && e.target.value == "") {
      taskDivs[i - 1].remove = true;
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
  modifyTaskAfterAnimation(KeyName, i,j) {
    console.log(j,'jj')
    let taskList = this.state.taskList;
    let taskDivs = taskList[this.state.taskListIndex].taskDivs;
    let checkedTaskDivs = taskList[this.state.taskListIndex].checkedDivs;
    if (KeyName == "newlyAdded"){ 
      if(j==-1)taskDivs[i].newlyAdded = false;
      else taskDivs[i].children[j].newlyAdded = false;
    }
    if (KeyName == "remove") {
      if(j==-1){
        console.log('i')
        if (i == 0 && taskDivs.length > 1) taskDivs[i + 1].focus = true;
        else if (i > 0) taskDivs[i - 1].focus = true;
        taskDivs.splice(i, 1);}
      else{
        console.log('j')
        if (j == 0 && taskDivs[i].children.length > 1) taskDivs[i].children[j+1].focus = true;
        else if (j > 0) taskDivs[i].children[j-1].focus = true;
        taskDivs[i].children.splice(j, 1);
      }
    }
    if (KeyName == "checked"  ) {
      if(j==-1 &&taskDivs[i].checked == true){
        if (i == 0 && taskDivs.length > 1) taskDivs[i + 1].focus = true;
        else if (i > 0) taskDivs[i - 1].focus = true;
        taskDivs[i].newlyAdded = true;
        if (taskDivs[i].value != "") checkedTaskDivs.unshift(taskDivs[i]);
        taskDivs.splice(i, 1);
      }
      else if (j!=-1 && taskDivs[i].children[j].checked == true){
        if (j == 0 &&taskDivs[i].children.length > 1) taskDivs[i].children[j+1].focus = true;
        else if (j > 0) taskDivs[i].children[j-1].focus = true;
        taskDivs[i].children[j].newlyAdded = true;
        if (taskDivs[i].children[j].value != "") checkedTaskDivs.unshift(taskDivs[i].children[j]);
        taskDivs[i].children.splice(j, 1);
      }
    }

    this.setState({ taskList });
    console.log(taskList)
  }
  setHeight(value, i,j, isFromCheckedList = false) {
    // console.log(value)
    let taskList = this.state.taskList;
    if (!isFromCheckedList) {
      let taskDivs = taskList[this.state.taskListIndex].taskDivs;
      if(j==-1)taskDivs[i].height = value;
      else taskDivs[i].children[j].height = value
    } else {
      let checkedDivs = taskList[this.state.taskListIndex].checkedDivs;
      checkedDivs[i].height = value;
    }
    this.setState({ taskList });
  }

  render() {

    let constructTaskDiv =(taskDiv,i,j)=>{
    return (
        <TaskDiv
          taskArrayElement={taskDiv}
          key={j==-1 ? i:(i+1)*100+j}
          changeElement={(value, isFocus) => {
            if ((value || value === "") && !taskDiv.checked)taskDiv.value = value;
            taskDiv.focus = isFocus;
          }}
          manageTasks={(e) => this.checkKeyPress(e, i + 1)}
          clickedTick={() => this.checkedTask(i)}
          setHeight={(value) => this.setHeight(value, i,j)}
          changeElementKey={(value) =>
            this.modifyTaskAfterAnimation(value, i,j)
          }
          checkedList={false}
        ></TaskDiv>
      );
    }
    let allTaskDivs = () => {
      if (this.state.taskListIndex != -1)
        return this.state.taskList[this.state.taskListIndex].taskDivs.map(
          (taskDiv, i) => {
        return(
            <div key ={i}>
              {constructTaskDiv(taskDiv, i,-1)}
              {/* {console.log(taskDiv.children)} */}
              {taskDiv.children.map((element,j)=> constructTaskDiv(element, i,j))}
            </div>)
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
              this.addTask(0, e.target.value);
              e.target.value = "";
            }
          }}
          plusNewTask={(_) => this.addTask(0)}
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
          clickedTick={(i) => this.uncheckedTask(i)}
          setHeight={(value, i) => this.setHeight(value, i,-1, true)}
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
