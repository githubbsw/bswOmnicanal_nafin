const $ = require('jquery');
require('popper.js');
require('bootstrap');
require('datatables.net-dt')();
require('datatables.net-responsive-dt')();
let preguntaCita = ""
let estatus = "DISPONIBLE"

var nodos = [];
var nodosRaiz = [];

let socket;

var versTip = "";
var clienteAuto = "";

var agenteOk = {};
var areasOk = {};
var usuarioOk = {};

var urls = {};

var areaIniciada = ""
var datosInbound = {}
var datosOutbound = {}

let llamadaEjec = {};

var entroaReceso = false;

var motivoDesco = "";
var motivodsc = ""
var procesoID;
var autorizado = false;
var timpoReceso = "00:00:00";
var enReceso = false;
var solicitarRecAnterior = "";
var contactosAsignados = "";

var tipi1 = false;
var tipi2 = false;

var tipoDeRespuestas = [];
var constimer = false;
var pausPart="";
var timeoutRecesos=0;
ipcRenderer.send('test', '')

ipcRenderer.on('testResult', async (event, datos) => {
    if (!datos.test) {
        $("body").show();
        ipcRenderer.send('getUsuario', $("#AREAINICIADA_").val())
    } else {
        $("body").show();
        $("body").html(
        `<div class="p-5" style="width: 100%;height: 100%; background-image: url(img/bg-degradado.png); background-size: 100% 100%;">

          <h2 class="text-white">Realizando test de conexión</h2>
          <p class="text-white">Espere un momento por favor...</p>
          <div class="spinner-border text-secondary" role="status">
            <span class="sr-only">Loading...</span>
          </div>
          <div class="spinner-border text-success" role="status">
            <span class="sr-only">Loading...</span>
          </div>
          <div class="spinner-border text-light" role="status">
            <span class="sr-only">Loading...</span>
          </div>
          <div class="spinner-border text-dark" role="status">
            <span class="sr-only">Loading...</span>
          </div>
          <button type="button" onclick="cancelarTest()" class="btn btn-link  col-12" style="color: green;">Cancelar</button>

            </div>
            <div class="col d-none float-left bg-light h-100 px-0 position-relative">
            <webview id="webview_" src="${datos.urls.tipificacion2}?CNUSERID=SPUSRM" style="display:inline-flex; width:100%; height:100%;"></webview>
            <webview id="webviewTipificacion" src="${datos.urls.tipificacion2}?CNUSERID=SPUSRM" style="display:inline-flex; width:100%; height:100%;" localStorage="true" partition="persist:simplifica"></webview>
            '</div>`

        );
        var webview_ = document.getElementById('webview_')
        webview_.addEventListener('dom-ready', () => {
            tipi1 = true;
            if(tipi2 && tipi1){
                ipcRenderer.send('cerrarSesion_', "")
            }
        })
        var webviewTipificacion = document.getElementById('webviewTipificacion')
        webviewTipificacion.addEventListener('dom-ready', () => {
            tipi2 = true;
            if(tipi2 && tipi1){
                ipcRenderer.send('cerrarSesion_', "")
            }
        })
    }
})


function cancelarTest(){

    ipcRenderer.send('cerrarSesion_', "")

}


function buscarClienteContacto() {
    const result = contactosAsignados.filter(cliente => cliente.nombreCliente.indexOf($("#inputBuscar").val()) > -1);
    pintarContactos(result)
}

function seleccionarContacto(idCont) {
    const result = contactosAsignados.filter(cliente => cliente.id = idCont)[0];
    contactoseleccionado = result;
}

function pintarContactos(datos) {

    $(".contactoList").remove();
    var bg = true;
    datos.forEach((contacto, index) => {

        var icon = contacto.tipoTele == "MOVIL" ? "icon-mobile" : "icon-phone";
        var icon2 = contacto.tipoTele3 == "MOVIL" ? "icon-mobile" : "icon-phone";
        var icon3 = contacto.tipoTele3 == "MOVIL" ? "icon-mobile" : "icon-phone";

        contacto.contactoTele_ = "";
        contacto.contactoTele2_ = "";
        contacto.contactoTele3_ = "";

        if (contacto.contactoTele != "" && contacto.contactoTele != "0") {
            contacto.contactoTele_ = '<div class="numeroContacto" title="Marcar ' + contacto.contactoTele + '" onclick="marcarList(' + contacto.contactoTele + '); seleccionarContacto(' + contacto.id + ')" ><span class="' + icon + '"></span> ' + contacto.contactoTele + '</div>'
        }
        if (contacto.contactoTele2 != "" && contacto.contactoTele2 != "0") {
            contacto.contactoTele2_ = '<div class="numeroContacto" title="Marcar ' + contacto.contactoTele + '"  onclick="marcarList(' + contacto.contactoTele2 + '); seleccionarContacto(' + contacto.id + ')" ><span class="' + icon2 + '"></span> ' + contacto.contactoTele2 + '</div>'
        }
        if (contacto.contactoTele3 != "" && contacto.contactoTele3 != "0") {
            contacto.contactoTele3_ = '<div class="numeroContacto" title="Marcar ' + contacto.contactoTele + '"  onclick="marcarList(' + contacto.contactoTele3 + '); seleccionarContacto(' + contacto.id + ')"><span class="' + icon3 + '"></span> ' + contacto.contactoTele3 + '</div>'
        }

        var bg_ = bg ? "bg-light" : "bg-gris";

        $("#listaContactos").append(

            `<li class="contactoList list-group-item ${bg_} "  >
            <div style="color: #00BCD4; font-size: 20px; font-weight: 700;">${contacto.nombreCliente}</div>
            <div style="display: flex; justify-content: space-between; color: #000;">
             ${contacto.contactoTele_} ${contacto.contactoTele2_} ${contacto.contactoTele3_}
            </div>
            <div style="font-size: small;"><i>${ MaysPrimera(contacto.contactoStatus.toLowerCase())}</i></div>
            </li>`
        )

        bg = !bg;
    });
}


ipcRenderer.on('consultarContactosResult', async (event, datos) => {


    contactosAsignados = datos;
    pintarContactos(datos)

    if (datos.length == 0) {

        $("#contactosDiv").html(
            `<div class="alert alert-primary text-center" role="alert">
                No hay contactos asignados aún
            </div>`
        );
    }
})

function marcarList(numero) {
    $("#numeroMarcar").val(numero)
    $("#numeroMarcar_").val(numero)
}
function modalidad() {
    if (agenteOk.bstnCanalId == "OBD") {
        
        if(agenteOk.btcasigancion == "M"){
            marcacionManual4 = true;
            $("#teclado_out").addClass("d-flex");
            $("#teclado_out").removeClass("d-none");
        }
    } else {

        marcacionCallback = true;
        $("#btnBuscarClienteOut").show()
        pintarBusquedaDeCliente()

    }
}


