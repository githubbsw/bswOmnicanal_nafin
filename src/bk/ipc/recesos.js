const { ipcMain} = require('electron');

const helper = require('../helpers/recesos');

  ipcMain.on('solicitarReceso', async(event, datos) => {
    const obj = await helper.solicitarReceso(datos); 
    event.reply("solicitarRecesoResult", obj);
  });


  ipcMain.on('tomarReceso', async(event, datos) => {
    const obj = await helper.tomarReceso(datos); 
    event.reply("tomarRecesoResult", obj);
  });


  ipcMain.on('consultarMovimientos', async(event, usuario) => {
    const obj = await helper.consultarMovimientos(usuario); 
    event.reply("consultarMovimientosResult", obj);
  });
  
  ipcMain.on('consultaTipoReceso', async(event,datos) => {
    const obj = await helper.consultaTipoReceso(); 
    event.reply("consultaTipoRecesoResult", obj);
  });
  
  ipcMain.on('consultaRecesoAuto', async(event,usuario,canales) => {
    const obj = await helper.consultaRecesoAuto(usuario, canales); 
    event.reply("consultaRecesoAutoResult", obj);
  });
 
  ipcMain.on('terminarReceso', async(event,usuario) => {
    await helper.terminarReceso(usuario); 
    console.log("terminarRecesoResult");
    event.reply("terminarRecesoResult", "");
  });
 
  

