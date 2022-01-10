
const { ipcRenderer } = require('electron');
const $ = require('jquery');
require('popper.js');
require('bootstrap');

let datosCombos = {}
let urls = {}
let clientesTotal = {}
let datosCliente = {}


async function seleccionarClienteCita(cliente, numero){
    datosCliente = clientesTotal[cliente];
    if(datosCliente.correoElectronico){
        let correos =  datosCliente.correoElectronico.length > 0 ? datosCliente.correoElectronico.substring(4, datosCliente.correoElectronico.length ) : "notiene@notiene.com";
        correos = correos.split("<br>")
        if(correos.length > 0){
            $("#correoElectronico").html("")
            correos.forEach(c => {
                $("#correoElectronico").append(`<option value="${c}">${c}</option>`)
            });
        }else{
            $("#correoElectronico").remove();
            $("#labelCorreo").after(`<input type="text" class="form-control form-control-sm" id="correoElectronico">`);
        }
    }else{
        $("#correoElectronico").remove();
        $("#labelCorreo").after(`<input type="text" class="form-control form-control-sm" id="correoElectronico">`);
    }
    
    $("#idBeneficiario").val(datosCliente.idCliente)
    $("#apPaterno").val(datosCliente.apPat)
    $("#apMaterno").val(datosCliente.appMat)
    $("#nombreBenef").val(datosCliente.nombre)
    $("#numeroMovil").val(numero)
    $("#fechaNacimiento").val(datosCliente.fechaNac)
    $("#cita").show()
    $(".ocultar").show()
    $("#divListaClientes").hide()
    consultarCatalogos();
}

function getDatos() {
    const querystring = require('querystring');
    let query = querystring.parse(global.location.search);
    let clientes = JSON.parse(query['?datos']).cliente
    clientesTotal = clientes;
    urls = JSON.parse(query['?datos']).urls
    let llamada = JSON.parse(query['?datos']).llamadaOk
    $("#listaClientes").html("")
    if(clientes.length > 1){
        clientes.forEach((c, index) => {
            $("#listaClientes").append(`<li style="cursor: pointer;" class="text-left list-group-item">
                   <button onclick="seleccionarClienteCita(${index}, ${llamada.telefonoCliente})" type="button" class="btn mr-3 btn-dark">Seleccionar</button>
            ${c.idCliente +" - " + c.nombreCom}</li>`)
        });
    }else if(clientes.length == 1){
        seleccionarClienteCita(0, llamada.telefonoCliente)
    }    
    
}
getDatos()

function mostrarCita() {
    $("#datosBTN").removeClass("btn-success")
    $("#datosBTN").addClass("btn-dark")
    $("#citaBTN").addClass("btn-success")
    $("#citaBTN").removeClass("btn-dark")
    $("#datos").hide()
    $("#cita").show()
}


function consultarCita() {
    $("#datosBTN").removeClass("btn-success")
    $("#datosBTN").addClass("btn-dark")
    $("#citaBTN").addClass("btn-success")
    $("#citaBTN").removeClass("btn-dark")
    $("#datos").hide()
    $("#cita").show()
}

function mostrarDatos() {
    $("#citaBTN").removeClass("btn-success")
    $("#citaBTN").addClass("btn-dark")
    $("#datosBTN").addClass("btn-success")
    $("#datosBTN").removeClass("btn-dark")
    $("#consultarBTN").addClass("btn-dark")
    $("#consultarBTN").removeClass("btn-success")
    $("#datos").show()
    $("#cita").hide()
}

function consultarCatalogos() {
    $.ajax({
        url: urls.dirTomcat+"/SIO_FNC_WS/services/ServicioCatalogos/consulta",
        data: {},
        type: "post",
        dataType: 'json',
        success: function (response) {
            datosCombos = response;
            pintarComboEstado()
        }
    });
}


function pintarComboEstado() {
    $("#datosEstados").html("")
    $("#datosEstados").append(`<option value="NOSELECT">Seleccione un estado</option>`)
    datosCombos.estados.forEach(e => {
        $("#datosEstados").append(`<option value="${e.FNCEDOID}">${e.FNCEDODSC}</option>`)
    });
    $("#informacionSucursal").html("");
    $("#nombreSuc").html("");
    $("#telefonoSuc").html("")
    $("#comboSucursales").html("")
    $("#comboSucursales").append(`<option value="NOSELECT">Seleccione una sucursal</option>`)
    $("#comboTramite").html("")
    $("#comboTramite").append(`<option value="NOSELECT">Seleccione un tramite</option>`)
    $("#fechaSeleccionada").val("")
    $("#diaFechaSeleccionada").val("")
    $("#fechaOver").html("Selecciona un tramite primero")
    $("#fechas").html("")
    $("#comboHorarios").html("")
    $("#comboHorarios").append(`<option value="NOSELECT">Seleccione una fecha primero</option>`)
    //$("#datosEstados").val(datosCliente.idEstado)
    //buscarSucursales()
    
}

