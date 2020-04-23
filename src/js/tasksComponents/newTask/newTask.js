import React from "react";
import "./newTaskStyles.css";

export default function Newtask(props) {
  return (
    <div className="newTaskContainer">
      <img
        onClick={_=>props.plusNewTask()}
        src="../../images/plus.svg"
        alt="plus sign"
        className="plusImageNewTask"
      />
      <input
        onKeyDown={(e) =>props.enterNewTask(e)}
        type="text"
        name=""
        placeholder="Add a task"
        className="textAreaNewTask"
      />
    </div>
  );
}
