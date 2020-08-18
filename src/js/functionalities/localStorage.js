let storageDirectory = localStorage;

export function setLocalStorage(storageData, storageName) {
  if (!chrome.storage) {
    let json_str = JSON.stringify(storageData);
    storageDirectory.setItem(storageName, json_str);
  } else {
    console.log('worked!!')
    chrome.storage.sync.set(
      { 'taskListsData':(storageData) },
      function () {}
    );
  }
}

export function getLocalStorage(storageName) {
  if (!chrome.storage) {
    let data = storageDirectory.getItem(storageName);
    // console.log(JSON.parse(data))
    if (data) return JSON.parse(data);
    else return undefined;
  } else {
    chrome.storage.sync.get(storageName, function (data) {
      if (data) return (data);
    });
  }
}
