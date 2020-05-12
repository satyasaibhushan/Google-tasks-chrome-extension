function listTaskLists() {
    gapi.client.tasks.tasklists.list({
        'maxResults': 10
    }).then(function(response) {
      var taskLists = response.result.items;
      if (taskLists && taskLists.length > 0) {
        for (var i = 0; i < taskLists.length; i++) {
          var taskList = taskLists[i];
          console.log(taskList)
        }
        
      } else {
        appendPre('No task lists found.');
      }
    });
  }

  
  export default {
    authorize(params) {
      return new Promise((resolve, reject) => {
        gapi.auth.authorize({
          'client_id': __CONFIG__.clientId,
          'scope': SCOPES,
          'immediate': params.immediate,
          'cookie_policy': 'single_host_origin'
        },
        authResult => {
          if (authResult.error) {
            return reject(authResult.error);
          }
          return gapi.client.load('tasks', 'v1', () =>
            gapi.client.load('plus', 'v1', () => resolve()));
        });
      });
    },
  
    listTaskLists() {
      const request = gapi.client.tasks.tasklists.list();
  
      return this.makeRequest(request,true);
    },
  
    showTaskList(taskListId) {
      const request = gapi.client.tasks.tasklists.get({ tasklist: taskListId });
  
      return this.makeRequest(request);
    },
  
    insertTaskList(title ) {
      const request = gapi.client.tasks.tasklists.insert({ title: title });
  
      return this.makeRequest(request);
    },
  
    updateTaskList(taskListId, title ) {
      const request = gapi.client.tasks.tasklists.update({
        tasklist: taskListId,
        id: taskListId,
        title
      });
  
      return this.makeRequest(request);
    },
  
    deleteTaskList(taskListId ) {
      const request = gapi.client.tasks.tasklists.delete({
        tasklist: taskListId
      });
  
      return this.makeRequest(request);
    },
  
    listTasks(taskListId) {
      const request = gapi.client.tasks.tasks.list({
        tasklist: taskListId
      });
  
      return this.makeRequest(request,true);
    },
  
    insertTask({ taskListId, title,notes,parent, ...params }) {
      const request = gapi.client.tasks.tasks.insert({
        tasklist: taskListId,
        title: title,
        notes:notes,
        parent:parent,
        ...params
      });
  
      return this.makeRequest(request);
    },
  
    updateTask({ taskListId, taskId,title,notes,parent, ...params }) {
      const request = gapi.client.tasks.tasks.update({
        tasklist: taskListId,
        task: taskId,
        id: taskId,
        title: title,
        notes:notes,
        parent:parent,
        ...params
      });
  
      return this.makeRequest(request);
    },
  
    deleteTask(taskListId, taskId ) {
      const request = gapi.client.tasks.tasks.delete({
        tasklist: taskListId,
        task: taskId,
        id: taskId
      });
  
      return this.makeRequest(request);
    },
  
    makeRequest(requestObj, isItems = false) {
      return new Promise((resolve, reject) => {
        requestObj.execute(resp =>
          resp.error
          ? reject(resp.error)
          : ( isItems ?  resolve(resp.result.items) : resolve(resp.result)))
      });
    }
  
  };  