const { ipcMain} = require('electron');

const helper = require('../helpers/usuario');

ipcMain.on('CerrarSesion', async(event, idAgente) => {
  const obj = await helper.CerrarSesion(idAgente); 
  event.reply("CerrarSesionResult", obj);
});


ipcMain.on('insertarMovimientoDesconexion', async(event, idAgente,tiempo) => {
  const obj = await helper.insertarMovimientoDesconexion(idAgente,tiempo); 
  event.reply("insertarMovimientoDesconexionResult", obj);
});

ipcMain.on('insertarMovimientoDesconexionInicio', async(event, idAgente,tiempo) => {
  const obj = await helper.insertarMovimientoDesconexion(idAgente,tiempo); 
  event.reply("insertarMovimientoDesconexionInicioResult", obj);
});

ipcMain.on('consultarRespuestas', async(event, datos) => {
  const campana = await helper.consultarRespuestas(datos); 
  event.reply("consultarRespuestasResult", campana);
});

ipcMain.on('consultarTipoRespuesta', async(event, idCampana) => {
  const tipoResp = await helper.consultarTipoRespuesta(); 
  var datos=[];
  var datosData =new Object();
  datosData.tipoResp=tipoResp;
  datos.push(  datosData);
  var datosData =new Object();
  datosData.lista=idCampana;
  datos.push(datosData);
  event.reply("consultarTipoRespuestaResult", datos);
});

ipcMain.on('consultarConfTipificacion', async(event, idTipidicacion) => {
  const conf = await helper.consultarConfTipificacion(idTipidicacion); 
  event.reply("consultarConfTipificacionResult", conf);
});

ipcMain.on('consultarTipificacionLlamada', async(event, datos) => {
  const resultado = await helper.consultarTipificacionLlamada(datos); 
  event.reply("consultarTipificacionLlamadaResult", resultado);
});

ipcMain.on('consultarCampanaOC', async(event, datos) => {
  const resultado = await helper.consultarCampanaOC(datos); 
  event.reply("consultarCampanaOCResult", resultado);
});

ipcMain.on('actCitaCRM', async(event, datos) => {
  const resultado = await helper.actCitaCRM(datos); 
  event.reply("actCitaCRMResult", resultado);
});

ipcMain.on('consultarNumTransferencias', async(event, datos) => {
  const resultado = await helper.consultarNumTransferencias(); 
  event.reply("consultarNumTransferenciasResult", resultado);
});

ipcMain.on('consultaVersion', async(event, idAgente) => {
  const obj = await helper.consultaVersion(); 
  event.reply("consultaVersionResult", obj);
});

ipcMain.on('estatusExtension', async(event, canal) => {
  const obj = await helper.estatusExtension(canal); 
  event.reply("estatusExtensionResult", obj);
});

ipcMain.on('restablecerAgente', async(event, datos) => {
  await helper.restablecerAgente(datos); 
});