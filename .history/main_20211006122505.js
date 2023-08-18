"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var path = require("path");
var url = require("url");

var globalShortcut = electron_1.globalShortcut;
// Initialize remote module
require('@electron/remote/main').initialize();
var win = null;
var args = process.argv.slice(1), serve = args.some(function (val) { return val === '--serve'; });
function createWindow() {
    // Create the browser window.
    win = new electron_1.BrowserWindow({
        height: 800,
        width: 1366,
        maxHeight: 800,
        maxWidth: 1366,
        minHeight: 800,
        minWidth: 1366,
        backgroundColor: '#e9e4e1',
        icon: path.join(__dirname, '/dist/assets/icons/icon.ico'),
        webPreferences: {
            nodeIntegration: true,
            allowRunningInsecureContent: (serve) ? true : false,
            contextIsolation: false,
            enableRemoteModule: true,
        },
        show: false
    });
    if (serve) {
        win.webContents.openDevTools();
        require('electron-reload')(__dirname, {
            electron: require(__dirname + "/node_modules/electron")
        });
        win.loadURL('http://localhost:4200');
    }
    else {
        win.loadURL(url.format({
            pathname: path.join(__dirname, 'dist/index.html'),
            protocol: 'file:',
            slashes: true
        }));
    }
    globalShortcut.register('f5', function () {
        console.log('f5 is pressed');
        win.reload();
    });
    globalShortcut.register('CommandOrControl+R', function () {
        console.log('CommandOrControl+R is pressed');
        win.reload();
    });
    // Emitted when the window is closed.
    win.on('closed', function () {
        // Dereference the window object, usually you would store window
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null;
    });
    win.webContents.on('did-finish-load', function () {
        /// then close the loading screen window and show the main window
        win.show();
    });
    return win;
}
try {
    // This method will be called when Electron has finished
    // initialization and is ready to create browser windows.
    // Some APIs can only be used after this event occurs.
    // Added 400 ms to fix the black background issue while using transparent window. More detais at https://github.com/electron/electron/issues/15947
    electron_1.app.on('ready', function () {
        electron_1.app.allowRendererProcessReuse = false;
        setTimeout(createWindow, 400);
        electron_1.Menu.setApplicationMenu(null);
    });
    // Quit when all windows are closed.
    electron_1.app.on('window-all-closed', function () {
        // On OS X it is common for applications and their menu bar
        // to stay active until the user quits explicitly with Cmd + Q
        if (process.platform !== 'darwin') {
            electron_1.app.quit();
        }
    });
    electron_1.app.on('activate', function () {
        // On OS X it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (win === null) {
            createWindow();
        }
    });
}
catch (e) {
    // Catch Error
    // throw e;
}
//# sourceMappingURL=main.js.map
