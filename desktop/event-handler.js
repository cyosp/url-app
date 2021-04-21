const {app, ipcMain} = require('electron');
const browserWindow = require('./browser-window');

const request = require('request');
const fs = require('fs');
const {basename} = require('path');

ipcMain.on('favicon-changed', (ipcMainEvent, url) => {
    download(url, app.getPath("temp") + '/' + new URL(url).hostname + '-' + basename(url));
});

function download(url, path) {
    const req = request({
        method: 'GET',
        uri: url
    });

    req.pipe(fs.createWriteStream(path));
    req.on('close', () => {
        try {
            browserWindow.setIcon(path);
        } catch (e) {
            console.error(e);
        } finally {
            deleteFile(path);
        }
    });
}

function deleteFile(path) {
    fs.unlink(path, (err) => {
        if (err) {
            console.log(err);
        }
    });
}
