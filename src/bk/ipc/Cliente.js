const { ipcMain} = require('electron');

const helper = require('../helpers/Cliente.js');

  ipcMain.on('consultarCliente', async(event, obj) => {

    const clienteObj = await helper.consultar(obj.criterios,obj.datosPaginacion); 
    event.reply("consultarClienteResult", clienteObj);

  });

  ipcMain.on('consultarTotal', async(event, obj) => {

    const clienteObj = await helper.consultarTotal(obj.criterios); 
    event.reply("consultarTotalResult", clienteObj);

  });

  ipcMain.on('insertarDatosCliente', async(event, obj) => {

    const clienteObj = await helper.insertar(obj); 
    event.reply("insertarDatosClienteResult", clienteObj);

  });

  ipcMain.on('actualizarDatosCliente', async(event, obj) => {

    const clienteObj = await helper.insertarEdicion(obj); 
    event.reply("insertarDatosClienteResult", clienteObj);

  });

  ipcMain.on('actualizarCte', async(event, obj) => {
    const clienteObj = await helper.insertarEdicion(obj); 
    event.reply("insertarCteResult", clienteObj);
  });

  ipcMain.on('consultarPorLlaves', async(event, llave) => {

    const clienteObj = await helper.consultarPorLlaves(llave); 
    event.reply("consultarPorLlavesResult", clienteObj);

  });

  ipcMain.on('insertarTelefono', async(event, telefono) => {

    const clienteObj = await helper.insertarTelefono(telefono); 
    event.reply("insertarTelefonoResult", clienteObj);

  });

  ipcMain.on('insertarCorreo', async(event,correo) => {

    const clienteObj = await helper.insertarCorreo(correo); 
    event.reply("insertarCorreoResult", clienteObj);

  });

  ipcMain.on('consultarPortabilidad', async(event,telefono) => {

    const clienteObj = await helper.consultarPortabilidad(telefono); 
    event.reply("consultarPortabilidadResult", clienteObj);

  });

  ipcMain.on('consultarPortabilidadPrinci', async(event,telefono) => {

    const clienteObj = await helper.consultarPortabilidad(telefono); 
    event.reply("consultarPortabilidadPrinciResult", clienteObj);

  });

  ipcMain.on('consultarTelefonos', async(event,idCliente) => {

    const clienteObj = await helper.consultarTelefonos(idCliente); 
    event.reply("consultarTelefonosResult", clienteObj);

  });

  ipcMain.on('consultarCorreos', async(event,idCliente) => {

    const clienteObj = await helper.consultarCorreos(idCliente); 
    event.reply("consultarCorreosResult", clienteObj);

  });


  ipcMain.on('consultarCorreos_', async(event,idCliente, folio) => {

    const correos = await helper.consultarCorreos(idCliente); 
    var result = {
      correos,
      folio
    }
    event.reply("consultarCorreos_Result", result);

  });


  ipcMain.on('consultarContactos', async(event,idUsuario) => {

    const contactos = await helper.consultarContactos(idUsuario); 
    event.reply("consultarContactosResult", contactos);

  });


  
  ipcMain.on('consultarEstados', async(event,arg) => {

    const estados = await helper.consultarEstados(); 
    event.reply("consultarEstadosResult", estados);

  });

  ipcMain.on('consultarMunicipio', async(event,id) => {
    const mun = await helper.consultarMunicipio(id); 
    event.reply("consultarMunicipioResult", mun);

  });
  
  ipcMain.on('consultarCombosCliente', async(event) => {
    const mun = await helper.consultarCombosCliente(); 
    event.reply("consultarCombosClienteResult", mun);

  });

