let datosCombos = {}
let clientesTotal = {}
let datosCliente = {}


async function seleccionarClienteCita(cliente, numero) {
    datosCliente = clientesTotal[cliente];
    if (datosCliente.correoElectronico) {
        let correos = datosCliente.correoElectronico.length > 0 ? datosCliente.correoElectronico.substring(4, datosCliente.correoElectronico.length) : "notiene@notiene.com";
        correos = correos.split("<br>")
        if (correos.length > 0) {
            $("#correoElectronico").html("")
            correos.forEach(c => {
                $("#correoElectronico").append(`<option value="${c}">${c}</option>`)
            });
        } else {
            $("#correoElectronico").remove();
            $("#labelCorreo").after(`<input type="text" class="form-control form-control-sm" id="correoElectronico">`);
        }
    } else {
        $("#correoElectronico").remove();
        $("#labelCorreo").after(`<input type="text" class="form-control form-control-sm" id="correoElectronico">`);
    }
    $("#idBeneficiario").val(datosCliente.idCliente)
    $("#apPaterno").val(datosCliente.apPat)
    $("#apMaterno").val(datosCliente.appMat)
    $("#nombreBenef").val(datosCliente.nombre)
    $("#numeroMovil").val(numero)
    $("#fechaNacimientoCita").val(datosCliente.fechaNac)
    $("#cita").show()
    $(".ocultar").show()
    $("#divListaClientes").hide()
    consultarCatalogos();
}

function verAltaDeCita(datos) {
    pitarCitasAlta()
    let clientes = datos
    clientesTotal = clientes;
    $("#listaClientes").html("")
    //if (clientes.length > 1) {
        clientes.forEach((c, index) => {


            if(c.btcrm1folcita != null){

                $("#listaClientes").append(

                    `
                                   <div class="text-white" style="MARGIN: 20PX 0;BACKGROUND: #fbfbfb36;">
                                   <div style="border-bottom: solid 1px #fff"class=" p-2 col-12 d-flex text-left flex-wrap flex-fill bd-highlight">
                                      <div class="col-4 flex-fill bd-highlight">Folio cita:</div>
                                      <div class=" classDato col-8 flex-fill bd-highlight">${c.btcrm1folcita}</div>
                                   </div>
                                   <div style="border-bottom: solid 1px #fff"class=" p-2 col-12 d-flex text-left flex-wrap flex-fill bd-highlight">
                                      <div class="col-4 flex-fill bd-highlight">Datos:</div>
                                      <div  class=" classDato col-8 flex-fill bd-highlight">${c.idCliente + " - " + c.nombreCom}</div>
                                   </div>
                                   <div style="border-bottom: solid 1px #fff"class=" p-2 col-12 d-flex text-left flex-wrap flex-fill bd-highlight">
                                      <div class="col-4 flex-fill bd-highlight">Fecha y hora:</div>
                                      <div  class=" classDato col-8 flex-fill bd-highlight">${c.btcrm1feccita + ",  " + c.btcrm1horcita}</div>
                                   </div>
                                   </div>
                    `  
                                )
            }else{


                $("#listaClientes").append(

                    `
                    <div class="text-white" style="MARGIN: 20PX 0;BACKGROUND: #fbfbfb36;">

                                   <div style="border-bottom: solid 1px #fff"class=" p-2 col-12 d-flex text-left flex-wrap flex-fill bd-highlight">
                                      <div class="col-4 flex-fill bd-highlight">Datos:</div>
                                      <div  class=" classDato col-8 flex-fill bd-highlight">${c.idCliente + " - " + c.nombreCom}</div>
                                   </div>
                                   <div style="border-bottom: solid 1px #fff"class=" p-2 col-12 d-flex text-left flex-wrap flex-fill bd-highlight">
                                      <div class="col-4 flex-fill bd-highlight"></div>
                                      <div class=" classDato col-8 flex-fill bd-highlight"><button onclick="seleccionarClienteCita(${index}, ${c.telefonoFijoInput})" type="button" class="btn mr-3 btn-info">Seleccionar</button></div>
                                   </div>
                                   </div>
                    `  
                                )

            }
            






        });
    /*} else if (clientes.length == 1) {
        seleccionarClienteCita(0, llamadaOk.telefonoCliente)
    }*/




    $("#altadecitaContenedor").show()
    $("#displayScript").hide()
    $("#displayCliente").hide()

}

function mostrarCita() {
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
    $("#datos").show()
    $("#cita").hide()
}

