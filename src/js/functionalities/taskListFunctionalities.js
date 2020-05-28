import api from "./tasks.api";

export default {

    updateTaskList(value,taskLists,setTaskLists,index){
        taskLists[index].name = value
        setTaskLists(taskLists)
        api.updateTaskList(taskLists[index].id,value)
    },
    deleteTaskList(value,taskLists,setTaskLists,index,setTaskListIndex){
        console.log('a',value,taskLists,setTaskLists,index,setTaskListIndex)
        api.deleteTaskList(taskLists[index].id)
        taskLists.splice(index,1)
        setTaskListIndex(index-1)
        setTaskLists(taskLists)
    }
    

}