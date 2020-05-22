import React, { useEffect, useRef,useState } from "react";
import "./modal.css";

export default function Modal(props) {
  const container = useRef(null);
  const div = useRef(null);
  const textArea = useRef(null);
  const mounted = useRef();
  const [inputValue, setValue] = useState(props.inputValue)
  const [isOpened, setOpen] = useState(props.isOpened)

  useEffect(() => {
    let modalContainer = document.getElementsByClassName("modal-container")[0];
    modalContainer.addEventListener("click", (e) => {
      if (e.target == modalContainer) props.clickedClose();
    });
  }, []);
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
    } else {
       
      if (!props.isOpened && !isOpened) {
        setOpen(true)
        var tl = gsap.timeline();
        tl.to(
          container.current,
          {duration:0.1, backgroundColor: "rgba(59, 59, 59, 0)" ,delay:0.1}
        );
        tl.to(
          container.current,
          {duration:0.01,display: "none",delay:0.1 }
        );
        var tl2 = gsap.timeline();
        tl2.to(div.current,  { duration:0.1, opacity: 0.7 });
        tl2.to(
          div.current,
          {duration:0.3,
            opacity: 0.4,
            scale:0.5,
          }
        );
      }
      if (props.isOpened && isOpened) {
        setOpen(false)
        var tl = gsap.timeline();
        tl.to(container.current,  {duration:0, display: "flex" });
        tl.to(
          container.current,
          {duration: 0.5, backgroundColor: "rgba(59, 59, 59, 0.452)" }
        );
        var tl2 = gsap.timeline();
        tl2.to(
          div.current,
          {
            duration: 0.2,
            opacity: 0.7,
            scale:1,
          }
        )
        tl2.to(div.current,  { duration: 0.3, opacity: 1 });
      }
      if(!props.isInput && isOpened && textArea.current.style.height != textArea.current.scrollHeight + "px"){
        textArea.current.style.height = "auto";
        textArea.current.style.height = textArea.current.scrollHeight + "px";
      }
    }
  });
  return (
    <div
      ref={container}
      className={
        props.isOpened ? "modal-container open" : "modal-container close"
      }
      style={{display:'none'}}
    >
      <section
        className={props.isOpened ? "modal-div open" : "modal-div close"}
        ref={div}
      >
        <div className="modalText">
          <p>{props.text}</p>
        </div>
        <div className="modalContent">
          <div style={{ padding: props.isInput? '10px 0 0 0' : '6px 0',background: props.isInput? 'rgba(120, 176, 232, 0.19)' : ''}}>
          <textarea
          ref={textArea}
            rows="1"
            type="text"
            name=""
            value={inputValue}
            onChange={(e)=>setValue(e.target.value)
            }
            readOnly={!props.isInput}
            style={{
            whiteSpace: props.isInput? 'nowrap' : '',
            lineHeight: props.isInput? '10px':'18px'    
          }}
          ></textarea>
          </div>
        </div>
        <div className="modalButtonsContainer">
          <button onClick={props.clickedClose}>Cancel</button>
          <button>Done</button>
        </div>
      </section>
    </div>
  );
}
