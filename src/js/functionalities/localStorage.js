let storageDirectory =localStorage;

export function setLocalStorage(storageData,storageName){
    let json_str = JSON.stringify(storageData);
    storageDirectory.setItem( storageName,json_str)
}

export function getLocalStorage(storageName){
    let data = storageDirectory.getItem(storageName);
    if(data)  return (JSON.parse(data)) 
    else return undefined
}
