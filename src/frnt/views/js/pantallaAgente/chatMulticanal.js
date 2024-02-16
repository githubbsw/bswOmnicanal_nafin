require('popper.js');
var canalesM = "";
var agente = {};
var agenteActual = {}
var sisVar = {};
var medidaIndica = 40;
var opcPrcSMS = [];
var timer;



$('#modalSMS').on('show.bs.modal', function (event) {
	var modal = $(this)
	if (oSipSessionCall) {
		modal.find('.modal-title').text("Enviar SMS a " + llamadaOk.telefonoCliente)
		modal.find('#numeroTlefonicoSMS').val(llamadaOk.telefonoCliente)
		modal.find('#textoSMS').val("")
	} else {
		modal.find('.modal-title').text("Enviar nuevo SMS")
		modal.find('#numeroTlefonicoSMS').val("")
		modal.find('#textoSMS').val("")
	}
	modal.find('.modal-dialog').removeClass("modal-xl")
	$('#tipificacionSMS').hide();
	$('#tipificacionSMS').html("");
	$('#smsCuerpo').show();

	if (oSipSessionCall) {
		$('#textoSMS').val(llamadaOk.idLlamada.split(".")[1])
	}else{
		$('#textoSMS').val("")
	}

	
	modal.find('.modal-footer').show();

	

})

function enviarSMS() {
	let guardar = "SI";
	if (oSipSessionCall  && !$.isEmptyObject(clienteSeleccionado)) {
		guardar = "SI"
	}else{
		guardar = "NO"
	}
	let datosSMS = {
		telefono: $('#numeroTlefonicoSMS').val(),
		mensaje: $('#textoSMS').val(),
		url: urls.smsAPI,
		user: urls.smsAPIUser,
		pssw: urls.smsAPIPssw,
		prefijoSMS: urls.smsAPIPrefijo
	}
	ipcRenderer.send('mandarSMS', {datosSMS, guardar, agente: agenteOk.id, idLlamada : llamadaOk.idLlamada})

}


ipcRenderer.on('mandarSMSResult', (event, datos) => {


	if(datos.success == "true"){
		$("#alertaSMS").remove();
		$('#modalSMS').find('.modal-body').prepend(
			`<div id="alertaSMS" class="alert alert-success" role="alert">
			Se envio el SMS correctamente
			</div>`
		)
		setTimeout(() => {
			$("#alertaSMS").remove();
		}, 2000);
		/*
		$('#modalSMS').find('.modal-footer').hide();
		$('#smsCuerpo').hide();
		$('#modalSMS').find('.modal-dialog').addClass("modal-xl")
		$('#tipificacionSMS').show();
		$('#modalSMS').find('.modal-title').text("Tipificar SMS")
		$('#tipificacionSMS').height($('body').height() - 250);

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
				"&ID_TC=" + datos.id +
				"&TIPOMONITOREO_TC=" + opcPrcSMS[0].valor +
				"&TELEFONO=" + $('#numeroTlefonicoSMS').val()+
				"&TIPOENCUESTA_TC=" + opcPrcSMS[1].valor +
				"&FECHASESIONINI=" + formatoFecha(new Date()) +
				"&FECHAINTERACCION=" + formatoFecha(new Date()) +
				"&HORASESIONINI=" + formatoHora(new Date()) +
				"&HORAINTERACCION=" + formatoHora(new Date()) +
				"&NOMBREPROPORCIONADO=" + encodeURI("") +
				"&ESTATUSFINALIZADO=" + "";
			$("#tipificacionSMS").html(
				'<webview id="webviewTipificacionSMS" src="' + url + parametros + '" style="display:inline-flex; width:100%; height:100%;" localStorage="true" partition="persist:simplifica"></webview>'
			);
			*/
	}else{

		$("#alertaSMS").remove();
		$('#modalSMS').find('.modal-body').prepend(
			`<div id="alertaSMS" class="alert alert-danger" role="alert">
			No se puedo enviar el SMS
			</div>`
		)
		setTimeout(() => {
			$("#alertaSMS").remove();
		}, 2000);
	}

});

//ipcRenderer.send('opcPrcSMS', "")

ipcRenderer.send('getCanalesM', "")


ipcRenderer.on('opcPrcSMSResult', (event, datos) => {


	opcPrcSMS = datos;

})

ipcRenderer.on('getCanalesMResult', async(event, datos) => {
	canalesM = datos.canalesM;
	agenteActual.canales = canalesM
	let resultag =  await datos.agente.filter(a => a.bstnCanalId == $("#AREAINICIADA_").val())[0]
    agente = resultag;
	agenteActual.idAgente = agente.id;
	areaIniciada = datos.areaIniciada;

	if (agenteActual.canales == "1" || agenteActual.canales == "2") {
		if (areaIniciada == "IBD") {
			$("#marcadorSide").remove()
		}
		else if (areaIniciada == "OBD") {
			$("#marcadorSide-etiqueta3").remove()
		}

		return;
	}

	//remplazamos los ids numericos de rh a multicanal 
	agenteActual.canales = agenteActual.canales.replace("12", "T");
	agenteActual.canales = agenteActual.canales.replace("11", "F");
	agenteActual.canales = agenteActual.canales.replace("8", "W");
	agenteActual.canales = agenteActual.canales.replace("7", "CH");
	agenteActual.canales = agenteActual.canales.replace("4", "M");
	agenteActual.canales = agenteActual.canales.replace("1", "I");


	consultarInteracciones();
	setInterval('consultarInteracciones()', 3000);

	$("#canales").html("");

	if (agenteActual.canales.indexOf("F") != -1) {

		$("#marcadorSide-etiqueta3").append(
			" <div id='chatFace'> <img src='img/iconMsnFace.png' alt='' style='width: 40px;'><span id='intMessenger' class='badge badge-dark' style='font-size: 13px;top: " + medidaIndica + "px; position: absolute; left: 16px;'>0</span></div> "
		);
		medidaIndica = medidaIndica + 50;
	}
	if (agenteActual.canales.indexOf("W") != -1) {
		$("#marcadorSide-etiqueta3").append(
			"<div id='chatWhat'> <img src='img/iconMsnWhat.png' alt='' style='width: 37px;'><span id='intWhatsApp' class='badge badge-dark' style='font-size: 13px;top: " + medidaIndica + "px; position: absolute; left: 16px;'>0</span></div>"
		);
		medidaIndica = medidaIndica + 50;
	}

	if (agenteActual.canales.indexOf("T") != -1) {
		$("#marcadorSide-etiqueta3").append(
			"<div id='chatTW'> <img src='img/iconMsnTW.png' alt='' style='width: 43px;'><span id='intTiwitter' class='badge badge-dark' style='font-size: 13px;top: " + medidaIndica + "px; position: absolute; left: 16px;'>0</span></div>"
		);
		medidaIndica = medidaIndica + 50;
	}


	if (agenteActual.canales.indexOf("CH") != -1) {
		$("#marcadorSide-etiqueta3").append(
			"<div id='chatM'> <img src='img/chatIcon.svg' alt='' style='width: 38px;'><span id='intChat' class='badge badge-dark' style='font-size: 13px;top: " + medidaIndica + "px; position: absolute; left: 16px;'>0</span></div>"
		);
		medidaIndica = medidaIndica + 50;
	}


	if (agenteActual.canales.indexOf("M") != -1) {
		$("#marcadorSide-etiqueta3").append(
			"<div id='chatM'> <img src='img/mailIcon.svg' alt='' style='width: 38px;'><span id='intMail' class='badge badge-dark' style='font-size: 13px;top: " + medidaIndica + "px; position: absolute; left: 16px;'>0</span></div>"
		);
		medidaIndica = medidaIndica + 50;
	}



})


