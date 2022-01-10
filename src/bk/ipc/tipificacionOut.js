const { ipcMain} = require('electron');

const helper = require('../helpers/tipificacionOut');

  ipcMain.on('consultarScript', async(event, IdAgente) => {
    const obj = await helper.consultarScript(IdAgente); 
    event.reply("consultarScriptResult", obj);
  });

  ipcMain.on('ConsultaClienteSalida', async(event, obAgt) => {
    const obj = await helper.ConsultaClienteSalida(obAgt); 
    event.reply("ConsultaClienteSalidaResult", obj);
  });
  

  ipcMain.on('consultarEstatus', async(event, objCl) => {
    const obj = await helper.consultarEstatus(); 
    event.reply("consultarEstatusResult", obj);
  });
  
  ipcMain.on('consultarTipificacion', async(event, idEstatus,idcampania) => {
    const obj = await helper.consultarTipificacion(idEstatus,idcampania); 
    event.reply("consultarTipificacionResult", obj);
  });
  

  ipcMain.on('GuardarEstatus', async(event, objCl) => {
    const obj = await helper.GuardarEstatus(objCl); 
    event.reply("GuardarEstatusResult", obj);
  });

  ipcMain.on('consultarActCRM', async(event, idAgente) => {
    const actCRM = await helper.consultarActCRM(idAgente); 
    event.reply("consultarActCRMResult", actCRM);
  });


  ipcMain.on('completarActividad', async(event, datos) => {
    const result = await helper.completarActividad(datos); 
    event.reply("completarActividadResult", result);
  });