const { ipcMain} = require('electron');

const helper = require('../helpers/notificacionColaEspera');

ipcMain.on('consultQueue', async(event) => {
    const obj = await helper.consultQueue(); 
    event.reply("consultQueueResult", obj);
  });