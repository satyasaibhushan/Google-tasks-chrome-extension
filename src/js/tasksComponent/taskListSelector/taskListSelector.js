import React from "react";
import "./taskListSelector.css";
import Modal from "../modal/modal";
import OptionsPanel from '../optionsPanel/optionsPanel'

export class TaskListSelector extends React.Component {
  constructor() {
    super();
    this.state={
      isModalOpen: false,
    }
  }

  componentDidUpdate() {
    var x, i, j, selElmnt, a, b, c;
    let props = this.props;
    x = document.getElementsByClassName("taskListSelector");
    for (i = 0; i < x.length; i++) {
      selElmnt = x[i].getElementsByTagName("select")[0];
      a = document.createElement("DIV");
      a.setAttribute("class", "select-selected");
      let listSelectedText= document.createElement("span")
      // listSelectedText.setAttribute('style','height')
      listSelectedText.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
      a.appendChild(listSelectedText)
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
        if(j==this.props.selectedList+1){
          let tick = document.createElement('img')
          tick.src = '../../images/tick.svg'
          tick.className = 'selectedListIcon'
          c.append(tick)}
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

  componentWillUpdate(){
   let x = document.getElementsByClassName("taskListSelector");
    for (let i = 0; i < x.length; i++) {
      if(x[i].childNodes.length >1){
      x[i].removeChild(x[i].childNodes[1])
      x[i].removeChild(x[i].childNodes[1])
      }
    }

  }

  render() {
    return (
      <div  style={{height:'2rem'}}>
        <div className="taskListSelector">
          <select
            id="taskListFlow"
            onChange={(e) =>
              this.props.selectedOption(
                this.props.listNames.indexOf(e.target.value)
              )
            }
          >
            <option value="initial">
              {this.props.listNames[this.props.selectedList]}
            </option>
            {this.props.listNames.map((element, i) => (
              <option value={element} key={i} className='listDivs' >
                {element}
              </option>
            ))}
          </select>
        </div>
        <div className='taskListIcon' onClick={_=>this.setState({isModalOpen:true})}></div>
        <Modal
          text={"Hello there! Testing header"}
          inputValue={
            "Can't change betterdgh asdfjghsa  fjahsg sadf ldjkfhaskdfh "
          }
          isInput={true}
          isOpened={this.state.isModalOpen}
          clickedClose={(_) =>
            this.setState({ isModalOpen: false })
          }
        />
        
      </div>
    );
  }
}
