const { ipcMain} = require('electron');

const helper = require('../helpers/chatMulticanal');

  ipcMain.on('consultarInteracciones', async(event, idUsuario,canales) => {

    const interacciones = await helper.consultarInteracciones(canales,idUsuario); 
    event.reply("consultarInteraccionesResult", interacciones);



  });

  ipcMain.on('cambiarEstatusNuevo', async(event, idInteraccion) => {

    const estatusNUevo = await helper.cambiarEstatusNuevo(idInteraccion); 
    event.reply("cambiarEstatusNuevoResult", estatusNUevo);
  });
  

  ipcMain.on('opcPrcSMS', async(event, datos) => {
    const opcPrcSMS = await helper.opcPrcSMS(); 
    event.reply("opcPrcSMSResult", opcPrcSMS);
  });

  ipcMain.on('mandarSMS', async(event, datos) => {
    const mandarSMS = await helper.mandarSMS(datos); 
    event.reply("mandarSMSResult", mandarSMS);
  });

  ipcMain.on('cambiarEstatusNotificadoEnelPrograma', async(event, idInteraccion) => {
    const estatusNUevo = await helper.cambiarEstatusNotificadoEnelPrograma(idInteraccion); 
    event.reply("cambiarEstatusNotificadoEnelProgramaResult", estatusNUevo);
  });