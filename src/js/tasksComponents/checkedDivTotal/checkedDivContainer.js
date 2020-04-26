import React from "react";
import "./checkedDivContainer.css";
import { CheckedDiv } from "./checkedDiv/checkedDiv";

export class CheckedDivTotal extends React.Component{
    constructor(props){
        super()
        console.log(props)
        this.state = {
            checkedArray : props.checkedList
        }
    }

    changeElementKey (keyName,i){
        
       let  checkedArray = this.state.checkedArray
        if(keyName=="newlyAdded" && checkedArray[i].newlyAdded == true) checkedArray[i].newlyAdded = false;
        this.setState({checkedArray})
    }
    removeClick(i){
        let  checkedArray = this.state.checkedArray
        checkedArray[i].focus = false;
        this.setState({checkedArray})
    } 

 allCheckedDivs(checkedList) {
    //  console.log(checkedList)
   return  checkedList.map((checkedItem,i)=>{
        return (
            <CheckedDiv
            key={i}
            index={i}
            element={checkedItem}
            removeKey={(value)=>this.changeElementKey(value,i)}
            removeClick={_=>this.removeClick(i)}
            />
          )
     }) }
    render(){

        return(
            <div className="chekedDivContainer">
                {this.allCheckedDivs(this.state.checkedArray)}
            </div>
        )
        
        
    }
}