function validarCanales() {
    $('.canalesLLammadas').remove()
    $('.canalesLLammadas').removeAttr('onclick');
    areasOk.forEach(area => {
        if (area.btversioncanal == 'IBD') {
            $('#canalesLLammadas').after(
                '<button id="canalIBD" type="button" class="btn canalesLLammadas col btn-secondary">Inbound</button>'
            )
            $('#canalIBD').attr('onClick', 'cambiarCanal("IBD");');
        } else if (area.btversioncanal == 'OBD') {
            $('#canalesLLammadas').after(
                '<button id="canalOBD" type="button" class="btn canalesLLammadas col btn-secondary">Outbound</button>'
            )
            $('#canalOBD').attr('onClick', 'cambiarCanal("OBD");');
        }
    });

    if(areaIniciada=="OBD")
    {
        $('#eventoLlamada').after(
            '<button id="restablecer" type="button" class="btn canalesLLammadas col btn-secondary" >Restablecer agente</button>'
        )
        $('#restablecer').attr('onClick', 'restablecerAgente()');
    }

    $('#canal' + areaIniciada).removeClass("btn-secondary")
    $('#canal' + areaIniciada).addClass("btn-info")
}

function cambiarCanal(canal_) {
    if (canal_ != areaIniciada) {
        if (areaIniciada == "IBD") {
            $('#tituloCambiarCanal').html("Cambiar a Outbound")
        } else {
            $('#tituloCambiarCanal').html("Cambiar a Inbound")
        }
        $('#btnSiCambiar').removeAttr('onclick');
        $('#btnSiCambiar').attr('onClick', 'cambiarSiCanal("' + canal_ + '");');
        $('#confirmarCambio').modal("show")
    }
}

function cambiarSiCanal(canal) {
    $('body').html("")
    ipcRenderer.send('cambiarCanal', canal)
}

function cambiarConf() {
    var datosConf = {
        versTip: $("#versTip").val(),
        clienteAuto: $("#clienteAuto").val()
    }
    versTip = $("#versTip").val();
    clienteAuto = $("#clienteAuto").val();
    ipcRenderer.send('guardarConf', datosConf)
}

ipcRenderer.on('consultarConfTipificacionResult', (event, datos) => {
    preguntaCita = datos[0].pregunta
    if(datos[0].aceptaCita != "SI"){
        $("#btnCita").remove();
    }
})

ipcRenderer.on('getUsuarioResult', async (event, datos) => {
    $("#usuario").html(datos.usuario.usuarioid);
    ipcRenderer.send('getUsuarioModulos', datos.usuario.usuarioid)
    ipcRenderer.send('consultarActCRM', datos.usuario.usuarioid)
    versTip = datos.versTip;
    clienteAuto = datos.clienteAuto;
    let resultag =  await datos.agente.filter(a => a.bstnCanalId == $("#AREAINICIADA_").val())[0]
    agenteOk = resultag;
    urls = datos.urls;
    areasOk = datos.areas;
    areaIniciada = datos.areaIniciada;
    datosInbound = datos.inbound;
    datosOutbound = datos.outbound;
    ipcRenderer.send('consultarRespuestas', { campana: agenteOk.campana, canal: areaIniciada });
    ipcRenderer.send('consultarTipoRespuesta', '')
    ipcRenderer.send('consultarNumTransferencias', '')

    ipcRenderer.send('consultarConfTipificacion', obtenerVersionTip())
    leerConfi()
    
    $("#versTip").val(versTip);
    $("#clienteAuto").val(clienteAuto);
    validarCanales()
    if (areaIniciada == "OBD") {
        modalidad();
    }
    isOnline();
    if (agenteOk.estatusRec == "DIS") {
       connectarSipml();
    } else  if (agenteOk.estatusRec == "SOL") {
        terminarReceso();
        console.log("terminarReceso");
        //connectarSipml();
    }
    else {
        motivodsc = agenteOk.dscReceso;
        enReceso = true;
        var horaRecesoTiempo=agenteOk.horaReceso;
        if(horaRecesoTiempo==undefined){
            horaRecesoTiempo="00:00:00";
        }
        timpoReceso = horaRecesoTiempo;
        nombreAgente.innerHTML = "<span class='datosAgente mr-2'>Agente:</span>" + agenteOk.nombre;
        extAgente.innerHTML = "<span class='datosAgente mr-2'>Extensión:</span>" + agenteOk.extension;
        supervisorAgente.innerHTML = "<span class='datosAgente mr-2'>Supervisor:</span>" + agenteOk.supervisor;
        receso()
    }

    cmboEstadoPersonaBuscar()
})


function cerrarVentana() {

    if ($("#divOpen").hasClass("d-flex")) {
        $("#divOpen").removeClass("d-flex")
    }
    $("#divOpen").hide();
    $("#webview").remove();
    $("#divLlamada").show();
    $("#divLlamada").addClass("d-flex");
    $("#mydiv").addClass("d-none");
    $("#modulosCont").hide();
    $("#displayTipificacion").hide();
    $("#buscarCliente").hide();
    $("#quitarTipificacion").hide();
    $("#seleccionarCliente").hide();
    $("#webviewTipificacion").remove();
    $("#displayCliente").show();
    $("#displayScript").hide()
    $("#altadecitaContenedor").hide()
    $("#displayClienteNuevo").hide();
    $("#cancelarSeleccion").hide();
    if (enLlamada) {
        $("#displayLlamada").show()
    } else {
        $("#displayUsuario").show()
    }
    llenarDatosCliente(clienteSeleccionado);

}


function script() {
    //console.log(clienteSeleccionado)
    if ($.isEmptyObject(clienteSeleccionado)) {
        $("#alertPrincipal").html("<strong>Aviso.</strong> Es necesario tener un cliente Seleccionado");
        $("#alertPrincipal").fadeTo(3000, 500).slideUp(500, function () {
            $("#alertPrincipal").slideUp(2000);
        });
        return

    }

    if (!llamadaOk.camposReservados) {
        llamadaOk.camposReservados = [];
    }

    $("#quitarTipificacion").show()
    $("#displayTipificacion").show()
    $("#displayUsuario").hide()
    $("#buscarCliente").hide()
    if (versTip == "V1") {

        var url = urls.tipificacion + "?";

    } else if (versTip == "V2") {

        var url = urls.tipificacion2 + "?";
    }

    var parametros = "CNUSERID=" + usuarioOk.CNUSERID +
        "&CNMDLSID=" + "CRM" +
        "&CNOTRMID=" + "CRM00004" +
        "&CNOTRMVER=" + "1" +
        "&EJECUTIVO_TC=" + usuarioOk.CNUSERID +
        "&ID_TC=" + llamadaOk.idLlamada + "S" +
        "&TIPOMONITOREO_TC=" + obtenerCanal() +
        "&TELEFONO=" + llamadaOk.telefonoCliente +
        "&TIPOENCUESTA_TC=" + obtenerVersionScript() +
        "&RUTAIVR=" + formarIvr() +
        "&FECHASESIONINI=" + llamadaOk.fechaLlamada +
        "&FECHAINTERACCION=" + llamadaOk.fechaLlamada +
        "&HORASESIONINI=" + llamadaOk.horaLlamada +
        "&HORAINTERACCION=" + llamadaOk.horaLlamada +
        "&NOMBREPROPORCIONADO=" + encodeURI(clienteSeleccionado.nombrecompleto) +
        "&FOLIOCTE=" + clienteSeleccionado.id +
        "&P=" + reemplazaPalabras(llamadaOk.camposReservados).campos +
        "&PV=" + reemplazaPalabras(llamadaOk.camposReservados).palabras +
        "&IP=" + urls.ipCRM +
        "&ESTATUSFINALIZADO=" + "" +
        "&CAMPANAID=" + obtenerCampana();
    $("#displayTipificacion").html(
        '<webview id="webviewTipificacion" src="' + url + parametros + '" style="display:inline-flex; width:100%; height:100%;" localStorage="true" partition="persist:simplifica"></webview>'
    );
}

