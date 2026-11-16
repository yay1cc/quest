const { app, BrowserWindow, ipcMain } = require('electron');
const { execFile } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const GAME_CATALOG = [
  { name: 'Counter-Strike 2', process: ['cs2.exe'], store: 'Steam' },
  { name: 'Dota 2', process: ['dota2.exe'], store: 'Steam' },
  { name: 'Fortnite', process: ['fortniteclient-win64-shipping.exe'], store: 'Epic Games' },
  { name: 'Rocket League', process: ['rocketleague.exe'], store: 'Epic Games / Steam' },
  { name: 'VALORANT', process: ['valorant-win64-shipping.exe'], store: 'Riot Games' },
  { name: 'League of Legends', process: ['league of legends.exe'], store: 'Riot Games' },
  { name: 'Teamfight Tactics', process: ['teamfighttactics.exe'], store: 'Riot Games' },

  // Rockstar Games: Windows/PC releases only.
  { name: 'Grand Theft Auto V', process: ['gta5.exe', 'gta5_enhanced.exe'], folders: ['Grand Theft Auto V'], store: 'Rockstar / Steam / Epic' },
  { name: 'Grand Theft Auto IV', process: ['gtaiv.exe'], folders: ['Grand Theft Auto IV'], store: 'Rockstar / Steam' },
  { name: 'Grand Theft Auto III', process: ['gta3.exe'], folders: ['GTAIII', 'Grand Theft Auto III'], store: 'Rockstar / Steam' },
  { name: 'Grand Theft Auto: Vice City', process: ['gta-vc.exe'], folders: ['Grand Theft Auto Vice City', 'GTA Vice City'], store: 'Rockstar / Steam' },
  { name: 'Grand Theft Auto: San Andreas', process: ['gta_sa.exe'], folders: ['Grand Theft Auto San Andreas', 'GTA San Andreas'], store: 'Rockstar / Steam' },
  { name: 'Red Dead Redemption 2', process: ['rdr2.exe'], folders: ['Red Dead Redemption 2'], store: 'Rockstar / Steam / Epic' },
  { name: 'Red Dead Redemption', process: ['rdr.exe'], folders: ['Red Dead Redemption'], store: 'Rockstar / Steam' },
  { name: 'L.A. Noire', process: ['lanoire.exe'], folders: ['L.A. Noire', 'LA Noire'], store: 'Rockstar / Steam' },
  { name: 'Max Payne', process: ['maxpayne.exe'], folders: ['Max Payne'], store: 'Rockstar / Steam' },
  { name: 'Max Payne 2: The Fall of Max Payne', process: ['maxpayne2.exe'], folders: ['Max Payne 2'], store: 'Rockstar / Steam' },
  { name: 'Max Payne 3', process: ['maxpayne3.exe'], folders: ['Max Payne 3'], store: 'Rockstar / Steam' },
  { name: 'Bully: Scholarship Edition', process: ['bully.exe'], folders: ['Bully Scholarship Edition'], store: 'Rockstar / Steam' },
  { name: 'Manhunt', process: ['manhunt.exe'], folders: ['Manhunt'], store: 'Rockstar / Steam' },
  { name: 'Manhunt 2', process: ['manhunt2.exe'], folders: ['Manhunt 2'], store: 'Rockstar' },
  { name: 'Midnight Club II', process: ['midnightclub2.exe'], folders: ['Midnight Club 2', 'Midnight Club II'], store: 'Rockstar / Steam' }
];

function runCommand(command, args, timeout = 7000) {
  return new Promise((resolve) => {
    execFile(command, args, { windowsHide: true, timeout, maxBuffer: 4 * 1024 * 1024 }, (error, stdout) => {
      resolve(error ? '' : stdout || '');
    });
  });
}

async function getRunningProcesses() {
  if (process.platform !== 'win32') return [];
  const stdout = await runCommand('tasklist', ['/FO', 'CSV', '/NH'], 5000);
  return stdout.split(/\r?\n/).map((line) => {
    const match = line.match(/^"([^"]+)"/);
    return match ? match[1].toLowerCase() : '';
  }).filter(Boolean);
}

async function getRockstarRegistryPaths() {
  if (process.platform !== 'win32') return [];
  const roots = [
    'HKLM\\SOFTWARE\\Rockstar Games',
    'HKLM\\SOFTWARE\\WOW6432Node\\Rockstar Games',
    'HKCU\\SOFTWARE\\Rockstar Games'
  ];
  const outputs = await Promise.all(roots.map((root) => runCommand('reg', ['query', root, '/s'], 7000)));
  const paths = [];
  for (const output of outputs) {
    for (const line of output.split(/\r?\n/)) {
      const match = line.match(/^\s*(?:InstallFolder|InstallPath|InstallDir|Path)\s+REG_\w+\s+(.+?)\s*$/i);
      if (match) paths.push(match[1].trim().replace(/^"|"$/g, ''));
    }
  }
  return paths;
}

function getSearchRoots() {
  const roots = new Set();
  for (const envName of ['ProgramFiles', 'ProgramFiles(x86)', 'ProgramW6432', 'LOCALAPPDATA']) {
    const base = process.env[envName];
    if (!base) continue;
    roots.add(path.join(base, 'Rockstar Games'));
    roots.add(path.join(base, 'Rockstar Games', 'Launcher'));
  }
  for (const drive of ['C:', 'D:', 'E:', 'F:']) {
    roots.add(path.join(drive, 'Program Files', 'Rockstar Games'));
    roots.add(path.join(drive, 'Program Files (x86)', 'Rockstar Games'));
    roots.add(path.join(drive, 'Games', 'Rockstar Games'));
  }
  return [...roots];
}

function directoryExists(candidate) {
  try { return fs.statSync(candidate).isDirectory(); } catch { return false; }
}

async function getGames() {
  const [running, registryPaths] = await Promise.all([getRunningProcesses(), getRockstarRegistryPaths()]);
  const searchRoots = getSearchRoots();
  const catalog = GAME_CATALOG.map((game) => ({ ...game, installed: false, installPath: null }));
  const rockstarGames = catalog.filter((game) => game.folders);

  // Launcher registry entries are checked first; game folders are then checked in common install locations.
  for (const game of rockstarGames) {
    const folderNames = game.folders.map((name) => name.toLowerCase());
    const registryMatch = registryPaths.find((candidate) =>
      folderNames.some((folder) => candidate.toLowerCase().includes(folder)) && directoryExists(candidate)
    );
    let installPath = registryMatch || null;

    if (!installPath) {
      outer: for (const root of searchRoots) {
        for (const folder of game.folders) {
          const candidate = path.join(root, folder);
          if (directoryExists(candidate)) {
            installPath = candidate;
            break outer;
          }
        }
      }
    }

    game.installed = Boolean(installPath);
    game.installPath = installPath;
  }

  return catalog.map((game) => ({
    name: game.name,
    store: game.store,
    running: game.process.some((name) => running.includes(name)),
    installed: game.installed,
    installPath: game.installPath
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
