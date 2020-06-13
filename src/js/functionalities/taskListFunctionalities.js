import api from "./tasks.api";

export default {
  addTaskList(value, taskLists, setTaskLists, index, setTaskListIndex, setMesaage) {
    let taskListElement = {
      name: value,
      taskDivs: [],
      checkedDivs: [],
      id: "",
    };
    if (taskLists.map(ele => ele.name).indexOf(value) == -1) {
      api.insertTaskList(value).then(res => (taskListElement.id = res.id));
      taskLists.push(taskListElement);
      setTaskListIndex(taskLists.length - 1);
      setTaskLists(taskLists);
    } else setMesaage("Please create a list with new name");
  },
  updateTaskList(value, taskLists, setTaskLists, index) {
    taskLists[index].name = value;
    setTaskLists(taskLists);
    api.updateTaskList(taskLists[index].id, value);
  },
  deleteTaskList(value, taskLists, setTaskLists, index, setTaskListIndex) {
    api.deleteTaskList(taskLists[index].id);
    taskLists.splice(index, 1);
    setTaskListIndex(index - 1);
    setTaskLists(taskLists);
  },
  deleteCompletedTasks(value, taskLists, setTaskLists, index, setTaskListIndex) {
    taskLists[index].checkedDivs.forEach(element => {
      api.deleteTask(taskLists[index].id, element.id);
    });
    taskLists[index].checkedDivs = [];
    setTaskLists(taskLists);
  },
};
