const { ipcMain} = require('electron');

const helper = require('../helpers/notificacionColaEspera');

ipcMain.on('consultQueue', async(event,agenteId) => {
    const obj = await helper.consultQueue(agenteId); 
    event.reply("consultQueueResult", obj);
  });