function mostrarIframe(id, sesion) {

	var cliente = aux.int.filter(function (element) {
		return (element.imcclienteid == id && element.imcsesionid == sesion)
	})[0];
	sisVar.cteSeleccionado = cliente;

	var url = "";
	var img = "";

	if (cliente.inmccanalid == "F") {

		url = urls.dirMDE+"/Facebook/Facebook/FacebookChatM.jsp?" + "idCliente=" + cliente.imcclienteid + "&CNUSERID=" + agenteActual.idAgente;
		img = "img/messengerIcon.svg";

	} else if (cliente.inmccanalid == "W") {

		url = urls.dirMDE+"/Whatsapp/Whatsapp/WhatsappChatM.jsp?" + "idCliente=" + cliente.imcclienteid + "&CNUSERID=" + agenteActual.idAgente;
		img = "img/whatsappIcon.svg";

	} else if (cliente.inmccanalid == "CH") {

		var clienteid = cliente.imcclienteid.split(".")[1];
		var portal = cliente.imcclienteid.split(".")[0];

		url = urls.dirMDE+"/S5P300MI4NPas/SIO/PRT/chatdelAgente.jsp?PORTAL=" + portal + "&idCliente=" + clienteid + "&CNUSERID=" + agenteActual.idAgente;
		img = "img/chatIcon.svg";

	}
	else if (cliente.inmccanalid == "M") {
		url = urls.dirMDE+"/mailind/mailMulticanal.jsp?CNUSERID=" + agenteActual.idAgente + "&emailCliente=" + cliente.imcclienteid + "&idCorreo=" + cliente.imcsesionid;
		img = "img/mailIcon.svg";

	}
	else if (cliente.inmccanalid == "T") {
		url = urls.dirMDE+"/Twitter/Twitter/TwitterChatM.jsp?" + "idCliente=" + cliente.imcclienteid + "&CNUSERID=" + agenteActual.idAgente;;
		img = "img/TwitterIcon.svg";

	}
	else if (cliente.inmccanalid == "I") {
		url = "https://cc.bsw.mx/EspartacusSoftwareCenter/MenuPage.php?CNUSERID=" + agenteActual.idAgente + "&MULTICANAL=S&VERSIONMENU=14";
		img = "img/inbIcon.svg";
	}

	if (cliente.inmccanalid == "I") {
		$("#divContacto").html(

			replaceAll(
				"  <div class='bg-light  d-flex justify-content-between align-items-center py-2 px-3 border-left'>" +
				"         <i onclick='cerrarChat()' class='fas fa-arrow-left mr-3 d-md-none' style='font-size: 32px'></i>" +
				"         <img src='" + img + "' class='float-left rounded' style='width: 40px;height: 40px;'>" +
				"         <div class='col'>" +
				"             <div class='col-12 p-0 font-weight-bolder'>" + cliente.imccliente + "</div>" +
				"         </div>" +
				"<i onclick='verCRM(" + cliente.imctelefono + ", " + cliente.imccorreo + ")' class='far fa-address-book' style='font-size: 32px; float: right; color: #20c997; '></i>" +
				"  </div>")


		)
		window.open(url, "_blank", "directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,top=" + ($("body").height() - $("#divContacto").height() + 130) + ",left=" + ($("body").width() - $("#divContacto").width() + 10) + ",width=" + ($("#divContacto").width() - 10) + ",height=" + ($("#divContacto").height() - 130));
	}
	else {
		ipcRenderer.send('mostrarIframes', url, sisVar.cteSeleccionado.imccliente, cliente.inmccanalid, sisVar.cteSeleccionado.imcclienteid);
	}

	if (cliente.imcesnuevo == "0") {
		cambiarEstatusNuevo(cliente.imcidn);
	}
}