function buscarSucursales() {
    const result = datosCombos.sucursales.filter(suc => suc.FNCOFIEDO == $("#datosEstados").val());
    $("#comboSucursales").html("")
    $("#comboSucursales").append(`<option value="NOSELECT">Seleccione una sucursal</option>`)
    result.forEach(e => {
        $("#comboSucursales").append(`<option value="${e.FNCOFIID}">${e.FNCOFIDSC}</option>`)
    });
    $("#informacionSucursal").html("");
    $("#nombreSuc").html("");
    $("#telefonoSuc").html("")
    $("#comboTramite").html("")
    $("#comboTramite").append(`<option value="NOSELECT">Seleccione un tramite</option>`)
    $("#fechaSeleccionada").val("")
    $("#diaFechaSeleccionada").val("")
    $("#fechaOver").html("Selecciona un tramite primero")
    $("#fechas").html("")
    $("#comboHorarios").html("")
    $("#comboHorarios").append(`<option value="NOSELECT">Seleccione una fecha primero</option>`)
}

function datosSucursales() {
    const result = datosCombos.sucursales.filter(suc => suc.FNCOFIID == $("#comboSucursales").val())[0];
    $("#informacionSucursal").html(result.FCNOFIDIRC);
    $("#nombreSuc").html(result.FNCOFIDSC);
    $("#telefonoSuc").html(result.FNCOFITEL1);
    consultarTamites(result.FNCOFIID);
}

function consultarTamites(fncofiid) {
    $.ajax({
        url: urls.dirTomcat+"/SIO_FNC_WS/services/ServicioCatalogos/tramitesPorSucursal",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        data: JSON.stringify({
            sucursal: fncofiid
        }),
        type: "post",
        dataType: 'json',
        success: function (response) {
            pintarComboTramites(response.tramitesPorSucursal)
        }
    });
}

function pintarComboTramites(tramites) {
    $("#comboTramite").html("")
    $("#comboTramite").append(`<option value="NOSELECT">Seleccione un tramite</option>`)
    tramites.forEach(e => {
        $("#comboTramite").append(`<option value="${e.fnctrmid}">${e.fnctrmnoml}</option>`)
    });
    $("#comboHorarios").html("")
    $("#comboHorarios").append(`<option value="NOSELECT">Seleccione una fecha primero</option>`)
    $("#fechaSeleccionada").val("")
    $("#diaFechaSeleccionada").val("")
    $("#fechaOver").html("Selecciona un tramite primero")
    $("#fechas").html("")
    //$("#comboTramite").val(datosCliente.tramite)
    //consultarFechas()
    


}

function consultarFechas() {
    $.ajax({
        url: urls.dirTomcat+"/SIO_FNC_WS/services/ServicioCatalogos/fechasPorTramiteSucursal",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        data: JSON.stringify({
            sucursal: $("#comboSucursales").val(),
            tramite: $("#comboTramite").val(),
        }),
        type: "post",
        dataType: 'json',
        success: function (response) {
            pintarFechas(response.fechasPorTramiteSucursal)
        }
    });
    $("#comboHorarios").html("")
    $("#comboHorarios").append(`<option value="NOSELECT">Seleccione una fecha primero</option>`)
}

function seleccionarDia(fecha, dia) {
    $("#fechaSeleccionada").val(fecha)
    $("#diaFechaSeleccionada").val(dia)
    let fecha_ = new Date(fecha + " 00:00:00");
    let options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    $("#fechaOver").html("Seleccionó el dia, " + fecha_.toLocaleString("es-ES", options))
    $(".selectedDate").addClass("btn-success")
    $(".selectedDate").removeClass("btn-dark selectedDate")
    $("#" + fecha).addClass("btn-dark selectedDate")
    consultarHorarios(fecha, dia)
}

