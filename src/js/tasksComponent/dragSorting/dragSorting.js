import React, { useEffect, useRef, useState } from "react";
import api from "../../functionalities/tasks.api";

export default function DragSorting(props) {
  const [dragging, setDragging] = useState(false);
  const dragItem = useRef();
  const dragItemNode = useRef();
  const dragOverItem = useRef();
  const draggingOverDivHeight = useRef();
  const [draggingOverHighlightPosition, setHighlight] = useState(0);
  const draggingOverHighlightPositionRef = useRef();

  useEffect(() => {
    let taskDivs = props.taskDivs;
    if (draggingOverHighlightPosition != 0 && (dragOverItem.current || dragOverItem.current == 0)) {
      dragOverItem.current.length != 2
        ? (taskDivs[dragOverItem.current].draggingOver = draggingOverHighlightPosition)
        : (taskDivs[dragOverItem.current[0]].children[
            dragOverItem.current[1]
          ].draggingOver = draggingOverHighlightPosition);
    }
    props.setTaskList(taskDivs);
  }, [dragOverItem.current, draggingOverHighlightPosition]);

  let taskDragStart = (item, i, j) => {
    dragItemNode.current = item;
    j == -1 ? (dragItem.current = i) : (dragItem.current = [i, j]);
    j == -1 ? (props.taskDivs[i].dragging = true) : (props.taskDivs[i].children[j].dragging = true);
    dragItemNode.current.addEventListener("dragend", taskDragEnd);
    setTimeout(() => {
      setDragging(true);
    }, 0);
  };

  let taskDragEnter = (item, i, j, e) => {
    let taskDivs = props.taskDivs;
    if (dragItemNode.current !== item && (dragOverItem.current != i || dragOverItem.current != [i, j])) {
      new Promise((resolve, reject) => {
        resolve();
      })
        .then(() => {
          if (dragOverItem.current || dragOverItem.current == 0) {
            dragOverItem.current.length != 2
              ? taskDivs[dragOverItem.current]
                ? (taskDivs[dragOverItem.current].draggingOver = 0)
                : ""
              : taskDivs[dragOverItem.current[0]] &&
                taskDivs[dragOverItem.current[0]].children &&
                taskDivs[dragOverItem.current[0]].children[dragOverItem.current[1]]
              ? (taskDivs[dragOverItem.current[0]].children[dragOverItem.current[1]].draggingOver = 0)
              : "";
          } else return;
        })
        .then(() => (j == -1 ? (dragOverItem.current = i) : (dragOverItem.current = [i, j])))
        .then(() => props.setTaskList(taskDivs));
    }
  };

  let taskDragEnd = e => {
    e.preventDefault();
    let taskDivs = props.taskDivs;
    let taskDiv,
      draggedTaskDisplacement = 0,
      isBefore = 0;
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
        draggedTaskDisplacement =
          dragItem.current[0] == dragOverItem.current[0] && dragItem.current[1] < dragOverItem.current[1]
            ? -1
            : 0;
      } else {
        if (taskDivs[dragItem.current].children.length > 0) {
          taskDivs[dragItem.current].dragging = false;
        } else {
          taskDiv = taskDivs.splice(dragItem.current, 1)[0];
          if (dragItem.current < dragOverItem.current[0]) isBefore = 1;
        }
      }
      if (taskDiv) {
        if (draggingOverHighlightPositionRef.current == -1) draggedTaskDisplacement++;
        let parentTask = isBefore ? taskDivs[dragOverItem.current[0] - 1] : taskDivs[dragOverItem.current[0]];
        let prev =
          dragOverItem.current[1] == 0 && draggingOverHighlightPositionRef.current == 1
            ? ""
            : parentTask.children[dragOverItem.current[1] + draggedTaskDisplacement - 1].id;
        moveTaskElement(
          parentTask.children,
          props.taskListId,
          taskDiv,
          prev,
          draggedTaskDisplacement,
          parentTask
        );
      }
    } else {
      if (dragItem.current.length == 2) {
        taskDiv = taskDivs[dragItem.current[0]].children.splice(dragItem.current[1], 1)[0];
        if (taskDivs[dragItem.current[0]].children.length == 0) taskDivs[dragItem.current[0]].collapsed = 0;
        taskDiv.children = [];
        taskDiv.subset = -1;
        delete taskDiv.parentId;
        if (draggingOverHighlightPositionRef.current == -1) draggedTaskDisplacement++;
      } else {
        taskDiv = taskDivs.splice(dragItem.current, 1)[0];
        draggedTaskDisplacement = dragOverItem.current > dragItem.current ? 0 : 1;
        if (draggingOverHighlightPositionRef.current == 1) draggedTaskDisplacement--;
      }
      let prev =
        dragOverItem.current == 0 && draggingOverHighlightPositionRef.current == 1
          ? ""
          : taskDivs[dragOverItem.current + draggedTaskDisplacement - 1].id;
      moveTaskElement(taskDivs, props.taskListId, taskDiv, prev, draggedTaskDisplacement);
    }
    // props.setTaskList(taskDivs)
    setDragging(false);
    dragItem.current = null;
    dragItemNode.current.removeEventListener("dragend", taskDragEnd);
    dragItemNode.current = null;
  };
  let moveTaskElement = (tasksArray, taskArrayId, task, prevId, displacement, parent = undefined) => {
    task.newlyAdded = true;
    task.dragging = false;
    if (parent) {
      task.subset = dragOverItem.current[0];
      task.parentId = parent.id;
    }
    api.moveTask({
      taskListId: taskArrayId,
      taskId: task.id,
      previous: prevId,
      parent: parent ? parent.id : "",
    });
    tasksArray.splice((!parent ? dragOverItem.current : dragOverItem.current[1]) + displacement, 0, task);
  };

  let taskDragOver = (e, i, j) => {
    e.preventDefault();
    if (draggingOverDivHeight.current && dragging) {
      let scrollDist = document.getElementsByClassName("tasksComponentContainer")[0].scrollTop;

      if (e.pageY - e.currentTarget.offsetTop - draggingOverDivHeight.current * 1.5 + scrollDist > 0) {
        setHighlight(-1);
        draggingOverHighlightPositionRef.current = -1;
      } else {
        setHighlight(1);
        draggingOverHighlightPositionRef.current = 1;
      }
    } else if (!dragging) return;
  };

  return props.taskDivs.map((taskDiv, i) => {
    return [
      <div
        key={i}
        draggable
        onDragStart={e => taskDragStart(e.target, i, -1)}
        onDragOver={e => {
          dragging ? taskDragOver(e, i, -1) : "";
          draggingOverDivHeight.current = e.currentTarget.offsetHeight;
        }}
        onDragEnter={dragging ? e => taskDragEnter(e.target, i, -1, e) : null}
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
                onDragOver={e => {
                  dragging ? taskDragOver(e, i, j) : "";
                  draggingOverDivHeight.current = e.currentTarget.offsetHeight;
                }}
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
