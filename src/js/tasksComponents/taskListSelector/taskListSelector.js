import React from "react";
// import "./checkedDivContainer.css";

export class TaskListSelector extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div className="taskListSelector">
        <div>
          <select id="taskListFlow" onChange={(e) => this.props.selectedOption((this.props.listNames).indexOf(e.target.value))}>
            {this.props.listNames.map((element, i) => (
              <option value={element} key={i} >
                {element}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  }
}