function pintarContactosMulti(datos) {


	aux = {};

	aux.int = datos.interacciones;
	aux.int = datos.interacciones;
	sisVar.totalContactosNuevos = 0;
	sisVar.totalMensajesNoLeidos = 0;
	sisVar.intMessenger = 0;
	sisVar.intChat = 0;
	sisVar.intWhatsApp = 0;
	sisVar.intMail = 0;
	sisVar.intInb = 0;
	sisVar.intTiwitter = 0;

	$("#listaContactos").html("");
	$("#intMessenger").html(sisVar.intMessenger);
	$("#intChat").html(sisVar.intChat);
	$("#intWhatsApp").html(sisVar.intWhatsApp);
	$("#intMail").html(sisVar.intMail);
	$("#intInb").html(sisVar.intInb);
	$("#intTiwitter").html(sisVar.intTiwitter);

	for (var i = 0; i < aux.int.length; i++) {

		aux.selected = ""; aux.nuevos = ""; aux.nuevoContacto = ""; aux.mensaje = "";

		if (sisVar.cteSeleccionado != undefined && sisVar.cteSeleccionado.imcclienteid == aux.int[i].imcclienteid && sisVar.cteSeleccionado.imcsesionid == aux.int[i].imcsesionid) {
			//aux.selected = " background-color: #F1F3F4; ";	
		}

		if (datos[aux.int[i].inmccanalid] != undefined) {

			aux.noVistos = datos[aux.int[i].inmccanalid].noVistos.filter(function (element) {
				return element.id == aux.int[i].imcclienteid
			});
			aux.ultimosMensajes = datos[aux.int[i].inmccanalid].ultimosMensajes.filter(function (element) {
				return element.id == aux.int[i].imcclienteid
			});

			if (aux.noVistos.length > 0 && aux.noVistos[0].total != 0) {

				aux.nuevos = "<span class='badge badge-dark badge-pill'>" + aux.noVistos[0].total + "</span>";
				sisVar.totalMensajesNoLeidos = sisVar.totalMensajesNoLeidos + parseInt(aux.noVistos[0].total);
			}

			if (aux.ultimosMensajes.length > 0 && aux.ultimosMensajes[0].cuerpo != "") {

				aux.ultimosMensajes[0].cuerpo = replaceAll(aux.ultimosMensajes[0].cuerpo);
				aux.cuerpo = aux.ultimosMensajes[0].cuerpo;
				aux.cuerpo = aux.cuerpo.split("-x-").join('%');
				aux.cuerpo = decodeURI(aux.cuerpo);
				aux.ultimosMensajes[0].cuerpo = aux.cuerpo;

				if (aux.ultimosMensajes[0].tipo != "chat") {
					aux.mensaje = "<i class='fas fa-photo-video'></i>"
				} else {
					aux.mensaje = aux.ultimosMensajes[0].cuerpo;
					aux.mensaje = cortarTextoConPuntos(aux.mensaje, 30);
				}
			}


		}

		if (aux.int[i].imcesnuevo == "0") {
			aux.nuevoContacto = "<div style=' width: 10px; height: 10px; position: absolute; top: 9px; left: 20px; background: #20c997; border-radius: 50%; '></div>";
			sisVar.totalContactosNuevos = sisVar.totalContactosNuevos + 1;
			//startRingTone();
			//showNotification();
			//function startRingTone() {
			//	try { ringtone.play(); }
			//	catch (e) { }
			//}
		}
		// solo la primera vez, va y cambia el estatus, para saber que ese chat ya se notifico al agente
		if (aux.int[i].imcasignadoalprograma == "0") {
			//mostrar notificación
			showNotificationChat();
			startRingToneChat();
			//cambiar estatus
			cambiarEstatusNotificadoEnelPrograma(aux.int[i].imcidn);
			
		}
		if (aux.int[i].inmccanalid == "F" && agenteActual.canales.indexOf("F") != -1) {

			$("#listaContactos").append(

				replaceAll(

					" <li onclick='mostrarIframe(\"" + aux.int[i].imcclienteid + "\", \"" + aux.int[i].imcsesionid + "\")' style='background-color: #007fff; cursor: pointer;" + aux.selected + "' class='list-group-item d-flex justify-content-between align-items-center'>" + aux.nuevoContacto +
					"    <img src='img/iconMsnFace.png' class='rounded float-left' style='width: 30px;'>" +
					"    <div class='col'>" +
					"       <div class='col-12 p-0 font-weight-bolder'>" + aux.int[i].imccliente + "</div>" +
					"       <div class='col-12 p-0'>" + aux.mensaje + "</div>" +
					"    </div>" + aux.nuevos +
					" </li>")
			);

			sisVar.intMessenger = sisVar.intMessenger + 1;

		} else if (aux.int[i].inmccanalid == "CH" && agenteActual.canales.indexOf("CH") != -1) {


			$("#listaContactos").append(

				replaceAll(
					" <li onclick='mostrarIframe(\"" + aux.int[i].imcclienteid + "\", \"" + aux.int[i].imcsesionid + "\")' style='background-color: orange;cursor: pointer; " + aux.selected + "' class=' list-group-item d-flex justify-content-between align-items-center'>" + aux.nuevoContacto +
					"    <img src='img/chatIcon.svg' class='rounded float-left' style='width: 30px;'>" +
					"    <div class='col'>" +
					"       <div class='col-12 p-0 font-weight-bolder'>" + aux.int[i].imccliente + "</div>" +
					"       <div class='col-12 p-0'>" + aux.mensaje + "</div>" +
					"    </div>" + aux.nuevos +
					" </li>")


			);
			sisVar.intChat = sisVar.intChat + 1;

		} else if (aux.int[i].inmccanalid == "W" && agenteActual.canales.indexOf("W") != -1) {


			$("#listaContactos").append(

				replaceAll(
					" <li onclick='mostrarIframe(\"" + aux.int[i].imcclienteid + "\", \"" + aux.int[i].imcsesionid + "\")' style='background-color: #67c15e;cursor: pointer; " + aux.selected + "' class='list-group-item d-flex justify-content-between align-items-center'>" + aux.nuevoContacto +
					"    <img src='img/iconMsnWhat.png' class='rounded float-left' style='width: 30px;'>" +
					"    <div class='col'>" +
					"       <div class='col-12 p-0 font-weight-bolder'>" + aux.int[i].imccliente + "</div>" +
					"       <div class='col-12 p-0'>" + aux.mensaje + "</div>" +
					"    </div>" + aux.nuevos +
					" </li>")

			);

			sisVar.intWhatsApp = sisVar.intWhatsApp + 1;

		} else if (aux.int[i].inmccanalid == "M" && agenteActual.canales.indexOf("M") != -1) {


			$("#listaContactos").append(

				replaceAll(
					" <li onclick='mostrarIframe(\"" + aux.int[i].imcclienteid + "\", \"" + aux.int[i].imcsesionid + "\")' style='background-color: #ff7c80;cursor: pointer; " + aux.selected + "' class='list-group-item d-flex justify-content-between align-items-center'>" + aux.nuevoContacto +
					"    <img src='img/iconM.png' class='rounded float-left' style='width: 39px;'>" +
					"    <div class='col'>" +
					"       <div class='col-12 p-0 font-weight-bolder'>" + aux.int[i].imccliente.split('"').join('') + "</div>" +
					"       <div class='col-12 p-0'>" + aux.mensaje + "</div>" +
					"    </div>" + aux.nuevos +
					" </li>")

			);

			sisVar.intMail = sisVar.intMail + 1;

		}
		else if (aux.int[i].inmccanalid == "I" && agenteActual.canales.indexOf("I") != -1) {

			if (aux.int[i].imcesnuevo == "0") {
				$("#listaContactos").append(

					replaceAll(
						" <li onclick='mostrarIframe(\"" + aux.int[i].imcclienteid + "\", \"" + aux.int[i].imcsesionid + "\")' style='cursor: pointer; " + aux.selected + "' class='list-group-item d-flex justify-content-between align-items-center'>" + aux.nuevoContacto +
						"    <img src='img/inbIcon.svg' class='rounded float-left' style='width: 30px;'>" +
						"    <div class='col'>" +
						"       <div class='col-12 p-0 font-weight-bolder'>" + aux.int[i].imccliente + "</div>" +
						"       <div class='col-12 p-0'>" + aux.mensaje + "</div>" +
						"    </div>" + aux.nuevos +
						" </li>")

				);
			}
			else {
				$("#listaContactos").append(

					replaceAll(
						" <li  style='cursor: pointer; " + aux.selected + "' class='list-group-item d-flex justify-content-between align-items-center'>" + aux.nuevoContacto +
						"    <img src='img/inbIcon.svg' class='rounded float-left' style='width: 30px;'>" +
						"    <div class='col'>" +
						"       <div class='col-12 p-0 font-weight-bolder'>" + aux.int[i].imccliente + "</div>" +
						"       <div class='col-12 p-0'>" + aux.mensaje + "</div>" +
						"    </div>" + aux.nuevos +
						" </li>")

				);
			}

			sisVar.intInb = sisVar.intInb + 1;

		} else if (aux.int[i].inmccanalid == "T" && agenteActual.canales.indexOf("T") != -1) {


			$("#listaContactos").append(

				replaceAll(
					" <li onclick='mostrarIframe(\"" + aux.int[i].imcclienteid + "\", \"" + aux.int[i].imcsesionid + "\")' style='background-color: #1DA1F2;cursor: pointer; " + aux.selected + "' class='list-group-item d-flex justify-content-between align-items-center'>" + aux.nuevoContacto +
					"    <img src='img/iconMsnTW2.png' class='rounded float-left' style='width: 30px;'>" +
					"    <div class='col'>" +
					"       <div class='col-12 p-0 font-weight-bolder'>" + aux.int[i].imccliente + "</div>" +
					"       <div class='col-12 p-0'>" + aux.mensaje + "</div>" +
					"    </div>" + aux.nuevos +
					" </li>")

			);

			sisVar.intTiwitter = sisVar.intTiwitter + 1;

		}

		$("#intMessenger").html(sisVar.intMessenger);
		$("#intChat").html(sisVar.intChat);
		$("#intWhatsApp").html(sisVar.intWhatsApp);
		$("#intMail").html(sisVar.intMail);
		$("#intInb").html(sisVar.intInb);
		$("#intTiwitter").html(sisVar.intTiwitter);

		$("#totalContactosNuevos").html(sisVar.totalContactosNuevos);
		$("#totalMensajesNoLeidos").html(sisVar.totalMensajesNoLeidos);

	}

	/*$("#listaContactos").append(
		replaceAll(
			" <li data-toggle='modal' data-numero='8888888888' data-target='#modalSMS' data-whatever='SMS - Guadalupe Maciel'  style='background-color: #7D3C98; cursor: pointer;' class=' list-group-item d-flex justify-content-between align-items-center'>"+
			"    <img src='img/ICONSMS_.svg' class='rounded float-left' style='width: 30px;'>" +
			"    <div class='col'>" +
			"       <div class='col-12 p-0 font-weight-bolder'>Guadalupe Maciel (SMS)</div>" +
			"       <div class='col-12 p-0'>Información de horarios</div>" +
			"    </div>" +
			" </li>")
	);*/

	if ((sisVar.totalContactosNuevos + sisVar.totalMensajesNoLeidos) != 0) {


		aux.actuales = 0;
		var dhhs = $('#notificacionesTotales').html();

		if ($('#notificacionesTotales').html() != undefined) {
			aux.actuales = parseInt($("#notificacionesTotales").html());
		}

		$("#notificacionesTotales").remove();
		$("#iconNotificaciones").after("<span id='notificacionesTotales' class='badge badge-light mx-1'>" + (sisVar.totalContactosNuevos + sisVar.totalMensajesNoLeidos) + "</span>");


		if ((sisVar.totalContactosNuevos + sisVar.totalMensajesNoLeidos) > aux.actuales) {

			var x = document.getElementById("myAudio");

			//x.play(); 
		}

	} else {

		$("#notificacionesTotales").remove();

	}





}

function consultarInteracciones() {
	ipcRenderer.send('consultarInteracciones', agente.id, agenteActual.canales)
}


ipcRenderer.on('consultarInteraccionesResult', (event, datos) => {

	var datos = datos;
	pintarContactosMulti(datos);

	ipcRenderer.send('verificarVentanas', datos.interacciones)




})

function cambiarEstatusNuevo(idIteraccion) {
	ipcRenderer.send('cambiarEstatusNuevo', idIteraccion)

}


ipcRenderer.on('cambiarEstatusNuevoResult', (event, datos) => {


})
function cambiarEstatusNotificadoEnelPrograma(idIteraccion) {
	ipcRenderer.send('cambiarEstatusNotificadoEnelPrograma', idIteraccion)
}


