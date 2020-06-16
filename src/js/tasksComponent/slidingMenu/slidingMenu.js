import React, { useEffect, useRef, useState } from "react";
import "./slidingMenu.css";
import Dropdown from "../taskListSelector/dropdown";

export default function SlidingMenu(props) {
  if (props.isOpened)
    document.getElementsByClassName("tasksComponentContainer")[0].onscroll = function () {
      document.getElementsByClassName("tasksComponentContainer")[0].scrollTo(0, 0);
      return null;
    };
  return (
    <div className="slidingMenuContainer" style={{ display: props.isOpened ? "" : "none" }}>
      <section className="slidingMenuTopSection">
        <div className="closeArrowContainer">
          <span className="closeArrow"></span>
        </div>
        <div className="slidingMenuDeleteIconContainer">
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
          style={{ height: "47px",maxHeight:'' }}
          onInput={e => {
            e.target.style.height = "0";
            e.target.style.height = e.target.scrollHeight + "px";
            console.log(e.target.style.height, e.target.scrollHeight);
          }}></textarea>
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
          onInput={e => {
            e.target.style.height = "0";
            e.target.style.height = e.target.scrollHeight + "px";
            console.log(e.target.style.height, e.target.scrollHeight);
          }}></textarea>
      </section>
      <section className="slidingMenuListSection">
        <div className="listIconContainer">
            <div className="listIcon"></div>
        </div>
        <div className='slidingMenuDropdown'>
        <Dropdown
        listNames={props.listNames}
        selectedList={props.listNames[props.selectedList]}
        selectedListIndex={props.selectedList}
        clickedList={e=>{console.log(e)}}
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
