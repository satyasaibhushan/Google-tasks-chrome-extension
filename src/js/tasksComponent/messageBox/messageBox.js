import React, { useEffect, useRef, useState } from "react";
import "./messageBox.css";

export default function MessageBox(props) {
  const [isVisible,changeVisibility] = useState(props.isVisible)
  const messageDiv = useRef(null)
  console.log(props.msgChange)
  useEffect(()=>{
    console.log('hey therr',isVisible)
    if(props.isVisible){
      var tl = gsap.timeline();
      console.log(messageDiv.current.style.display)
      tl.to(messageDiv.current,  { duration:0,display:'flex', })
      tl.to(messageDiv.current,  { duration:0.5,ease:'easeInOut', opacity: 1,y:"-=3rem" });
      tl.to(messageDiv.current,  { duration:0.5,ease:'easeInOut',delay:4,display:'none', opacity: 0,y:"+=3rem" })
      setTimeout(() => {
        changeVisibility(false)
      }, 5000);
    }
  },[props.msgChange])
  return (
    <div
      className="messageBox"
      style={{
        position: "fixed",
        height: "3rem",
        width:'20rem',
        bottom: "3rem",
        backgroundColor: "rgba(32,33,37,0.95)",
        color: "white",
        justifyContent:'space-around',
        alignItems:'center',
        opacity:0
      }}
      ref={messageDiv}
    >
      <div className="messageDiv">
        <p style={{fontSize:'16px'}}>{props.message}</p>
      </div>
      <div className="undoButton">
        <button style={{ border:'none',
        textAlign:'center',
        textDecoration:'none',
        fontSize:'16px',
        width:'4rem',
        height:'2rem',
        cursor:'pointer',
        outlineWidth:'0',
        color:'rgb(107,165,237)',
        backgroundColor:'rgba(32,33,37,0)'
        }}
        onClick={(e)=>{props.clickedUndo(e)}}>Undo</button>
      </div>
    </div>
  );
}
