
var clientes = [];
var paginacion = 0;
var paginacionTotal = 0;
var intervaloPag = 20;
var clienteSeleccionado = {}
var clientePreSeleccionado = {}
var nombrecompleto2="";
var ciudadArr = [];
var criteriosSeleccionEditarCliente=[];
var recargarcliente=false;
var telefonostxt = "";
var correotxt = "";

function abrirBuscarCliente() {
    if(!$("#buscarCliente").is(":visible")){
        paginacion = 0;
        paginacionTotal = 0;
        $("#buscar").val("");
        $("#listClientes").html("");
        $("#paginacion").remove()
        $("#seleccionarCliente").hide();
        $("#editarCliente").hide(); 
        $("#cancelarSeleccion").show();
        $("#buscarCliente").show();
        $("#displayClienteNuevo").hide();
        $("#displayScript").hide()
        $("#altadecitaContenedor").hide()
        $("#displayTipificacion").hide()
        $("#quitarTipificacion").hide()
        $("#webviewTipificacion").remove()
        pintarGrid([])
    }
}

function seleccionarCliente(){
    if(oSipSessionCall){

        var guardarNombre = { 
            nombrecliente: clientePreSeleccionado.id + " - " + clientePreSeleccionado.nombrecompleto,
            idLlamada: llamadaOk.idLlamada,
            idAgente: usuarioOk.CNUSERID,
            telefonoCliente:llamadaOk.telefonoCliente,
            idCliente: clientePreSeleccionado.id,
            clienteNombre: clientePreSeleccionado.nombrecompleto,
            idFolio: llamadaOk.idFolio
        }

        if(areaIniciada == "OBD"){
            ipcRenderer.send('guardarNombreO', guardarNombre)
        }else {
            ipcRenderer.send('guardarNombre', guardarNombre)
        }
    }
    $("#seleccionarCliente").hide();
    $("#editarCliente").hide(); 
    $("#cancelarSeleccion").hide();
    $("#buscarCliente").hide();
    
    //llenarDatosCliente(clienteSeleccionado);
}

ipcRenderer.on('guardarNombreResult', (event, result) => {
    if(result == "ok"){

        clienteSeleccionado = clientePreSeleccionado;

    }else{

        $("#alertPrincipal").html("<strong>Aviso.</strong>"  + result);
        $("#alertPrincipal").fadeTo(3000, 500).slideUp(500, function () {
            $("#alertPrincipal").slideUp(2000);
        });
        clienteSeleccionado = {}
    }
    tipificacion()
    llenarDatosCliente(clienteSeleccionado);

})

function cancelarBusquedaSelect(){
    $("#buscarCliente").hide();
    $("#seleccionarCliente").hide();
    $("#editarCliente").hide(); 
    $("#cancelarSeleccion").hide();
    llenarDatosCliente(clienteSeleccionado);
}

function runScript(e) {
    if (e.keyCode == 13) {
        paginacion = 0;
        consultarCliente("listClientes", "")
        return false;
    }
}

function consultarCliente(tipo, criterio){
    $(".loader").show()
    $("#buscar").prop('disabled', true);
    var obj = {};
    var datosPaginacion = {};
    datosPaginacion.inicio = paginacion;
    datosPaginacion.limite = intervaloPag;
    if(criterio == "" && tipo == "listClientes" ){
        obj.criterios = $("#buscar").val();

    }else{
        
        obj.criterios = criterio;
    }
    obj.datosPaginacion = datosPaginacion;
    ipcRenderer.send('consultarCliente', obj)

}
 
function paginacionBtn(pag){
    if(pag == "sig"){
        if(paginacion < paginacionTotal){
            paginacion = paginacion + intervaloPag;
        }
        consultarCliente("listClientes", "");

    }else if(pag == "ant"){
        if(paginacion <= 0){
            paginacion = 0;
        }else{
            paginacion = paginacion - intervaloPag;
        }
        consultarCliente("listClientes", "");
    }
}


ipcRenderer.on('consultarClienteResult', (event, datos) => {

    $("#buscar").prop('disabled', false);
    $("#listClientes").html("");
    clientes = datos.valor;
    pintarGrid(datos.valor)
    datos.valor.forEach(cliente => {
        $("#listClientes").append(
        '<li class="list-group-item">'+
        '<button style="margin-left:-11px;" type="button" onclick="verCliente('+cliente.id+')" class="btn btn-success btn-sm">Ver</button> '+
        cliente.id +" - "+cliente.nombrecompleto+
        '</li>'
        );  
    });
    $("#paginacion").remove()
    if(datos.total > intervaloPag){
        $("#listClientes").after(
            '<nav id="paginacion" aria-label="Page navigation example">'+
            '<ul class="pagination justify-content-end my-3">'+
            '<li class="page-item disabled">'+
                '<a class="link px-2" onclick="paginacionBtn(\'ant\')" style="color: #fff;" href="#">Anterior</a>'+
            '</li>'+
            '<li class="page-item">'+
            '<a class="link px-2" onclick="paginacionBtn(\'sig\')" style="color: #fff;" href="#">Siguiente</a>'+
            '</li>'+
            '</ul>'+
            '</nav>'
        )
    }
    if(clientes.length == 1 ){
        clientePreSeleccionado = clientes[0]
       // seleccionarCliente()
        $("#editarCliente").show(); 
    }
    paginacionTotal = datos.total;
    $(".loader").hide()
  
})