ipcRenderer.on('cambiarEstatusNotificadoEnelProgramaResult', (event, datos) => {


})
function startRingToneChat() {
		try { ringtoneChat.play(); }
		catch (e) { }

		timer = setInterval(function () {
			stopRingToneChat();
		}
			, 3000);

		
}
function stopRingToneChat() {
    try { ringtoneChat.pause(); }
    catch (e) { }
}
function showNotificationChat () 
 {
    const notification = new window.Notification(
        'Nuevo chat',
        {
          body: 'Atender chat',
          icon: '../../../../img/agente.png',
        }
      );
      
}
/*
ipcMain.on('getCanalesM', async (event, arg) => {
	var dato = {};
	dato.canalesM = canalesM[0].canales;
	dato.agente = datosAgente;
	dato.areaIniciada = areaIniciada;
	event.reply('getCanalesMResult', dato)
  });
*/
function cortarTextoConPuntos(texto, limite) {
	var puntosSuspensivos = "...";
	if (texto.length > limite) {
		texto = texto.substring(0, limite) + puntosSuspensivos;
	}

	return texto;
}
function replaceAll(cadena) {

	//return cadena;

	//cadena= target.replace(new RegExp("\\uD83D\\uDE00", 'g'), "&#128512;");      
	cadena = cadena.split("\\uD83D\\uDD95\\uD83C\\uDFFB").join("&#128405;");

	cadena = cadena.split("\\uD83D\\uDE00").join("&#128512;");
	cadena = cadena.split("\\uD83D\\uDE01").join("&#128513;");
	cadena = cadena.split("\\uD83D\\uDE02").join("&#128514;");
	cadena = cadena.split("\\uD83D\\uDE03").join("&#128515;");
	cadena = cadena.split("\\uD83D\\uDE04").join("&#128516;");
	cadena = cadena.split("\\uD83D\\uDE05").join("&#128517;");
	cadena = cadena.split("\\uD83D\\uDE06").join("&#128518;");
	cadena = cadena.split("\\uD83D\\uDE07").join("&#128519;");
	cadena = cadena.split("\\uD83D\\uDE08").join("&#128520;");
	cadena = cadena.split("\\uD83D\\uDE09").join("&#128521;");
	cadena = cadena.split("\\uD83D\\uDE0A").join("&#128522;");


	cadena = cadena.split("\\uD83D\\uDE0B").join("&#128523;");
	cadena = cadena.split("\\uD83D\\uDE0C").join("&#128524;");
	cadena = cadena.split("\\uD83D\\uDE0D").join("&#128525;");
	cadena = cadena.split("\\uD83D\\uDE0E").join("&#128526;");
	cadena = cadena.split("\\uD83D\\uDE0F").join("&#128527;");
	cadena = cadena.split("\\uD83D\\uDE10").join("&#128528;");
	cadena = cadena.split("\\uD83D\\uDE11").join("&#128529;");
	cadena = cadena.split("\\uD83D\\uDE12").join("&#128530;");
	cadena = cadena.split("\\uD83D\\uDE13").join("&#128531;");
	cadena = cadena.split("\\uD83D\\uDE14").join("&#128532;");

	cadena = cadena.split("\\uD83D\\uDE15").join("&#128533;");
	cadena = cadena.split("\\uD83D\\uDE16").join("&#128534;");
	cadena = cadena.split("\\uD83D\\uDE17").join("&#128535;");
	cadena = cadena.split("\\uD83D\\uDE18").join("&#128536;");
	cadena = cadena.split("\\uD83D\\uDE19").join("&#128537;");
	cadena = cadena.split("\\uD83D\\uDE1A").join("&#128538;");
	cadena = cadena.split("\\uD83D\\uDE1B").join("&#128539;");
	cadena = cadena.split("\\uD83D\\uDE1C").join("&#128540;");
	cadena = cadena.split("\\uD83D\\uDE1D").join("&#128541;");
	cadena = cadena.split("\\uD83D\\uDE1E").join("&#128542;");

	cadena = cadena.split("\\uD83D\\uDE1F").join("&#128543;");
	cadena = cadena.split("\\uD83D\\uDE20").join("&#128544;");
	cadena = cadena.split("\\uD83D\\uDE21").join("&#128545;");
	cadena = cadena.split("\\uD83D\\uDE22").join("&#128546;");
	cadena = cadena.split("\\uD83D\\uDE23").join("&#128547;");
	cadena = cadena.split("\\uD83D\\uDE24").join("&#128548;");
	cadena = cadena.split("\\uD83D\\uDE25").join("&#128549;");
	cadena = cadena.split("\\uD83D\\uDE26").join("&#128550;");
	cadena = cadena.split("\\uD83D\\uDE27").join("&#128551;");
	cadena = cadena.split("\\uD83D\\uDE28").join("&#128552;");

	cadena = cadena.split("\\uD83D\\uDE29").join("&#128553;");
	cadena = cadena.split("\\uD83D\\uDE2A").join("&#128554;");
	cadena = cadena.split("\\uD83D\\uDE2B").join("&#128555;");
	cadena = cadena.split("\\uD83D\\uDE2C").join("&#128556;");
	cadena = cadena.split("\\uD83D\\uDE2D").join("&#128557;");
	cadena = cadena.split("\\uD83D\\uDE2E").join("&#128558;");
	cadena = cadena.split("\\uD83D\\uDE2F").join("&#128559;");
	cadena = cadena.split("\\uD83D\\uDE30").join("&#128560;");
	cadena = cadena.split("\\uD83D\\uDE31").join("&#128561;");
	cadena = cadena.split("\\uD83D\\uDE32").join("&#128562;");

	cadena = cadena.split("\\uD83D\\uDE33").join("&#128563;");
	cadena = cadena.split("\\uD83D\\uDE34").join("&#128564;");
	cadena = cadena.split("\\uD83D\\uDE35").join("&#128565;");
	cadena = cadena.split("\\uD83D\\uDE36").join("&#128566;");
	cadena = cadena.split("\\uD83D\\uDE37").join("&#128567;");
	cadena = cadena.split("\\uD83D\\uDE38").join("&#128568;");
	cadena = cadena.split("\\uD83D\\uDE39").join("&#128569;");
	cadena = cadena.split("\\uD83D\\uDE3A").join("&#128570;");
	cadena = cadena.split("\\uD83D\\uDE3B").join("&#128571;");
	cadena = cadena.split("\\uD83D\\uDE3C").join("&#128572;");

	cadena = cadena.split("\\uD83D\\uDE3D").join("&#128573;");
	cadena = cadena.split("\\uD83D\\uDE3E").join("&#128574;");
	cadena = cadena.split("\\uD83D\\uDE3F").join("&#128575;");
	cadena = cadena.split("\\uD83D\\uDE40").join("&#128576;");
	cadena = cadena.split("\\uD83D\\uDE41").join("&#128577;");
	cadena = cadena.split("\\uD83D\\uDE42").join("&#128578;");
	cadena = cadena.split("\\uD83D\\uDE43").join("&#128579;");
	cadena = cadena.split("\\uD83D\\uDE44").join("&#128580;");
	cadena = cadena.split("\\uD83D\\uDE45").join("&#128581;");
	cadena = cadena.split("\\uD83D\\uDE46").join("&#128582;");

	cadena = cadena.split("\\uD83D\\uDE47").join("&#128583;");
	cadena = cadena.split("\\uD83D\\uDE48").join("&#128584;");
	cadena = cadena.split("\\uD83D\\uDE49").join("&#128585;");
	cadena = cadena.split("\\uD83D\\uDE4A").join("&#128586;");
	cadena = cadena.split("\\uD83D\\uDE4B").join("&#128587;");
	cadena = cadena.split("\\uD83D\\uDE4C").join("&#128588;");
	cadena = cadena.split("\\uD83D\\uDE4D").join("&#128589;");
	cadena = cadena.split("\\uD83D\\uDE4E").join("&#128590;");
	cadena = cadena.split("\\uD83D\\uDE4F").join("&#128591;");
	cadena = cadena.split("\\uD83D\\uDE50").join("&#128592;");

	cadena = cadena.split("\\uD83D\\uDE51").join("&#128593;");
	cadena = cadena.split("\\uD83D\\uDE52").join("&#128594;");
	cadena = cadena.split("\\uD83D\\uDE53").join("&#128595;");
	cadena = cadena.split("\\uD83D\\uDE54").join("&#128596;");
	cadena = cadena.split("\\uD83D\\uDE55").join("&#128597;");
	cadena = cadena.split("\\uD83D\\uDE56").join("&#128598;");
	cadena = cadena.split("\\uD83D\\uDE57").join("&#128599;");
	cadena = cadena.split("\\uD83D\\uDE58").join("&#128600;");
	cadena = cadena.split("\\uD83D\\uDE59").join("&#128601;");
	cadena = cadena.split("\\uD83D\\uDE5A").join("&#128602;");

	cadena = cadena.split("\\uD83D\\uDE5B").join("&#128603;");
	cadena = cadena.split("\\uD83D\\uDE5C").join("&#128604;");
	cadena = cadena.split("\\uD83D\\uDE5D").join("&#128605;");
	cadena = cadena.split("\\uD83D\\uDE5E").join("&#128606;");
	cadena = cadena.split("\\uD83D\\uDE5F").join("&#128607;");
	cadena = cadena.split("\\uD83D\\uDE60").join("&#128608;");
	cadena = cadena.split("\\uD83D\\uDE61").join("&#128609;");
	cadena = cadena.split("\\uD83D\\uDE62").join("&#128610;");
	cadena = cadena.split("\\uD83D\\uDE63").join("&#128611;");
	cadena = cadena.split("\\uD83D\\uDE64").join("&#128612;");

	cadena = cadena.split("\\uD83D\\uDE65").join("&#128613;");
	cadena = cadena.split("\\uD83D\\uDE66").join("&#128614;");
	cadena = cadena.split("\\uD83D\\uDE67").join("&#128615;");
	cadena = cadena.split("\\uD83D\\uDE68").join("&#128616;");
	cadena = cadena.split("\\uD83D\\uDE69").join("&#128617;");
	cadena = cadena.split("\\uD83D\\uDE6A").join("&#128618;");
	cadena = cadena.split("\\uD83D\\uDE6B").join("&#128619;");
	cadena = cadena.split("\\uD83D\\uDE6C").join("&#128620;");
	cadena = cadena.split("\\uD83D\\uDE6D").join("&#128621;");
	cadena = cadena.split("\\uD83D\\uDE6E").join("&#128622;");

	cadena = cadena.split("\\uD83D\\uDE6F").join("&#128623;");
	cadena = cadena.split("\\uD83D\\uDE70").join("&#128624;");
	cadena = cadena.split("\\uD83D\\uDE71").join("&#128625;");
	cadena = cadena.split("\\uD83D\\uDE72").join("&#128626;");
	cadena = cadena.split("\\uD83D\\uDE73").join("&#128627;");
	cadena = cadena.split("\\uD83D\\uDE74").join("&#128628;");
	cadena = cadena.split("\\uD83D\\uDE75").join("&#128629;");
	cadena = cadena.split("\\uD83D\\uDE76").join("&#128630;");
	cadena = cadena.split("\\uD83D\\uDE77").join("&#128631;");
	cadena = cadena.split("\\uD83D\\uDE78").join("&#128632;");

	cadena = cadena.split("\\uD83D\\uDE79").join("&#128633;");
	cadena = cadena.split("\\uD83D\\uDE7A").join("&#128634;");
	cadena = cadena.split("\\uD83D\\uDE7B").join("&#128635;");
	cadena = cadena.split("\\uD83D\\uDE7C").join("&#128636;");
	cadena = cadena.split("\\uD83D\\uDE7D").join("&#128637;");
	cadena = cadena.split("\\uD83D\\uDE7E").join("&#128638;");
	cadena = cadena.split("\\uD83D\\uDE7F").join("&#128639;");
	cadena = cadena.split("\\uD83D\\uDE80").join("&#128640;");
	cadena = cadena.split("\\uD83D\\uDE81").join("&#128641;");
	cadena = cadena.split("\\uD83D\\uDE82").join("&#128642;");

	cadena = cadena.split("\\uD83D\\uDE83").join("&#128643;");
	cadena = cadena.split("\\uD83D\\uDE84").join("&#128644;");
	cadena = cadena.split("\\uD83D\\uDE85").join("&#128645;");
	cadena = cadena.split("\\uD83D\\uDE86").join("&#128646;");
	cadena = cadena.split("\\uD83D\\uDE87").join("&#128647;");
	cadena = cadena.split("\\uD83D\\uDE88").join("&#128648;");
	cadena = cadena.split("\\uD83D\\uDE89").join("&#128649;");
	cadena = cadena.split("\\uD83D\\uDE8A").join("&#128650;");
	cadena = cadena.split("\\uD83D\\uDE8B").join("&#128651;");
	cadena = cadena.split("\\uD83D\\uDE8C").join("&#128652;");

	cadena = cadena.split("\\uD83D\\uDE8D").join("&#128653;");
	cadena = cadena.split("\\uD83D\\uDE8E").join("&#128654;");
	cadena = cadena.split("\\uD83D\\uDE8F").join("&#128655;");
	cadena = cadena.split("\\uD83D\\uDE90").join("&#128656;");
	cadena = cadena.split("\\uD83D\\uDE91").join("&#128657;");
	cadena = cadena.split("\\uD83D\\uDE92").join("&#128658;");
	cadena = cadena.split("\\uD83D\\uDE93").join("&#128659;");
	cadena = cadena.split("\\uD83D\\uDE94").join("&#128660;");
	cadena = cadena.split("\\uD83D\\uDE95").join("&#128661;");
	cadena = cadena.split("\\uD83D\\uDE96").join("&#128662;");

	cadena = cadena.split("\\uD83D\\uDE97").join("&#128663;");
	cadena = cadena.split("\\uD83D\\uDE98").join("&#128664;");
	cadena = cadena.split("\\uD83D\\uDE99").join("&#128665;");
	cadena = cadena.split("\\uD83D\\uDE9A").join("&#128666;");
	cadena = cadena.split("\\uD83D\\uDE9B").join("&#128667;");
	cadena = cadena.split("\\uD83D\\uDE9C").join("&#128668;");
	cadena = cadena.split("\\uD83D\\uDE9D").join("&#128669;");
	cadena = cadena.split("\\uD83D\\uDE9E").join("&#128670;");
	cadena = cadena.split("\\uD83D\\uDE9F").join("&#128671;");
	cadena = cadena.split("\\uD83D\\uDEA0").join("&#128672;");

	cadena = cadena.split("\\uD83D\\uDEA1").join("&#128673;");
	cadena = cadena.split("\\uD83D\\uDEA2").join("&#128674;");
	cadena = cadena.split("\\uD83D\\uDEA3").join("&#128675;");
	cadena = cadena.split("\\uD83D\\uDEA4").join("&#128676;");
	cadena = cadena.split("\\uD83D\\uDEA5").join("&#128677;");
	cadena = cadena.split("\\uD83D\\uDEA6").join("&#128678;");
	cadena = cadena.split("\\uD83D\\uDEA7").join("&#128679;");
	cadena = cadena.split("\\uD83D\\uDEA8").join("&#128680;");
	cadena = cadena.split("\\uD83D\\uDEA9").join("&#128681;");
	cadena = cadena.split("\\uD83D\\uDEAA").join("&#128682;");

	cadena = cadena.split("\\uD83D\\uDEAB").join("&#128683;");
	cadena = cadena.split("\\uD83D\\uDEAC").join("&#128684;");
	cadena = cadena.split("\\uD83D\\uDEAD").join("&#128685;");
	cadena = cadena.split("\\uD83D\\uDEAE").join("&#128686;");
	cadena = cadena.split("\\uD83D\\uDEAF").join("&#128687;");
	cadena = cadena.split("\\uD83D\\uDEB0").join("&#128688;");
	cadena = cadena.split("\\uD83D\\uDEB1").join("&#128689;");
	cadena = cadena.split("\\uD83D\\uDEB2").join("&#128690;");
	cadena = cadena.split("\\uD83D\\uDEB3").join("&#128691;");
	cadena = cadena.split("\\uD83D\\uDEB4").join("&#128692;");

	cadena = cadena.split("\\uD83D\\uDEB5").join("&#128693;");
	cadena = cadena.split("\\uD83D\\uDEB6").join("&#128694;");
	cadena = cadena.split("\\uD83D\\uDEB7").join("&#128695;");
	cadena = cadena.split("\\uD83D\\uDEB8").join("&#128696;");
	cadena = cadena.split("\\uD83D\\uDEB9").join("&#128697;");
	cadena = cadena.split("\\uD83D\\uDEBA").join("&#128698;");
	cadena = cadena.split("\\uD83D\\uDEBB").join("&#128699;");
	cadena = cadena.split("\\uD83D\\uDEBC").join("&#128700;");
	cadena = cadena.split("\\uD83D\\uDEBD").join("&#128701;");
	cadena = cadena.split("\\uD83D\\uDEBE").join("&#128702;");

	cadena = cadena.split("\\uD83D\\uDEBF").join("&#128703;");
	cadena = cadena.split("\\uD83D\\uDEC0").join("&#128704;");
	cadena = cadena.split("\\uD83D\\uDEC1").join("&#128705;");
	cadena = cadena.split("\\uD83D\\uDEC2").join("&#128706;");
	cadena = cadena.split("\\uD83D\\uDEC3").join("&#128707;");
	cadena = cadena.split("\\uD83D\\uDEC4").join("&#128708;");
	cadena = cadena.split("\\uD83D\\uDEC5").join("&#128709;");
	cadena = cadena.split("\\uD83D\\uDEC6").join("&#128710;");
	cadena = cadena.split("\\uD83D\\uDEC7").join("&#128711;");
	cadena = cadena.split("\\uD83D\\uDEC8").join("&#128712;");

	cadena = cadena.split("\\uD83E\\uDD70").join("&#129392;");
	cadena = cadena.split("\\uD83C\\uDFA4").join("&#127908;");
	cadena = cadena.split("\\uD83E\\uDD28").join("&#129320;");
	cadena = cadena.split("\\uD83D\\uDC4F").join("&#128079;");
	cadena = cadena.split("\\ud83d\\uDC40").join("&#128064;");
	cadena = cadena.split("\\uD83E\\uDD7A").join("&#129402;");
	cadena = cadena.split("\\uD83c\\uDFA7").join("&#127911;");
	cadena = cadena.split("\\uD83E\\uDD24").join("&#129316;");

	cadena = cadena.split("\\uD83E\\uDD23").join("&#129315;");
	cadena = cadena.split("\\uD83E\\uDD2A").join("&#129322;");
	cadena = cadena.split("\\uD83E\\uDDD0").join("&#129488;");
	cadena = cadena.split("\\uD83E\\uDD13").join("&#129299;");
	cadena = cadena.split("\\uD83E\\uDD29").join("&#129321;");
	cadena = cadena.split("\\uD83E\\uDD73").join("&#129395;");
	cadena = cadena.split("\\uD83E\\uDD2C").join("&#129324;");
	cadena = cadena.split("\\uD83E\\uDD2F").join("&#129327;");
	cadena = cadena.split("\\uD83E\\uDD75").join("&#129397;");
	cadena = cadena.split("\\uD83E\\uDD76").join("&#129398;");

	cadena = cadena.split("\\uD83E\\uDD17").join("&#129303;");
	cadena = cadena.split("\\uD83E\\uDD14").join("&#129300;");
	cadena = cadena.split("\\uD83E\\uDD2D").join("&#129325;");
	cadena = cadena.split("\\uD83E\\uDD2B").join("&#129323;");
	cadena = cadena.split("\\uD83E\\uDD25").join("&#129317;");
	cadena = cadena.split("\\uD83E\\uDD10").join("&#129296;");
	cadena = cadena.split("\\uD83E\\uDD74").join("&#129396;");
	cadena = cadena.split("\\uD83E\\uDD22").join("&#129314;");
	cadena = cadena.split("\\uD83E\\uDD2E").join("&#129326;");
	cadena = cadena.split("\\uD83E\\uDD27").join("&#129319;");

	cadena = cadena.split("\\uD83E\\uDD12").join("&#129298;");
	cadena = cadena.split("\\uD83E\\uDD15").join("&#129301;");
	cadena = cadena.split("\\uD83E\\uDD11").join("&#129297;");
	cadena = cadena.split("\\uD83E\\uDD32").join("&#129330;");
	cadena = cadena.split("\\uD83D\\uDC50").join("&#128080;");
	cadena = cadena.split("\\uD83C\\uDFFB").join("&#127995;");
	cadena = cadena.split("\\uD83E\\uDD1D").join("&#129309;");
	cadena = cadena.split("\\uD83D\\uDC4D").join("&#128077;");
	cadena = cadena.split("\\uD83D\\uDC4E").join("&#128078;");
	cadena = cadena.split("\\uD83D\\uDC4A").join("&#128074;");

	cadena = cadena.split("\\uD83E\\uDD1B").join("&#129307;");
	cadena = cadena.split("\\uD83E\\uDD1C").join("&#129308;");
	cadena = cadena.split("\\uD83E\\uDD1E").join("&#129310;");
	cadena = cadena.split("\\uD83E\\uDD18").join("&#129304;");
	cadena = cadena.split("\\uD83D\\uDC4C").join("&#128076;");
	cadena = cadena.split("\\uD83D\\uDC46").join("&#128070;");
	cadena = cadena.split("\\uD83D\\uDC47").join("&#128071;");
	cadena = cadena.split("\\uD83D\\uDC48").join("&#128072;");
	cadena = cadena.split("\\uD83D\\uDC49").join("&#128073;");
	cadena = cadena.split("\\uD83E\\uDD1F").join("&#129311;");

	cadena = cadena.split("\\u2665").join("&#9829;");
	cadena = cadena.split("\\u263A").join("&#9786;");
	cadena = cadena.split("\\u2639").join("&#9785;");
	cadena = cadena.split("\\u270A").join("&#9994;");
	cadena = cadena.split("\\u270C").join("&#9996;");
	cadena = cadena.split("\\u00BF").join("&#191;");
	cadena = cadena.split("\\u00A1").join("&#161;");

	cadena = cadena.split("\\ud83d\\udd95\\ud83c\\udffb").join("&#128405;");

	cadena = cadena.split("\\ud83d\\ude00").join("&#128512;");
	cadena = cadena.split("\\ud83d\\ude01").join("&#128513;");
	cadena = cadena.split("\\ud83d\\ude02").join("&#128514;");
	cadena = cadena.split("\\ud83d\\ude03").join("&#128515;");
	cadena = cadena.split("\\ud83d\\ude04").join("&#128516;");
	cadena = cadena.split("\\ud83d\\ude05").join("&#128517;");
	cadena = cadena.split("\\ud83d\\ude06").join("&#128518;");
	cadena = cadena.split("\\ud83d\\ude07").join("&#128519;");
	cadena = cadena.split("\\ud83d\\ude08").join("&#128520;");
	cadena = cadena.split("\\ud83d\\ude09").join("&#128521;");
	cadena = cadena.split("\\ud83d\\ude0a").join("&#128522;");


	cadena = cadena.split("\\ud83d\\ude0b").join("&#128523;");
	cadena = cadena.split("\\ud83d\\ude0c").join("&#128524;");
	cadena = cadena.split("\\ud83d\\ude0d").join("&#128525;");
	cadena = cadena.split("\\ud83d\\ude0e").join("&#128526;");
	cadena = cadena.split("\\ud83d\\ude0f").join("&#128527;");
	cadena = cadena.split("\\ud83d\\ude10").join("&#128528;");
	cadena = cadena.split("\\ud83d\\ude11").join("&#128529;");
	cadena = cadena.split("\\ud83d\\ude12").join("&#128530;");
	cadena = cadena.split("\\ud83d\\ude13").join("&#128531;");
	cadena = cadena.split("\\ud83d\\ude14").join("&#128532;");

	cadena = cadena.split("\\ud83d\\ude15").join("&#128533;");
	cadena = cadena.split("\\ud83d\\ude16").join("&#128534;");
	cadena = cadena.split("\\ud83d\\ude17").join("&#128535;");
	cadena = cadena.split("\\ud83d\\ude18").join("&#128536;");
	cadena = cadena.split("\\ud83d\\ude19").join("&#128537;");
	cadena = cadena.split("\\ud83d\\ude1a").join("&#128538;");
	cadena = cadena.split("\\ud83d\\ude1b").join("&#128539;");
	cadena = cadena.split("\\ud83d\\ude1c").join("&#128540;");
	cadena = cadena.split("\\ud83d\\ude1d").join("&#128541;");
	cadena = cadena.split("\\ud83d\\ude1e").join("&#128542;");

	cadena = cadena.split("\\ud83d\\ude1f").join("&#128543;");
	cadena = cadena.split("\\ud83d\\ude20").join("&#128544;");
	cadena = cadena.split("\\ud83d\\ude21").join("&#128545;");
	cadena = cadena.split("\\ud83d\\ude22").join("&#128546;");
	cadena = cadena.split("\\ud83d\\ude23").join("&#128547;");
	cadena = cadena.split("\\ud83d\\ude24").join("&#128548;");
	cadena = cadena.split("\\ud83d\\ude25").join("&#128549;");
	cadena = cadena.split("\\ud83d\\ude26").join("&#128550;");
	cadena = cadena.split("\\ud83d\\ude27").join("&#128551;");
	cadena = cadena.split("\\ud83d\\ude28").join("&#128552;");

	cadena = cadena.split("\\ud83d\\ude29").join("&#128553;");
	cadena = cadena.split("\\ud83d\\ude2a").join("&#128554;");
	cadena = cadena.split("\\ud83d\\ude2b").join("&#128555;");
	cadena = cadena.split("\\ud83d\\ude2c").join("&#128556;");
	cadena = cadena.split("\\ud83d\\ude2d").join("&#128557;");
	cadena = cadena.split("\\ud83d\\ude2e").join("&#128558;");
	cadena = cadena.split("\\ud83d\\ude2f").join("&#128559;");
	cadena = cadena.split("\\ud83d\\ude30").join("&#128560;");
	cadena = cadena.split("\\ud83d\\ude31").join("&#128561;");
	cadena = cadena.split("\\ud83d\\ude32").join("&#128562;");

	cadena = cadena.split("\\ud83d\\ude33").join("&#128563;");
	cadena = cadena.split("\\ud83d\\ude34").join("&#128564;");
	cadena = cadena.split("\\ud83d\\ude35").join("&#128565;");
	cadena = cadena.split("\\ud83d\\ude36").join("&#128566;");
	cadena = cadena.split("\\ud83d\\ude37").join("&#128567;");
	cadena = cadena.split("\\ud83d\\ude38").join("&#128568;");
	cadena = cadena.split("\\ud83d\\ude39").join("&#128569;");
	cadena = cadena.split("\\ud83d\\ude3a").join("&#128570;");
	cadena = cadena.split("\\ud83d\\ude3b").join("&#128571;");
	cadena = cadena.split("\\ud83d\\ude3c").join("&#128572;");

	cadena = cadena.split("\\ud83d\\ude3d").join("&#128573;");
	cadena = cadena.split("\\ud83d\\ude3e").join("&#128574;");
	cadena = cadena.split("\\ud83d\\ude3f").join("&#128575;");
	cadena = cadena.split("\\ud83d\\ude40").join("&#128576;");
	cadena = cadena.split("\\ud83d\\ude41").join("&#128577;");
	cadena = cadena.split("\\ud83d\\ude42").join("&#128578;");
	cadena = cadena.split("\\ud83d\\ude43").join("&#128579;");
	cadena = cadena.split("\\ud83d\\ude44").join("&#128580;");
	cadena = cadena.split("\\ud83d\\ude45").join("&#128581;");
	cadena = cadena.split("\\ud83d\\ude46").join("&#128582;");

	cadena = cadena.split("\\ud83d\\ude47").join("&#128583;");
	cadena = cadena.split("\\ud83d\\ude48").join("&#128584;");
	cadena = cadena.split("\\ud83d\\ude49").join("&#128585;");
	cadena = cadena.split("\\ud83d\\ude4a").join("&#128586;");
	cadena = cadena.split("\\ud83d\\ude4b").join("&#128587;");
	cadena = cadena.split("\\ud83d\\ude4c").join("&#128588;");
	cadena = cadena.split("\\ud83d\\ude4d").join("&#128589;");
	cadena = cadena.split("\\ud83d\\ude4e").join("&#128590;");
	cadena = cadena.split("\\ud83d\\ude4f").join("&#128591;");
	cadena = cadena.split("\\ud83d\\ude50").join("&#128592;");

	cadena = cadena.split("\\ud83d\\ude51").join("&#128593;");
	cadena = cadena.split("\\ud83d\\ude52").join("&#128594;");
	cadena = cadena.split("\\ud83d\\ude53").join("&#128595;");
	cadena = cadena.split("\\ud83d\\ude54").join("&#128596;");
	cadena = cadena.split("\\ud83d\\ude55").join("&#128597;");
	cadena = cadena.split("\\ud83d\\ude56").join("&#128598;");
	cadena = cadena.split("\\ud83d\\ude57").join("&#128599;");
	cadena = cadena.split("\\ud83d\\ude58").join("&#128600;");
	cadena = cadena.split("\\ud83d\\ude59").join("&#128601;");
	cadena = cadena.split("\\ud83d\\ude5a").join("&#128602;");

	cadena = cadena.split("\\ud83d\\ude5b").join("&#128603;");
	cadena = cadena.split("\\ud83d\\ude5c").join("&#128604;");
	cadena = cadena.split("\\ud83d\\ude5d").join("&#128605;");
	cadena = cadena.split("\\ud83d\\ude5e").join("&#128606;");
	cadena = cadena.split("\\ud83d\\ude5f").join("&#128607;");
	cadena = cadena.split("\\ud83d\\ude60").join("&#128608;");
	cadena = cadena.split("\\ud83d\\ude61").join("&#128609;");
	cadena = cadena.split("\\ud83d\\ude62").join("&#128610;");
	cadena = cadena.split("\\ud83d\\ude63").join("&#128611;");
	cadena = cadena.split("\\ud83d\\ude64").join("&#128612;");

	cadena = cadena.split("\\ud83d\\ude65").join("&#128613;");
	cadena = cadena.split("\\ud83d\\ude66").join("&#128614;");
	cadena = cadena.split("\\ud83d\\ude67").join("&#128615;");
	cadena = cadena.split("\\ud83d\\ude68").join("&#128616;");
	cadena = cadena.split("\\ud83d\\ude69").join("&#128617;");
	cadena = cadena.split("\\ud83d\\ude6a").join("&#128618;");
	cadena = cadena.split("\\ud83d\\ude6b").join("&#128619;");
	cadena = cadena.split("\\ud83d\\ude6c").join("&#128620;");
	cadena = cadena.split("\\ud83d\\ude6d").join("&#128621;");
	cadena = cadena.split("\\ud83d\\ude6e").join("&#128622;");

	cadena = cadena.split("\\ud83d\\ude6f").join("&#128623;");
	cadena = cadena.split("\\ud83d\\ude70").join("&#128624;");
	cadena = cadena.split("\\ud83d\\ude71").join("&#128625;");
	cadena = cadena.split("\\ud83d\\ude72").join("&#128626;");
	cadena = cadena.split("\\ud83d\\ude73").join("&#128627;");
	cadena = cadena.split("\\ud83d\\ude74").join("&#128628;");
	cadena = cadena.split("\\ud83d\\ude75").join("&#128629;");
	cadena = cadena.split("\\ud83d\\ude76").join("&#128630;");
	cadena = cadena.split("\\ud83d\\ude77").join("&#128631;");
	cadena = cadena.split("\\ud83d\\ude78").join("&#128632;");

	cadena = cadena.split("\\ud83d\\ude79").join("&#128633;");
	cadena = cadena.split("\\ud83d\\ude7a").join("&#128634;");
	cadena = cadena.split("\\ud83d\\ude7b").join("&#128635;");
	cadena = cadena.split("\\ud83d\\ude7c").join("&#128636;");
	cadena = cadena.split("\\ud83d\\ude7d").join("&#128637;");
	cadena = cadena.split("\\ud83d\\ude7e").join("&#128638;");
	cadena = cadena.split("\\ud83d\\ude7f").join("&#128639;");
	cadena = cadena.split("\\ud83d\\ude80").join("&#128640;");
	cadena = cadena.split("\\ud83d\\ude81").join("&#128641;");
	cadena = cadena.split("\\ud83d\\ude82").join("&#128642;");

	cadena = cadena.split("\\ud83d\\ude83").join("&#128643;");
	cadena = cadena.split("\\ud83d\\ude84").join("&#128644;");
	cadena = cadena.split("\\ud83d\\ude85").join("&#128645;");
	cadena = cadena.split("\\ud83d\\ude86").join("&#128646;");
	cadena = cadena.split("\\ud83d\\ude87").join("&#128647;");
	cadena = cadena.split("\\ud83d\\ude88").join("&#128648;");
	cadena = cadena.split("\\ud83d\\ude89").join("&#128649;");
	cadena = cadena.split("\\ud83d\\ude8a").join("&#128650;");
	cadena = cadena.split("\\ud83d\\ude8b").join("&#128651;");
	cadena = cadena.split("\\ud83d\\ude8c").join("&#128652;");

	cadena = cadena.split("\\ud83d\\ude8d").join("&#128653;");
	cadena = cadena.split("\\ud83d\\ude8e").join("&#128654;");
	cadena = cadena.split("\\ud83d\\ude8f").join("&#128655;");
	cadena = cadena.split("\\ud83d\\ude90").join("&#128656;");
	cadena = cadena.split("\\ud83d\\ude91").join("&#128657;");
	cadena = cadena.split("\\ud83d\\ude92").join("&#128658;");
	cadena = cadena.split("\\ud83d\\ude93").join("&#128659;");
	cadena = cadena.split("\\ud83d\\ude94").join("&#128660;");
	cadena = cadena.split("\\ud83d\\ude95").join("&#128661;");
	cadena = cadena.split("\\ud83d\\ude96").join("&#128662;");

	cadena = cadena.split("\\ud83d\\ude97").join("&#128663;");
	cadena = cadena.split("\\ud83d\\ude98").join("&#128664;");
	cadena = cadena.split("\\ud83d\\ude99").join("&#128665;");
	cadena = cadena.split("\\ud83d\\ude9a").join("&#128666;");
	cadena = cadena.split("\\ud83d\\ude9b").join("&#128667;");
	cadena = cadena.split("\\ud83d\\ude9c").join("&#128668;");
	cadena = cadena.split("\\ud83d\\ude9d").join("&#128669;");
	cadena = cadena.split("\\ud83d\\ude9e").join("&#128670;");
	cadena = cadena.split("\\ud83d\\ude9f").join("&#128671;");
	cadena = cadena.split("\\ud83d\\udea0").join("&#128672;");

	cadena = cadena.split("\\ud83d\\udea1").join("&#128673;");
	cadena = cadena.split("\\ud83d\\udea2").join("&#128674;");
	cadena = cadena.split("\\ud83d\\udea3").join("&#128675;");
	cadena = cadena.split("\\ud83d\\udea4").join("&#128676;");
	cadena = cadena.split("\\ud83d\\udea5").join("&#128677;");
	cadena = cadena.split("\\ud83d\\udea6").join("&#128678;");
	cadena = cadena.split("\\ud83d\\udea7").join("&#128679;");
	cadena = cadena.split("\\ud83d\\udea8").join("&#128680;");
	cadena = cadena.split("\\ud83d\\udea9").join("&#128681;");
	cadena = cadena.split("\\ud83d\\udeaa").join("&#128682;");

	cadena = cadena.split("\\ud83d\\udeab").join("&#128683;");
	cadena = cadena.split("\\ud83d\\udeac").join("&#128684;");
	cadena = cadena.split("\\ud83d\\udead").join("&#128685;");
	cadena = cadena.split("\\ud83d\\udeae").join("&#128686;");
	cadena = cadena.split("\\ud83d\\udeaf").join("&#128687;");
	cadena = cadena.split("\\ud83d\\udeb0").join("&#128688;");
	cadena = cadena.split("\\ud83d\\udeb1").join("&#128689;");
	cadena = cadena.split("\\ud83d\\udeb2").join("&#128690;");
	cadena = cadena.split("\\ud83d\\udeb3").join("&#128691;");
	cadena = cadena.split("\\ud83d\\udeb4").join("&#128692;");

	cadena = cadena.split("\\ud83d\\udeb5").join("&#128693;");
	cadena = cadena.split("\\ud83d\\udeb6").join("&#128694;");
	cadena = cadena.split("\\ud83d\\udeb7").join("&#128695;");
	cadena = cadena.split("\\ud83d\\udeb8").join("&#128696;");
	cadena = cadena.split("\\ud83d\\udeb9").join("&#128697;");
	cadena = cadena.split("\\ud83d\\udeba").join("&#128698;");
	cadena = cadena.split("\\ud83d\\udebb").join("&#128699;");
	cadena = cadena.split("\\ud83d\\udebc").join("&#128700;");
	cadena = cadena.split("\\ud83d\\udebd").join("&#128701;");
	cadena = cadena.split("\\ud83d\\udebe").join("&#128702;");

	cadena = cadena.split("\\ud83d\\udebf").join("&#128703;");
	cadena = cadena.split("\\ud83d\\udec0").join("&#128704;");
	cadena = cadena.split("\\ud83d\\udec1").join("&#128705;");
	cadena = cadena.split("\\ud83d\\udec2").join("&#128706;");
	cadena = cadena.split("\\ud83d\\udec3").join("&#128707;");
	cadena = cadena.split("\\ud83d\\udec4").join("&#128708;");
	cadena = cadena.split("\\ud83d\\udec5").join("&#128709;");
	cadena = cadena.split("\\ud83d\\udec6").join("&#128710;");
	cadena = cadena.split("\\ud83d\\udec7").join("&#128711;");
	cadena = cadena.split("\\ud83d\\udec8").join("&#128712;");

	cadena = cadena.split("\\ud83e\\udd70").join("&#129392;");
	cadena = cadena.split("\\ud83c\\udfa4").join("&#127908;");
	cadena = cadena.split("\\ud83e\\udd28").join("&#129320;");
	cadena = cadena.split("\\ud83d\\udc4f").join("&#128079;");
	cadena = cadena.split("\\ud83d\\udc40").join("&#128064;");
	cadena = cadena.split("\\ud83e\\udd7a").join("&#129402;");
	cadena = cadena.split("\\ud83c\\udfa7").join("&#127911;");
	cadena = cadena.split("\\ud83e\\udd24").join("&#129316;");

	cadena = cadena.split("\\ud83e\\udd23").join("&#129315;");
	cadena = cadena.split("\\ud83e\\udd2a").join("&#129322;");
	cadena = cadena.split("\\ud83e\\uddd0").join("&#129488;");
	cadena = cadena.split("\\ud83e\\udd13").join("&#129299;");
	cadena = cadena.split("\\ud83e\\udd29").join("&#129321;");
	cadena = cadena.split("\\ud83e\\udd73").join("&#129395;");
	cadena = cadena.split("\\ud83e\\udd2c").join("&#129324;");
	cadena = cadena.split("\\ud83e\\udd2f").join("&#129327;");
	cadena = cadena.split("\\ud83e\\udd75").join("&#129397;");
	cadena = cadena.split("\\ud83e\\udd76").join("&#129398;");

	cadena = cadena.split("\\ud83e\\udd17").join("&#129303;");
	cadena = cadena.split("\\ud83e\\udd14").join("&#129300;");
	cadena = cadena.split("\\ud83e\\udd2d").join("&#129325;");
	cadena = cadena.split("\\ud83e\\udd2b").join("&#129323;");
	cadena = cadena.split("\\ud83e\\udd25").join("&#129317;");
	cadena = cadena.split("\\ud83e\\udd10").join("&#129296;");
	cadena = cadena.split("\\ud83e\\udd74").join("&#129396;");
	cadena = cadena.split("\\ud83e\\udd22").join("&#129314;");
	cadena = cadena.split("\\ud83e\\udd2e").join("&#129326;");
	cadena = cadena.split("\\ud83e\\udd27").join("&#129319;");

	cadena = cadena.split("\\ud83e\\udd12").join("&#129298;");
	cadena = cadena.split("\\ud83e\\udd15").join("&#129301;");
	cadena = cadena.split("\\ud83e\\udd11").join("&#129297;");
	cadena = cadena.split("\\ud83e\\udd32").join("&#129330;");
	cadena = cadena.split("\\ud83d\\udc50").join("&#128080;");
	cadena = cadena.split("\\ud83c\\udffb").join("&#127995;");
	cadena = cadena.split("\\ud83e\\udd1d").join("&#129309;");
	cadena = cadena.split("\\ud83d\\udc4d").join("&#128077;");
	cadena = cadena.split("\\ud83d\\udc4e").join("&#128078;");
	cadena = cadena.split("\\ud83d\\udc4a").join("&#128074;");

	cadena = cadena.split("\\ud83e\\udd1b").join("&#129307;");
	cadena = cadena.split("\\ud83e\\udd1c").join("&#129308;");
	cadena = cadena.split("\\ud83e\\udd1e").join("&#129310;");
	cadena = cadena.split("\\ud83e\\udd18").join("&#129304;");
	cadena = cadena.split("\\ud83d\\udc4c").join("&#128076;");
	cadena = cadena.split("\\ud83d\\udc46").join("&#128070;");
	cadena = cadena.split("\\ud83d\\udc47").join("&#128071;");
	cadena = cadena.split("\\ud83d\\udc48").join("&#128072;");
	cadena = cadena.split("\\ud83d\\udc49").join("&#128073;");
	cadena = cadena.split("\\ud83e\\udd1f").join("&#129311;");



	cadena = cadena.split("\\u2665").join("&#9829;");
	cadena = cadena.split("\\u263a").join("&#9786;");
	cadena = cadena.split("\\u2639").join("&#9785;");
	cadena = cadena.split("\\u270a").join("&#9994;");
	cadena = cadena.split("\\u270c").join("&#9996;");
	cadena = cadena.split("\\u00bf").join("&#191;");
	cadena = cadena.split("\\u00a1").join("&#161;");

	cadena = cadena.split("\\u00c1").join("&Aacute;");
	cadena = cadena.split("\\u00e1").join("&aacute;");
	cadena = cadena.split("\\u00c9").join("&Eacute;");
	cadena = cadena.split("\\u00e9").join("&eacute;");
	cadena = cadena.split("\\u00cd").join("&Iacute;");
	cadena = cadena.split("\\u00ed").join("&iacute;");
	cadena = cadena.split("\\u00d3").join("&Oacute;");
	cadena = cadena.split("\\u00f3").join("&oacute;");
	cadena = cadena.split("\\u00da").join("&Uacute;");
	cadena = cadena.split("\\u00fa").join("&uacute;");
	cadena = cadena.split("\\u00dc").join("&Uuml;");
	cadena = cadena.split("\\u00fc").join("&uuml;");
	cadena = cadena.split("\\u00d1").join("&Ntilde;");
	cadena = cadena.split("\\u00f1").join("&ntilde;");

	return cadena;
};

