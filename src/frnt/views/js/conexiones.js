const { ipcRenderer } = require('electron');
const $ = require('jquery');

function login(){
    if($('#inputContrasenaConf').val()=="SPUSRM2020"){
        $('#loginConf').hide();
        $('#conf').addClass("d-block");  
        leerConfi();       
    }
}

function leerConfi(){
    ipcRenderer.send('leerConfi', "")
}

ipcRenderer.on('leerConfiResult', (event, conexiones) => {
    $('#listConexiones').html("")
    conexiones.forEach(conexion => {
        if(conexion.select){
            $('#listConexiones').append(`<li onclick="seleccionarConexion(${conexion.id})" id="${conexion.id}" style="cursor: pointer;" class="list-group-item bg-dark text-white">${conexion.nombre}</li>`)
        }else{
            $('#listConexiones').append(`<li onclick="seleccionarConexion(${conexion.id})" id="${conexion.id}" style="cursor: pointer;" class="list-group-item">${conexion.nombre}</li>`)
        }  
    });
})

function seleccionarConexion(id){   
    ipcRenderer.send('seleccionarConexion', id);
     $(".list-group-item").removeClass("bg-dark text-white");
     $("#"+id).addClass("bg-dark text-white");
}

ipcRenderer.on('seleccionarConexionResult', (event, args) => {
    leerConfi();
})


function cerrar(){

    ipcRenderer.send('cerrarSesion_', "")
    
}

function cerrarVentana(){

    ipcRenderer.send('cerrarVentana2', "")
    
}