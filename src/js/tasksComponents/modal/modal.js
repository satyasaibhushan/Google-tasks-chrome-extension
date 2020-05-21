import React from "react";
import "./modal.css";

export default function Modal(props) {
  return (
    <div className='modal-container' style={{
        display:props.isOpened ? 'block':'none'
    }}>
        <section className="modal-div">
          <div className='modalText'>
           <p>{props.text}</p>
          </div>
          <div className='modalContent'>
              <textarea rows='1'
                type="text"
                name=""
                value={props.inputValue}
                readOnly={!props.isInput}></textarea>
          
          </div>
          <div className='modalButtonsContainer'>
                <button onClick={props.clickedClose}>Cancel</button>
                <button>Done</button>
          </div>
        </section>
      </div>
  );
}