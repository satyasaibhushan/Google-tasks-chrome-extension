import React, { useEffect, useRef, useState } from "react";
import "./optionsPanel.css";

export default function OptionsPanel(props) {
  useEffect(() => {
    let optionsPanelContainer = document.getElementsByClassName("optionsPanelContainer")[0];
    document.addEventListener("click", e => {
      if (e.target == optionsPanelContainer) props.clickedClose();
    });
  }, []);

  return (
    <div className="optionsPanelContainer" style={{ display: props.isOpened ? "block" : "none" }}>
      <span className="closeIcon" onClick={props.clickedClose}></span>
      <div className={props.isOpened ? "optionsPanel open" : "optionsPanel close"}>
        {props.displayOptionNames.map((element, i) => {
          return [
            element.title ? (
              <p className="optionsTitle" key={i}>
                {element.title}
              </p>
            ) : (
              ""
            ),
            element.options.map((ele, j) => {
              return (
                <div
                  onClick={e => {
                    element.type == "options" ? props.clickedOption(i, j) : {};
                  }}
                  className={element.inactive.indexOf(j)!=-1 ? "options inactive" : "options"}
                  key={i * 10 + j}>
                  {ele}
                </div>
              );
            }),
            i != props.displayOptionNames.length - 1 ? <div key={i + 10} className="seperator"></div> : "",
          ];
        })}
      </div>
    </div>
  );
}
