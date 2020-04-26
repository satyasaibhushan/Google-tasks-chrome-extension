import React from "react";
import "./checkedDiv.css";
import {TaskDiv} from "../../taskDiv/taskDiv"

export class CheckedDiv extends React.Component{




   render(){
    // console.log(this.props)
        return(
            <TaskDiv
            taskArrayElement={this.props.element}
            key={this.props.keys}
            // keys={i}
            changeElement={e => this.props.removeClick(e)}
            manageTasks={_ => console.log(2)}
            clickedTick={_ => console.log(3)}
            changeElementKey={_ => this.props.removeKey("newlyAdded")}
            checkedList = {true}
            />
        )
   } 

}
