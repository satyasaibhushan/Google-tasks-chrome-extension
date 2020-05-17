export default {
  //  setTaskList()

  setHeight(taskComponent, value, i, j, isFromCheckedList = false) {
    let taskList = taskComponent.state.taskList;
    if (!isFromCheckedList) {
      let taskDivs = taskList[taskComponent.state.taskListIndex].taskDivs;
      if (j == -1) taskDivs[i].height = value;
      else taskDivs[i].children[j].height = value;
    } else {
      let checkedDivs = taskList[taskComponent.state.taskListIndex].checkedDivs;
      checkedDivs[i].height = value;
    }
    taskComponent.setState({ taskList });
  },

  checkKeyPress(taskComponent, e, i, j) {
    let taskList = taskComponent.state.taskList;
    let taskDivs = taskList[taskComponent.state.taskListIndex].taskDivs;

    if (e.keyCode == 13) {
      e.preventDefault();
      if (e.metaKey) {
        this.addTask(taskComponent, i, j, "", true);
      } else if (e.target.selectionEnd == 0 && e.target.value != "") {
        this.addTask(taskComponent, i,j, e.target.value, false, true);
      } else this.addTask(taskComponent, i,j);
    } else if (e.keyCode == 8 && e.target.value == "") {
      if (j == -1) taskDivs[i - 1].remove = true;
      else taskDivs[i - 1].children[j].remove = true;
      e.preventDefault();
    } else if (
      e.keyCode == 38 &&
      !(i == 1 && j == -1) &&
      e.target.selectionEnd == 0
    ) {
      if (j == -1) {
        if (taskDivs[i - 2].children && taskDivs[i - 2].children.length > 0)
          taskDivs[i - 2].children[
            taskDivs[i - 2].children.length - 1
          ].focus = true;
        else taskDivs[i - 2].focus = true;
      } else if (j == 0) {
        taskDivs[i - 1].focus = true;
      } else if (j >= 1) taskDivs[i - 1].children[j - 1].focus = true;
    } else if (
      e.keyCode == 40 &&
      e.target.selectionEnd == e.target.value.length
    ) {
      if (i == taskDivs.length) {
        if (taskDivs[i - 1].children) {
          if (j == taskDivs[i - 1].children.length - 1) return;
        } else return;
      }
      if (j == -1) {
        if (taskDivs[i - 1].children.length == 0) taskDivs[i].focus = true;
        else taskDivs[i - 1].children[0].focus = true;
      } else if (j == taskDivs[i - 1].children.length - 1)
        taskDivs[i].focus = true;
      else taskDivs[i - 1].children[j + 1].focus = true;
    } else return;

    taskComponent.setState({ taskList });
  },

  addTask(
    taskComponent,
    i,
    j,
    value = "",
    isMetaPressed = false,
    isBefore = false
  ) {
    let taskList = taskComponent.state.taskList;
    let taskDivs = taskList[taskComponent.state.taskListIndex].taskDivs;
    if (taskDivs[i-1]&&taskDivs[i-1].children[j] &&( taskDivs[i-1].children[j].subset != -1))
        isMetaPressed = isMetaPressed ? false : true;
    else if (taskDivs[i-1] && taskDivs[i-1].children.length>0)
        isMetaPressed = isMetaPressed ? false : true;

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

    if (isMetaPressed) {
      if (taskComponent.setParentId(i, taskDivs))
        taskDiv.parentId = taskComponent.setParentId(i, taskDivs);
      else taskDiv.parentId = i;

      taskDivs[i - 1].children.splice(j+1,0,taskDiv);
    } else {
      taskDiv.children = [];
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
      taskComponent.setState({ taskList });
    }
    console.log(taskList)
  },

  modifyTaskAfterAnimation(taskComponent, KeyName, i, j) {
    let taskList = taskComponent.state.taskList;
    let taskDivs = taskList[taskComponent.state.taskListIndex].taskDivs;
    let checkedTaskDivs =
      taskList[taskComponent.state.taskListIndex].checkedDivs;
    if (KeyName == "newlyAdded") {
      if (j == -1) taskDivs[i].newlyAdded = false;
      else taskDivs[i].children[j].newlyAdded = false;
    }
    if (KeyName == "remove") {
      if (j == -1) {
        if (i == 0 && taskDivs.length > 1) taskDivs[i + 1].focus = true;
        else if (i > 0) taskDivs[i - 1].focus = true;
        taskDivs.splice(i, 1);
      } else {
        if (j == 0 && taskDivs[i].children.length > 1)
          taskDivs[i].children[j + 1].focus = true;
        else if (j > 0) taskDivs[i].children[j - 1].focus = true;
        taskDivs[i].children.splice(j, 1);
      }
    }
    if (KeyName == "checked") {
      if (j == -1 && taskDivs[i].checked == true) {
        if (i == 0 && taskDivs.length > 1) taskDivs[i + 1].focus = true;
        else if (i > 0) taskDivs[i - 1].focus = true;
        taskDivs[i].newlyAdded = true;
        if (taskDivs[i].value != "") checkedTaskDivs.unshift(taskDivs[i]);
        taskDivs.splice(i, 1);
      } else if (j != -1 && taskDivs[i].children[j].checked == true) {
        if (j == 0 && taskDivs[i].children.length > 1)
          taskDivs[i].children[j + 1].focus = true;
        else if (j > 0) taskDivs[i].children[j - 1].focus = true;
        taskDivs[i].children[j].newlyAdded = true;
        if (taskDivs[i].children[j].value != "")
          checkedTaskDivs.unshift(taskDivs[i].children[j]);
        taskDivs[i].children.splice(j, 1);
      }
    }

    taskComponent.setState({ taskList });
  },

  checkedTask(taskComponent, i,j) {
    let taskList = taskComponent.state.taskList;
    let taskDivs = taskList[taskComponent.state.taskListIndex].taskDivs;
    if(j==-1){
    if (taskDivs[i].value == "") {
      taskDivs[i].checked = true;
      taskDivs[i].remove = true;
      console.log("deleted empty task");
    }
     else {
      taskDivs[i].checked = taskDivs[i].checked == true ? false : true;
      console.log("1 task Completed");
    }}
    else {
    if (taskDivs[i].children[j].value == "") {
        taskDivs[i].children[j].checked = true;
        taskDivs[i].children[j].remove = true;
        console.log("deleted empty task");
        }
    else {
        taskDivs[i].children[j].checked = taskDivs[i].checked == true ? false : true;
        console.log("1 task Completed");
        }    
    }
    taskComponent.setState({ taskList });
  },

  uncheckedTask(taskComponent, i) {
    let taskList = taskComponent.state.taskList;
    let checkedTaskDivs =
      taskList[taskComponent.state.taskListIndex].checkedDivs;
    checkedTaskDivs[i].unchecked =
      checkedTaskDivs[i].unchecked == true ? false : true;
    console.log("1 task marked incomplete");
    taskComponent.setState({ taskList });
  },
};