function tipificacion() {



    if(llamadaOk.idLlamada == undefined || llamadaOk.idLlamada == null || llamadaOk.idLlamada == ""){
        return;
    }
    if ($.isEmptyObject(clienteSeleccionado)) {
        $("#alertPrincipal").html("<strong>Aviso.</strong> Es necesario tener un cliente Seleccionado");
        $("#alertPrincipal").fadeTo(3000, 500).slideUp(500, function () {
            $("#alertPrincipal").slideUp(2000);
        });
        return
    }
    if (!llamadaOk.camposReservados) {
        llamadaOk.camposReservados = [];
    }
    $("#quitarTipificacion").show()
    $("#displayTipificacion").show()
    $("#displayUsuario").hide()
    $("#buscarCliente").hide()
    if (versTip == "V1") {

        var url = urls.tipificacion + "?";

    } else if (versTip == "V2") {

        var url = urls.tipificacion2 + "?";
    }
    var parametros = "CNUSERID=" + usuarioOk.CNUSERID +
        "&CNMDLSID=" + "CRM" +
        "&CNOTRMID=" + "CRM00004" +
        "&CNOTRMVER=" + "1" +
        "&EJECUTIVO_TC=" + usuarioOk.CNUSERID +
        "&ID_TC=" + llamadaOk.idLlamada +
        "&TIPOMONITOREO_TC=" + obtenerCanal() +
        "&TELEFONO=" + llamadaOk.telefonoCliente +
        "&TIPOENCUESTA_TC=" + obtenerVersionTip() +
        "&RUTAIVR=" + formarIvr() +
        "&FECHASESIONINI=" + llamadaOk.fechaLlamada +
        "&FECHAINTERACCION=" + llamadaOk.fechaLlamada +
        "&HORASESIONINI=" + llamadaOk.horaLlamada +
        "&HORAINTERACCION=" + llamadaOk.horaLlamada +
        "&NOMBREPROPORCIONADO=" + encodeURI(clienteSeleccionado.nombrecompleto) +
        "&FOLIOCTE=" + clienteSeleccionado.id +
        "&P=" + reemplazaPalabras(llamadaOk.camposReservados).campos +
        "&PV=" + reemplazaPalabras(llamadaOk.camposReservados).palabras +
        "&IP=" + urls.ipCRM +
        "&ESTATUSFINALIZADO=" + "" +
        "&CAMPANAID=" + obtenerCampana();
    $("#displayTipificacion").html(
        '<webview id="webviewTipificacion" src="' + url + parametros + '" style="display:inline-flex; width:100%; height:100%;" localStorage="true" partition="persist:simplifica"></webview>'
    );
}

function reemplazaPalabras(camposResv) {
    var campos = "";
    var palabras = "";
    camposResv.forEach((campo, index) => {
        if (index != camposResv.length - 1) {
            campos += campo.sptcamposcriptpr + ",";
            palabras += campo.sptcamposcriptvalor + ",";
        } else {
            campos += campo.sptcamposcriptpr;
            palabras += campo.sptcamposcriptvalor;
        }
    });
    var p = { palabras, campos }
    return p;
}

function obtenerCanal() {

    if (areaIniciada == "IBD") {
        return 1;
    } else if (areaIniciada == "OBD") {
        if (agenteOk.bstnCanalIdAsignado == "OBD") {
            return 2;
        } else if (agenteOk.bstnCanalIdAsignado == "CALL") {
            return 9;
        }
    }
}

function obtenerCampana() {

    if (areaIniciada == "IBD") {
        if(clienteSeleccionado.campana == undefined || clienteSeleccionado.campana == "undefined")
        {
            return '1008';
        }
        else
        {
            return clienteSeleccionado.campana;
        }
    } else if (areaIniciada == "OBD") {
        return llamadaOk.btAgenteCmpId;
    }
}

function obtenerVersionTip() {
    if (areaIniciada == "IBD") {
        return datosInbound.tipificacion;
    } else if (areaIniciada == "OBD") {
        return agenteOk.scrip;
    }
}

function obtenerVersionScript() {
    if (areaIniciada == "IBD") {
        return agenteOk.scrip;
    } else if (areaIniciada == "OBD") {
        return agenteOk.scrip;
    }
}

function quitarTipificacion() {
    $("#displayTipificacion").hide()
    $("#buscarCliente").hide()
    $("#quitarTipificacion").hide()
    $("#webviewTipificacion").remove()
    if (oSipSessionCall) {
        $("#displayUsuario").hide()
        $("#displayLlamada").show()

    } else {
        $("#displayUsuario").show()
        $("#displayLlamada").hide()
    }
}

function formarIvr() {
    var cadenaIvr = llamadaOk.RutaIvr ? llamadaOk.RutaIvr : "";
    var rutaivr1 = cadenaIvr.replace("|", "-");
    rutaivr1 = rutaivr1.replace(/ /g, "_");
    return rutaivr1;
}

function cerrarScrip() {
    if (versTip == "V1") {
        var url = urls.tipificacion + "?";
    } else if (versTip == "V2") {
        var url = urls.tipificacion2 + "?";
    }
    var parametros = "CNUSERID=" + usuarioOk.CNUSERID +
        "&CNMDLSID=" + "CRM" +
        "&CNOTRMID=" + "CRM00004" +
        "&CNOTRMVER=" + "1" +
        "&EJECUTIVO_TC=" + usuarioOk.CNUSERID +
        "&ID_TC=" + llamadaOk.idLlamada + "S" +
        "&TIPOMONITOREO_TC=" + obtenerCanal() +
        "&TELEFONO=" + llamadaOk.telefonoCliente +
        "&TIPOENCUESTA_TC=" + obtenerVersionScript() +
        "&FECHASESIONFIN=" + datos.fecha +
        "&HORASESIONFIN=" + datos.hora +
        "&NOMBREPROPORCIONADO=" + encodeURI(clienteSeleccionado.nombrecompleto) +
        "&FOLIOCTE=" + clienteSeleccionado.id +
        "&IP=" + urls.ipCRM +
        "&ESTATUSFINALIZADO=FINALIZADO";
    $("#divOpen2").html(
        '<webview id="webview_" src="' + url + parametros + '" style="display:inline-flex; width:100%; height:100%;"></webview>'
    );
}



