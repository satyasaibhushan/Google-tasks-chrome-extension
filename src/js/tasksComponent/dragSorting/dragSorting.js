import React, { useEffect, useRef, useState } from "react";

export default function DragSorting(props) {
  const [dragging, setDragging] = useState(false);
  const dragItem = useRef();
  const dragItemNode = useRef();
  const dragOverItem = useRef();

  let taskDragStart = (item, i, j) => {
    console.log("Starting to drag", item);
    dragItemNode.current = item;
    dragItem.current = i;
    dragItemNode.current.addEventListener("dragend", taskDragEnd);
    setTimeout(() => {
      setDragging(true);
    }, 0);
  };

  let taskDragEnter = (item, i, j) => {
    console.log("Entering a drag target", item);
    if (dragItemNode.current !== item) {
      console.log("Target is NOT the same as dragged item");
      dragOverItem.current = i;
    }
  };

  let taskDragEnd = () => {
    let taskDivs = props.taskDivs;
    taskDivs.splice(dragOverItem.current, 0, taskDivs.splice(dragItem.current, 1)[0]);
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
              >
                {props.constructTaskDiv(element, i, j)}
              </div>,
            ])
          : ""
        : "",
    ];
  });
}
