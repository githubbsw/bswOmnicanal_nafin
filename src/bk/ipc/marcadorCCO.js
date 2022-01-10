const { ipcMain} = require('electron');
const helper = require('../helpers/marcadorCCO');

ipcMain.on('consultarFechaHoraO', async(event, id) => {
  const result = await helper.consultarFechaHora(id);
  event.reply("consultarFechaHoraResult", result);
});

ipcMain.on('consultaridllamOut', async(event, datos) => {
  const consultaridllamOut = await helper.consultaridllamOut(datos); 
  console.log(consultaridllamOut)
  event.reply("consultaridllamOutResult", consultaridllamOut);
});

ipcMain.on('actulizarAgenteO', async(event, objtAgt) => {
  const objAg = await helper.actulizarAgente(objtAgt); 
  event.reply("actulizarAgenteResult", objAg);
});

ipcMain.on('actualizarContactoO', async(event, datos) => {
  const act = await helper.actualizarContacto(datos); 
  event.reply("actualizarContactoResult", act);
});

ipcMain.on('guardarNombreO', async(event, obj) => {
  const objAg = await helper.guardarNombre(obj); 
  event.reply("guardarNombreResult", objAg);
});

ipcMain.on('insertarPausaO', async(event, obj) => {
  const result = await helper.insertarPausa(obj); 
  event.reply("insertarPausaResult", result);
});

ipcMain.on('actualizarPausaO', async(event, obj) => {
  const result = await helper.actualizarPausa(obj); 
  event.reply("actualizarPausaResult", result);
});

ipcMain.on('marcacionManual', async(event, obj) => {
  const result = await helper.marcacionManual(obj); 
  event.reply("marcacionManualResult", result);
});

ipcMain.on('GenerarLlamada', async(event, datos) => {
  const act = await helper.GenerarLlamada(datos); 
  //event.reply("actulizarAgenteResult", act);
});


ipcMain.on('ActualizarAgenteExtesionConectada', async(event, datos) => {
  const act = await helper.ActualizarAgenteExtesionConectada(datos); 
  event.reply("actulizarAgenteResult", act);
});
