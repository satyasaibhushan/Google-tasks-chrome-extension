import React from "react";
import "./checkedDivContainer.css";
import { TaskDiv } from "../taskDiv/taskDiv";

export class CheckedDivTotal extends React.Component {
  constructor(props) {
    super();
    this.state = {
      opened: false,
    };
    this.checkedDivs = React.createRef();
  }

  changeElementKey(keyName, i) {
    let checkedArray = this.props.checkedList;
    let tasksArray = this.props.tasksList;
    if (keyName == "newlyAdded" && checkedArray[i].newlyAdded == true)
      checkedArray[i].newlyAdded = false;
    if (keyName == "unchecked" && checkedArray[i].unchecked == true) {
      checkedArray[i].newlyAdded = true;
      checkedArray[i].checked = false;
      checkedArray[i].unchecked = false;
      if(checkedArray[i].parentId){
       let index= tasksArray.map(item=>item.id).indexOf(checkedArray[i].parentId)
        if(index !=-1) tasksArray[index].children.unshift(checkedArray[i])  
        else {delete checkedArray[i].parentId
          checkedArray[i].subset = -1
          tasksArray.unshift(checkedArray[i]);}

      }
     else  tasksArray.unshift(checkedArray[i]);
      checkedArray.splice(i, 1);
      console.log(checkedArray)
    }
    this.props.changeCheckedArray(checkedArray);
    this.props.changeTaskArray(tasksArray);
  }
  removeClick(i) {
    let checkedArray = this.props.checkedList;
    checkedArray[i].focus = false;
    this.props.changeCheckedArray(checkedArray);
  }
  openingAnimaton(){
    TweenMax.fromTo(
      this.checkedDivs.current,
      {scaleY:1, opacity: 0 },
      { duration: 0.5,opacity: 1}
    );
  }

  allCheckedDivs(checkedList) {
    return checkedList.map((checkedItem, i) => {
      return (
        <TaskDiv
          taskArrayElement={checkedItem}
          key={i}
          changeElement={(_) => this.removeClick(i)}
          manageTasks={(_) => console.log(2)}
          clickedTick={(_) => this.props.clickedTick(i)}
          setHeight={(value)=>this.props.setHeight(value,i)}
          changeElementKey={(value) => this.changeElementKey(value, i)}
          checkedList={true}
        />
      );
    });
  }
  render() {
    return (
      <div className="chekedDivContainer">
        <div
          className={
            this.props.checkedList.length == 0
              ? "chekedDivsWrapper "
              : "chekedDivsWrapper opened"
          }
          onClick={(_) =>{
            this.setState({ opened: this.state.opened ? false : true })
            this.openingAnimaton()}
          }
        >
          Completed ({this.props.checkedList.length})
          <i className={this.state.opened ? "down" : "up"}></i>
        </div>
        <div
          ref={this.checkedDivs}
          className={this.state.opened ?"chekedDivs opened" :'chekedDivs'}
          style={{
            display: this.state.opened ? "block" : "none",
         }}
        >
          {/* {this.checkedDivs.current ? console.log(this.checkedDivs.current.clientHeight) : ''} */}
          {this.allCheckedDivs(this.props.checkedList)}
        </div>
      </div>
    );
  }
}
