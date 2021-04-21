const {app, BrowserWindow} = require('electron');

let browserWindow;

function build() {
    browserWindow = new BrowserWindow({
        width: 1024,
        height: 768,
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true
        }
    });
    exitOnClose();
    loadUrl();
    registerFaviconChangedEvent();
}

function exitOnClose() {
    browserWindow.on('close', () => {
        app.exit();
    });
}

function loadUrl() {
    browserWindow.loadURL(process.argv[2]);
}

function registerFaviconChangedEvent() {
    browserWindow.webContents.on('dom-ready', () => {
        browserWindow.webContents.executeJavaScript(
            'try {' +
            '   let favicon = document.querySelector(\'link[rel="shortcut icon"], link[rel="icon"]\');' +
            '   if(favicon) {' +
            '      const ipcRender = require(\'electron\').ipcRenderer;' +
            '      let notifyFaviconChanged = function() {' +
            '         if(favicon.href)' +
            '            ipcRender.send(\'favicon-changed\', favicon.href);' +
            '         else' +
            '            console.error(\'Missing favicon href attribute\');' +
            '      };' +
            '      notifyFaviconChanged();' +
            '   } else {' +
            '      console.error( \'Missing favicon element\');' +
            '   }' +
            '} catch (e) {' +
            '  console.error(e);' +
            '}'
        );
    });
}

module.exports = {
    build: build,
    setIcon: (iconPath) => {
        browserWindow.setIcon(iconPath);
    }
}
