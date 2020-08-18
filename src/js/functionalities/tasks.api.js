export default {

  listTaskLists() {
    const request = gapi.client.tasks.tasklists.list();

    return this.makeRequest(request, true);
  },

  showTaskList(taskListId) {
    const request = gapi.client.tasks.tasklists.get({ tasklist: taskListId });

    return this.makeRequest(request);
  },

  insertTaskList(title) {
    const request = gapi.client.tasks.tasklists.insert({ title: title });

    return this.makeRequest(request);
  },

  updateTaskList(taskListId, title) {
    const request = gapi.client.tasks.tasklists.update({
      tasklist: taskListId,
      id: taskListId,
      title,
    });

    return this.makeRequest(request);
  },

  deleteTaskList(taskListId) {
    const request = gapi.client.tasks.tasklists.delete({
      tasklist: taskListId,
    });

    return this.makeRequest(request);
  },

  listTasks(taskListId) {
    const request = gapi.client.tasks.tasks.list({
      tasklist: taskListId,
      showHidden: true,
      maxResults: 100,
    });

    return this.makeRequest(request, true);
  },

  insertTask({ taskListId, title, notes, parent, ...params }) {
    const request = gapi.client.tasks.tasks.insert({
      tasklist: taskListId,
      title: title,
      notes: notes,
      parent: parent,
      ...params,
    });

    return this.makeRequest(request);
  },

  updateTask({ taskListId, taskId, title, notes, parent, ...params }) {
    const request = gapi.client.tasks.tasks.update({
      tasklist: taskListId,
      task: taskId,
      id: taskId,
      title: title,
      notes: notes,
      parent: parent,
      ...params,
    });

    return this.makeRequest(request);
  },

  deleteTask(taskListId, taskId) {
    const request = gapi.client.tasks.tasks.delete({
      tasklist: taskListId,
      task: taskId,
      id: taskId,
    });

    return this.makeRequest(request);
  },
  moveTask({ taskListId, taskId, parent, previous, ...params }) {
    const request = gapi.client.tasks.tasks.move({
      tasklist: taskListId,
      task: taskId,
      parent: parent,
      previous: previous,
      ...params,
    });

    return this.makeRequest(request);
  },

  makeRequest(requestObj, isItems = false) {
    return new Promise((resolve, reject) => {
      requestObj.execute(resp =>
        resp.error ? reject(resp.error) : isItems ? resolve(resp.result.items) : resolve(resp.result)
      );
    });
  },
};
