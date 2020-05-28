import React from "react";
import "./taskListSelector.css";
import Modal from "../modal/modal";
import OptionsPanel from "../optionsPanel/optionsPanel";
import updateTaskLists from "../../functionalities/taskListFunctionalities";

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
        options: ["Rename List", "Delete List", "Delete all Completed tasks"],
      },
      {
        title: "",
        type: "shortcuts",
        options: ["KeyBoard shortcuts", "Copy remainders to tasks"],
      },
    ];

    this.modalTemplates = [
      [
        { text: "Rename list", inputValue: "", isInput: true },
        {
          text: "Delete this list?",
          inputValue: "deleting this list will also delete __ tasks",
          isInput: false,
        },
        {
          text: "Delete all completed tasks?",
          inputValue: "__ completed tasks will be permanently removed",
          isInput: false,
        },
      ],
    ];
    this.modalFunctions = [[updateTaskLists.updateTaskList,updateTaskLists.deleteTaskList , {}]];
  }

  componentDidUpdate() {
    var x, i, j, selElmnt, a, b, c;
    let props = this.props;
    x = document.getElementsByClassName("taskListSelector");
    for (i = 0; i < x.length; i++) {
      selElmnt = x[i].getElementsByTagName("select")[0];
      a = document.createElement("DIV");
      a.setAttribute("class", "select-selected");
      let listSelectedText = document.createElement("span");
      // listSelectedText.setAttribute('style','height')
      listSelectedText.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
      a.appendChild(listSelectedText);
      x[i].appendChild(a);
      b = document.createElement("DIV");
      b.setAttribute("class", "select-items select-hide");
      for (j = 1; j < selElmnt.length; j++) {
        c = document.createElement("DIV");
        c.innerHTML = selElmnt.options[j].innerHTML;
        c.addEventListener("click", function (e) {
          props.selectedOption(props.listNames.indexOf(this.innerHTML));
          var y, i, k, s, h;
          s = this.parentNode.getElementsByTagName("select");
          h = this.parentNode;
          for (i = 0; i < s.length; i++) {
            if (s.options[i].innerHTML == this.innerHTML) {
              s.selectedIndex = i;
              h.innerHTML = this.innerHTML;
              y = this.parentNode.getElementsByClassName("same-as-selected");
              for (k = 0; k < y.length; k++) {
                y[k].removeAttribute("class");
              }
              this.setAttribute("class", "same-as-selected");
              break;
            }
          }
          h.click();
        });
        b.appendChild(c);
        if (j == this.props.selectedList + 1) {
          let tick = document.createElement("img");
          tick.src = "../../images/tick.svg";
          tick.className = "selectedListIcon";
          c.append(tick);
        }
      }
      x[i].appendChild(b);
      a.addEventListener("click", function (e) {
        e.stopPropagation();
        closeAllSelect(this);
        this.nextSibling.classList.toggle("select-hide");
        this.classList.toggle("select-arrow-active");
      });
    }
    function closeAllSelect(elmnt) {
      var x,
        y,
        i,
        arrNo = [];
      x = document.getElementsByClassName("select-items");
      y = document.getElementsByClassName("select-selected");
      for (i = 0; i < y.length; i++) {
        if (elmnt == y[i]) {
          arrNo.push(i);
        } else {
          y[i].classList.remove("select-arrow-active");
        }
      }
      for (i = 0; i < x.length; i++) {
        if (arrNo.indexOf(i)) {
          x[i].classList.add("select-hide");
        }
      }
    }

    document.addEventListener("click", closeAllSelect);
  }

  componentWillUpdate() {
    let x = document.getElementsByClassName("taskListSelector");
    for (let i = 0; i < x.length; i++) {
      if (x[i].childNodes.length > 1) {
        x[i].removeChild(x[i].childNodes[1]);
        x[i].removeChild(x[i].childNodes[1]);
      }
    }
  }

  render() {
    return (
      <div style={{ height: "2rem" }}>
        <div className="taskListSelector">
          <select
            id="taskListFlow"
            onChange={e => this.props.selectedOption(this.props.listNames.indexOf(e.target.value))}
          >
            <option value="initial">{this.props.listNames[this.props.selectedList]}</option>
            {this.props.listNames.map((element, i) => (
              <option value={element} key={i} className="listDivs">
                {element}
              </option>
            ))}
          </select>
        </div>
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
            console.log(this.props);
            this.modalFunctions[0][this.state.modal.selectedOptionIndex](
              value,
              this.props.taskLists,
              this.props.setTaskLists,
              this.props.selectedList,
              this.props.setTaskListIndex,
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
            if (modal.isInput) modal.inputValue = this.props.listNames[this.props.selectedList];
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
