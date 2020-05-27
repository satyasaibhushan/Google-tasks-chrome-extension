import React, { useEffect, useRef, useState } from "react";
import "./optionsPanel.css";

export default function OptionsPanel(props) {

  useEffect(() => {
    let optionsPanelContainer = document.getElementsByClassName("optionsPanelContainer")[0];
    document.addEventListener("click", e => {
      if (e.target == optionsPanelContainer ) props.clickedClose();
    });
  },[]);
  return (
    <div className='optionsPanelContainer' style={{display:props.isOpened ? 'block':'none'}}>
       <div className={props.isOpened ?'optionsPanel open':'optionsPanel close'}>

       </div>
    </div>
  )
}