async function pintarFechas(fechas) {
    let noHabiles = await datosCombos.diasNoLaborales.filter(noLab => noLab.fncofiid == $("#comboSucursales").val());
    $("#fechaSeleccionada").val("")
    $("#diaFechaSeleccionada").val("")
    $("#fechaOver").html("Selecciona un día")
    $("#fechas").html("")
    $("#fechas").append(`<button type="button" style="max-width: 12%;width: 12%;min-width: 12%;" class="btn px-0 btn-info m-1">D</button>`)
    $("#fechas").append(`<button type="button" style="max-width: 12%;width: 12%;min-width: 12%;" class="btn px-0 btn-info m-1">L</button>`)
    $("#fechas").append(`<button type="button" style="max-width: 12%;width: 12%;min-width: 12%;" class="btn px-0 btn-info m-1">M</button>`)
    $("#fechas").append(`<button type="button" style="max-width: 12%;width: 12%;min-width: 12%;" class="btn px-0 btn-info m-1">M</button>`)
    $("#fechas").append(`<button type="button" style="max-width: 12%;width: 12%;min-width: 12%;" class="btn px-0 btn-info m-1">J</button>`)
    $("#fechas").append(`<button type="button" style="max-width: 12%;width: 12%;min-width: 12%;" class="btn px-0 btn-info m-1">V</button>`)
    $("#fechas").append(`<button type="button" style="max-width: 12%;width: 12%;min-width: 12%;" class="btn px-0 btn-info m-1">S</button>`)
    let primeraFecha = new Date(fechas[0].fechas + " 00:00:00");
    let diaPrimeraF = primeraFecha.getDay()
    primeraFecha.setTime(primeraFecha.getTime() - 86400000)
    let html = "";
    for (var i = 0; i < diaPrimeraF; i++) {
        
        let dia = `<button type="button" style="max-width: 12%;width: 12%;min-width: 12%;" class="px-0 btn btn-light m-1">${primeraFecha.getDate()}</button>`;
        dia+= html;
        html = dia;
        primeraFecha.setTime(primeraFecha.getTime() - 86400000 )
    }
    $("#fechas").append(html)
    for (var i = 0; i < fechas.length; i++) {
        let date = new Date(fechas[i].fechas + " 00:00:00");
        let options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
        let noHabilDay = await noHabiles.filter(noLab => noLab.fncofiid == $("#comboSucursales").val() && noLab.fnccaldffecha == fechas[i].fechas );
        if(noHabilDay.length > 0){
            $("#fechas").append(`<button title="${date.toLocaleString("es-ES", options) + ", Dia inhabil"}" type="button" style="max-width: 12%;width: 12%;min-width: 12%;" class="px-0 btn btn-warning m-1">${date.getDate()}</button>`)
        }else{
            if (parseInt(fechas[i].citasDisponibles) > 0) {
                $("#fechas").append(`<button id="${fechas[i].fechas}" onclick="seleccionarDia('${fechas[i].fechas}', '${fechas[i].diaSemana}')" title="${date.toLocaleString("es-ES", options) + ", Citas disponibles"}" type="button" style="max-width: 12%;width: 12%;min-width: 12%;" class="px-0 btn btn-success m-1">${date.getDate()}</button>`)
            } else {
                $("#fechas").append(`<button title="${date.toLocaleString("es-ES", options) + ", No hay citas disponibles"}" type="button" style="max-width: 12%;width: 12%;min-width: 12%;" class="px-0 btn btn-danger m-1">${date.getDate()}</button>`)
            }
        }
    }
}

function consultarHorarios(fecha, dia) {
    $.ajax({
        url: urls.dirTomcat+"/SIO_FNC_WS/services/ServicioCatalogos/horarioPorFechaTramiteSucursal",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        data: JSON.stringify({
            sucursal: $("#comboSucursales").val(),
            tramite: $("#comboTramite").val(),
            dia: dia,
            fechaCita: fecha,
        }),
        type: "post",
        dataType: 'json',
        success: function (response) {
            pintarComboHorarios(response.horariosPorFechaTramiteSucursal)
        }
    });
}


function pintarComboHorarios(horarios) {
    $("#comboHorarios").html("")
    $("#comboHorarios").append(`<option value="NOSELECT">Seleccione un horario</option>`)
    horarios.forEach(e => {
        if(e.citasDisponibles == "0"){
            $("#comboHorarios").append(`<option style="background: #dc3545;color: #fff;" disabled value="${e.fncmtzservhorid}">${e.fncmtzservhordsc}</option>`)
        }else{
            $("#comboHorarios").append(`<option style="background: #28a745;color: #fff;" value="${e.fncmtzservhorid}">${e.fncmtzservhordsc}</option>`)
        }
    });
}


