
const helper = require('../helpers/login');
const { ipcMain} = require('electron');


ipcMain.on('consultarOpcionesProceso', async(event, vars) => {
  var opcPrc =  await helper.consultarOpcPrc(vars); 
  event.reply("consultarOpcionesProcesoResult", opcPrc);
});

ipcMain.on('validarUsuario', async(event, usuarioid) => {
  var validarUsuario =  await helper.validarUsuario(usuarioid, event); 
  event.reply("validarUsuarioResult", validarUsuario);
});

ipcMain.on('consultarNombre', async(event, usuarioid) => {
  const usuario = await helper.consultarNombre(usuarioid); 
  event.reply("consultarNombreResult", usuario[0]);
});

ipcMain.on('consultarPorId', async(event, datos) => {
  const usuario = await helper.consultarPorId(datos.id, datos.marcador); 
  if(usuario != "USUARIO_LOGUEADO"  && usuario != "RECESO_VENCIDO" ){
    const canalesM = await helper.consultarCanalesM(datos.id);
    const areas = await helper.consultarAreas(datos.id); 
    var user = {
      usuario,
      areas,
      canalesM
    }
    event.reply("consultarPorIdResult", user);
  }else{
    event.reply("consultarPorIdResult", usuario);
  }
  
});


ipcMain.on('limpiarSesiones', async(event, usuarioid) => {
  var limpiaS = await helper.limpiarSesiones(usuarioid); 
  event.reply("limpiarSesionesResult", limpiaS);
});


ipcMain.on('limpiarReceso', async(event, usuarioid) => {
  var limpiaR = await helper.updateRecesos(usuarioid); 
  event.reply("limpiarRecesoResult", limpiaR);
});