function verCliente(id){
    $("#seleccionarCliente").show();
    $("#cancelarSeleccion").show();
    $("#displayCliente").show();
    $("#displayScript").hide();
    $("#editarCliente").show(); 
    const result = clientes.filter(cliente => cliente.id == id)[0];
    clientePreSeleccionado = result;
    llenarDatosCliente(result);

}

/*  dany */

function pintarGrid(valores){
    var dataSet =[];
    valores.forEach(valor => {
        var data =[];
        data.push("");
        data.push('<button type="button" class="btn btn-sm col btn-info" onclick="verCliente('+valor.id+')" >'+valor.id+'</button>');
        data.push(valor.nombrecompleto);
        data.push(valor.correoElectronico);
        data.push(valor.telefonos);
       /* data.push(valor.regimen);
        data.push(valor.rfc);
        data.push(valor.curp);
        data.push(valor.nss);
        data.push(valor.codigoPostal);
        data.push(valor.calle);
        data.push(valor.numeroExterior);
        data.push(valor.numeroInterior);
        data.push(valor.colonia);
        data.push(valor.ciudad);
        data.push(valor.estado);
        data.push(valor.pais);*/
        dataSet.push(data)

    });

    $('#example').DataTable( {
        data: dataSet,
        "info":false, 
        "pagingType": "simple",
        "searching": false, 
        "responsive": {details: true},
        "select": true, 
        "ordering": true,
        "lengthMenu": [ 20 ],
	   	destroy: true,
	   //	language: lenguaje,
        columns: [
            { title: "" },
            { title: "Id" },
            { title: "Nombre" },
            { title: "Correo electrónico" },
            { title: "Teléfono" },
          /*  { title: "Regimen" },
            { title: "RFC" },
            { title: "CURP" },
            { title: "NSS" },
            { title: "CP" },
            { title: "Calle" },
            { title: "Número Ext" },
            { title: "Número Int" },
            { title: "Colonia" },
            { title: "Ciudad" },
            { title: "Estado" },
            { title: "País" },*/
            
        ]
    } );
    $('.dataTables_length').remove();
    $('#example thead').css("background", "#0c0c0cb8");
    $('#example thead').css("color", "#fff");
    $('#example').css("color", "#0c0c0c");
    $('#example').css("background", "#fff");
    $('#example').css("font-size", "14px");
    $('#example tr').css("cursor", "pointer");
    $('.dataTables_paginate').remove();
    $('#example tr td:first-child').css("width", "10px");
    $('#example thead tr th:first-child').css("width", "10px");
}

function pintarGridTelefono(valores){
    var dataSet =[];
    valores.forEach(valor => 
    {
        var data =[];        
        data.push(valor.BTCLIENTETELNO);
        data.push(valor.BTCLIENTETELTIPO);
        dataSet.push(data)
    });

    $('#gridTelefonos').DataTable( {
        data: dataSet,
        "info":false, 
        "pagingType": "simple",
        "searching": false, 
        "responsive": {details: true},
        "select": true, 
        "ordering": true,
        "lengthMenu": [ 20 ],
	   	destroy: true,
	   //	language: lenguaje,
        columns: [
            { title: "Telefono" },
            { title: "Tipo" }
            
        ]
    } );
    $('.dataTables_length').remove();
    $('#gridTelefonos thead').css("background", "#0c0c0cb8");
    $('#gridTelefonos thead').css("color", "#fff");
    $('#gridTelefonos').css("color", "#0c0c0c");
    $('#gridTelefonos').css("background", "#fff");
    $('#gridTelefonos').css("font-size", "14px");
    $('#gridTelefonos tr').css("cursor", "pointer");
    $('.dataTables_paginate').remove();
    $('#gridTelefonos tr td:first-child').css("width", "10px");
    $('#gridTelefonos thead tr th:first-child').css("width", "10px");
}

function pintarGridCorreos(valores){
    var dataSet =[];
    valores.forEach(valor => 
    {
        var data =[];        
        data.push(valor.BTCLIENTECORREO);
        dataSet.push(data)
    });

    $('#gridCorreos').DataTable( {
        data: dataSet,
        "info":false, 
        "pagingType": "simple",
        "searching": false, 
        "responsive": {details: true},
        "select": true, 
        "ordering": true,
        "lengthMenu": [ 20 ],
	   	destroy: true,
	   //	language: lenguaje,
        columns: [
            { title: "Correo" }
            
        ]
    } );
    $('.dataTables_length').remove();
    $('#gridCorreos thead').css("background", "#0c0c0cb8");
    $('#gridCorreos thead').css("color", "#fff");
    $('#gridCorreos').css("color", "#0c0c0c");
    $('#gridCorreos').css("background", "#fff");
    $('#gridCorreos').css("font-size", "14px");
    $('#gridCorreos tr').css("cursor", "pointer");
    $('.dataTables_paginate').remove();
    $('#gridCorreos tr td:first-child').css("width", "10px");
    $('#gridCorreos thead tr th:first-child').css("width", "10px");
}

