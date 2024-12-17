
const helper = require('../helpers/login');
const { ipcMain} = require('electron');
const fs = require('fs');

ipcMain.on('consultarOpcionesProceso', async(event, vars) => {
  var opcPrc =  await helper.consultarOpcPrc(vars); 
  event.reply("consultarOpcionesProcesoResult", opcPrc);
});

ipcMain.on('validarUsuario', async(event, usuarioid) => {
  // Crear archivo Log
  var d = new Date();
  if(d.getDate()<10){
      dd = '0'+d.getDate();
  }
  else{
      dd = d.getDate();
  }
  if((d.getMonth()+1)<10){
      mm = '0'+(d.getMonth()+1);
  }
  else{
      mm = (d.getMonth()+1);
  }  
  var nomArchivoLog = "C:/Logs/LOG_"+d.getFullYear() + mm + dd+'.txt';
  
  if (!fs.existsSync("C:/Logs")) {
    // If it doesn't exist, create the directory
    fs.mkdirSync("C:/Logs");
  } 
  fs.appendFileSync(nomArchivoLog, 'Version 4.1.64.2_10.dic.2024  \n');
  fs.appendFileSync(nomArchivoLog, 'Inicio sesion: ' + d.toLocaleTimeString()+'  \n');  
  
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

ipcMain.on('consultaMotivosCancelacion', async(event) => {
  var limpiaR = await helper.consultaMotivosCancelacion(); 
  event.reply("consultaMotivosCancelacionResult", limpiaR);
});