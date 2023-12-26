const { ipcRenderer, app } = require('electron');
const open = require('opn');

const $ = require('jquery');
require('popper.js');
require('bootstrap');

var opcionesProceso = {};
var versionA = '';
var versionN = '';
var url = '';
var bandera = true;


var input = document.getElementById("inputContrasena");
input.addEventListener("keyup", function(event) {
  if (event.keyCode === 13 && bandera == true) {
    event.preventDefault();
    login()
  }
});




ipcRenderer.on('consultarOpcionesProcesoResult', async (event, opcProceso) => {
    await opcProceso.forEach((opc)=> {
      opcionesProceso[opc.nombre] = opc.valor;
    })
    ipcRenderer.send('setOpcPrc', opcionesProceso)
})


ipcRenderer.on('setOpcPrcResult', async (event, arg) => {
  if(arg == "ok"){

    $(".loginBg").show();
    $(".loginBg_2").removeClass("col-12")
    $(".loginBg_2").addClass("col-6")
    $(".loginBg_2 img").css("width", "80%")
  }
})

function consultarNombre(){

  if($("#inputUsuario").val() != ""){

    $(".loader").show()
    $(".alert").remove();
    ipcRenderer.send('consultarNombre',  $("#inputUsuario").val())
    $("#nombreUsuario").html("")

  }
}

ipcRenderer.on('consultarNombreResult', (event, usuario) => {


    if(usuario != null){

      $("#nombreUsuario").html( usuario.SSUSRDSC)
     
    }else{

      $(".alert").remove();
      $("#inputUsuario").before(
        
        '<div class="alert alert-danger" role="alert" style="background: transparent; border: none;">'+
        'Usuario no encontrado'+
        '</div>'
  
      );

    }
    $(".loader").hide()


})

function cancelar(){
    ipcRenderer.send('cerrarVentana', "");
}

function login(){

  
  let datos = {};
  datos.usuarioid = $("#inputUsuario").val();
  datos.pssw = $("#inputContrasena").val();
  datos.url = opcionesProceso.password;

  if(datos.usuarioid != ""){
    $(".loader").show()
    $("#btnLogin").hide()
    ipcRenderer.send('validarUsuario', datos)
  }

}

function abrirConf(){
    ipcRenderer.send('abrirPantallaConf', "");
}

function limpiarCache(){
  ipcRenderer.send('limpiarCache', "");
}

ipcRenderer.on('validarUsuarioResult', (event, datos) => {

  if(datos.valido){
    let datos = {};
    datos.usuarioid = $("#inputUsuario").val();
    datos.pssw = $("#inputContrasena").val();
    ipcRenderer.send('consultarPorId', { id: datos.usuarioid, marcador: opcionesProceso.ipCRM} )
  

  }else{

    $(".alert").remove();
    $("#inputUsuario").before(
      
      '<div class="alert alert-danger" role="alert" style="background: transparent; border: none;">'+
      datos.mensaje +
      '</div>'

    );
    $(".loader").hide()
    $("#btnLogin").show()

  }

})

/*
ipcRenderer.on('abrirPantallaConfResult', (event, datos) => {

  $("body").html(datos);

})

*/

ipcRenderer.on('consultarPorIdResult', (event, user) => {

  if(user == "USUARIO_LOGUEADO"){


    $(".alert").remove();
    $("#inputUsuario").before(
      
      '<div class="alert alert-danger" role="alert" style="background: transparent; border: none;"> Usuario con sesion activa </div>'

    );
    $(".loader").hide()
    $("#btnLogin").show()
    $("#mensajeModal").html("Usuario con sesion activa")
    $("#modalSesion").modal({ backdrop: 'static', keyboard: false}, 'show' );

  }else if(user == "RECESO_VENCIDO"){


    $(".alert").remove();
    $("#inputUsuario").before(
      
      '<div class="alert alert-danger" role="alert" style="background: transparent; border: none;"> El usuario tiene recesos vencidos </div>'

    );
    $(".loader").hide()
    $("#btnLogin").show()
    $("#mensajeModal").html("El usuario tiene recesos vencidos")
    $("#modalSesion").modal({ backdrop: 'static', keyboard: false}, 'show' );
    


  }else{

    console.log(user)
    let usuario = {
      usuarioid:$("#inputUsuario").val(),
      pssw: $("#inputContrasena").val()
    };
    let datos = {
      usuario: usuario,
      agente: user.usuario,
      areas: user.areas,
      canalesM: user.canalesM
    };
    ipcRenderer.send('setUsuario', datos);
  }  
  
  
})

function limpiarSesiones(){

  ipcRenderer.send('limpiarSesiones', $("#inputUsuario").val());

}

function limpiarReceso(){

  ipcRenderer.send('limpiarReceso', $("#inputUsuario").val());
  
}


ipcRenderer.on('limpiarSesionesResult', (event, arg) => {


  if(arg == "ok"){
    $("#modalSesion").modal( 'hide' );
    $(".alert").remove();

  }


});

ipcRenderer.on('limpiarRecesoResult', (event, arg) => {

  if(arg == "ok"){
    $("#modalSesion").modal( 'hide' );
    $(".alert").remove();
  }

});


function testTipi(){
  ipcRenderer.send('testLogin', "");
}


leerConfi()

function leerConfi(){
  ipcRenderer.send('leerConfi', "")
}

ipcRenderer.on('leerConfiResult',  async(event, conexiones) => {

  let resultag =  await conexiones.filter(cnn => cnn.select == true)[0]
  $("#server_").html(resultag.nombre)
  ipcRenderer.send('consultarOpcionesProceso', resultag.vers)
  console.log(resultag)
})


ipcRenderer.send('getVersion', "")

ipcRenderer.on('getVersionResult',  async(event, vers) => {
  versionA = vers;
  $("#version").html("Versión " + vers)
})

ipcRenderer.send('limpiarCacheSinCerrar', "");
//ipcRenderer.send('consultaVersion', '') ;

ipcRenderer.on('consultaVersionResult', (event, datos) => {
    //if (versionA.includes(datos.version[0].valor)) {
    //    $("#versionlbl").html(datos.version[0].valor);
    //    $("#modalVersion").modal({ backdrop: 'static', keyboard: false}, 'show' );
    //    $("#btnLogin").hide()
    //    console.log(datos)
    //    versionN = datos.version[0].valor;
    //    url = datos.version[1].valor;
    //    bandera = false;
    //}   
})

function descargarVersion() {
    $("#mensajeV").css('display', 'none');
    $("#loader").css('display', 'block');
    setTimeout(function(){ 
        var valido = fileExists(url)
        if (valido != false) {           
          $("#mensajeV").html('');
          $("#loader").css('display', 'none');
            $("#mensajeV").html('Ejecute el instalador descargado para relizar la instalación del programa.');
            $("#mensajeV").css('display', 'block');
            //$("#modalVersion").modal({ backdrop: 'static', keyboard: false}, 'show' );
            //window.open(url);
            open('https://www.google.com/')
            open(url);
        }
        else
        {
            $("#mensajeV").html('');
            $("#mensajeV").html('No se encontró el archivo de descarga, favor de comunicarse con el area de soporte');
            $("#loader").css('display', 'none');
            $("#mensajeV").css('display', 'block');
        }
    }, 1000);
}

function fileExists(url) {
    if(url){
        var req = new XMLHttpRequest();
        req.open('GET', url, false);
        req.send();
        return req.status==200;
    } else {
        return false;
    }
}