function llenarDatosCliente(datos){
    if ($.isEmptyObject(datos)) {
        $("#idCliente").html("");
        $("#nombreCliente").html("");
        $("#correoCliente").html("");
        $("#telefonoCliente").html("");
     
        $("#generoCtoIput").val("");
        $("#fechaNacimientoCtoInput").val("");
        $("#curpCtoInput").val("");
        $("#afiliadoCtoInput").val("");
       $("#telefonoFijoInput").val("");
       $("#telefonoAlternativoInput").val("");
       $("#clineteCorreoInput").val("");
        $("#clineteCorreoInput").val("");
        $("#telefonoMovilInput").val("");
        $("#datoCURP").val("");
        $("#datoFechaNac").val("");
        $("#datoGenero").val("");
        $("#datoContacto").val("");
        $("#datoAfilio").val("");



    }else{
        $("#idCliente").html(datos.id);
        $("#nombreCliente").html(datos.nombrecompleto);
        if (datos.correoElectronico == "" || datos.correoElectronico == null || datos.correoElectronico == undefined) {
            $("#clineteCorreoInput").val(correotxt);
            $("#correoCliente").html(correotxt);    
        } else {
            $("#clineteCorreoInput").val(datos.correoElectronico);
            $("#correoCliente").html(datos.correoElectronico);
        }
        if (datos.telefonos == "" || datos.telefonos == null || datos.telefonos == undefined) {
            $("#telefonoCliente").html(telefonostxt);    
        } else {
            $("#telefonoCliente").html(datos.telefonos);
        }
        $("#generoCtoIput").val(datos.generoCtoIput);
        $("#fechaNacimientoCtoInput").val(datos.fechaNacimientoCtoInput);
        $("#curpCtoInput").val(datos.curpCtoInput);
        $("#afiliadoCtoInput").val(datos.afiliadoCtoInput);
       $("#telefonoFijoInput").val(datos.telefonoFijoInput);
       $("#telefonoAlternativoInput").val(datos.telefonoAlternativoInput);

        $("#telefonoMovilInput").val(datos.telefonoMovilInput);
        $("#datoCURP").html(datos.curpCtoInput);
        $("#datoFechaNac").html(datos.fechaNacimientoCtoInput);
        $("#datoGenero").html((datos.generoCtoIput == 1 ? "MASCULINO": "FEMENINO"));
        $("#datoAfilio").html(datos.afiliadoCtoInput);
        setTimeout(() => {
            $("#comboEstadoPersona").val(datos.estado)
            cmboMuncipioPersonaBuscar()
        }, 1000);

        setTimeout(() => {
            $("#comboMunicipioPersona").val(datos.municipio)
           
        }, 2000);

        setTimeout(() => {
            $("#comboSucursalesPersona").val(datos.sucursal)
        }, 4500);

       
    }
    /*$("#rfcCliente").html(datos.rfc);
    $("#nssCliente").html(datos.nss);
    $("#curpCliente").html(datos.curp);
    $("#cpCliente").html(datos.codigoPostal);
    if(datos.calle==undefined){
        datos.calle="";
    }
    if(datos.numeroInterior==undefined){
        datos.numeroInterior="";
    }
    if(datos.numeroExterior==undefined){
        datos.numeroExterior="";
    }
    $("#direccionCliente").html(datos.calle + " "+ datos.numeroInterior + " " + datos.numeroExterior);
    $("#coloniaCliente").html(datos.colonia);
    $("#ciudadCliente").html(datos.ciudadDSC);
    $("#estadoCliente").html(datos.estadoDSC);
    $("#fechaNacimientoCliente").html(datos.fechaNacimiento);
    $("#generoCliente").html(datos.genero);
    $("#paisCliente").html(datos.pais);*/
}



function crearNombreCompleto(clase){
   
    nombrecompleto2="";
    var nombreComp =  $("#primerNombreInput").val() + " " ;
    
    nombrecompleto2= $("#apellidoPaternoInput").val() + " " + $("#apellidoMaternoInput").val()+" ";
    nombrecompleto2+=   $("#primerNombreInput").val(); 
   /* var segundoNombreIn=$("#segundoNombreInput").val()
    if(segundoNombreIn=="")
    {

    }
    else
    {
        nombreComp+=segundoNombreIn+" ";
        nombrecompleto2+=" "+segundoNombreIn;
    }*/
    nombreComp += $("#apellidoPaternoInput").val() + " " + $("#apellidoMaternoInput").val();
    var entrarametodocliente=false;
    if( $("#nombreCompletoInput").val() != nombreComp){
        entrarametodocliente=true;
    }
    $("#nombreCompletoInput").val(nombreComp) 
   if(entrarametodocliente==true){
    metodoInsertar();
   }

    
}

function validarTelefono(telefono){    
    if (telefono.value.trim() == "" || telefono.value.toUpperCase() == "NO PROPORCIONA") {
        $('#'+telefono.id).val("NO PROPORCIONA");
    }
    if ($("#telefonoMovilInput").val().toUpperCase() =="NO PROPORCIONA" && $("#telefonoAlternativoInput").val().toUpperCase() =="NO PROPORCIONA" ){
        $('#'+telefono.id).val("");
    }
    metodoInsertar();
}
function metodoInsertar(){    
   
    if ($('#CRMINSCLIENTE').is(':visible') ) {    
        if(recargarcliente == false )     {
        if($("#nombreCompletoInput").val().trim()!="")     {
            insertarCte();  
        }
    }
    }     
}

/** Funciones para HTML **/
function Letras (string){//Solo letras
    var out = '';
    var filtro = 'abcdefghijklmnÃ±opqrstuvwxyzABCDEFGHIJKLMNÃ‘OPQRSTUVWXYZ ';//Caracteres validos
    
    //Recorrer el texto y verificar si el caracter se encuentra en la lista de validos 
    for (var i=0; i<string.length; i++)
       if (filtro.indexOf(string.charAt(i)) != -1) 
             //Se aÃ±aden a la salida los caracteres validos
         out += string.charAt(i);
    
    //Retornar valor filtrado
    return out;
}

