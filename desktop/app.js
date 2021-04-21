const {app} = require('electron');
const browserWindow = require('./browser-window');
require('./event-handler');

app.whenReady().then(() => {
    browserWindow.build();
});
