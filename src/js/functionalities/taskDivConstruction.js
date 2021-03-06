import React, { useEffect, useRef, useState } from "react";
import SlidingMenu from "../tasksComponent/slidingMenu/slidingMenu";
import { TaskDiv } from "../tasksComponent/taskDiv/taskDiv";
import api from "./tasks.api";
import updateTasks from "./taskFunctionalities";
import drag from "../tasksComponent/dragSorting/dragSorting";
import DragSorting from "../tasksComponent/dragSorting/dragSorting";

let timer, updatingTaskData;
let updateTaskApi = updatingTaskData => {
  api.updateTask({
    taskListId: updatingTaskData[0],
    taskId: updatingTaskData[1],
    title: updatingTaskData[2],
    notes: updatingTaskData[3],
  });
};
function updateTask(taskListId, taskId, title, notes) {
  if (
    updatingTaskData &&
    (updatingTaskData[0] != taskListId || updatingTaskData[1] != taskId || updatingTaskData[3] != notes)
  ) {
    clearTimeout(timer);
    timer = null;
    updateTaskApi(updatingTaskData);
  }
  updatingTaskData = [taskListId, taskId, title, notes];
  if (!timer)
    timer = setTimeout(() => {
      updateTaskApi(updatingTaskData);
      timer = null;
      updatingTaskData = null;
    }, 3000);
}

