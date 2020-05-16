export default{
//  setTaskList()

    setHeight(taskComponent,value, i, j, isFromCheckedList = false) {
        // console.log(value)
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
    
    checkKeyPress(taskComponent,e, i, j) {
        let taskList = taskComponent.state.taskList;
        let taskDivs = taskList[taskComponent.state.taskListIndex].taskDivs;
    
        if (e.keyCode == 13) {
          e.preventDefault();
          if (e.metaKey) {
              this.addTask(taskComponent,i,j, "", true);
          } else if (e.target.selectionEnd == 0 && e.target.value != "") {
            this.addTask(taskComponent,i, e.target.value, false, true);
          } else this.addTask(taskComponent,i);
        }
         else if (e.keyCode == 8 && e.target.value == "") {
           console.log(j)
          if(j == -1)taskDivs[i - 1].remove = true;
          else taskDivs[i-1].children[j].remove = true;
          e.preventDefault();
        }
         else if (e.keyCode == 38 && (i != 1 || j!=0 ) && e.target.selectionEnd == 0){
          if(j==-1 || j==0)taskDivs[i - 2].focus = true;
          else if(j>1) taskDivs[i-1].children[j-1].focus = true;
        }
        else if (
          e.keyCode == 40 &&
         ( i != taskDivs.length ) &&
          e.target.selectionEnd == e.target.value.length
        ){
          if(j==-1)taskDivs[i].focus = true;
          else taskDivs[i-1].children[j].focus =true;
        }
        else return;
    
        taskComponent.setState({ taskList });
      },

      addTask(taskComponent,i, j,value = "", isMetaPressed = false, isBefore = false) {
        let taskList = taskComponent.state.taskList;
        let taskDivs = taskList[taskComponent.state.taskListIndex].taskDivs;
        if (taskDivs[i - 1] && taskDivs[i - 1].subset != -1)
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
        console.log(taskComponent.setParentId(i, taskDivs));
    
        if (isMetaPressed) {
          if (taskComponent.setParentId(i, taskDivs))
            taskDiv.parentId = taskComponent.setParentId(i, taskDivs);
          else taskDiv.parentId = i;
    
          taskDivs[i - 1].children.push(taskDiv);
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
          console.log(taskList);
        }
      },

      modifyTaskAfterAnimation(taskComponent,KeyName, i, j) {
        console.log(j, "jj");
        let taskList = taskComponent.state.taskList;
        let taskDivs = taskList[taskComponent.state.taskListIndex].taskDivs;
        let checkedTaskDivs = taskList[taskComponent.state.taskListIndex].checkedDivs;
        if (KeyName == "newlyAdded") {
          if (j == -1) taskDivs[i].newlyAdded = false;
          else taskDivs[i].children[j].newlyAdded = false;
        }
        if (KeyName == "remove") {
          if (j == -1) {
            console.log("i");
            if (i == 0 && taskDivs.length > 1) taskDivs[i + 1].focus = true;
            else if (i > 0) taskDivs[i - 1].focus = true;
            taskDivs.splice(i, 1);
          } else {
            console.log("j");
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
        console.log(taskList);
      },

      checkedTask(taskComponent,i) {
        let taskList = taskComponent.state.taskList;
        let taskDivs = taskList[taskComponent.state.taskListIndex].taskDivs;
        if (taskDivs[i].value == "") {
          taskDivs[i].checked = true;
          taskDivs[i].remove = true;
    
          console.log("deleted empty task");
        } else {
          taskDivs[i].checked = taskDivs[i].checked == true ? false : true;
          console.log("1 task Completed");
        }
        taskComponent.setState({ taskList });
      },

      uncheckedTask(taskComponent,i) {
        let taskList = taskComponent.state.taskList;
        let checkedTaskDivs = taskList[taskComponent.state.taskListIndex].checkedDivs;
        checkedTaskDivs[i].unchecked =
          checkedTaskDivs[i].unchecked == true ? false : true;
        console.log("1 task marked incomplete");
        taskComponent.setState({ taskList });
      }
      

 
}