function pestanasCRM(clase){
    $(".btn-aux-crm").addClass("btn-dark");
    $(".CRMPRINCIPALES").hide();
    $(".CRMTELEFONOS").hide();
    $(".CRMCORREOS").hide();
    $("."+clase).show();
    $("#"+clase).removeClass("btn-dark");
    $("#"+clase).addClass("btn-light");

    if(clase=="CRMPRINCIPALES")
    {
        $("#CRMINSCLIENTE").show();
        $("#CRMINSCORREOS").hide();
        $("#CRMINSTELEFONO").hide();
    }
    else if(clase=="CRMTELEFONOS")
    {
        if( $("#idClienteInput").val()!="")
            ipcRenderer.send('consultarTelefonos', $("#idClienteInput").val());
        
        $("#CRMINSCLIENTE").hide();
        $("#CRMINSCORREOS").hide();
        $("#CRMINSTELEFONO").show();
    }
    else if(clase=="CRMCORREOS")
    {
        if( $("#idClienteInput").val()!="")
            ipcRenderer.send('consultarCorreos', $("#idClienteInput").val());
        
        $("#CRMINSCLIENTE").hide();
        $("#CRMINSCORREOS").show();
        $("#CRMINSTELEFONO").hide();
    }

}


function nuevoCliente(){
    clientePreSeleccionado = {}
    var telefonoDesconocido=numeroRemoto.textContent;
    if(telefonoDesconocido=="unknown" || telefonoDesconocido=="null"||  telefonoDesconocido==null  || telefonoDesconocido=="navailable" || telefonoDesconocido=="unavailable" ){
        telefonoDesconocido="";
    }
    cmboEstadoPersonaBuscar()
    pestanasCRM("CRMPRINCIPALES");
    $("#displayClienteNuevo").show();
    $("#buscarCliente").hide();
    $("#displayScript").hide()
    $("#displayCliente").hide();
    $("#altadecitaContenedor").hide() ;  
    $("#telefonoInput").val(numeroRemoto.textContent);
    $("#telefonoInput").val();
  //  consultarPortabilidad();
    $("#clineteCorreoInput").val("");
    $("#telefonoFijoInput").val(telefonoDesconocido);
    $("#telefonoAlternativoInput").val("");
   // consultarEstados();  
   /*limpiardatos contacto*/
   $("#telefonoMovilInput").val(""),
    $("#generoCtoIput").val("");
    $("#fechaNacimientoCtoInput").val("");
    $("#curpCtoInput").val("");
    $("#afiliadoCtoInput").val("");
    $("#idClienteInput").val("");
    $("#primerNombreInput").val("");
    $("#apellidoPaternoInput").val("");
    $("#apellidoMaternoInput").val("");
    $("#nombreCompletoInput").val("");
}


function editarCliente(){
    cmboEstadoPersonaBuscar()
    criteriosSeleccionEditarCliente=clientePreSeleccionado;
   // consultarEstados();  
   quitarTipificacion(); 
    pestanasCRM("CRMPRINCIPALES");
    $("#displayClienteNuevo").hide();
    $("#displayScript").hide()
    $("#altadecitaContenedor").hide()
    $("#buscarCliente").hide();
    $("#displayCliente").hide();
    $("#displayScript").hide()
   
    $("#primerNombreInput").val(clientePreSeleccionado.primerNombre);
   // $("#segundoNombreInput").val(clientePreSeleccionado.segundoNombre);
    $("#apellidoPaternoInput").val(clientePreSeleccionado.apellidoPaterno); 
    $("#apellidoMaternoInput").val(clientePreSeleccionado.apellidoMaterno); 
    $("#idClienteInput").val(clientePreSeleccionado.id);
    setTimeout(() => {
        $("#comboEstadoPersona").val(clientePreSeleccionado.estado)
        cmboMuncipioPersonaBuscar();
        $("#comboMunicipioPersona").val(clientePreSeleccionado.municipio );
    }, 1000);

    setTimeout(() => {
        $("#comboMunicipioPersona").val(clientePreSeleccionado.municipio );
        $("#nombreCompletoInput").val(clientePreSeleccionado.nombrecompleto);
    }, 3000);
/*
    setTimeout(() => {
        $("#comboSucursalesPersona").val(clientePreSeleccionado.sucursal)
    }, 4500);*/
    $("#displayClienteNuevo").show();
    $("#displayScript").hide()
   
  /*  $("#rfcInput").val(clientePreSeleccionado.rfc);
    $("#nssInput").val(clientePreSeleccionado.nss);
    $("#curpInput").val(clientePreSeleccionado.curp);
    $("#codigoPostalInput").val(clientePreSeleccionado.codigoPostal);
    $("#coloniaInput").val(clientePreSeleccionado.colonia);
   
    $("#fechaNacimientoInput").val(clientePreSeleccionado.fechaNacimiento);
    $("#generoIput").val(clientePreSeleccionado.genero);
    $("#paisInput").val(clientePreSeleccionado.pais);

    $("#estadoInput").val(clientePreSeleccionado.estado);
    $("#numeroInteriorInput").val(clientePreSeleccionado.numeroInterior);
    $("#numeroExteriorInput").val(clientePreSeleccionado.numeroExterior);
    $("#calleInput").val(clientePreSeleccionado.calle);
    
    
   */
  
 
     

}

