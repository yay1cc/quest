const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('questHub', {
  listGames: () => ipcRenderer.invoke('games:list')
});
