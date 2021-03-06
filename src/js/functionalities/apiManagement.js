import Newtask from "../tasksComponent/newTask/newTask";
import api from "./tasks.api";
import { getCookie } from "../functionalities/cookies";
export default {
  newTask(checked, value, subset, id, parentId, notes) {
    let task = {
      checked: checked,
      value: value,
      focus: false,
      newlyAdded: false,
      height:0,
      subset: subset,
      id: id,
      notes: notes,
    };
    if (!parentId) task.children = [];
    else task.parentId = parentId;
    return task;
  },
  showAll(taskComponent) {
    let cookieTaskListIndex = getCookie("taskListIndex");
    if (cookieTaskListIndex == "" || !cookieTaskListIndex) cookieTaskListIndex = 0;
    if (taskComponent.props.gapiAvailable && taskComponent.state.count == 0) {
      let taskList = [];
      api
        .listTaskLists()
        .then(x => {
          x.forEach((ele, i) => {
            
            let taskListElement = {
              name: ele.title,
              taskDivs: [],
              checkedDivs: [],
              id: ele.id,
            };
            api
              .listTasks(ele.id)
              .then(task => {
                if (task && task.length > 0) {
                  task.sort(function (a, b) {
                    return a.position - b.position;
                  });
                  console.log(task);
                  task.forEach((element, i) => {
                    if (element.status == "needsAction" && !element.parent) {
                      taskListElement.taskDivs.push(
                        this.newTask(false, element.title, -1, element.id, undefined,element.notes ? element.notes : "")
                      );
                      taskListElement.taskDivs[taskListElement.taskDivs.length - 1].collapsed = 0;
                    }
                  });
                }
                return task;
              })
              .then(task => {
                if (task && task.length > 0)
                  task.forEach((element, i) => {
                    if (element.parent && element.status != "completed") {
                      {
                        let parentIndex = taskListElement.taskDivs.map(ele => ele.id).indexOf(element.parent);
                        taskListElement.taskDivs[parentIndex].children.push(
                          this.newTask(false, element.title, parentIndex, element.id, element.parent, element.notes ? element.notes : "")
                        );
                        taskListElement.taskDivs[parentIndex].collapsed =
                          getCookie("defaultShowSubtasks") === "true" ? 1 : -1;
                      }
                    }
                  });
                return task;
              })
              .then(task => {
                if (task && task.length > 0) {
                  task = task
                    .filter(ele => {
                      if (ele.completed) return true;
                      else return false;
                    })
                    .sort(function (a, b) {
                      return new Date(b.completed).getTime() - new Date(a.completed).getTime();
                    });
                  task.forEach((element, i) => {
                    if (element.status == "completed")
                      taskListElement.checkedDivs.push(
                        this.newTask(true, element.title, -1, element.id, element.parent ? element.parent : "", element.notes ? element.notes : "")
                      );
                  });
                }
              })
              .then(task => {
                if (
                  taskComponent.state.taskList.length > 1 &&
                  i == cookieTaskListIndex
                ) {
                  taskComponent.setState({ taskListIndex: i, count: 1 });
                }
              });
            taskList.push(taskListElement);
            
          });
        })
        .then(_ => {
          // console.log(taskComponent.state.taskList, taskList,JSON.stringify(taskList) == JSON.stringify(taskComponent.state.taskList))
          // if(JSON.stringify(taskList) != JSON.stringify(taskComponent.state.taskList)){
          taskComponent.setState({ taskList });
        // }
        });
      taskComponent.setState({ count: 1 });
    }
  },

  updateTask() {},
};
