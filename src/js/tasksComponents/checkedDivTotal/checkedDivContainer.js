import React from "react";
import "./checkedDivContainer.css";
import { TaskDiv } from "../taskDiv/taskDiv";

export class CheckedDivTotal extends React.Component {
  constructor(props) {
    super();
    console.log(props);
    this.state = {
      checkedArray: props.checkedList,
    };
  }

  changeElementKey(keyName, i) {
    let checkedArray = this.state.checkedArray;
    if (keyName == "newlyAdded" && checkedArray[i].newlyAdded == true)
      checkedArray[i].newlyAdded = false;
    this.setState({ checkedArray });
  }
  removeClick(i) {
    let checkedArray = this.state.checkedArray;
    checkedArray[i].focus = false;
    this.setState({ checkedArray });
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
          clickedTick={(_) => console.log(3)}
          changeElementKey={(_) => this.changeElementKey("newlyAdded", i)}
          checkedList={true}
        />
      );
    });
  }
  render() {
    return (
      <div className="chekedDivContainer">
        <div
          style={{
            height: "3rem",
            width: "20rem",
            fontSize: "20px",
            display: "flex",
            paddingLeft:'4rem',
            // justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          Completed ({this.state.checkedArray.length})
        </div>
        {this.allCheckedDivs(this.state.checkedArray)}
      </div>
    );
  }
}
