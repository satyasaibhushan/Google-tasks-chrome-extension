import Newtask from "../newTask/newTask";

export default {
  newTask(checked, value, subset, id, parentId) {
    let task = {
      checked: checked,
      value: value,
      focus: false,
      newlyAdded: false,
      height: 0,
      subset: subset,
      id: id,
    };
    if (!parentId) task.children = [];
    else task.parentId = parentId;
    return task;
  },
  showAll(taskComponent, api) {
    if (taskComponent.props.gapiAvailable && taskComponent.state.count == 0) {
      api.listTaskLists().then((x) => {
        x.forEach((ele) => {
          let taskList = taskComponent.state.taskList;
          let taskListElement = {
            name: ele.title,
            taskDivs: [],
            checkedDivs: [],
          };
          api
            .listTasks(ele.id)
            .then((task) => {
                task.sort(function(a, b){return a.position - b.position});
              console.log(task);
              task.forEach((element, i) => {
                if (element.status == "needsAction" && !element.parent) {
                  taskListElement.taskDivs.push(
                    this.newTask(false, element.title, -1, element.id)
                  );
                }
              });
              return task;
            })
            .then((task) => {
              task.forEach((element, i) => {
                if (element.parent && element.status != "completed") {
                  {
                    let parentIndex = taskListElement.taskDivs
                      .map((ele) => ele.id)
                      .indexOf(element.parent);
                      console.log(element.position);
                      taskListElement.taskDivs[parentIndex].children.push(
                        this.newTask(
                          false,
                          element.title,
                          parentIndex,
                          element.id,
                          element.parent
                        )
                      );
                  }
                } else if (element.status == "completed")
                  taskListElement.checkedDivs.push(
                    this.newTask(
                      true,
                      element.title,
                      -1,
                      element.id,
                      element.parent ? element.parent : ""
                    )
                  );
              });
            });
          taskList.push(taskListElement);
          taskComponent.setState({ taskList });
          // console.log(taskList);
        });
      });
      taskComponent.setState({ count: 1 });
    }
  },
};
