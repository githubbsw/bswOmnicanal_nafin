const { ipcRenderer } = require('electron');

const $ = require('jquery');
require('popper.js');
require('bootstrap');

var usuario = ""
ipcRenderer.send('getUsuario', '')
$("#opcionesCanal").modal({ backdrop: 'static', keyboard: false}, 'show' );

function cambiarCanal(canal){

  $('.modal-body').hide()
  $('#loader').show()
  ipcRenderer.send('cambiarCanal', canal)
}

ipcRenderer.on('estatusExtensionResult',  async(event, vers) => {
  
})

setTimeout(() => {
  $('.modal-body').hide()
  $('#loader').show()
  ipcRenderer.send('CerrarSesion', { idAgente: usuario, tipoCierre: "CIERRE_SESION" })
}, 10000);


function cerrarSesion(){
  $('.modal-body').hide()
  $('#loader').show()
  ipcRenderer.send('CerrarSesion', { idAgente: usuario, tipoCierre: "CIERRE_SESION" })
  //ipcRenderer.send('CerrarSesion', usuario)   
}


ipcRenderer.on('CerrarSesionResult', (event, arg) => {
  if(arg == "ok"){
      ipcRenderer.send('cerrarSesion_', "")   
  }
})


ipcRenderer.on('getUsuarioResult', (event, datos) => {

  usuario = datos.usuario.usuarioid

})