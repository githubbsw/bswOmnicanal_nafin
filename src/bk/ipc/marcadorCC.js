const { ipcMain} = require('electron');
const helper = require('../helpers/marcadorCC');

ipcMain.on('consultarFechaHora', async(event, datos) => {
  let result = await helper.consultarFechaHora(datos);
  if(result == "NO"){
    result = await helper.consultarFechaHora(datos);
    if(result == "NO"){
      result = await helper.consultarFechaHora(datos);
      event.reply("consultarFechaHoraResult", result);
    }else{
      event.reply("consultarFechaHoraResult", result);
    }
  }else{
    event.reply("consultarFechaHoraResult", result);
  }




  
});


ipcMain.on('cancelarllamada', async(event, datos) => {
  var result = await helper.cancelarllamada(datos);
  if(result == "NO"){
    result = await helper.cancelarllamada(datos);
    if(result == "NO"){
      result = await helper.cancelarllamada(datos);
      event.reply("cancelarLlamadaResult", result);
    }else{
      event.reply("cancelarLlamadaResult", result);
    }
  }else{
    event.reply("cancelarLlamadaResult", result);
  }
  
});

ipcMain.on('finalizarCrm', async(event, datos) => {
  var result = await helper.finalizarCrm(datos);
  if(result == "NO"){
    result = await helper.finalizarCrm(datos);
    if(result == "NO"){
      result = await helper.finalizarCrm(datos);
      event.reply("finalizarCrmResult", result);
    }else{
      event.reply("finalizarCrmResult", result);
    }
  }else{
    event.reply("finalizarCrmResult", result);
  }

});


ipcMain.on('consultaridllamivrcrm', async(event, Crmcabecero) => {
  const onfoMarcador = await helper.consultaridllamivrcrm(Crmcabecero); 
  event.reply("consultaridllamivrcrmResult", onfoMarcador);
});

ipcMain.on('actulizarAgente', async(event, objtAgt) => {
  const objAg = await helper.actulizarAgente(objtAgt); 
  event.reply("actulizarAgenteResult", objAg);
});

ipcMain.on('guardarNombre', async(event, obj) => {
  const objAg = await helper.guardarNombre(obj); 
  event.reply("guardarNombreResult", objAg);
});

ipcMain.on('insertarPausa', async(event, obj) => {
  const result = await helper.insertarPausa(obj); 
  event.reply("insertarPausaResult", result);
});

ipcMain.on('actualizarPausa', async(event, obj) => {
  const result = await helper.actualizarPausa(obj); 
  event.reply("actualizarPausaResult", result);
});

ipcMain.on('insertarTransferencia', async(event, datos) => {
  var result = await helper.insertarTransferencia(datos);
  event.reply("insertarTransferenciaResult", result);
  
});

ipcMain.on('recuperarIdLlamadaIn', async(event, Crmcabecero) => {
  const onfoMarcador = await helper.recuperarIdLlamadaIn(Crmcabecero); 
  event.reply("consultaridllamivrcrmResult", onfoMarcador);
});