function insertarCte()
{
 var telefonoMovilInput= $("#telefonoMovilInput").val();
 var telefonoAlternativoInput=  $("#telefonoAlternativoInput").val();
 if($("#clineteCorreoInput").val().trim()==""){
    $("#clineteCorreoInput").val("");
 }
   
 if($("#telefonoMovilInput").val().toUpperCase() =="NO PROPORCIONA" && $("#telefonoAlternativoInput").val().toUpperCase() =="NO PROPORCIONA" ){
    telefonoMovilInput="";
}

if(($("#telefonoMovilInput").val().trim().length!= 10 && $("#telefonoMovilInput").val().toUpperCase() !="NO PROPORCIONA" ) ){ 
    telefonoMovilInput="";
}
if( $("#telefonoAlternativoInput").val().trim().length!= 10  && $("#telefonoAlternativoInput").val().toUpperCase() !="NO PROPORCIONA" ) { 
    telefonoAlternativoInput="";
}

   // $("#CRMINSCLIENTE").hide();
   if( new RegExp('^[0-9]*$').test($("#telefonoMovilInput").val().trim()) == false  && $("#telefonoMovilInput").val().toUpperCase() !="NO PROPORCIONA" ){ 
    telefonoMovilInput="";
}
if( new RegExp('^[0-9]*$').test($("#telefonoAlternativoInput").val().trim()) == false  && $("#telefonoAlternativoInput").val().toUpperCase() !="NO PROPORCIONA"  ){ 
    telefonoAlternativoInput="";
}

    var obj2 = $(".CRMPRINCIPALES input");
    var obj_ = $(".CRMPRINCIPALES select");    
    var obj = {
        idLlamada: llamadaOk.idLlamada,
        idAgente: usuarioOk.CNUSERID,
        telefonoCliente:llamadaOk.telefonoCliente,      
        idFolio: llamadaOk.idFolio,
        urls: urls.ipCRM,
        nombreAgente: llamadaOk.nombreAgente,
        extension: llamadaOk.extension,
        canalId: llamadaOk.canalId,
        rutaIVR: llamadaOk.rutaIVR,

        primerNombre: $("#primerNombreInput").val(), 
        apellidoPaterno: $("#apellidoPaternoInput").val(),  
        apellidoMaterno: $("#apellidoMaternoInput").val(),  
        nombreCompleto: $("#nombreCompletoInput").val(),  
        estado: $("#comboEstadoPersona").val(), 
        municipio: $("#comboMunicipioPersona").val(), 
        sucursal: $("#comboSucursalesPersona").val(), 
      
        correoElectronico:  $("#clineteCorreoInput").val(),
        correo:$("#clineteCorreoInput").val(),
        nir: $("#nirInput").val(),
        serie: $("#serieInput").val(),
        razon: $("#compaInput").val(),
        telefono: $("#telefonoInput").val().trim(),
        tipo: $("#tipoTelefonoIput").val(),
        nombrecompleto2:nombrecompleto2,
        /*datos contacto*/
        telefonoFijoInput: $("#telefonoFijoInput").val().trim(),
        telefonoAlternativoInput: telefonoAlternativoInput ,
        telefonoMovilInput:telefonoMovilInput,
        generoCtoIput: $("#generoCtoIput").val(),
        fechaNacimientoCtoInput: $("#fechaNacimientoCtoInput").val(),
        curpCtoInput: $("#curpCtoInput").val(),
        afiliadoCtoInput: $("#afiliadoCtoInput").val(),       
        
    };

    if($("#idClienteInput").val()=="")
    {
        ipcRenderer.send('insertarCte', obj);
    }
    else
    {
        obj.id=$("#idClienteInput").val();
        ipcRenderer.send('actualizarCte', obj)
    }    
}


ipcRenderer.on('insertarCteResult', (event, datos) => {
   
    $("#CRMINSCLIENTE").show();
    
    if($("#idClienteInput").val()=="")
    {
     //   $("#actuaGuarda").html("<Strong>Aviso.</Strong> Persona se guardado");
    }
    else
    {
       // $("#actuaGuarda").html("<Strong>Aviso.</Strong> Persona se actualizado");
    }
    
   /* $("#actuaGuarda").fadeTo(3000, 500).slideUp(500, function()
    {
        $("#actuaGuarda").slideUp(3000);
    });*/
    
    llenarCamposAltainsertarCte(datos.valores);
    clientePreSeleccionado = datos.resultado;
    if(datos.result!="OK"){
        clientePreSeleccionado = {}
        $("#actuaGuarda").html("<Strong>Aviso.</Strong>"+datos.result+"");
        $("#actuaGuarda").fadeTo(3000, 500).slideUp(500, function()
        {
            $("#actuaGuarda").slideUp(3000);
         });
         return;
    }
})

function llenarCamposAltainsertarCte( datos){
    if(datos ==""){
        datos = {
            apellidoMaterno: "",
            apellidoPaterno: "",
            correoElectronico: "",
            correo:"",
            id: "",
            nombrecompleto: "",
            primerNombre: "",
            generoCtoIput:"",
            fechaNacimientoCtoInput: "",
            curpCtoInput: "",
            afiliadoCtoInput: "", 
            telefonos: "",
            telefonoFijoInput:"",
            telefonoAlternativoInput:"",
            telefonoMovilInput:"",
           
        }

    }

   

    $("#idClienteInput").val(datos.id);  

 

}


