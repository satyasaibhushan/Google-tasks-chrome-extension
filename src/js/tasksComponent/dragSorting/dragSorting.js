import React, { useEffect, useRef, useState } from "react";
import updateTasks from "../../functionalities/taskFunctionalities";
import api from "../../functionalities/tasks.api";

export default function DragSorting(props) {
  const [dragging, setDragging] = useState(false);
  const dragItem = useRef();
  const dragItemNode = useRef();
  const dragOverItem = useRef();

  let taskDragStart = (item, i, j) => {
    console.log("Starting to drag", item);
    dragItemNode.current = item;
    j == -1 ? (dragItem.current = i) : (dragItem.current = [i, j]);
    dragItemNode.current.addEventListener("dragend", taskDragEnd);
    setTimeout(() => {
      setDragging(true);
    }, 0);
  };

  let taskDragEnter = (item, i, j) => {
    console.log("Entering a drag target", item);
    if (dragItemNode.current !== item) {
      console.log("Target is NOT the same as dragged item");
      j == -1 ? (dragOverItem.current = i) : (dragOverItem.current = [i, j]);
    }
  };

  let taskDragEnd = () => {
    let taskDivs = props.taskDivs;
    if (dragOverItem.current.length == 2) {
      if (dragItem.current.length == 2) {
        let taskDiv = taskDivs[dragItem.current[0]].children.splice(dragItem.current[1], 1)[0];
        if (taskDivs[dragItem.current[0]].children.length == 0) taskDivs[dragItem.current[0]].collapsed = 0;
        taskDiv.parentId = taskDivs[dragOverItem.current[0]].id;
        taskDiv.newlyAdded = true;
        taskDiv.subset = dragOverItem.current[0];
        api.moveTask({
          taskListId: props.taskListId,
          taskId: taskDiv.id,
          parent: taskDivs[dragOverItem.current[0]].id,
          previous:
            dragOverItem.current[1] == 0
              ? ""
              : taskDivs[dragOverItem.current[0]].children[dragOverItem.current[1] - 1].id,
        });
        taskDivs[dragOverItem.current[0]].children.splice(dragOverItem.current[1], 0, taskDiv);
      } else {
        if (taskDivs[dragItem.current].children.length > 0) return null;
        else {
          let taskDiv = taskDivs.splice(dragItem.current, 1)[0];
          taskDiv.newlyAdded = true;
          taskDiv.newlyAdded = true;
          taskDiv.subset = dragOverItem.current[0];
          if (dragItem.current > dragOverItem.current[0]) {
            taskDiv.parentId = taskDivs[dragOverItem.current[0]].id;
            console.log(taskDiv, taskDiv.id);
            api.moveTask({
              taskListId: props.taskListId,
              taskId: taskDiv.id,
              parent: taskDivs[dragOverItem.current[0]].id,
              previous:
                dragOverItem.current[1] == 0
                  ? ""
                  : taskDivs[dragOverItem.current[0]].children[dragOverItem.current[1] - 1].id,
            });
            taskDivs[dragOverItem.current[0]].children.splice(dragOverItem.current[1], 0, taskDiv);
          } else {
            taskDiv.parentId = taskDivs[dragOverItem.current[0] - 1].id;
            api.moveTask({
              taskListId: props.taskListId,
              taskId: taskDiv.id,
              parent: taskDivs[dragOverItem.current[0] - 1].id,
              previous:
                dragOverItem.current[1] == 0
                  ? ""
                  : taskDivs[dragOverItem.current[0] - 1].children[dragOverItem.current[1] - 1].id,
            });
            taskDivs[dragOverItem.current[0] - 1].children.splice(dragOverItem.current[1], 0, taskDiv);
          }
        }
      }
    } else {
      if (dragItem.current.length == 2) {
        let taskDiv = taskDivs[dragItem.current[0]].children.splice(dragItem.current[1], 1)[0];
        if (taskDivs[dragItem.current[0]].children.length == 0) taskDivs[dragItem.current[0]].collapsed = 0;
        taskDiv.children = [];
        taskDiv.subset = -1;
        delete taskDiv.parentId;
        taskDiv.newlyAdded = true;
        api.moveTask({
            taskListId: props.taskListId,
            taskId: taskDiv.id,
            previous: dragOverItem.current == 0 ? "" : taskDivs[dragOverItem.current - 1].id,
          });
        taskDivs.splice(dragOverItem.current, 0, taskDiv);
      } else {
        let taskDiv = taskDivs.splice(dragItem.current, 1)[0];
        taskDiv.newlyAdded = true;
        api.moveTask({
          taskListId: props.taskListId,
          taskId: taskDiv.id,
          previous: dragOverItem.current == 0 ? "" : taskDivs[dragOverItem.current - 1].id,
        });
        taskDivs.splice(dragOverItem.current, 0, taskDiv);
      }
    }
    console.log(taskDivs.map(taskDivs => taskDivs.value));
    console.log(props.taskDivs.map(taskDivs => taskDivs.value));
    // props.setTaskList(taskDivs)
    setDragging(false);
    dragItem.current = null;
    dragItemNode.current.removeEventListener("dragend", taskDragEnd);
    dragItemNode.current = null;
  };

  return props.taskDivs.map((taskDiv, i) => {
    return [
      <div
        key={i}
        draggable
        onDragStart={e => taskDragStart(e.target, i, -1)}
        onDragEnter={dragging ? e => taskDragEnter(e.target, i, -1) : null}
      >
        {props.constructTaskDiv(taskDiv, i, -1)}
      </div>,
      taskDiv.children.length > 0
        ? taskDiv.children
          ? taskDiv.children.map((element, j) => [
              <div
                key={i * 100}
                style={{
                  display: taskDiv.collapsed == 1 ? "none" : "",
                  animation: taskDiv.collapsed == -1 ? "tasks-slide-out 0.3s ease-in-out 1" : "",
                }}
                draggable
                onDragStart={e => taskDragStart(e.target, i, j)}
                onDragEnter={dragging ? e => taskDragEnter(e.target, i, j) : null}
              >
                {props.constructTaskDiv(element, i, j)}
              </div>,
            ])
          : ""
        : "",
    ];
  });
}