function cerrarTipificacion(datos) {
    
    if (versTip == "V1") {
        var url = urls.tipificacion + "?";
    } else if (versTip == "V2") {
        var url = urls.tipificacion2 + "?";
    }
    var parametros = "CNUSERID=" + usuarioOk.CNUSERID +
        "&CNMDLSID=" + "CRM" +
        "&CNOTRMID=" + "CRM00004" +
        "&CNOTRMVER=" + "1" +
        "&EJECUTIVO_TC=" + usuarioOk.CNUSERID +
        "&ID_TC=" + llamadaOk.idLlamada +
        "&TIPOMONITOREO_TC=" + obtenerCanal() +
        "&TELEFONO=" + llamadaOk.telefonoCliente +
        "&TIPOENCUESTA_TC=" + obtenerVersionTip() +
        "&FECHASESIONFIN=" + datos.fecha +
        "&HORASESIONFIN=" + datos.hora +
        "&NOMBREPROPORCIONADO=" + encodeURI(clienteSeleccionado.nombrecompleto) +
        "&FOLIOCTE=" + clienteSeleccionado.id +
        "&IP=" + urls.ipCRM +
        "&ESTATUSFINALIZADO=FINALIZADO";
    $("#divOpen2").html(
        '<webview id="webview_" src="' + url + parametros + '" style="display:inline-flex; width:100%; height:100%;"></webview>'
    );


    llamadaOk = {};
    clienteSeleccionado = {}
}

