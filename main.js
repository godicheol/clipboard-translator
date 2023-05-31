// main.js

// Modules to control application life and create native browser window
const {
  app,
  BrowserWindow,
  dialog,
  ipcMain
} = require('electron');
const fs = require('fs');
const path = require('path');
const clipboard = require('electron-clipboard-extended');

let mainWindow;
let webContents;
let copyHandler = false;

const DEFAULT_TO = "ko-KR";

const config = {
  isResized: false,
  provider: 0, // default Google
  from: null, // default auto
  to: DEFAULT_TO, // default ko-KR
}

const PROVIDERS = [
  {
    name: "Google",
    host: "https://translate.google.com/?op=translate&text=<text>&sl=<from>&tl=<to>",
    width: 512,
    height: 440,
  }, {
    name: "Papago",
    host: "https://papago.naver.com/?st=<text>&sk=<from>&tk=<to>",
    width: 512,
    height: 440,
    defaultFrom: "auto",
  }, {
    name: "Deepl",
    host: "https://www.deepl.com/translator#<from>/<to>/<text>", // https://www.deepl.com/translator#en/de/text
    width: 600,
    height: 540,
    defaultFrom: "en",
  }, {
    name: "Bing",
    host: "https://www.bing.com/translator?from=<from>&to=<to>&text=<text>",
    width: 512,
    height: 666,
  }, {
    name: "Yandex",
    host: "https://translate.yandex.com/?source_lang=<from>&target_lang=<to>&text=<text>",
    width: 520,
    height: 520,
  }
];

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    alwaysOnTop: true,
    icon: path.join(__dirname, "assets/icons/icon.png"),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      // nodeIntegration: false, // is default value after Electron v5
    }
  });

  webContents = mainWindow.webContents;

  // and load the index.html of the app.
  mainWindow.loadFile('index.html');

  // Open the DevTools.
  // webContents.openDevTools();

  webContents.on("did-finish-load", () => {
    console.log("Window loaded.");

    setCopyHandler();
  });

  webContents.on("close", () => {
    console.log("Window closed.");

    unsetCopyHandler();

    // reset config
    config.isResized = false;
    config.provider = 0;
    config.from = null;
    config.to = DEFAULT_TO;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  ipcMain.on("set-provider", function(e, res) {
    try {
      config.provider = parseInt(res);
    } catch(err) {
      
    }
    // log(config);
  })

  ipcMain.on("set-from", function(e, res) {
    if (!!res) {
      config.from = res;
    }
    // log(config);
  })

  ipcMain.on("set-to", function(e, res) {
    if (!!res) {
      config.to = res;
    }
    // log(config);
  })

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

function isWin() {
  return os.platform() === "win32";
}

function isMac() {
  return os.platform() === "darwin";
}

function isLoaded() {
  return mainWindow && mainWindow.webContents && mainWindow.webContents.isLoading() === false;
}

function isFocused() {
  return mainWindow && mainWindow.webContents && mainWindow.webContents.isFocused;
}

function alert(title, message) {
  dialog.showErrorBox(title || "Title", message || "");
}

function log(...args) {
  console.log(">", ...args);
}

function sendValue(key, value) {
  mainWindow.webContents.send(key, null, value);
}

function sendError(key, err) {
  mainWindow.webContents.send(key, err);
}

function setReceive(key, func) {
  ipcMain.on(key, func);
}

function removeReceive(key) {
  ipcMain.removeListener(key);
}

function translate(text) {
  const provider = PROVIDERS[config.provider];
  let { host, width, height, defaultFrom, defaultTo } = provider;
  let { from, to } = config;

  host = host.replace("\<text\>", text);

  if (from) {
    try {
      const lc = new Intl.Locale(from).language;
      host = host.replace("\<from\>", lc);
    } catch(err) {
      host = host.replace("\<from\>", defaultFrom || "");
    }
  } else {
    host = host.replace("\<from\>", defaultFrom || "");
  }
  if (to) {
    try {
      const lc = new Intl.Locale(to).language;
      host = host.replace("\<to\>", lc);
    } catch(err) {
      host = host.replace("\<to\>", defaultTo || "");
    }
  } else {
    host = host.replace("\<to\>", defaultTo || "");
  }

  if (!config.isResized) {
    if (width && height) {
      mainWindow.setSize(width, height);
    }
    config.isResized = true;
  }

  log(host);

  mainWindow.loadURL(host);
}

function setCopyHandler() {
  if (!copyHandler) {
    clipboard.on("text-changed", function() {
      const text = clipboard.readText();
      translate(text);
    });
    clipboard.startWatching();
    copyHandler = true;
  }
}

function unsetCopyHandler() {
  if (copyHandler) {
    clipboard.off("text-changed");
    clipboard.stopWatching();
    copyHandler = false;
  }
}