export default function TotalTaskDivs(props) {
  const [isEditMenuOpened, setEditMenu] = useState();
  const editingTask = useRef([-1, -1]);

  useEffect(() => {
    if (isEditMenuOpened === true) {
      document.addEventListener("keydown", closeEditMenu);
    } else if (isEditMenuOpened === false) {
      document.removeEventListener("keydown", closeEditMenu);
    }
  }, [isEditMenuOpened]);

  let constructTaskDiv = (taskDiv, i, j) => {
    return (
      <TaskDiv
        taskArrayElement={taskDiv}
        key={j == -1 ? i : (i + 1) * 100 + j}
        changeElement={(value, isFocus) => {
          if ((value || value === "") && !taskDiv.checked && taskDiv.id != "") {
            if (taskDiv.value != value) {
              updateTask(props.taskListId, taskDiv.id, value, taskDiv.notes);
              taskDiv.value = value;
            }
          }
          taskDiv.focus = isFocus;
        }}
        manageTasks={e =>
          updateTasks.checkKeyPress(props.taskDivs, props.setTaskList, props.taskListId, e, i + 1, j, setSlidingMenu)
        }
        clickedTick={() => updateTasks.checkedTask(props.taskDivs, props.setTaskList, props.setMessage, i, j)}
        setHeight={value => updateTasks.setHeight(props.taskDivs, props.setTaskList, value, i, j)}
        changeElementKey={value =>
          updateTasks.modifyTaskAfterAnimation(
            props.taskDivs,
            props.checkedDivs,
            props.taskListId,
            props.setTaskList,
            props.setCheckedDivs,
            props.setMessage,
            value,
            i,
            j
          )
        }
        hoveredIcon={isTick => {
          let taskDivs = props.taskDivs;
          if (j == -1) {
            taskDivs[i].icon = isTick ? "tick" : "";
            taskDivs[i].children
              ? taskDivs[i].children.forEach(element => {
                  element.icon = isTick ? "tick" : "";
                })
              : "";
          } else {
            taskDivs[i].children[j].icon = isTick ? "tick" : "";
          }
          props.setTaskList(taskDivs);
        }}
        clickedCollapseIcon={_ => {
          updateTasks.clickedCollapseIcon(props.taskDivs, props.setTaskList, i);
        }}
        clickedEdit={_ => {
          setEditMenu(true);
          editingTask.current = [i, j];
        }}
        checkedList={false}></TaskDiv>
    );
  };
  let closeEditMenu = e => {
    if (e.keyCode == 27 && isEditMenuOpened) setEditMenu(false);
    else if (e.keyCode == 13 && e.metaKey) {
      setEditMenu(false);
    }
  };
  let setSlidingMenu = (isOpen, i, j) => {
    isOpen ? (editingTask.current = [i - 1, j]) : "";
    setEditMenu(isOpen);
  };

  let submitted = (title, notes, list, subtasks) => {
    let taskDivs = props.taskDivs;
    let taskDiv =
      editingTask.current[1] == -1
        ? taskDivs[editingTask.current[0]]
        : taskDivs[editingTask.current[0]].children[editingTask.current[1]];

    new Promise((resolve, reject) => {
      resolve();
    })
      .then(_ => {
        if (title != taskDiv.value || notes != taskDiv.notes) {
          api.updateTask({
            taskListId: props.taskListId,
            taskId: taskDiv.id,
            title: title,
            notes: notes,
          });
          taskDiv.value = title;
          taskDiv.notes = notes;
          taskDiv.edited = true;

          props.setTaskList(taskDivs);
        }
      })
      .then(_ => {
        if (list != props.selectedList) {
          if (
            (editingTask.current[1] == -1 && taskDivs[editingTask.current[0]].children.length == 0) ||
            editingTask.current[1] != -1
          ) {
            props.setMessage("Moved 1 task to " + props.taskLists[list].name);
            api.deleteTask(props.taskListId, taskDiv.id);
            let newDiv = { ...taskDiv };
            if (editingTask.current[1] != -1) {
              newDiv.subset = -1;
              delete newDiv.parentId;
              newDiv.children = [];
              taskDivs[editingTask.current[0]].children.splice(editingTask.current[1], 1);
              if (taskDivs[editingTask.current[0]].children.length == 0) taskDivs[editingTask.current[0]].collapsed = 0;
            } else taskDivs.splice(editingTask.current[0], 1);
            api
              .insertTask({ taskListId: props.taskLists[list].id, title: newDiv.value, notes: newDiv.notes })
              .then(res => (newDiv.id = res.id));
            newDiv.newlyAdded = true;
            props.taskLists[list].taskDivs.unshift(newDiv);
            props.setTaskList(taskDivs);
          } else {
            props.setMessage(
              "Moved " +
                (taskDivs[editingTask.current[0]].children.length + 1) +
                " tasks to " +
                props.taskLists[list].name
            );
            api.deleteTask(props.taskListId, taskDiv.id);
            let newDiv = { ...taskDiv };
            let newSubtasks = [].concat(taskDiv.children).reverse();
            taskDivs.splice(editingTask.current[0], 1);
            props.taskLists[list].taskDivs.unshift(newDiv);
            api
              .insertTask({ taskListId: props.taskLists[list].id, title: newDiv.value, notes: newDiv.notes })
              .then(res => {
                newDiv.id = res.id;
                newSubtasks.forEach(ele => {
                  api
                    .insertTask({
                      taskListId: props.taskLists[list].id,
                      title: ele.value,
                      notes: ele.notes,
                      parent: res.id,
                    })
                    .then(result => {
                      ele.id = result.id;
                      ele.parentId = res.id;
                    });
                });
              });

            props.setTaskList(taskDivs);
          }
        }
      });

    props.setTaskList(taskDivs);
  };

  return (
    <div>
      <DragSorting
        taskDivs={props.taskDivs}
        constructTaskDiv={constructTaskDiv}
        taskListId={props.taskListId}
        setTaskList={props.setTaskList}
      />
      {isEditMenuOpened ? (
        <SlidingMenu
          isOpened={isEditMenuOpened}
          listNames={props.listNames}
          selectedList={props.selectedList}
          constructTaskDiv={constructTaskDiv}
          clickedClose={_ => setEditMenu(false)}
          taskNumber={editingTask.current}
          taskDivs={props.taskDivs}
          submitted={(title, notes, taskListIndex) => submitted(title, notes, taskListIndex)}
          clickedDelete={_ => {
            setEditMenu(false);
            updateTasks.deleteTask(
              props.taskDivs,
              props.setTaskList,
              props.taskListId,
              editingTask.current[0],
              editingTask.current[1],
              props.setMessage
            );
          }}
        />
      ) : (
        ""
      )}
    </div>
  );
}
