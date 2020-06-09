import React, { useEffect, useRef, useState } from "react";
import api from "../../functionalities/tasks.api";

export default function DragSorting(props) {
  const [dragging, setDragging] = useState(false);
  const dragItem = useRef();
  const dragItemNode = useRef();
  const dragOverItem = useRef();

  let taskDragStart = (item, i, j) => {
    dragItemNode.current = item;
    j == -1 ? (dragItem.current = i) : (dragItem.current = [i, j]);
    j == -1 ? (props.taskDivs[i].dragging = true) : (props.taskDivs[i].children[j].dragging = true);
    dragItemNode.current.addEventListener("dragend", taskDragEnd);
    setTimeout(() => {
      setDragging(true);
    }, 0);
  };

  let taskDragEnter = (item, i, j) => {
    let taskDivs = props.taskDivs;
    if (dragItemNode.current !== item && (dragOverItem.current != i || dragOverItem.current != [i, j])) {
      new Promise((resolve, reject) => {
        resolve();
      })
        .then(() => {
          if (dragOverItem.current) {
            // if(dragOverItem.current.length != 2)
            dragOverItem.current.length != 2
              ? (taskDivs[dragOverItem.current].draggingOver = false)
              : taskDivs[dragOverItem.current[0]].children[dragOverItem.current[1]]
              ? (taskDivs[dragOverItem.current[0]].children[dragOverItem.current[1]].draggingOver = false)
              : "";
          }
        })
        .then(() => (j == -1 ? (dragOverItem.current = i) : (dragOverItem.current = [i, j])))
        .then(() =>
          j == -1 ? (taskDivs[i].draggingOver = true) : (taskDivs[i].children[j].draggingOver = true)
        )
        .then(() => props.setTaskList(taskDivs));
    }
  };

  let taskDragEnd = () => {
    let taskDivs = props.taskDivs;
    let taskDiv, isBefore;
    dragOverItem.current.length != 2
      ? (taskDivs[dragOverItem.current].draggingOver = false)
      : (taskDivs[dragOverItem.current[0]].children[dragOverItem.current[1]].draggingOver = false);
    if (dragOverItem.current.length == 2) {
      if (dragItem.current.length == 2) {
        taskDiv = taskDivs[dragItem.current[0]].children.splice(dragItem.current[1], 1)[0];
        if (
          taskDivs[dragItem.current[0]].children.length == 0 &&
          dragItem.current[0] != dragOverItem.current[0]
        )
          taskDivs[dragItem.current[0]].collapsed = 0;
      } else {
        if (taskDivs[dragItem.current].children.length > 0) return null;
        else {
          taskDiv = taskDivs.splice(dragItem.current, 1)[0];
          if (dragItem.current < dragOverItem.current[0]) isBefore = 1;
        }
      }
      if (taskDiv) {
        taskDiv.newlyAdded = true;
        taskDiv.dragging = false;
        taskDiv.subset = dragOverItem.current[0];
        let parentTask = isBefore ? taskDivs[dragOverItem.current[0] - 1] : taskDivs[dragOverItem.current[0]];
        taskDiv.parentId = parentTask.id;
        api.moveTask({
          taskListId: props.taskListId,
          taskId: taskDiv.id,
          parent: parentTask.id,
          previous: dragOverItem.current[1] == 0 ? "" : parentTask.children[dragOverItem.current[1] - 1].id,
        });
        parentTask.children.splice(dragOverItem.current[1], 0, taskDiv);
      }
    } else {
      if (dragItem.current.length == 2) {
        taskDiv = taskDivs[dragItem.current[0]].children.splice(dragItem.current[1], 1)[0];
        if (taskDivs[dragItem.current[0]].children.length == 0) taskDivs[dragItem.current[0]].collapsed = 0;
        taskDiv.children = [];
        taskDiv.subset = -1;
        delete taskDiv.parentId;
      } else taskDiv = taskDivs.splice(dragItem.current, 1)[0];
      taskDiv.newlyAdded = true;
      taskDiv.dragging = false;
      api.moveTask({
        taskListId: props.taskListId,
        taskId: taskDiv.id,
        previous: dragOverItem.current == 0 ? "" : taskDivs[dragOverItem.current - 1].id,
      });
      taskDivs.splice(dragOverItem.current, 0, taskDiv);
    }
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
