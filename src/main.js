const { app, BrowserWindow, ipcMain } = require('electron');
const { execFile } = require('node:child_process');
const path = require('node:path');

const GAME_CATALOG = [
  { name: 'Counter-Strike 2', process: ['cs2.exe'], store: 'Steam' },
  { name: 'Dota 2', process: ['dota2.exe'], store: 'Steam' },
  { name: 'Grand Theft Auto V', process: ['gta5.exe', 'gta5_enhanced.exe'], store: 'Steam / Epic' },
  { name: 'Fortnite', process: ['fortniteclient-win64-shipping.exe'], store: 'Epic Games' },
  { name: 'Rocket League', process: ['rocketleague.exe'], store: 'Epic Games / Steam' },
  { name: 'VALORANT', process: ['valorant-win64-shipping.exe'], store: 'Riot Games' },
  { name: 'League of Legends', process: ['league of legends.exe'], store: 'Riot Games' },
  { name: 'Teamfight Tactics', process: ['teamfighttactics.exe'], store: 'Riot Games' }
];

function getRunningProcesses() {
  return new Promise((resolve) => {
    if (process.platform !== 'win32') return resolve([]);
    execFile('tasklist', ['/FO', 'CSV', '/NH'], { windowsHide: true, timeout: 5000 }, (error, stdout) => {
      if (error) return resolve([]);
      const names = stdout.split(/\r?\n/).map((line) => {
        const match = line.match(/^"([^"]+)"/);
        return match ? match[1].toLowerCase() : '';
      }).filter(Boolean);
      resolve(names);
    });
  });
}

async function getGames() {
  const running = await getRunningProcesses();
  return GAME_CATALOG.map((game) => ({
    name: game.name,
    store: game.store,
    running: game.process.some((name) => running.includes(name))
  }));
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1120,
    height: 760,
    minWidth: 850,
    minHeight: 620,
    backgroundColor: '#10111a',
    title: 'QuestHub',
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });
  win.loadFile(path.join(__dirname, 'index.html'));
}

ipcMain.handle('games:list', getGames);

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
