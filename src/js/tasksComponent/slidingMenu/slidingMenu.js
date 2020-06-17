import React, { useEffect, useRef, useState } from "react";
import "./slidingMenu.css";
import Dropdown from "../taskListSelector/dropdown";

export default function SlidingMenu(props) {
  let tasksComponentContanier = document.getElementsByClassName("tasksComponentContainer")[0];
  if (props.isOpened) {
    tasksComponentContanier.scrollTo(0, 0);
    tasksComponentContanier.onscroll = function () {
      tasksComponentContanier.scrollTo(0, 0);
    };
  } else {
    tasksComponentContanier.onscroll = function () {};
  }
  const [titleTextAreaFocus, setTitleTextAreaFocus] = useState(false);
  const [notesTextAreaFocus, setNotesTextAreaFocus] = useState(false);
  return (
    <div
      className={props.isOpened ? "slidingMenuContainer open" : "slidingMenuContainer close"}
      style={{ display: props.isOpened ? "" : "none" }}>
      <section className="slidingMenuTopSection">
        <div className="closeArrowContainer" onClick={_ => props.clickedClose()}>
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
          placeholder="Enter title"
          style={{ height: "47px", maxHeight: "" }}
          onFocus={_ => setTitleTextAreaFocus(true)}
          onBlur={_ => setTitleTextAreaFocus(false)}
          onInput={e => {
            e.target.style.height = "0";
            e.target.style.height = e.target.scrollHeight + "px";
            console.log(e.target.style.height, e.target.scrollHeight);
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
            console.log(e.target.style.height, e.target.scrollHeight);
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
            selectedList={props.listNames[props.selectedList]}
            selectedListIndex={props.selectedList}
            clickedList={e => {
              console.log(e);
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
