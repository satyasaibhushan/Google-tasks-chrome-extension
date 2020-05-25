import React, { useEffect, useRef,useState } from "react";
import './optionsPanel.css';

export default function OptionsPanel(props) {
  const container = useRef(null);
//   const div = useRef(null);
//   const textArea = useRef(null);
//   const mounted = useRef();
//   const [inputValue, setValue] = useState(props.inputValue)
//   const [isOpened, setOpen] = useState(props.isOpened)


  return (
    <div
      ref={container}
      className='optionsPanelWhole'
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