function insertarCliente(numero)
{
    var obj2 = $(".CRMPRINCIPALES input");
    var obj_ = $(".CRMPRINCIPALES select");
    for(var i = 0; i < obj2.length; i++ ){
        if(obj2[i].id =="primerNombreInput" && obj2[i].value =="" ){
            $("#CRMINSCLIENTE").show();
            $("#actuaGuarda").html("<Strong>Aviso.</Strong> Es necesario llenar el campo nombre");
            $("#actuaGuarda").fadeTo(3000, 500).slideUp(500, function()
            {
                $("#actuaGuarda").slideUp(3000);
            });
            return;
        }
        if(obj2[i].id == "apellidoPaternoInput" && obj2[i].value ==""){
            $("#actuaGuarda").html("<Strong>Aviso.</Strong> Es necesario llenar el campo Apellido paterno");
            $("#actuaGuarda").fadeTo(3000, 500).slideUp(500, function()
            {
                $("#actuaGuarda").slideUp(3000);
            });
            $("#CRMINSCLIENTE").show();
            return;
        }
    }
    for(var i = 0; i < obj_.length; i++ ){
        if(obj_[i].id == "REGIMENInput" &&  (obj_[i].value ==""  || obj_[i].value == "NOSELECT") ){
            $("#actuaGuarda").html("<Strong>Aviso.</Strong> Es necesario seleccionar un Estado");
            $("#actuaGuarda").fadeTo(3000, 500).slideUp(500, function()
            {
                $("#actuaGuarda").slideUp(3000);
            });
            $("#CRMINSCLIENTE").show();
            return;
        }
        if(obj_[i].id == "sectorInput" &&  (obj_[i].value ==""  || obj_[i].value == "NOSELECT") ){
            $("#actuaGuarda").html("<Strong>Aviso.</Strong> Es necesario seleccionar un Estado");
            $("#actuaGuarda").fadeTo(3000, 500).slideUp(500, function()
            {
                $("#actuaGuarda").slideUp(3000);
            });
            $("#CRMINSCLIENTE").show();
            return;
        }

        if(obj_[i].id == "comboEstadoPersona" &&  (obj_[i].value ==""  || obj_[i].value == "NOSELECT") ){
            $("#actuaGuarda").html("<Strong>Aviso.</Strong> Es necesario seleccionar un Estado");
            $("#actuaGuarda").fadeTo(3000, 500).slideUp(500, function()
            {
                $("#actuaGuarda").slideUp(3000);
            });
            $("#CRMINSCLIENTE").show();
            return;
        }
        
    }

    if($("#telefonoInput").val() ==""  ){
        $("#telefonoInput").val("NO PROPORCIONA")
    }
    

    
    if( new RegExp('^[0-9]*$').test($("#telefonoInput").val().trim()) == false && $("#telefonoInput").val().toUpperCase() !="NO PROPORCIONA" ){ 
        $("#actuaGuarda").html("<Strong>Aviso.</Strong> Ingrese Teléfono valido ");
        $("#actuaGuarda").fadeTo(3000, 500).slideUp(500, function()
        {
            $("#actuaGuarda").slideUp(3000);
        });
        $("#CRMINSCLIENTE").show();
        return;
    }
    
    
    if(($("#telefonoInput").val().trim().length!= 10 && $("#telefonoInput").val().toUpperCase() !="NO PROPORCIONA" )){ 
        $("#actuaGuarda").html("<Strong>Aviso.</Strong> Ingrese Teléfono a 10 digitos  ");
        $("#actuaGuarda").fadeTo(3000, 500).slideUp(500, function()
        {
            $("#actuaGuarda").slideUp(3000);
        });
        $("#CRMINSCLIENTE").show();
        return;
    }
    var obj = {
        idLlamada: llamadaOk.idLlamada,
        idAgente: usuarioOk.CNUSERID,
        telefonoCliente:llamadaOk.telefonoCliente,      
        idFolio: llamadaOk.idFolio,
        urls: urls.ipCRM,
        nombreAgente: llamadaOk.nombreAgente,
        extension: llamadaOk.extension,
        canalId: llamadaOk.canalId,
        rutaIVR: llamadaOk.rutaIVR,
        rfc: $("#RFCInput").val(),
        pyme:$("#pYMEInput").val(),
        regimen:$("#REGIMENInput").val(),
        sector:$("#sectorInput").val(),
        primerNombre: $("#primerNombreInput").val(),      
        apellidoPaterno: $("#apellidoPaternoInput").val(),  
        apellidoMaterno: $("#apellidoMaternoInput").val(),  
        nombreCompleto: $("#nombreCompletoInput").val(),
        correo:$("#clineteCorreoInput").val(),
        edad:$("#edadInput").val(),  
        estado: $("#comboEstadoPersona").val(), 
        municipio: $("#comboMunicipioPersona").val(), 
        sucursal: $("#comboSucursalesPersona").val(), 
        genero: $("#GeneroInput").val(), 
        telefono: $("#telefonoInput").val(),
        tipotelefono:$("#TipotelInput").val(),
        Extesion:$("#ExtesionInput").val(), 
        codigoPostal: $("#cpInput").val(),
        Actividad:$("#ActividadInput").val(),
        ActividadOtro:$("#ActividadOtroInput").val(),
        Medio:$("#MedioInput").val(),
        OtroCanal:$("#OtroCanalInput").val(),
       /*   
        nss: $("#nssInput").val(),  
        curp: $("#curpInput").val(),  
          
        numeroExterior: $("#numeroExteriorInput").val(),  
        numeroInterior: $("#numeroInteriorInput").val(),  
        calle: $("#calleInput").val(),  
        colonia: $("#coloniaInput").val(),  
        ciudad: $("#ciudadInput").val(),  
         
        fechaNacimiento: $("#fechaNacimientoInput").val(),  
         
        pais: $("#paisInput").val(),  
        direccion: "",  */
        correoElectronico: "",
        nir: $("#nirInput").val(),
        serie: $("#serieInput").val(),
        razon: $("#compaInput").val(),
        telefono: $("#telefonoInput").val(),
        tipo: $("#tipoTelefonoIput").val(),
        correoElectronico:  $("#clineteCorreoInput").val(),
        correo:$("#clineteCorreoInput").val(), 
        nombrecompleto2:nombrecompleto2,
        /*datos contacto*/

        telefonoAlternativoInput:$("#telefonoAlternativoInput").val(),
        telefonoMovilInput: $("#telefonoMovilInput").val(),
        generoCtoIput: $("#generoCtoIput").val(),
        fechaNacimientoCtoInput: $("#fechaNacimientoCtoInput").val(),
        curpCtoInput: $("#curpCtoInput").val(),
        afiliadoCtoInput: $("#afiliadoCtoInput").val(),
    };

    telefonostxt = $("#telefonoInput").val();
    
    correotxt = $("#clineteCorreoInput").val();

    if($("#idClienteInput").val()=="")
    {
        ipcRenderer.send('insertarDatosCliente', obj);
    }
    else
    {
        obj.id=$("#idClienteInput").val();
        ipcRenderer.send('actualizarDatosCliente', obj)
    }
    
}


