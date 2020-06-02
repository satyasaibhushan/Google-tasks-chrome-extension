import React from "react";
import { TaskDiv } from "../tasksComponent/taskDiv/taskDiv";
import api from "./tasks.api";
import updateTasks from "./taskFunctionalities";
import drag from "../tasksComponent/dragSorting/dragSorting";
import DragSorting from "../tasksComponent/dragSorting/dragSorting";

export default function TotalTaskDivs(props) {
  let constructTaskDiv = (taskDiv, i, j) => {
    return (
      <TaskDiv
        taskArrayElement={taskDiv}
        key={j == -1 ? i : (i + 1) * 100 + j}
        changeElement={(value, isFocus) => {
          if ((value || value === "") && !taskDiv.checked && taskDiv.id != "") {
            api.updateTask({
              taskListId: props.taskListId,
              taskId: taskDiv.id,
              title: value,
            });
            taskDiv.value = value;
          }
          taskDiv.focus = isFocus;
        }}
        manageTasks={e =>
          updateTasks.checkKeyPress(props.taskDivs, props.setTaskList, props.taskListId, e, i + 1, j)
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
        checkedList={false}
      ></TaskDiv>
    );
  };

  
  return <DragSorting taskDivs={props.taskDivs} constructTaskDiv={constructTaskDiv} taskListId= {props.taskListId} setTaskList={props.setTaskList}/>
}