function checkDecimal(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

function verAplicacion(nodo) {
    let liga = nodo.CNESMNRUDS + '/' + nodo.CNESMNOBJ 
    let ligadiv = liga.split(".");
    if( ligadiv[ligadiv.length-1].toLowerCase() == "pdf"){
        ipcRenderer.send('abrirPDF', liga)
    }else{

        liga = liga + '?CNUSERID=' + usuarioOk.CNUSERID ;
        abrirVentana()
        $("#divOpen").html(
            '<webview id="webview"  src="' + liga + '" style="display:inline-flex; width:100%; height:100%;" plugins></webview>'
        );
    }
}

function abrirCorreo(nodo) {
    abrirVentana()
    $("#divOpen").html(
        '<webview id="webview" plugins src="' + urls.mail + '?CNUSERID=' + usuarioOk.CNUSERID + '" style="display:inline-flex; width:100%; height:100%;"></webview>'
    );
}

function abrirCorreo_(mail) {
    abrirVentana()
    $("#divOpen").html(
        '<webview id="webview" src="' + urls.mail + '?CNUSERID=' + usuarioOk.CNUSERID + '&emailCliente=' + mail + '" style="display:inline-flex; width:100%; height:100%;"></webview>'
    );
}

$("#exampleModal").on('shown.bs.modal', function () {
    ipcRenderer.send('consultaTipoReceso', "")
    ipcRenderer.send('consultarMovimientos', usuarioOk.CNUSERID)
    Timer();
});

function solicitarReceso() {
    var objRec = {};
    objRec.usuario = usuarioOk.CNUSERID
    objRec.idLlamada = $("#texto").text();
    objRec.itpoRec = document.getElementById("inputGroupSelect04").value;
    objRec.descRec = document.getElementById("inputGroupSelect04").selectedOptions[0].innerText;
    objRec.estatusSol = "SOL"
    ipcRenderer.send('solicitarReceso', objRec)
}

ipcRenderer.on('consultarMovimientosResult', (event, datos) => {
    entroaReceso = true;
    var entro = true;
    var datosLit = datos.valor;
    var list = " <a  class='list-group-item list-group-item-action active' style='background: #28a745; border-color: #28a745;'>Movimiento del agente </a>";
    if (datos.tiempoTotalReceso != null)
        $("#recesoAcomulado").html("Receso acumulado:<br> " + datos.tiempoTotalReceso);
    query = datos.tiempoTotalEfectivo;
    if (datos.tiempoTotalEfectivo != null) {
        $("#tiempoEfectivo").html("Tiempo acumulado:<br> " + datos.tiempoTotalEfectivo);
        inicio = false;
        d = new Date();
        segundos = 0;
       //clearInterval(myVar)
        var myVar = setInterval(tiempoEfectivo, 1000);
    }
    for (var i = 0; i < datosLit.length; i++) {
        if (datosLit[i].idReceso == "SBSC" && entro) {
            $("#ingresoSistema").html("Ingreso al sistema: " + datosLit[i].horaInicial);
            tiempoEnSesion(datos.horaActual, datosLit[i].horaInicial);
            entro = false;
        }
        var inicial = new Date(datosLit[i].fechaInicial);
        var dd = String(inicial.getDate()).padStart(2, '0');
        var mm = String(inicial.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = inicial.getFullYear();
        inicial = dd + '/' + mm + '/' + yyyy;
        if (datosLit[i].fechaFinal != null) {
            var final = new Date(datosLit[i].fechaFinal);
            var ddF = String(final.getDate()).padStart(2, '0');
            var mmF = String(final.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyyF = final.getFullYear();
            final = ddF + '/' + mmF + '/' + yyyyF;
            var hfinal = datosLit[i].horaFin
        }
        else {
            var final = "";
            var hfinal = "";
        }
        var hfinalOK=hfinal;
        if(hfinal==null){
            hfinalOK="";
        }
        list += "<li class='list-group-item'>" + datosLit[i].descTipoReceso + " " + inicial + " " + datosLit[i].horaInicial + " - " + final + " " + hfinalOK + "</li>";
    }
    document.getElementById("listaMovi").innerHTML = list;
})

ipcRenderer.on('solicitarRecesoResult', (event, datos) => {
    $('#exampleModal').modal('hide');
    solicitarRecAnterior = "SOL";

        $("#alertPrincipal").html("<strong>Aviso.</strong> Solicitud de receso enviada");
        $("#alertPrincipal").fadeTo(2000, 500).slideUp(500, function () {
            $("#alertPrincipal").slideUp(500);
        });

    entroaReceso = false;
})

/*Timer de tiempo acumulado*/
function tiempoEfectivo() {
    if (!inicio) {
        query = query.split(":");
        d.setHours(query[0]);
        d.setMinutes(query[1])
        d.setSeconds(query[2])
        inicio = true;
    } else {
        d.setSeconds(segundos)
    }
    document.getElementById("tiempoEfectivo").innerHTML = "Tiempo acumulado:<br> " + LeadingZero(d.getHours()) + ":" + LeadingZero(d.getMinutes()) + ":" + LeadingZero(d.getSeconds());
    segundos = d.getSeconds() + 1;
}

ipcRenderer.on('consultaTipoRecesoResult', (event, datos) => {
    var datosCmb = datos.valor;
    var cadena = "";
    for (var i = 0; i < datosCmb.length; i++) {
        if (datosCmb[i].id != "SBSC" && datosCmb[i].id != "SAGT" && datosCmb[i].id != "SIPP" && datosCmb[i].id != "SICH")
            cadena += "<option value=" + datosCmb[i].id + ">" + datosCmb[i].rCorto + "</option>";
    }
    document.getElementById("inputGroupSelect04").innerHTML = cadena;
})

this.tomarReceso = function () {
    if (!oSipSessionCall) {

        objRec = {};
        objRec.usuario = usuarioOk.CNUSERID
        objRec.idLlamada = $("#texto").text();
        objRec.motivoid = this.motivoid;
        objRec.motivodsc = this.motivodsc
        objRec.estatusAgente = "RES"
        ipcRenderer.send('tomarReceso', objRec)
        motivoDesco = "Receso"
        sipUnRegister();
    }

}


ipcRenderer.on('tomarRecesoResult', (event, datos) => {
    autorizado = false;
    enReceso = true;
    $("#success-alert").html("<strong>Aviso.</strong> Salir a receso");
    $("#success-alert").fadeTo(2000, 500).slideUp(500, function () {
        $("#success-alert").slideUp(500);
    });

    document.getElementById("btnTomarRec").style.display = "none"

    $("#tituloPausa").html("Agente en: " + this.motivodsc);
    $("#btnTerminarReceso").attr("onclick", "terminarReceso()");
    //datos.spcwtrcsfechaini

    inicioPausa = new Date().getTime();; //asignamos el tiempo de inicio de receso para que se pueda comparar el tiempo

    tiempoEnPausa();

    $("#pausaModal").modal({
        backdrop: "static",
        keyboard: false
    });
    setTimeout(() => {
        ipcRenderer.send('cerrarSesion_', "")
    }, 1000);


})

receso = function () {
    autorizado = false;
    $("#success-alert").html("<strong>Aviso.</strong> Salir a receso");
    $("#success-alert").fadeTo(2000, 500).slideUp(500, function () {
        $("#success-alert").slideUp(500);
    });

    document.getElementById("btnTomarRec").style.display = "none"

    $("#tituloPausa").html("Agente en: " + this.motivodsc);
    $("#btnTerminarReceso").attr("onclick", "terminarReceso()");

    inicioPausa = new Date();
    if (timpoReceso != "") {
        pausPart = timpoReceso.split(":")
        inicioPausa.setHours(pausPart[0]);
        inicioPausa.setMinutes(pausPart[1]);
        inicioPausa.setSeconds(pausPart[2]);
    }
    tiempoEnPausa();

    $("#pausaModal").modal({
        backdrop: "static",
        keyboard: false
    });
}


this.Timer = function () {
    setInterval(consultaRecesoAuto, 4000);
    if(constimer == false)
    {
        if(timeoutRecesos !=null){
            clearTimeout( timeoutRecesos );
        }
        timeoutRecesos = setInterval(consultaRecesoAuto, 4000);
        constimer = true;	
    }
    else
    {
        clearTimeout( timeoutRecesos );
        timeoutRecesos =null;
        constimer = false;		
    }
}
this.consultaRecesoAuto = function () {
    ipcRenderer.send('consultaRecesoAuto', usuarioOk.CNUSERID, canalesM)
}

this.terminarReceso = function () {
    document.getElementById("btnTerminarReceso").style.display = "none";
    $(".loader").show();
    var agenteidReceso=usuarioOk.CNUSERID;
    if(agenteidReceso==undefined){
        agenteidReceso= agenteOk.id;
    }
    ipcRenderer.send('terminarReceso', agenteidReceso);

}

ipcRenderer.on('terminarRecesoResult', (event, datos) => {
    console.log("terminarRecesoResult");
    ipcRenderer.send('recargarPantalla', "");
})

function tiempoEnPausa() {
    // obteneos la fecha actual
    var actual = new Date().getTime();

    // obtenemos la diferencia entre la fecha actual y la de inicio
    var diff = new Date(actual - inicioPausa);

    // mostramos la diferencia entre la fecha actual y la inicial
    var result = LeadingZero(diff.getUTCHours()) + ":" + LeadingZero(diff.getUTCMinutes()) + ":" + LeadingZero(diff.getUTCSeconds());
    document.getElementById('tiempoPausa').innerHTML = result;

    // Indicamos que se ejecute esta función nuevamente dentro de 1 segundo
    if (enReceso)
        setTimeout("tiempoEnPausa()", 1000);
}

function tiempoEnSesion(horaActual, horaSesion) {

    horaActualPart = horaActual.split(":")
    var actual = new Date();
    actual.setHours(horaActualPart[0]);
    actual.setMinutes(horaActualPart[1]);
    actual.setSeconds(horaActualPart[2]);

    var horaSec = new Date();

    horaSesionPart = horaSesion.split(":")
    horaSec.setHours(horaSesionPart[0]);
    horaSec.setMinutes(horaSesionPart[1]);
    horaSec.setSeconds(horaSesionPart[2]);


    // obtenemos la diferencia entre la fecha actual y la de inicio
    var diff = new Date(actual - horaSec);

    // mostramos la diferencia entre la fecha actual y la inicial


    var result = LeadingZero(diff.getUTCHours()) + ":" + LeadingZero(diff.getUTCMinutes()) + ":" + LeadingZero(diff.getUTCSeconds());
    $("#tiempoSesion").html("Tiempo en sesion: <br> " + result); //
    if (query == null) {
        $("#tiempoEfectivo").html("Tiempo acumulado: <br> " + result);
    }

    // Indicamos que se ejecute esta función nuevamente dentro de 1 segundo
    if (entroaReceso) {
        var actualMas1 = LeadingZero(actual.getHours()) + ":" + LeadingZero(actual.getMinutes()) + ":" + LeadingZero(actual.getSeconds() + 1);
        setTimeout("tiempoEnSesion('" + actualMas1 + "','" + horaSesion + "')", 1000);
    }

}




/* Funcion que pone un 0 delante de un valor si es necesario */
function LeadingZero(Time) {
    return (Time < 10) ? "0" + Time : +Time;
}

//FUNCION PARA VALIDAR SI HAY INTERNET
function isOnline() {
    const isOnline = require('is-online');

    // navigator.onLine
    isOnline().then(online => {
        if (online) {
            alertaConexionIncio(true, "inicio")
        }
        else {
            alertaConexionIncio(false, "inicio")
        }
    });
}

ipcRenderer.on('consultaRecesoAutoResult', (event, datos) => {
    objRe = datos.valor;
    objReMDE= datos.valorMDE;
    var recesoMDE ="0";

    try  {
        recesoMDE = objReMDE[0].atencion ;
    } catch (err){} 

    if (objRe[0].BTESTAGNTT == "SOLAUT" && !autorizado) {
        if(recesoMDE.toString() == "0" ){
        autorizado = true;
        clearTimeout( timeoutRecesos );    
        document.getElementById("solicitarRec").style.display = "none"
        document.getElementById("btnTomarRec").style.display = "block";
        this.motivodsc = objRe[0].BTESTAGNTMOTIVO;
        this.motivoid = objRe[0].BTESTAGNTMOTIVOID;
        tomarReceso();

        $("#alertPrincipal").html("<strong>Aviso.</strong> Solicitud de " + this.motivodsc + " fue autorizado.");
        document.getElementById("alertPrincipal").style.display = "block";
    }


    }
    else if (objRe[0].BTESTAGNTT == "DIS" && solicitarRecAnterior == "SOL") {
        solicitarRecAnterior = "";
        $("#alertPrincipal").html("<strong>Aviso.</strong> Solicitud de " + objRe[0].BTESTAGNTMOTIVO + " fue rechazado.");
        $("#alertPrincipal").fadeTo(16000, 500).slideUp(500, function () {
            $("#alertPrincipal").slideUp(16000);
        });
    }
})

function abrirVentana() {

    if ($("#divLlamada").hasClass("d-flex")) {
        $("#divLlamada").removeClass("d-flex")
    }
    $("#divLlamada").hide()
    $("#divOpen").show()
    $("#webview").remove()
    $("#divOpen").addClass("d-flex")

    if ($("#mydiv").hasClass("d-none") && oSipSessionCall) {
        $("#mydiv").removeClass("d-none")
    }
    $("#mydiv").css("top", $("body").height() - 510)
    $("#mydiv").css("left", "15px")

}

function modulosToggle() {
    if ($('#modulosCont').is(':visible')) {
        $("#modulosCont").hide()
    } else {
        $("#modulosCont").show()
    }
}

async function cerrarSesion() {
    ipcRenderer.send('CerrarSesion', { idAgente: usuarioOk.CNUSERID, tipoCierre: "PRECIERRE_SESION", canal:obtenerCanal()})
}

ipcRenderer.on('CerrarSesionResult', async (event, arg) => {
    if (arg == "ok") {
        motivoDesco = "cierreSesion"
        await sipUnRegister();
        ipcRenderer.send('cerrarSesion_', "")
    } else if (arg == "PRECIERRE_SESION") {
        precierre = true;
        $("#alertPrincipal").html("<strong>Aviso.</strong> Tiene una llamada asignada, al terminar la llamada el sistema realizara el cierre de sesión");
        $("#alertPrincipal").fadeTo(16000, 500).slideUp(500, function () {
            $("#alertPrincipal").slideUp(16000);
        });
    }
})

function clicActividades(obj, cliente, canal, folio) {
    if (canal == 13) {
        ipcRenderer.send('consultarCorreos_', cliente, folio)
    }
}

ipcRenderer.on('consultarCorreos_Result', (event, datos) => {
    $("#display" + datos.folio).html("")
    datos.correos.forEach((mail) => {
        $("#display" + datos.folio).append(
            `<li onclick="abrirCorreo_('${mail.BTCLIENTECORREO}')"style="cursor:pointer" class="list-group-item text-info" title="Enviar correo ${mail.BTCLIENTECORREO} ">${mail.BTCLIENTECORREO}</li>`
        )
    })
})

function completarAct(cliente, folio) {
    ipcRenderer.send('completarActividad', { cliente, folio })
}

ipcRenderer.on('completarActividadResult', (event, datos) => {
    ipcRenderer.send('consultarActCRM', agenteOk.id)
})

ipcRenderer.on('consultarActCRMResult', (event, datos) => {


    if (datos.length == 0) {
        mostrarTeclado()
        $("#actividadesPendientes").html(
            `<div class="alert alert-primary" role="alert">
                No hay actividades siguientes
            </div>`
        );

    } else {

        $("#actividadesPendientes").html("");
        datos.forEach((act) => {

            let btnCompleto = `<a onclick="completarAct(${act.numeroCliente}, ${act.folio})" href="#" class="btn btn-info">Completar</a>`;

            let bg = '<h5 class="text-info px-2"><span class="icon-minus"></span></h5>';
            if (act.estatusId == 1) {
                bg = '<h5 title="Incompleto" class="text-danger px-2"><span class="icon-checkbox-unchecked"></span></h5>';
            } else if (act.estatusId == 2) {
                bg = '<h5 title="Por completar" class="text-warning px-2"><span class="icon-hour-glass"></span></h5>';
            } else if (act.estatusId == 3) {
                bg = '<h5 title="Completo" class="text-success px-2"><span class="icon-checkbox-checked"></span></h5>';
                btnCompleto = ``;
            }
            $("#actividadesPendientes").append(`
                <div class="card  border-dark mb-1" >
                <div onclick="clicActividades( this, ${act.numeroCliente} ,${act.canal}, ${act.folio})" style="cursor:pointer" class="card-header bg-dark px-1 text-left" data-toggle="collapse" href="#collapse-${act.folio}" role="button" aria-expanded="false" aria-controls="collapse-${act.folio}">
                    <div class="d-flex ">${bg} <h6>${(act.fecha + " " + act.hora)}</h6>
                    </div>
                    <h5 class="text-ligth px-1">${act.actividad}</h5>
                </div>
                <div class="collapse" id="collapse-${act.folio}">
                <div class="card-body text-dark text-left">
                    <p class="card-text mb-1">${act.otros}</p>
                    <p class="card-text mb-1">Cliente: ${act.numeroCliente + " - " + act.nombreCliente}</p>
                    <ul id="display${act.folio}" class="list-group my-2">
                    </ul>
                    ${btnCompleto} 
                </div>
                </div>
                </div>
            `)
        })

    }





})



function filtrarRespuestas() {
   const result = tipoDeRespuestas.filter(tipo => tipo.bstrttipo == $("#selectRespTipo").val()); 
   $("#listRespuestas").html("");
   result.forEach((resp) => {
    $("#listRespuestas").append(`<option value="${resp.bstrtId}">${resp.bstrtDsc}</option>`)
   })

   verScript()
    
}


var lista="";

ipcRenderer.on('consultarTipoRespuestaResult', (event, datos) => {
    lista="";
    try  {
    $("#selectRespTipo").html("")
    datos[0].tipoResp.forEach((tipo) => {
        $("#selectRespTipo").append(`<option value="${tipo.bstrttId}">${tipo.bstrttTipo}</option>`)
    })
} catch (err){}
try  {
    if(datos[1].lista != undefined && datos[1].lista !=""){
        lista=datos[1].lista; }
     } catch (err){}
    filtrarRespuestas();
})


function verScript() {
    try  {
        if(lista != undefined && lista !=""){
          $("#listRespuestas").val(lista)} 
        } catch (err){}
        
    //const result = tipoDeRespuestas.filter(tipo => tipo.bstrtId == id)[0];
    const result = tipoDeRespuestas.filter(tipo => tipo.bstrtId == $("#listRespuestas").val()[0])[0];

   // const result = tipoDeRespuestas.filter(tipo => tipo.bstrtId == $("#listRespuestas").val())[0];
    $("#preguntaTitulo").html(result.bstrtDsc);
    $("#respuestaText").html(result.bstrtrrespTipo);

   
}

function traerScrip(){

    if(!$("#displayScript").is(":visible")){
        $("#displayScript").show()
        $("#displayCliente").hide();
    }else{
        $("#displayScript").hide()
        $("#displayCliente").show();
    }
    ipcRenderer.send('consultarRespuestas', { campana: agenteOk.campana, canal: areaIniciada });
    ipcRenderer.send('consultarTipoRespuesta', '')
}


ipcRenderer.on('consultarNumTransferenciasResult', (event, datos) => {

    $("#transferenciasCombo").html("")
    datos.forEach((dato) => {
        $("#transferenciasCombo").append(`<option value="${dato.TEL}">${dato.DSC}</option>`)
    })

})






ipcRenderer.on('consultarRespuestasResult', (event, datos) => {
    
    if (datos.length == 0) {
        $("#verRespuestasTipoP").remove();
    }

    tipoDeRespuestas = datos;
    $("#listRespuestas").html("");
    datos.forEach((resp) => {
        $("#listRespuestas").append(`
            <li onclick="verScript(${resp.bstrtId})" class="list-group-item" style="cursor: pointer;">
                <div style="font-weight: 700;">${resp.bstrtDsc}</div>
                <div style="width: 100%; text-overflow: ellipsis; white-space: nowrap; overflow: hidden;">${resp.bstrtrrespTipo}</div>
            </li>
        `)
    })
})




function cambiarVolumen(){

    ringbacktone.volume = $("#volumenTimbre").val() ;
    ringtone.volume = $("#volumenTimbre").val() ;
    dtmfTone.volume = $("#volumenTimbre").val() ;


}


function connectarWebSoket(){
    let puesto = ""
    if(obtenerCanal() != 1){
        puesto = "AGENTE_CLIENTE_SERVIDOR";
       // ipcRenderer.send('consultarCampanaOC', { agenteid:agenteOk.id  })

    }else{
        puesto = "AGENTE_CLIENTE_SERVIDOR_INB";
    //    ejecutarWebSocket(puesto,'');
    }
    
    ejecutarWebSocket(puesto );
}


ipcRenderer.on('consultarCampanaOCResult', async (event, datos) => {
    if(datos.length == 0 ){
        ejecutarWebSocket("AGENTE_CLIENTE_SERVIDOR",'');
    }else{       
        ejecutarWebSocket("AGENTE_CLIENTE_SERVIDOR", datos[0].campanaPertenece);
    }
   
})


function ejecutarWebSocket(puesto){   
   // debug de socket
    //socket = new io.connect( "http://localhost:2001", { query: 'username=' + agenteOk.id + '&puesto=' + puesto + 

   socket = new io.connect( urls.dirCRM + ':' + "2001", { query: 'username=' + agenteOk.id + '&puesto=' + puesto + 
    "&ext=" + agenteOk.extension + "&campana=" + agenteOk.campana});

    socket.on("disconnect", async function() {
        //location.reload();
        console.log("client disconnected from server");
    });
    socket.on('connect', function() {
        console.log("Successfully connected!");
        if(oSipSessionCall){
            estatus = "EN LLAMADA"
        }
        $("#usuario").html(usuarioOk.CNUSERID +" - " +usuarioOk.CNUSERDSC + " ("+ estatus +") " );
        socket.emit('cambioEstatusAgente', {estatus: estatus, agenteOk, areaIniciada});
    });

    socket.on('cerrarSesionAgenteResult', function() {
        console.log("Successfully connected!");
        if(!oSipSessionCall){        
            cerrarSesion();   
        }      
    });

    
    socket.on('solicitarEstatusAgentes2', function(datos) {
        if(oSipSessionCall){
            estatus = "EN LLAMADA"
        }
        socket.emit('cambioEstatusAgente', {estatus: estatus, agenteOk, areaIniciada});
    });

    socket.on('verificarDisp_2', async function(datos) {

        if(!oSipSessionCall){
            let result = await areasOk.filter(area => area.btversioncanal == "OBD" );
            if(result.length> 0){
                sipUnRegister();
                ipcRenderer.send('actulizarAgente', { IdAgente: usuarioOk.CNUSERID, estatus: "NO DISPONIBLE", areaIniciada })
                setTimeout(() => {
                    cambiarSiCanal("OBD")
                }, 1000);
            }
        }
        
    });



    socket.on('seMovioUnaCita_', function(idLlamada) {

        //alert(idLlamada)
        if(idLlamada == llamadaOk.idLlamada){
            if($("#displayTipificacion").is(":visible")){
                tipificacion()
            }
        }
        
    });

    socket.on('datosLlamadaAgt', function(datos) {
        llamadaEjec = datos;
        //console.log(datos);
    });

    socket.on('generandoLlamada', function(datos) {
        estatus = "EN ESPERA";
        $("#usuario").html(usuarioOk.CNUSERID +" - " +usuarioOk.CNUSERDSC + " ("+ estatus +") " );
    });

    socket.on('generandoLlamadaNo', function(datos) {
        estatus = "DISPONIBLE"
        $("#usuario").html(usuarioOk.CNUSERID +" - " +usuarioOk.CNUSERDSC + " ("+ estatus +") " );
        socket.emit('cambioEstatusAgente', {estatus: estatus, agenteOk, areaIniciada});
    });

    
   

}


var lenguajeEsp = {
    "sProcessing": "Procesando...",
    "sLengthMenu": "Mostrar _MENU_ registros",
    "sZeroRecords": "No se encontraron resultados",
    "sEmptyTable": "Ning&uacute;n dato disponible en esta tabla",
    "sInfo": "   _TOTAL_ registros",
    "sInfoEmpty": "  0 registros",
    "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
    "sInfoPostFix": "",
    "sSearch": "Buscar:",
    "sUrl": "",
    "sInfoThousands": ",",
    "sLoadingRecords": "Cargando...",
    "oPaginate": {
        "sFirst": "Primero",
        "sLast": "Último",
        "sNext": "Siguiente",
        "sPrevious": "Anterior"
    },
    "oAria": {
        "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
        "sSortDescending": ": Activar para ordenar la columna de manera descendente"
    }

}

ipcRenderer.on('seCerroCRM', async (event, datos) => {

   //tipificacion()

})
function verPantallaCRM(){
    if (!$.isEmptyObject(clienteSeleccionado)  && !$.isEmptyObject(llamadaOk)) {
        ipcRenderer.send('verPantallaCRM', urls.dirCRMPANTALLA + "?CNUSERID=" + agenteOk.id + "&IDCLIENTE=" + clienteSeleccionado.id + "&IDLLAMADANUEVA=" + llamadaOk.idLlamada )
    }else{
        $("#alertPrincipal").html("<strong>Aviso.</strong> Necesita estar en llamada y tener una persona seleccionada");
        $("#alertPrincipal").fadeTo(3000, 500).slideUp(500, function () {
            $("#alertPrincipal").slideUp(2000);
        });
    }
}

function abrirAltaCita(){
   // ipcRenderer.send('consultarTipificacionLlamada',  { id:  "1586194297.13540", preguntaCita, tipificacion: obtenerVersionTip() })
   if (!$.isEmptyObject(llamadaOk)) {
        ipcRenderer.send('consultarTipificacionLlamada', { id:llamadaOk.idLlamada , preguntaCita, tipificacion: obtenerVersionTip() })
    }else{
        $("#alertPrincipal").html("<strong>Aviso.</strong> Necesita estar en llamada");
        $("#alertPrincipal").fadeTo(3000, 500).slideUp(500, function () {
            $("#alertPrincipal").slideUp(2000);
        });
    }
}

ipcRenderer.on('consultarTipificacionLlamadaResult', async (event, datos) => {
    if(datos.length == 0 ){
        $("#alertPrincipal").html("<strong>Aviso.</strong> Es necesario por lo menos un FUB y tipificacion");
        $("#alertPrincipal").fadeTo(3000, 500).slideUp(500, function () {
            $("#alertPrincipal").slideUp(2000);
        });
        return;
    }
    let result = await datos.filter(cliente => 
        (cliente.cita  == "SI"  && cliente.folioFubUnico != "NOTINEFUB") ||
        (cliente.cita  == "REPROGRAMACION")  );
    if(result.length > 0){
        verAltaDeCita(result)
    }else if(datos[0].cita==null ) {
        
        $("#alertPrincipal").html("<strong>Aviso.</strong> Es necesario por lo menos una tipificacion y capturar Campo: ¿Se genera cita?  ");
        $("#alertPrincipal").fadeTo(3000, 500).slideUp(500, function () {
            $("#alertPrincipal").slideUp(2000);
        });
        return;

    }else if(datos[0].folioFubUnico== "NOTINEFUB" ) {
        
        $("#alertPrincipal").html("<strong>Aviso.</strong> Es necesario por lo menos un FUB");
        $("#alertPrincipal").fadeTo(3000, 500).slideUp(500, function () {
            $("#alertPrincipal").slideUp(2000);
        });
        return;

   }else{
        $("#alertPrincipal").html("<strong>Aviso.</strong>Campo: ¿Se genera cita? tiene valor NO/CANCELACIÓN");
        $("#alertPrincipal").fadeTo(3000, 500).slideUp(500, function () {
            $("#alertPrincipal").slideUp(2000);
        });
    }
})



var sucursales = []
function cmboEstadoPersonaBuscar() {

   ipcRenderer.send('consultarEstados', "")
}


ipcRenderer.on('consultarEstadosResult', async (event, datos) => {
    cmboEstadoPersona(datos)

})

function cmboEstadoPersona(datos) {
    $("#comboEstadoPersona").html("")
    $("#comboEstadoPersona").append(`<option value="NOSELECT">Seleccione un estado</option>`)
    datos.forEach(e => {
        $("#comboEstadoPersona").append(`<option value="${e.ID}">${e.DSC}</option>`)
    });
    $("#comboEstadoPersona").val(datos[0].ID)
    ipcRenderer.send('consultarCombosCliente');

}

ipcRenderer.on('consultarCombosClienteResult', async (event, datos) => {
    consultarCombosCliente(datos)

})

function consultarCombosCliente(datos) {
    $("#REGIMENInput").html("");
    $("#sectorInput").html(""); 
    $("#edadInput").html(""); 
    $("#GeneroInput").html(""); 
    $("#ActividadInput").html("");
    $("#MedioInput").html("");
    MedioInput
    datos["regimen"].forEach(e => {
        $("#REGIMENInput").append(`<option value="${e.ID}">${e.DSC}</option>`)
    });
    datos["sector"].forEach(e => {
        $("#sectorInput").append(`<option value="${e.ID}">${e.DSC}</option>`)
    });
    datos["edad"].forEach(e => {
        $("#edadInput").append(`<option value="${e.ID}">${e.DSC}</option>`)
    });
    datos["genero"].forEach(e => {
        $("#GeneroInput").append(`<option value="${e.ID}">${e.DSC}</option>`)
    }); 
    datos["actividad"].forEach(e => {
        $("#ActividadInput").append(`<option value="${e.ID}">${e.DSC}</option>`)
    });
    datos["medio"].forEach(e => {
        $("#MedioInput").append(`<option value="${e.ID}">${e.DSC}</option>`)
    });
}


function cmboMuncipioPersonaBuscar() {
    ipcRenderer.send('consultarMunicipio', $("#comboEstadoPersona").val())
}

ipcRenderer.on('consultarMunicipioResult', async (event, datos) => {
    cmboMuncipioPersona(datos)

})

function cmboMuncipioPersona(datos) {
    $("#comboMunicipioPersona").html("")
    datos.forEach(e => {
        $("#comboMunicipioPersona").append(`<option value="${e.ID}">${e.DSC}</option>`)
    });
    setTimeout(() => {
        try {
            $("#comboMunicipioPersona").val(datos[0].ID)
          } catch (error) {           
          }
          
       
    }, 1000);
    
}




function sucursalesPersona() {
    const result = sucursales.filter(suc => suc.FNCOFIID == $("#comboMunicipioPersona").val().split("-")[1])[0];
    $("#comboSucursalesPersona").val(0)
}

function leerConfi(){
    ipcRenderer.send('leerConfi', "")
}

ipcRenderer.on('leerConfiResult',  async(event, conexiones) => {

    let resultag =  await conexiones.filter(cnn => cnn.select == true)[0]
    $("#server_").html(resultag.nombre)
    console.log(resultag)
})


ipcRenderer.send('getVersion', "")

ipcRenderer.on('getVersionResult',  async(event, vers) => {
  $("#version").html("Versión " + vers)
})

ipcRenderer.send('insertarCanal', '')

ipcRenderer.on('insertarCanalResult', async (event, canal) => {
    ipcRenderer.send('estatusExtension', canal)
});