function guardarCita() {
    let inputs = ["#idBeneficiario","#nombreBenef","#apPaterno", "#fechaSeleccionada",
    "#comboHorarios","#datosEstados","#comboSucursales","#comboTramite","#numeroMovil","#numeroMovil","#numeroMovil"]
    for (var i = 0; i < inputs.length; i++) {
        let elemento = $(inputs[i])
        if(elemento.prop("tagName")== "INPUT"){
            if(elemento.val() == ""){
                let label = $('label[for="'+ elemento.attr('id') +'"]');
                $("#alertaCita").remove();
                $("#cita").before(`<div class="alert alert-warning" id="alertaCita" role="alert">
                <h4 class="alert-heading">Aviso!</h4>
                <p>Falta completar el campo: <strong>${label.text()}</strong></p>
                </div>`);
                $("#contenedor").animate({ scrollTop: 0 }, "slow");
                return
            }
        }else{
            if(elemento.val() == "NOSELECT"){
                let label = $('label[for="'+ elemento.attr('id') +'"]');
                $("#alertaCita").remove();
                $("#cita").before(`<div class="alert alert-warning" id="alertaCita" role="alert">
                <h4 class="alert-heading">Aviso!</h4>
                <p>Falta seleccionar campo: <strong>${label.text()}</strong></p>
                </div>`);
                $("#contenedor").animate({ scrollTop: 0 }, "slow");
                return
            }
        }
    }

    $.ajax({
        url: urls.dirTomcat+"/SIO_FNC_WS/services/ServicioAltaCita/altaCita",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        data: JSON.stringify({
            inss: "",
            rfc: "",
            numPreAfiliacion: "0",
            numeroCliente: $("#idBeneficiario").val(),
            nombre: $("#nombreBenef").val(),
            apellidoMaterno: $("#apMaterno").val(),
            apellidoPaterno: $("#apPaterno").val(),
            asunto: "sin asunto",
            correoElectronico: $("#correoElectronico").val(),
            edad: 29,
            edadCatalogo: 29,
            fechaNacimiento: $("#fechaNacimiento").val() == "" ? "0000-00-00" : $("#fechaNacimiento").val(),
            fechaSolicitud: $("#fechaSeleccionada").val(),
            hora: $("#comboHorarios").val(),
            estado: $("#datosEstados").val(),
            sucural: $("#comboSucursales").val(),
            tramite: $("#comboTramite").val(),
            telefono01: $("#numeroMovil").val(),
            telefono02: $("#numeroMovil").val(),
            telefono03: $("#numeroMovil").val(),
            caravana: "0",
            numeroMaxCitasCaravana: "0",
            horaAtencionInicio: "",
            horaAtencionTermino: "",
            tipoCliente: "0",
            tipoAcceso: ""

        }),
        type: "post",
        dataType: 'json',
        success: function (response) {
            $("#alertaCita").remove();
            if (response.mensaje == "exito") {
                $("#cita").before(`
                <div class="alert alert-success" id="alertaCita" role="alert">
                <h4 class="alert-heading">Cita creada con exito</h4>
                <p class="pb-1">El número de solicitud es: <strong> ${response.cita.numeroSolicitud}</strong>  </p>
                <hr>
                </div>
                `);
                $("#contenedor").animate({ scrollTop: 0 }, "slow");

                ipcRenderer.send('actCitaCRM', {
                suc:$("#comboSucursales").val() , 
                tram: $("#comboTramite").val(), 
                fol: response.cita.numeroSolicitud, 
                fecha: $("#fechaSeleccionada").val(), 
                hora: response.cita.hora, 
                idLlam:datosCliente.idLlamada, 
                idCliente: datosCliente.idCliente, 
                folioCte: datosCliente.folio
                })


            } else if (response.cita.numeroSolicitud == 0) {
                $("#cita").before(`
                <div class="alert alert-warning" id="alertaCita" role="alert">
                <h4 class="alert-heading">Aviso!</h4>
                <p>${response.mensaje}</p>
                `);
                $("#contenedor").animate({ scrollTop: 0 }, "slow");
                consultarFechas()
            }
        }
    });
}


ipcRenderer.on('actCitaCRMResult', async (event, datos) => {

    console.log(datos)
})


function cerrarVentanaCita(){
    ipcRenderer.send('cerrarVentanaCita', "")
}