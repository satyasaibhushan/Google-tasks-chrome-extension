import React from "react";
import "./taskListSelector.css";
import Modal from "../modal/modal";
import OptionsPanel from "../optionsPanel/optionsPanel";
import updateTaskLists from "../../functionalities/taskListFunctionalities";
import Dropdown from "./dropdown";
import SlidingMenu from "../slidingMenu/slidingMenu";
import { getCookie, setCookie } from "../../functionalities/cookies";

export class TaskListSelector extends React.Component {
  constructor(props) {
    super();
    this.state = {
      isOptionsOpen: false,
      modal: { text: "", inputValue: "", isInput: false, isOpened: false, selectedOptionIndex: "-1,-1" },
      informative:{isOpened : false,i:-1,j:-1 },
    };
    this.displayOptionNames = [
      {
        title: "Set Defaults",
        type: "toggles",
        options: ["Collapse subtasks", "Show completed tasks tab"],
        inactive: [],
        selected: [
          getCookie("defaultShowSubtasks") === "true",
          getCookie("defaultShowCompletedTab") === "true" || !getCookie("defaultShowCompletedTab"),
        ],
      },
      {
        title: "",
        type: "options",
        options: ["Create new list", "Rename List", "Delete List", "Delete all Completed tasks"],
        inactive: [],
      },
      {
        title: "",
        type: "informatives",
        options: ["KeyBoard shortcuts"],
        inactive: [],
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
    this.informativeTemplates = [
      [
        {
          title: "Inline Task actions",
          column1: ["move task up/ down", "Indent/Unindent", "Enter details view"],
          column2: ["⌥/Alt + Up/Down", "⌘/ctrl + ] / [", "shift + enter"],
        },
        {
          title: "Inline edit actions",
          column1: ["Add task(when on a task)", "Add task(when on a subtask)", "Add subtask(when on a subtask)", "Add subtask(when on a subtask)"],
          column2: ["enter", "⌘/ctrl + enter", "enter", "⌘/ctrl + enter"],
        },
        {
          title: "Application",
          column1: ["Exit edit menu", "Open shortcuts",],
          column2: ["esc / ⌘/ctrl+enter", "⌘/ctrl + /", ],
        },
      ],
    ];
  }
  componentDidMount(){
    document.addEventListener('keydown',e=>{
      if(e.keyCode ==191 && e.metaKey){
        let informative = this.state.informative
        informative.isOpened = true
        informative.i =2;
        informative.j = 0;
        this.setState({informative})
      }
    })
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevState != this.state) {
      
      if (prevState.isOptionsOpen != this.state.isOptionsOpen)
        this.state.isOptionsOpen
          ? document.addEventListener("keyup", this.closeOptions.bind(this))
          : document.removeEventListener("keyup", this.closeOptions.bind(this));
      else if(this.state.informative.isOpened){
        if (this.state.informative.isOpened === true) {
          document.addEventListener("keyup", this.closeEditMenu.bind(this));
        } else if (this.state.informative.isOpened === false) {
          document.removeEventListener("keyup", this.closeEditMenu.bind(this));
        }
      }    
      else {
        this.state.modal.isOpened
          ? document.addEventListener("keyup", this.closeModal.bind(this))
          : document.removeEventListener("keyup", this.closeModal.bind(this));
      }
    }
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
          },
          {
            text: "Delete all completed tasks?",
            inputValue: noOfCheckedTasks + " completed tasks will be permanently removed",
            isInput: false,
          },
        ],
      ];
      let inactiveArray = this.displayOptionNames[1].inactive;
      if (this.props.selectedList == 0) {
        if (inactiveArray.indexOf(2) == -1) inactiveArray.push(2);
      } else {
        if (inactiveArray.indexOf(2) != -1) inactiveArray.splice(inactiveArray.indexOf(2), 1);
      }
      if (noOfCheckedTasks == 0) {
        if (inactiveArray.indexOf(3) == -1) inactiveArray.push(3);
      } else {
        if (inactiveArray.indexOf(3) != -1) inactiveArray.splice(inactiveArray.indexOf(3), 1);
      }
    }
  }
  closeOptions(e) {
    if (e.keyCode == 27) this.setState({ isOptionsOpen: false });
  }
  closeModal() {
    let modal = this.state.modal;
    modal.isOpened = false;
    this.setState({ modal });
  }
   closeEditMenu(e) {
    if (e.keyCode == 27 && this.state.informative.isOpened) {
      let informative = this.state.informative;
      informative.isOpened = false;
      this.setState({informative})
    };
  };

  render() {
    return (
      <div style={{ height: "2rem" }}>
        {this.props.selectedList != -1 ? (
          <Dropdown
            listNames={this.props.listNames}
            selectedList={this.props.listNames[this.props.selectedList]}
            selectedListIndex={this.props.selectedList}
            clickedList={this.props.setTaskListIndex}
            setCookie={true}
          />
        ) : (
          ""
        )}
        <div className="taskListIcon" onClick={_ => this.setState({ isOptionsOpen: !this.state.isOptionsOpen })}></div>
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
          clickedToggle={(i, j) => {
            if (j == 0) {
              let tasksLists = this.props.taskLists;
              if (this.displayOptionNames[i].selected[j]) {
                this.displayOptionNames[i].selected[j] = false;
                if (tasksLists.length > 0)
                  tasksLists.forEach(list => {
                    if (list.taskDivs.length > 0)
                      list.taskDivs.forEach(element => {
                        if (element.collapsed == 1) element.collapsed = -1;
                      });
                  });
              } else {
                this.displayOptionNames[i].selected[j] = true;
                if (tasksLists.length > 0)
                  tasksLists.forEach(list => {
                    if (list.taskDivs.length > 0)
                      list.taskDivs.forEach(element => {
                        if (element.collapsed == -1) element.collapsed = 1;
                      });
                  });
              }
              this.props.setTaskLists(tasksLists);
              setCookie("defaultShowSubtasks", this.displayOptionNames[i].selected[j], 365);
              this.forceUpdate();
            } else if (j == 1) {
              if (this.displayOptionNames[i].selected[j]) {
                this.displayOptionNames[i].selected[j] = false;
                this.props.setCompletedTabVisibility(false);
              } else {
                this.displayOptionNames[i].selected[j] = true;
                this.props.setCompletedTabVisibility(true);
              }
              setCookie("defaultShowCompletedTab", this.displayOptionNames[i].selected[j], 365);
              this.forceUpdate();
            }
          }}
          clickedInformative={(i, j) => {
            let informative = this.state.informative
            informative.isOpened = true
            informative.i = i
            informative.j = j
            this.setState({informative: informative,isOptionsOpen:false})
          }}
        />
        {this.state.informative.i!=-1?
        <SlidingMenu
          isOpened={this.state.informative.isOpened}
          isInformative ={true}
          clickedClose={_ => {
            let informative = this.state.informative
            informative.isOpened = false
            this.setState({informative})
          }}
          data={this.informativeTemplates[this.state.informative.j]}
          title={this.state.informative.i!=-1?this.displayOptionNames[this.state.informative.i].options[this.state.informative.j]:''}
          submitted={_=>_}
        />:''}
      </div>
    );
  }
}
