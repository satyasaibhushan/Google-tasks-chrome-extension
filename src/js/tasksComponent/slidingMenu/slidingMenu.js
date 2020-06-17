import React, { useEffect, useRef, useState } from "react";
import "./slidingMenu.css";
import Dropdown from "../taskListSelector/dropdown";
import apiManagement from "../../functionalities/apiManagement";

export default function SlidingMenu(props) {
  const [titleTextAreaFocus, setTitleTextAreaFocus] = useState(false);
  const [notesTextAreaFocus, setNotesTextAreaFocus] = useState(false);
  const [titleInputValue, setTitle] = useState();
  const [taskListNumber , setTaskListNumber] = useState(props.selectedList);

  let tasksComponentContanier = document.getElementsByClassName("tasksComponentContainer")[0];
  let taskDivs = props.taskDivs;
  let taskDiv = taskDivs
    ? props.taskNumber[1] == -1
      ? taskDivs[props.taskNumber[0]]
      : taskDivs[props.taskNumber[0]].children[props.taskNumber[1]]
    : "";

  useEffect(() => {
    taskDiv ? setTitle(taskDiv.value) : "";
  }, [taskDiv]);
  if (props.isOpened) {
    tasksComponentContanier.scrollTo(0, 0);
    tasksComponentContanier.onscroll = function () {
      tasksComponentContanier.scrollTo(0, 0);
    };
  } else {
    tasksComponentContanier.onscroll = function () {};
  }

  return (
    <div
      className={props.isOpened ? "slidingMenuContainer open" : "slidingMenuContainer close"}
      style={{ display: props.isOpened ? "" : "none" }}>
      <section className="slidingMenuTopSection">
        <div
          className="closeArrowContainer"
          onClick={_ => {
            props.submitted(titleInputValue,taskListNumber);
            props.clickedClose();
          }}>
          <span className="closeArrow"></span>
        </div>
        <div className="slidingMenuDeleteIconContainer" onClick={_ => props.clickedDelete()}>
          <img src="../../images/delete.svg" className="slidingMenuDeleteIcon " alt="delete icon" />
        </div>
      </section>

      <div className="seperator"></div>

      <section className="slidingAreaTextContainer">
        <textarea
          className="slidingAreaText"
          name=""
          id=""
          cols="30"
          rows=""
          value={titleInputValue}
          onChange={e => setTitle(e.target.value)}
          placeholder="Enter title"
          style={{ height: "47px", maxHeight: "" }}
          onFocus={_ => setTitleTextAreaFocus(true)}
          onBlur={_ => setTitleTextAreaFocus(false)}
          onInput={e => {
            e.target.style.height = "0";
            e.target.style.height = e.target.scrollHeight + "px";
          }}></textarea>
        <span
          className="textAreaBorderBottom"
          style={{ transform: titleTextAreaFocus ? "scaleX(1)" : "scaleX(0)" }}></span>
      </section>
      <section className="slidingNotesContainer">
        <textarea
          className="slidingNotesText"
          name=""
          id=""
          cols="30"
          rows=""
          placeholder="Add details"
          style={{ minHeight: "85px" }}
          onFocus={_ => setNotesTextAreaFocus(true)}
          onBlur={_ => setNotesTextAreaFocus(false)}
          onInput={e => {
            e.target.style.height = "0";
            e.target.style.height = e.target.scrollHeight + "px";
          }}></textarea>
        <span
          className="textAreaBorderBottom"
          style={{ transform: notesTextAreaFocus ? "scaleX(1)" : "scaleX(0)" }}></span>
      </section>
      <section className="slidingMenuListSection">
        <div className="listIconContainer">
          <div className="listIcon"></div>
        </div>
        <div className="slidingMenuDropdown">
          <Dropdown
            listNames={props.listNames}
            selectedList={props.listNames[taskListNumber]}
            selectedListIndex={taskListNumber}
            clickedList={e => {
              setTaskListNumber(e)
            }}
          />
        </div>
      </section>
      <section className="slidingMenuSubTasksSectoin">
        <div className="slidingMenuSubtasksIconContainer">
          <span className="subtasksIcon"></span>
        </div>
        <span className="addSubtasksButton">Add subtasks</span>
      </section>
    </div>
  );
}
