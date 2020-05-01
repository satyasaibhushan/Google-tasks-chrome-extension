import React from "react";
import "./checkedDivContainer.css";
import { TaskDiv } from "../taskDiv/taskDiv";

export class CheckedDivTotal extends React.Component {
  constructor(props) {
    super();
    
    this.state = {
      checkedArray: props.checkedList,
      tasksArray:props.tasksList,
      opened: false,
    };
  }

  changeElementKey(keyName, i) {
    let checkedArray = this.props.checkedList;
    let tasksArray = this.props.tasksList;
    if (keyName == "newlyAdded" && checkedArray[i].newlyAdded == true)
      checkedArray[i].newlyAdded = false;
    if (keyName == "unchecked" && checkedArray[i].unchecked == true) {
        checkedArray[i].newlyAdded=true;
        checkedArray[i].checked=false; 
        checkedArray[i].unchecked = false;
        tasksArray.unshift(checkedArray[i])
        checkedArray.splice(i , 1)
        
    }
    this.props.changeCheckedArray(checkedArray)
    this.props.changeTaskArray(tasksArray)
  }
  removeClick(i) {
    let checkedArray = this.props.checkedList;
    checkedArray[i].focus = false;
    this.props.changeCheckedArray(checkedArray)
  }

  allCheckedDivs(checkedList) {
    //  console.log(checkedList)

    return checkedList.map((checkedItem, i) => {
      return (
        <TaskDiv
          taskArrayElement={checkedItem}
          key={i}
          // keys={i}
          changeElement={(_) => this.removeClick(i)}
          manageTasks={(_) => console.log(2)}
          clickedTick={(_) => this.props.clickedTick(i)}
          changeElementKey={(value) => this.changeElementKey(value, i)}
          checkedList={true}
        />
      );
    });
  }
  render() {
    return (
      <div className="chekedDivContainer">
        <div style={{display: this.props.checkedList.length==0 ?'none' : ''}}
          className="chekedDivsWrapper"
          onClick={(_) =>
            this.setState({ opened: this.state.opened ? false : true })
          }
        >
          Completed ({this.props.checkedList.length})
          <i className={this.state.opened ? "down" : "up"}></i>
        </div>
        <div style={{ display: this.state.opened ? "block" : "none" }} >
        {this.allCheckedDivs(this.props.checkedList)}
        </div>
      </div>
    );
  }
}
