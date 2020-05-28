import React from "react";
import "./taskListSelector.css";
import Modal from "../modal/modal";
import OptionsPanel from "../optionsPanel/optionsPanel";
import updateTaskLists from "../../functionalities/taskListFunctionalities";
import Dropdown from "./dropdown";

export class TaskListSelector extends React.Component {
  constructor(props) {
    super();
    this.state = {
      isOptionsOpen: false,
      modal: { text: "", inputValue: "", isInput: false, isOpened: false, selectedOptionIndex: "-1,-1" },
    };
    this.displayOptionNames = [
      { title: "Sort By", type: "selection", options: ["Date", "My Order"] },
      {
        title: "",
        type: "options",
        options: ["Create new list", "Rename List", "Delete List", "Delete all Completed tasks"],
      },
      {
        title: "",
        type: "shortcuts",
        options: ["KeyBoard shortcuts", "Copy remainders to tasks"],
      },
    ];
    this.modalTemplates = [];
    this.modalFunctions = [
      [
        updateTaskLists.addTaskList,
        updateTaskLists.updateTaskList,
        updateTaskLists.deleteTaskList,
        updateTaskLists.deleteCompletedTasks,
      ],
    ];
  }

  componentDidUpdate() {
    let noOfTasks, noOfCheckedTasks;
    if (this.props.selectedList != -1) {
      noOfTasks = this.props.taskLists[this.props.selectedList].taskDivs.length;
      noOfCheckedTasks = this.props.taskLists[this.props.selectedList].checkedDivs.length;

      this.modalTemplates = [
        [
          { text: "Create new list", inputValue: "", isInput: true },
          { text: "Rename list", inputValue: "", isInput: true },
          {
            text: "Delete this list?",
            inputValue: "deleting this list will also delete " + noOfTasks + " tasks",
            isInput: false,
            // inactive: this.props.selectedList!=0 ? true:false
          },
          {
            text: "Delete all completed tasks?",
            inputValue: noOfCheckedTasks + " completed tasks will be permanently removed",
            isInput: false,
            // inactive: noOfCheckedTasks==0 ? true:false
          },
        ],
      ];
    }
  }

  render() {
    return (
      <div style={{ height: "2rem" }}>
        {this.props.selectedList != -1 ? (
          <Dropdown
            listNames={this.props.listNames}
            selectedList={this.props.listNames[this.props.selectedList]}
            selectedListIndex={this.props.selectedList}
            clickedList={this.props.setTaskListIndex}
          />
        ) : (
          ""
        )}
        <div
          className="taskListIcon"
          onClick={_ => this.setState({ isOptionsOpen: !this.state.isOptionsOpen })}
        ></div>
        <Modal
          text={this.state.modal.text}
          inputValue={this.state.modal.inputValue}
          isInput={this.state.modal.isInput}
          isOpened={this.state.modal.isOpened}
          clickedClose={_ => {
            let modal = this.state.modal;
            modal.isOpened = false;
            this.setState({ modal: modal });
          }}
          submitted={value => {
            this.modalFunctions[0][this.state.modal.selectedOptionIndex](
              value,
              this.props.taskLists,
              this.props.setTaskLists,
              this.props.selectedList,
              this.props.setTaskListIndex,
              this.props.setMessage
            );
          }}
        />
        <OptionsPanel
          displayOptionNames={this.displayOptionNames}
          isOpened={this.state.isOptionsOpen}
          clickedClose={_ => this.setState({ isOptionsOpen: false })}
          clickedOption={(i, j) => {
            let modal = this.state.modal;
            modal.text = this.modalTemplates[0][j].text;
            modal.inputValue = this.modalTemplates[0][j].inputValue;
            modal.isInput = this.modalTemplates[0][j].isInput;
            if (modal.isInput && j == 1) modal.inputValue = this.props.listNames[this.props.selectedList];
            modal.selectedSectionIndex = i;
            modal.selectedOptionIndex = j;
            modal.isOpened = true;
            this.setState({ modal: modal });
            this.setState({ isOptionsOpen: false });
          }}
        />
      </div>
    );
  }
}