function consultarCatalogos() {
    $.ajax({
        url: urls.dirTomcat + "/SIO_FNC_WS/services/ServicioCatalogos/consulta",
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
    $("#comboSucursales").html("")
    $("#comboSucursales").append(`<option value="NOSELECT">Seleccione una sucursal</option>`)
    const result = datosCombos.sucursales.filter(suc => suc.FNCOFIID == $("#datosMuniciopio").val());
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
    datosSucursales()
}

function datosSucursales() {
    const result = datosCombos.sucursales.filter(suc => suc.FNCOFIID == $("#comboSucursales").val())[0];
    $("#informacionSucursal").html(result.FCNOFIDIRC);
    $("#nombreSuc").html(result.FNCOFIDSC);
    $("#telefonoSuc").html(result.FNCOFITEL1);
    consultarTamites(result.FNCOFIID);
}


function buscarMunicipio() {
    $.ajax({
        url: urls.dirTomcat + "/SIO_FNC_WS/services/ServicioCatalogos/municipiosPorEstado",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        data: JSON.stringify({
            estado: $("#datosEstados").val()
        }),
        type: "post",
        dataType: 'json',
        success: function (response) {
            pintarComboMunicipio(response.municipios)
        }
    });
}

function pintarComboMunicipio(datos) {
    $("#datosMuniciopio").html("")
    $("#datosMuniciopio").append(`<option value="NOSELECT">Seleccione un municipio</option>`)
    datos.forEach(e => {
        $("#datosMuniciopio").append(`<option value="${e.fncofiid}">${e.fncmpiodsc}</option>`)
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


function consultarTamites(fncofiid) {
    $.ajax({
        url: urls.dirTomcat + "/SIO_FNC_WS/services/ServicioCatalogos/tramitesPorSucursal",
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
        url: urls.dirTomcat + "/SIO_FNC_WS/services/ServicioCatalogos/fechasPorTramiteSucursal",
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
    $("#fechas").append(`<button type="button" style="max-width: 12%;width: 12%;min-width: 12%;" class="btn px-0 btn-info m-0 m-sm-1">D</button>`)
    $("#fechas").append(`<button type="button" style="max-width: 12%;width: 12%;min-width: 12%;" class="btn px-0 btn-info m-0 m-sm-1">L</button>`)
    $("#fechas").append(`<button type="button" style="max-width: 12%;width: 12%;min-width: 12%;" class="btn px-0 btn-info m-0 m-sm-1">M</button>`)
    $("#fechas").append(`<button type="button" style="max-width: 12%;width: 12%;min-width: 12%;" class="btn px-0 btn-info m-0 m-sm-1">M</button>`)
    $("#fechas").append(`<button type="button" style="max-width: 12%;width: 12%;min-width: 12%;" class="btn px-0 btn-info m-0 m-sm-1">J</button>`)
    $("#fechas").append(`<button type="button" style="max-width: 12%;width: 12%;min-width: 12%;" class="btn px-0 btn-info m-0 m-sm-1">V</button>`)
    $("#fechas").append(`<button type="button" style="max-width: 12%;width: 12%;min-width: 12%;" class="btn px-0 btn-info m-0 m-sm-1">S</button>`)
    let primeraFecha = new Date(fechas[0].fechas + " 00:00:00");
    let diaPrimeraF = primeraFecha.getDay()
    primeraFecha.setTime(primeraFecha.getTime() - 86400000)
    let html = "";
    for (var i = 0; i < diaPrimeraF; i++) {

        let dia = `<button type="button" style="max-width: 12%;width: 12%;min-width: 12%;" class="px-0 btn btn-light m-0 m-sm-1">${primeraFecha.getDate()}</button>`;
        dia += html;
        html = dia;
        primeraFecha.setTime(primeraFecha.getTime() - 86400000)
    }
    $("#fechas").append(html)
    for (var i = 0; i < fechas.length; i++) {
        let date = new Date(fechas[i].fechas + " 00:00:00");
        let options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
        let noHabilDay = await noHabiles.filter(noLab => noLab.fncofiid == $("#comboSucursales").val() && noLab.fnccaldffecha == fechas[i].fechas);
        if (noHabilDay.length > 0) {
            $("#fechas").append(`<button title="${date.toLocaleString("es-ES", options) + ", Dia inhabil"}" type="button" style="max-width: 12%;width: 12%;min-width: 12%;" class="px-0 btn btn-warning m-0 m-sm-1">${date.getDate()}</button>`)
        } else {
            if (parseInt(fechas[i].citasDisponibles) > 0) {
                $("#fechas").append(`<button id="${fechas[i].fechas}" onclick="seleccionarDia('${fechas[i].fechas}', '${fechas[i].diaSemana}')" title="${date.toLocaleString("es-ES", options) + ", Citas disponibles"}" type="button" style="max-width: 12%;width: 12%;min-width: 12%;" class="px-0 btn btn-success m-0 m-sm-1">${date.getDate()}</button>`)
            } else {
                $("#fechas").append(`<button title="${date.toLocaleString("es-ES", options) + ", No hay citas disponibles"}" type="button" style="max-width: 12%;width: 12%;min-width: 12%;" class="px-0 btn btn-danger m-0 m-sm-1">${date.getDate()}</button>`)
            }
        }
    }
}

function consultarHorarios(fecha, dia) {
    $.ajax({
        url: urls.dirTomcat + "/SIO_FNC_WS/services/ServicioCatalogos/horarioPorFechaTramiteSucursal",
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
        if (e.citasDisponibles == "0") {
            $("#comboHorarios").append(`<option style="background: #dc3545;color: #fff;" disabled value="${e.fncmtzservhorid}">${e.fncmtzservhordsc}</option>`)
        } else {
            $("#comboHorarios").append(`<option style="background: #28a745;color: #fff;" value="${e.fncmtzservhorid}">${e.fncmtzservhordsc}</option>`)
        }
    });
}


function guardarCita() {
    let inputs = ["#idBeneficiario", "#nombreBenef", "#apPaterno", "#fechaSeleccionada",
        "#comboHorarios", "#datosEstados", "#comboSucursales", "#comboTramite", "#numeroMovil", "#numeroMovil", "#numeroMovil"]
    for (var i = 0; i < inputs.length; i++) {
        let elemento = $(inputs[i])
        if (elemento.prop("tagName") == "INPUT") {
            if (elemento.val() == "") {
                let label = $('label[for="' + elemento.attr('id') + '"]');
                $("#alertaCita").remove();
                $("#cita").before(`<div class="alert alert-warning" id="alertaCita" role="alert">
                <h4 class="alert-heading">Aviso!</h4>
                <p>Falta completar el campo: <strong>${label.text()}</strong></p>
                </div>`);
                $("#contenedor").animate({ scrollTop: 0 }, "slow");
                $("#btnGuardarCita").show()
                return
            }
        } else {
            if (elemento.val() == "NOSELECT") {
                let label = $('label[for="' + elemento.attr('id') + '"]');
                $("#alertaCita").remove();
                $("#cita").before(`<div class="alert alert-warning" id="alertaCita" role="alert">
                <h4 class="alert-heading">Aviso!</h4>
                <p>Falta seleccionar campo: <strong>${label.text()}</strong></p>
                </div>`);
                $("#contenedor").animate({ scrollTop: 0 }, "slow");
                $("#btnGuardarCita").show()
                return
            }
        }
    }

    $("#btnGuardarCita").hide()
    $.ajax({
        url: urls.dirTomcat + "/SIO_FNC_WS/services/ServicioAltaCita/altaCita",
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
            fechaNacimiento: $("#fechaNacimientoCita").val() == "" ? "0000-00-00" : $("#fechaNacimientoCita").val(),
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
            tipoAcceso: "",
            cnuserid: agenteOk.id,

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
                    suc: $("#comboSucursales").val(),
                    tram: $("#comboTramite").val(),
                    fol: response.cita.numeroSolicitud,
                    fecha: $("#fechaSeleccionada").val(),
                    hora: response.cita.hora,
                    idLlam: datosCliente.idLlamada,
                    idCliente: datosCliente.idCliente,
                    folioCte: datosCliente.folio,
                    fncsolhordsc: response.cita.fncsolhordsc,
                })
            } else if (response.cita.numeroSolicitud == 0) {
                $("#cita").before(`
                <div class="alert alert-warning" id="alertaCita" role="alert">
                <h4 class="alert-heading">Aviso!</h4>
                <p>${response.mensaje}</p>
                `);
                $("#contenedor").animate({ scrollTop: 0 }, "slow");
                $("#btnGuardarCita").show()
            }
        }
    });
}

ipcRenderer.on('actCitaCRMResult', async (event, datos) => {
    if(datos == "OK"){
        $("#alertPrincipal").html("<strong>Aviso.</strong> Se actualizo FUB");
        $("#alertPrincipal").fadeTo(3000, 500).slideUp(500, function () {
            $("#alertPrincipal").slideUp(2000);
        });
        $("#btnGuardarCita").show()
    }
})


function cerrarVentanaCita() {
    $("#altadecitaContenedor").hide()
    $("#altadecitaContenedor").html("")
    $("#displayScript").hide()
    $("#displayCliente").show()
}

function pitarCitasAlta() {
    $("#altadecitaContenedor").html(`
    <div id="contenedor" class="p-3"
    style="width: 100%;height: 100%;background: #00000069;/* position: absolute; */overflow-y: scroll;">
    <div id="divListaClientes" class="col-12">
    <div class="col-12 px-0" style="    text-align: right;">
        <button type="button" onclick="cerrarVentanaCita()" class="btn btn-danger">Cerrar Citas</button>
        </div>
       <p class="text-white font-weight-bolder text-left col-md-12" style="font-size: larger;">Seleccione una persona</p>
       <div id="listaClientes">
       </div>
    </div>
    <div class="card col-12 ocultar mb-3 text-left p-0" style="display: none;">
    <div class="col-12 px-0" style="    text-align: right;">
        <button type="button" onclick="cerrarVentanaCita()" class="btn btn-danger">Cerrar Citas</button>
        </div>
       <div class="card-body py-0 d-flex mb-3">
          <p class=" text-white font-weight-bolder text-left col my-0" style="font-size: x-large;">Alta de citas</p>
       </div>
    </div>
    <div class="card col-12 ocultar mb-3 text-left py-0 px-0" style="display: none;">
       <div class="card-body py-0">
          <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
             <li class="nav-item mx-1">
                <button id="citaBTN" type="button" onclick="mostrarCita()"
                   class="btn btn-success">Cita</button>
             </li>
             <li class="nav-item mx-1">
                <button id="datosBTN" type="button" onclick="mostrarDatos()" class="btn btn-dark">Datos de la Persona</button>
             </li>
          </ul>
       </div>
    </div>
    <div id="cita" class="card col-12 mb-3 text-left px-0" style="border: #fff solid 0px; display: none;">
       <div class="card-body px-1">
          <div class="form-row">
             <div class="form-group col-md-6">
                <label for="datosEstados">Estado</label>
                <select onchange="buscarMunicipio()" class="form-control form-control-sm" id="datosEstados">
                   <option value="NOSELECT">Espere</option>
                </select>
             </div>
             <div class="form-group col-md-6">
                <label for="datosEstados">Municipio</label>
                <select onchange="buscarSucursales()" class="form-control form-control-sm" id="datosMuniciopio">
                   <option value="NOSELECT">Primero seleccione un estado</option>
                </select>
             </div>
             <div class="form-group col-md-12">
                <label for="comboSucursales">Sucursal</label>
                <select onchange="datosSucursales()" class="form-control form-control-sm"
                   id="comboSucursales">
                   <option value="NOSELECT">Primero seleccione un municipio</option>
                </select>
             </div>
             <div class="form-group col-md-12">
                <label for="informacionSucursal">Informacion de la sucursal</label>
                <div class="alert alert-info" role="alert">
                   <h4 id="nombreSuc" class="alert-heading"></h4>
                   <p id="informacionSucursal"></p>
                   <hr>
                   <p id="telefonoSuc" class="mb-0"></p>
                </div>
             </div>
          </div>
          <div class="form-row">
             <div class="form-group col-md-12">
                <label for="comboTramite">Tramite</label>
                <select onchange="consultarFechas()" class="form-control form-control-sm" id="comboTramite">
                   <option value="NOSELECT">Primero seleccione una sucursal</option>
                </select>
             </div>
             <div class="form-group col-md-12" style="overflow-x: scroll;">
                <label for="fechaSeleccionada">Fecha</label>
                <label class="d-none" for="diaFechaSeleccionada">Fecha</label>
                <input type="hidden" class="form-control form-control-sm" id="fechaSeleccionada">
                <input type="hidden" class="form-control form-control-sm" id="diaFechaSeleccionada">
                <button type="button" id="fechaOver" style="max-width: 100%;width: 100%;min-width: 100%;"class="btn px-0 btn-light m-1">Selecciona un tramite primero</button>
                <div class="col-md-12 col-12 mx-auto px-0 text-left" style="min-width: 400px;" id="fechas"></div>
                <img style="width: 100%;" src="img/simbologia.png">
             </div>
             <div class="form-group col-md-12">
                <label for="comboHorarios">Horarios</label>
                <select class="form-control form-control-sm" id="comboHorarios">
                   <option value="NOSELECT">Seleccione una fecha primero</option>
                </select>
             </div>
             <div class="form-group col-md-12">
                <button id="btnGuardarCita" onclick="guardarCita()" type="button"
                   class="btn btn-dark btn-sm btn-lg btn-block">Guardar
                   cita</button>
             </div>
          </div>
       </div>

    </div>
    <div id="datos" class="card col-12 mb-3 text-left" style="display: none;border: #fff solid 0px;">
       <div class="card-body">
          <div class="form-row">
             <div class="form-group col-md-6">
                <label for="idBeneficiario">Id de la persona</label>
                <input type="text" class="form-control form-control-sm" id="idBeneficiario">
             </div>
             <div class="form-group col-md-12">
                <label for="fechaNacimientoCita">Fecha de nacimiento</label>
                <input type="date" class="form-control form-control-sm" id="fechaNacimientoCita">
             </div>
          </div>
          <div class="form-row">
             <div class="form-group col-md-4">
                <label for="apPaterno">Apellido Paterno</label>
                <input type="text" class="form-control form-control-sm" id="apPaterno">
             </div>
             <div class="form-group col-md-4">
                <label for="apMaterno">Apellido Materno</label>
                <input type="text" class="form-control form-control-sm" id="apMaterno">
             </div>
             <div class="form-group col-md-4">
                <label for="nombreBenef">Nombre(s)</label>
                <input type="text" class="form-control form-control-sm" id="nombreBenef">
             </div>
          </div>
          <div class="form-row">
             <div class="form-group col-md-6">
                <label id="labelCorreo" for="correoElectronico">Correo electrónico</label>
                <select class="form-control form-control-sm" id="correoElectronico">
                </select>
             </div>
             <div class="form-group col-md-6">
                <label for="numeroMovil">Telefono Movil</label>
                <input type="text" class="form-control form-control-sm" id="numeroMovil">
             </div>
          </div>
       </div>
    </div>
 </div>
    `)
}



function pitarLocalizacion() {
    $("#altadecitaContenedor").html(`
    <div id="contenedor" class="p-3"
    style="width: 100%;height: 100%;background: #00000069;overflow-y: scroll;">
    <div id="divListaClientes" class="col-12">
    <div class="card col-12 ocultar mb-3 text-left p-0">
    <div class="col-12 px-0" style="    text-align: right;">
        <button type="button" onclick="cerrarVentanaCita()" class="btn btn-danger">Cerrar</button>
        </div>
       <div class="card-body py-0 d-flex mb-3">
          <p class=" text-white font-weight-bolder text-left col my-0" style="font-size: x-large;">Horarios y Ubicaciones</p>
       </div>
    </div>
    <div id="cita" class="card col-12 mb-3 text-left px-0" style="border: #fff solid 0px;">
       <div class="card-body px-1">
          <div class="form-row">
             <div class="form-group col-md-6">
                <label for="datosEstados">Estado</label>
                <select onchange="buscarMunicipio()" class="form-control form-control-sm" id="datosEstados">
                   <option value="NOSELECT">Espere</option>
                </select>
             </div>
             <div class="form-group col-md-6">
                <label for="datosEstados">Municipio</label>
                <select onchange="buscarSucursales()" class="form-control form-control-sm" id="datosMuniciopio">
                   <option value="NOSELECT">Primero seleccione un estado</option>
                </select>
             </div>
             <div class="form-group col-md-12">
                <label for="comboSucursales">Sucursal</label>
                <select onchange="datosSucursales()" class="form-control form-control-sm"
                   id="comboSucursales">
                   <option value="NOSELECT">Primero seleccione un municipio</option>
                </select>
             </div>
             <div class="form-group col-md-12">
                <label for="informacionSucursal">Informacion de la sucursal</label>
                <div class="alert alert-info" role="alert">
                   <h4 id="nombreSuc" class="alert-heading"></h4>
                   <p id="informacionSucursal"></p>
                   <hr>
                   <p id="telefonoSuc" class="mb-0"></p>
                </div>
             </div>
          </div>
    </div>
 </div>
    `)



    if (!$('#altadecitaContenedor').is(':visible')) {
        $("#altadecitaContenedor").show()
        $("#displayScript").hide()
        $("#displayCliente").hide()
        consultarCatalogos();
    } else {
    }



    
}





















