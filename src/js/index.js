import React,{useState} from "react";
import {  render  } from "react-dom";

import '../css/styles.css'

import {TaskComponent} from "./tasksComponents/taskComponent"

class App extends React.Component{
    
  render(){
      return(
          <div>
              <div style={{display:'flex',justifyContent:"space-around",marginTop:'3rem'}}>
                  <TaskComponent/>
              </div>
          </div>
      )
  }

}
 
render(<App/>,document.getElementById("app"))
