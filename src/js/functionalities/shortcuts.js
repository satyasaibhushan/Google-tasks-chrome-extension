import api from "./tasks.api";

export function moveTaskUp(taskList, setTaskList, taskListId, i, j) {
  let taskDiv;
  if (j == -1 && i > 0) {
    taskDiv = taskList.splice(i, 1)[0];
    moveTaskElement(taskList,taskListId,taskDiv,i-1,-1)
  } else if (!(i == 0 && j == 0) && j != -1) {
      taskDiv = taskList[i].children.splice(j,1)[0]
      if(j== 0){ moveTaskElement(taskList,taskListId,taskDiv,i-1,taskList[i-1].children.length,taskList[i-1].id)}
      else moveTaskElement(taskList,taskListId,taskDiv,i,j-1,taskList[i].id)
  }
  setTaskList(taskList);
}

export function moveTaskDown(taskList, setTaskList, taskListId, i, j) {
  let taskDiv;
  if (j == -1 && i < taskList.length - 1) {
    taskDiv = taskList.splice(i, 1)[0];
    moveTaskElement(taskList,taskListId,taskDiv,i+1)
  } else if (
    !(i == taskList.length - 1 &&
      taskList[taskList.length - 1].children.length > 0 &&
      j == taskList[taskList.length - 1].children.length - 1
    ) &&j != -1
    ){ taskDiv = taskList[i].children.splice(j,1)[0];
        if(j == taskList[i].children.length) {moveTaskElement(taskList,taskListId,taskDiv,i+1,0,taskList[i+1].id);}
        else moveTaskElement(taskList,taskListId,taskDiv,i,j+1,taskList[i].id)
    }
  setTaskList(taskList);
}

export function intendTask(taskList, setTaskList, taskListId, i, j){
    let taskDiv;
 if(j==-1 && i!=0 && taskList[i].children.length ==0){
    taskDiv = taskList.splice(i, 1)[0];
    taskDiv.parentId = taskList[i-1].id
     taskDiv.subset = i-1
     delete taskDiv.children
    taskList[i-1].collapsed =-1
    moveTaskElement(taskList,taskListId,taskDiv,i-1,taskList[i-1].children.length,taskList[i-1].id)
 }  
 setTaskList(taskList);
}
export function unintendTask(taskList, setTaskList, taskListId, i, j){
    let taskDiv;
   if(j!=-1 ){
    taskDiv = taskList[i].children.splice(j,1)[0];
    delete taskDiv.parentId;
    taskDiv.subset = -1;
    taskDiv.children =[]
    moveTaskElement(taskList,taskListId,taskDiv,i+1)
    if(taskList[i].children.length == 0) taskList[i].collapsed =0
   }
   setTaskList(taskList);
}

let moveTaskElement = (tasksArray, taskArrayId, task, i,j=-1,parentId = null) => {

    if (parentId) {
      task.subset = i
      task.parentId = parentId;
      tasksArray[i].collapsed = -1
    }
    api.moveTask({
      taskListId: taskArrayId,
      taskId: task.id,
      previous: (i==0 &&j==-1) || (j==0&&parentId) ? '':!parentId ?tasksArray[i-1].id:tasksArray[i].children[j-1].id,
      parent: parentId,
    });
    !parentId ? tasksArray.splice(i,0,task):tasksArray[i].children.splice(j,0,task)
  };