ipcRenderer.on('insertarDatosClienteResult', (event, datos) => {
  
    $("#CRMINSCLIENTE").show();
    //$("#btnCancelarAltaCliente").show();
    if($("#idClienteInput").val()=="")
    {
        $("#actuaGuarda").html("<Strong>Aviso.</Strong> Persona se guardado");
    }
    else
    {
        $("#actuaGuarda").html("<Strong>Aviso.</Strong> Persona se actualizado");
    }
    
    $("#actuaGuarda").fadeTo(3000, 500).slideUp(500, function()
    {
        $("#actuaGuarda").slideUp(3000);
    });
    llenarCamposAlta(datos.valores);
    clientePreSeleccionado = datos.resultado;
    if(datos.result!="OK"){
        clientePreSeleccionado = {}
        $("#actuaGuarda").html("<Strong>Aviso.</Strong>"+datos.result+"");
        $("#actuaGuarda").fadeTo(3000, 500).slideUp(500, function()
        {
            $("#actuaGuarda").slideUp(3000);
         });
         return;
    }
})

ipcRenderer.on('consultarTelefonosResult', (event, datos) =>
 {
    pintarGridTelefono(datos);
    
})

ipcRenderer.on('consultarCorreosResult', (event, datos) =>
 {
    pintarGridCorreos(datos);
    
})


function consultarPortabilidad()
{
    ipcRenderer.send('consultarPortabilidad',$("#telefonoInput").val() )
}


ipcRenderer.on('consultarPortabilidadResult', (event, datos) => {

    $("#nirInput").val(datos[0].NIR) ;
    $("#compaInput").val(datos[0].RAZON_SOCIAL);
    $("#serieInput").val(datos[0].SERIE);
    $("#redInput").val(datos[0].TIPO_DE_RED);
})

function insertarCorreo()
{
    if($("#idClienteInput").val()!="")
    {
        if($("#clineteCorreoInput").val()!="")
        {
        var obj = {
            cliente:$("#idClienteInput").val(), 
            correo: $("#clineteCorreoInput").val()
        };

        ipcRenderer.send('insertarCorreo', obj)
        }else
        {
            $("#actuaGuarda").html("<Strong>Aviso.</Strong> Es necesario ingresar correo");
            $("#actuaGuarda").fadeTo(3000, 500).slideUp(500, function()
            {
                $("#actuaGuarda").slideUp(3000);
            });
            $("#CRMINSCLIENTE").show();
            return;
        }
    }
    else
    {
            $("#actuaGuarda").html("<Strong>Aviso.</Strong> Es necesario guardar una persona");
            $("#actuaGuarda").fadeTo(3000, 500).slideUp(500, function()
            {
                $("#actuaGuarda").slideUp(3000);
            });
           // alert("Es necesario llenar el campo Apellido paterno")
            $("#CRMINSCLIENTE").show();
            return;       
    }
}
ipcRenderer.on('insertarCorreoResult', (event, datos) => 
{    
    
    $("#clineteCorreoInput").val("");
    $("#actuaGuarda").html("<Strong>Aviso.</Strong> Correo guardado");
    $("#actuaGuarda").fadeTo(3000, 500).slideUp(500, function()
    {
        $("#actuaGuarda").slideUp(3000);
    });
    if( $("#idClienteInput").val()!="")
    ipcRenderer.send('consultarCorreos', $("#idClienteInput").val());
})

function insertarTelefono()
{
   if($("#idClienteInput").val()!="")
   {

    if($("#telefonoInput").val()!="")
    {
 
 
     
         var obj = {
         cliente:$("#idClienteInput").val(), 
         nir: $("#nirInput").val(),
         serie: $("#serieInput").val(),
         razon: $("#compaInput").val(),
         telefono: $("#telefonoInput").val(),
         tipo: $("#tipoTelefonoIput").val() 
         };
 
         ipcRenderer.send('insertarTelefono', obj)
     }
     else
     {
         $("#actuaGuarda").html("<Strong>Aviso.</Strong> Es necesario ingresar telefono");
         $("#actuaGuarda").fadeTo(3000, 500).slideUp(500, function()
         {
             $("#actuaGuarda").slideUp(3000);
         });
        // alert("Es necesario llenar el campo Apellido paterno")
         $("#CRMINSCLIENTE").show();
         return;
     }
      
    }
    else
    {
        $("#actuaGuarda").html("<Strong>Aviso.</Strong> Es necesario guardar la persona primero");
        $("#actuaGuarda").fadeTo(3000, 500).slideUp(500, function()
        {
            $("#actuaGuarda").slideUp(3000);
        });
       // alert("Es necesario llenar el campo Apellido paterno")
        $("#CRMINSCLIENTE").show();
        return;
    }
}
ipcRenderer.on('insertarTelefonoResult', (event, datos) => 
{      
    $("#telefonoInput").val("");   
    $("#compaInput").val(""); 
    $("#serieInput").val(""); 
    $("#nirInput").val("");  
    $("#clineteCorreoInput").val("");  
    $("#actuaGuarda").html("<Strong>Aviso.</Strong> Telefono guardado");
    $("#actuaGuarda").fadeTo(3000, 500).slideUp(500, function()
    {
        $("#actuaGuarda").slideUp(3000);
    });
    if( $("#idClienteInput").val()!="")
            ipcRenderer.send('consultarTelefonos', $("#idClienteInput").val());
            
})

