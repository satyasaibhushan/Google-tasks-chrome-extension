import apiManagement from "./apiManagement";
import api from "./tasks.api";
import { TaskDiv } from "../tasksComponent/taskDiv/taskDiv";
import { moveTaskUp, moveTaskDown,intendTask,unintendTask } from "../functionalities/shortcuts";

export default {
  //  setTaskList()

  setHeight(taskDivs, setTaskList, value, i, j, isFromCheckedList = false) {
    if (!isFromCheckedList) {
      if (j == -1) taskDivs[i].height = value;
      else taskDivs[i].children[j].height = value;
    } else {
      taskDivs[i].height = value;
    }
    setTaskList(taskDivs);
  },

  checkKeyPress(taskDivs, setTaskList, taskListId, e, i, j) {
    if (e.keyCode == 38 && e.getModifierState("Alt")) moveTaskUp(taskDivs, setTaskList, taskListId, i - 1, j);
    else if (e.keyCode == 40 && e.getModifierState("Alt")) moveTaskDown(taskDivs, setTaskList, taskListId, i - 1, j);
    else if(e.metaKey && e.keyCode ==221) {e.preventDefault();intendTask(taskDivs, setTaskList, taskListId, i - 1, j)}
    else if(e.metaKey && e.keyCode ==219) {e.preventDefault();unintendTask(taskDivs, setTaskList, taskListId, i - 1, j)}
    else if (e.keyCode == 13) {
      e.preventDefault();
      if (e.metaKey) {
        this.addTask(taskDivs, setTaskList, taskListId, i, j, "", true);
      } else if (e.target.selectionEnd == 0 && e.target.value != "") {
        this.addTask(taskDivs, setTaskList, taskListId, i, j, e.target.value, false, true);
      } else this.addTask(taskDivs, setTaskList, taskListId, i, j);
    } else if (e.keyCode == 8 && e.target.value == "") {
      if (j == -1) taskDivs[i - 1].remove = true;
      else taskDivs[i - 1].children[j].remove = true;
      e.preventDefault();
    } else if (e.keyCode == 38 && !(i == 1 && j == -1) && e.target.selectionEnd == 0) {
      if (j == -1) {
        if (taskDivs[i - 2].children && taskDivs[i - 2].children.length > 0)
          taskDivs[i - 2].children[taskDivs[i - 2].children.length - 1].focus = true;
        else taskDivs[i - 2].focus = true;
      } else if (j == 0) {
        taskDivs[i - 1].focus = true;
      } else if (j >= 1) taskDivs[i - 1].children[j - 1].focus = true;
    } else if (e.keyCode == 40 && e.target.selectionEnd == e.target.value.length) {
      if (i == taskDivs.length) {
        if (taskDivs[i - 1].children) {
          if (j == taskDivs[i - 1].children.length - 1) return;
        } else return;
      }
      if (j == -1) {
        if (taskDivs[i - 1].children.length == 0) taskDivs[i].focus = true;
        else taskDivs[i - 1].children[0].focus = true;
      } else if (j == taskDivs[i - 1].children.length - 1) taskDivs[i].focus = true;
      else taskDivs[i - 1].children[j + 1].focus = true;
    } else return;

    setTaskList(taskDivs);
  },

  addTask(taskDivs, setTaskList, taskListId, i, j, value = "", isMetaPressed = false, isBefore = false) {
    if (taskDivs[i - 1] && taskDivs[i - 1].children[j] && taskDivs[i - 1].children[j].subset != -1)
      isMetaPressed = isMetaPressed ? false : true;
    else if (taskDivs[i - 1] && taskDivs[i - 1].children.length > 0) isMetaPressed = isMetaPressed ? false : true;

    let taskDiv = {
      checked: false,
      value: value,
      focus: false,
      newlyAdded: true,
      height: 0,
      subset: isMetaPressed ? i - 1 : -1,
      id: "",
      collapsed: 0,
    };
    if (isBefore) taskDiv.focus = false;

    if (isMetaPressed && !isBefore) {
      if (taskDivs[i - 1].id != "") {
        taskDiv.parentId = taskDivs[i - 1].id;
        if (taskListId)
          api
            .insertTask({
              taskListId: taskListId,
              title: "",
              parent: taskDivs[i - 1].id,
              previous: taskDivs[i - 1].children[j] ? taskDivs[i - 1].children[j].id : "",
            })
            .then(res => (taskDiv.id = res.id));
      } else taskDiv.parentId = i;
      taskDivs[i - 1].children.splice(j + 1, 0, taskDiv);
    } else {
      taskDiv.children = [];
      if (isBefore) {
        taskDiv = {
          checked: false,
          value: "",
          focus: true,
          newlyAdded: true,
          height: 0,
          id: "",
          subset: -1,
          children: [],
        };
        if (j != -1) {
          (taskDiv.subset = i - 1), delete taskDiv.children, (taskDiv.parentId = i - 1);
          taskDivs[i - 1].children[j].focus = false;
          api
            .insertTask({
              taskListId: taskListId,
              title: "",
              parent: taskDivs[i - 1].id,
              previous: taskDivs[i - 1].children[j - 1] ? taskDivs[i - 1].children[j - 1].id : "",
            })
            .then(res => (taskDiv.id = res.id));
          taskDivs[i - 1].children.splice(j, 0, taskDiv);
        } else {
          taskDivs[i - 1].focus = false;
          api
            .insertTask({
              taskListId: taskListId,
              title: "",
              previous: taskDivs[i - 2] ? taskDivs[i - 2].id : "",
            })
            .then(res => (taskDiv.id = res.id));
          taskDivs.splice(i - 1, 0, taskDiv);
        }
      } else {
        if (taskListId)
          api
            .insertTask({
              taskListId: taskListId,
              title: "",
              previous: taskDivs[i - 1] ? taskDivs[i - 1].id : "",
            })
            .then(res => (taskDiv.id = res.id));
        taskDivs.splice(i, 0, taskDiv);
      }
    }
    if (taskDivs[i - 1] && taskDivs[i - 1].children && taskDivs[i - 1].children.length > 0)
      taskDivs[i - 1].collapsed = -1;
    setTaskList(taskDivs);
  },

  modifyTaskAfterAnimation(taskDivs, checkedDivs, taskListId, setTaskList, setCheckedDivs, setMessage, KeyName, i, j) {
    if (KeyName == "newlyAdded") {
      if (j == -1) {
        taskDivs[i].newlyAdded = false;
        taskDivs[i].focus = true;
      } else {
        taskDivs[i].children[j].newlyAdded = false;
        taskDivs[i].children[j].focus = true;
      }
    }
    if (KeyName == "remove") {
      if (j == -1) {
        if (i == 0 && taskDivs.length > 1) taskDivs[i + 1].focus = true;
        else if (i > 0) taskDivs[i - 1].focus = true;

        let message = "deleted 1 task ";
        taskDivs[i] && taskDivs[i].children && taskDivs[i].children.length > 0
          ? (message += "with " + taskDivs[i].children.length + " subtasks")
          : "";
        api.deleteTask(taskListId, taskDivs[i].id);
        taskDivs.splice(i, 1);

        setMessage(message);
      } else {
        if (j == 0 && taskDivs[i].children.length > 1) taskDivs[i].children[j + 1].focus = true;
        else if (j == 0) {
          taskDivs[i].focus = true;
          taskDivs[i].collapsed = 0;
        } else if (j > 0) taskDivs[i].children[j - 1].focus = true;
        api.deleteTask(taskListId, taskDivs[i].children[j].id);
        taskDivs[i].children.splice(j, 1);
        setMessage("deleted 1 subtask");
      }
    }
    if (KeyName == "checked") {
      if (j == -1 && taskDivs[i] && taskDivs[i].checked == true) {
        taskDivs[i].newlyAdded = true;
        if (taskDivs[i].value != "" || (j == -1 && taskDivs[i].children.length > 0)) {
          api.updateTask({
            taskListId: taskListId,
            taskId: taskDivs[i].id,
            title: taskDivs[i].value,
            status: "completed",
          });
          taskDivs[i].children.forEach((ele, i) => checkedDivs.unshift(ele));
          taskDivs[i].children = [];
          checkedDivs.unshift(taskDivs[i]);
        } else if (taskDivs[i].value == "") api.deleteTask(taskListId, taskDivs[i].id);
        taskDivs.splice(i, 1);
      } else if (
        j != -1 &&
        taskDivs[i] &&
        taskDivs[i].children &&
        taskDivs[i].children[j] &&
        taskDivs[i].children[j].checked == true
      ) {
        if (taskDivs[i].children.length == 1) taskDivs[i].collapsed = 0;
        taskDivs[i].children[j].newlyAdded = true;
        if (taskDivs[i].children[j].value != "") {
          api.updateTask({
            taskListId: taskListId,
            taskId: taskDivs[i].children[j].id,
            title: taskDivs[i].children[j].value,
            status: "completed",
          });
          checkedDivs.unshift(taskDivs[i].children[j]);
        } else api.deleteTask(taskListId, taskDivs[i].children[j].id);
        taskDivs[i].children.splice(j, 1);
      }
    }

    setTaskList(taskDivs);
    setCheckedDivs(checkedDivs);
  },

  checkedTask(taskDivs, setTaskList, setMessage, i, j) {
    if (j == -1) {
      if (taskDivs[i].children && taskDivs[i].children.length > 0) {
      }
      if (taskDivs[i].value == "" && taskDivs[i].children.length < 1) {
        taskDivs[i].checked = true;
        taskDivs[i].remove = true;
        setMessage("deleted empty task");
      } else {
        taskDivs[i].children.forEach(ele => ele.checked == true);
        taskDivs[i].checked = taskDivs[i].checked == true ? false : true;
        setMessage("1 task Completed");
      }
    } else {
      if (taskDivs[i].children[j].value == "") {
        taskDivs[i].children[j].checked = true;
        taskDivs[i].children[j].remove = true;
        setMessage("deleted empty task");
      } else {
        taskDivs[i].children[j].checked = taskDivs[i].checked == true ? false : true;
        setMessage("1 task Completed");
      }
    }
    setTaskList(taskDivs);
  },

  uncheckedTask(checkedDivs, setCheckedDivs, setMessage, i) {
    checkedDivs[i].unchecked = checkedDivs[i].unchecked == true ? false : true;
    setMessage("1 task marked incomplete");
    setCheckedDivs(checkedDivs);
  },
  clickedCollapseIcon(taskDivs, setTaskList, i) {
    if (taskDivs[i].collapsed == 1) taskDivs[i].collapsed = -1;
    else if (taskDivs[i].collapsed == -1) taskDivs[i].collapsed = 1;
    // else if(taskDivs[i].collapsed == 0 )
    setTaskList(taskDivs);
  },
};