function llenarCamposAlta( datos){
    recargarcliente=true;
    if(datos ==""){
        datos = {
            apellidoMaterno: "",
            apellidoPaterno: "",
           /* calle: "",
            ciudad: "",
            codigoPostal: "",
            colonia: "",*/
            correoElectronico: "",
            correo:"",
        /* curp: "",
            estado: "", */
            id: "",
            nombrecompleto: "",
        /*  nss: "",
            numeroExterior: "",
            numeroInterior: "",
            pais: "", */
            primerNombre: "",
            generoCtoIput:"",
            fechaNacimientoCtoInput: "",
            curpCtoInput: "",
            afiliadoCtoInput: "",           
        /*  regimen: "",
            rfc: "", 
            segundoNombre: "", */
            telefonos: "",
        /*  fechaNacimiento:"",
            genero:"", */
            telefonoFijoInput:"",
            telefonoAlternativoInput:"",

            telefonoMovilInput:"",
           
        }

      /*  $("#fechaNacimientoInput").val("");  
        $("#generoIput").val("");  
        $("#estadoInput").val("");  
        $("#ciudadInput").val("");  */

        $("#telefonoInput").val("");   
        $("#compaInput").val(""); 
        $("#serieInput").val(""); 
        $("#nirInput").val("");  
        $("#clineteCorreoInput").val("");  
        $("#gridTelefonos").html("");
        $("#gridCorreos").html("");

         $("#generoCtoIput").val("");
         $("#fechaNacimientoCtoInput").val("");
         $("#curpCtoInput").val("");
         $("#afiliadoCtoInput").val("");
         $("#telefonoFijoInput").val("");
         $("#telefonoAlternativoInput").val(""),

          $("#telefonoMovilInput").val("");
     //   $("#nirInputPrinci").val(""),
      //  $("#serieInputPrinci").val(""),
     //   $("#compaInputPrinci").val(""),
       // $("#telefonoInputPrinci").val(""),
     //   $("#tipoTelefonoIputPrinci").val(""),
    
    }

   

    $("#idClienteInput").val(datos.id);  
    $("#primerNombreInput").val(datos.primerNombre);   
   // $("#segundoNombreInput").val(datos.segundoNombre); 
    $("#apellidoPaternoInput").val(datos.apellidoPaterno); 
    $("#apellidoMaternoInput").val(datos.apellidoMaterno); 
    $("#nombreCompletoInput").val(datos.nombreCompleto); 
     $("#generoCtoIput").val(datos.generoCtoIput);
     $("#fechaNacimientoCtoInput").val(datos.fechaNacimientoCtoInput);
     $("#curpCtoInput").val(datos.curpCtoInput);
     $("#afiliadoCtoInput").val(datos.afiliadoCtoInput);
     $("#telefonoFijoInput").val(datos.telefonoFijoInput);
     $("#telefonoAlternativoInput").val(datos.telefonoAlternativoInput),
     $("#telefonoMovilInput").val(datos.telefonoMovilInput);
     $("#clineteCorreoInput").val(datos.correoElectronico);
   /* $("#rfcInput").val(datos.rfc); 
    $("#nssInput").val(datos.nss); 
    $("#curpInput").val(datos.curp); 
    $("#codigoPostalInput").val(datos.codigoPostal); 
    $("#numeroExteriorInput").val(datos.numeroExterior); 
    $("#numeroInteriorInput").val(datos.numeroInterior); 
    $("#calleInput").val(datos.calle); 
    $("#coloniaInput").val(datos.colonia); 
    $("#ciudadInput").val(datos.ciudad); 
    $("#estadoInput").val(datos.estado); 
    $("#fechaNacimientoInput").val(datos.fechaNacimiento); 
    $("#generoIput").val(datos.genero); 
    $("#paisInput").val(datos.pais); 
    $("#direccionInput").val(datos.primerNombre); 
*/

recargarcliente=false;

}

function cancelarAltaCliente(){

    telefonostxt = $("#telefonoFijoInput").val() ;
    
    correotxt = $("#clineteCorreoInput").val();

    cerrarVentana();
    $("#seleccionarCliente").hide();
    $("#editarCliente").hide(); 
    $("#cancelarSeleccion").hide();
    $("#buscarCliente").hide();
    var idclienteseleccionado = "";
    try  {
        idclienteseleccionado = clientePreSeleccionado.id ;
    } catch (err){} 

    if(idclienteseleccionado !="" &&  idclienteseleccionado != undefined){
        clienteSeleccionado = clientePreSeleccionado;
        tipificacion()
        llenarDatosCliente(clienteSeleccionado);
    }else{
       abrirBuscarCliente();
     llenarCamposAlta("");
     consultarCliente("listClientes", "");
    } 

}