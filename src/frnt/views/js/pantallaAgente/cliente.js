
function pintarBusquedaDeCliente(){
 
   $("#displayCliente h2").after(`
   <div class="d-flex justify-content-between">
               <button onclick="seleccionarCliente()" id="seleccionarCliente" type="button"
                  class="btn col btn-info mx-1" style="display: none;">Seleccionar esta persona</button>
               <button onclick="editarCliente()" id="editarCliente" type="button" class="btn col btn-success mx-1"
                  style="display: none;">Editar esta persona</button>
               <button onclick="cancelarBusquedaSelect()" id="cancelarSeleccion" type="button"
                  class="btn col btn-danger mx-1" style="display: none;">Cancelar búsqueda</button>
               <button onclick="quitarTipificacion()" id="quitarTipificacion" type="button"
                  class="btn col btn-danger mx-1" style="display: none;">Cerrar tipificación</button>
            </div>

   `)

    $("#displayCliente").after(`
    <div id="displayClienteNuevo" class="col-6 float-left text-center text-white pt-3"
            style="background: #00000091;overflow-y: scroll;display: none;">
            <div class="alert alert-success" id="actuaGuarda" style="display: none;"></div>
            <h3>Datos de la persona que llama</h3>
            <div class="d-flex justify-content-between bd-highlight flex-wrap">
               <button onclick="pestanasCRM('CRMPRINCIPALES')" id="CRMPRINCIPALES" type="button"
                  class="btn  btn-aux-crm col btn-dark mx-1">Datos principales</button>               
               <button onclick="insertarCliente()" id="CRMINSCLIENTE" type="button"
                  class="btn col btn-info mx-1">Guardar</button>
               <button onclick="insertarCorreo()" id="CRMINSCORREOS" type="button" class="btn col btn-info mx-1"
                  style="display:none">Guardar correo</button>
               <button onclick="insertarTelefono()" id="CRMINSTELEFONO" type="button" class="btn col btn-info mx-1"
                  style="display:none">Guardar telefono</button>
               <button onclick="cancelarAltaCliente()" id="btnCancelarAltaCliente" type="button" class="btn col-1 btn-danger mx-1"><span
                     class="icon-cross"></span></button>
               <button onclick="pestanasCRM('CRMTELEFONOS')" id="CRMTELEFONOS" type="button"
                  class="btn btn-aux-crm col btn-dark mx-1" style="visibility: hidden;display: none" >+ Teléfonos</button>
               <button onclick="pestanasCRM('CRMCORREOS')" id="CRMCORREOS" type="button"
                  class="btn btn-aux-crm col btn-dark mx-1" style="visibility: hidden;display: none" >+ Correos</button>
            </div>
            <div class="CRMPRINCIPALES col-6 float-left altaCRM text-left deshabilitado">Folio persona:<input
                  class="col " id="idClienteInput" title="Id cliente" disabled></div>
            <div class="CRMPRINCIPALES col-12 float-left altaCRM text-left ">Nombres<input
                  onblur="crearNombreCompleto()" class="col " id="primerNombreInput" title="Nombre"
                  style="text-transform: uppercase;" onkeyup="this.value=Letras(this.value)" ></div>
            <!--   <div class="CRMPRINCIPALES col-6 float-left altaCRM text-left ">Segundo nombre<input onblur="crearNombreCompleto()" class="col " id="segundoNombreInput" title="Nombre" ></div> -->
            <div class="CRMPRINCIPALES col-6 float-left altaCRM text-left ">Apellido paterno<input
                  onblur="crearNombreCompleto()" class="col " id="apellidoPaternoInput" title="Nombre"
                  style="text-transform: uppercase;" onkeyup="this.value=Letras(this.value)" ></div>
            <div class="CRMPRINCIPALES col-6 float-left altaCRM text-left ">Apellido materno<input
                  onblur="crearNombreCompleto()" class="col " id="apellidoMaternoInput" title="Nombre"
                  style="text-transform: uppercase;" onkeyup="this.value=Letras(this.value)" ></div>
           


                  <div class="CRMPRINCIPALES col-6 float-left altaCRM text-left "  >Estado
                     <select id="comboEstadoPersona" onchange="cmboMuncipioPersonaBuscar()" class="custom-select form-control">
                     </select>
                  </div>
                  <div class="CRMPRINCIPALES col-6 float-left altaCRM text-left "  >Municipio
                     <select id="comboMunicipioPersona" class="custom-select form-control" >
                     </select>
                  </div>
                 

                  <div class="CRMPRINCIPALES col-12 float-left altaCRM text-left p-0">
                    
                  <div class="CRMPRINCIPALES col-6 float-left altaCRM text-left ">Teléfono movil<input class="col"
                        id="telefonoMovilInput" title="Teléfono" maxlength="14" onblur="validarTelefono(this)"  style="text-transform: uppercase;"></div>
                        <div class="CRMPRINCIPALES col-6 float-left altaCRM text-left ">Teléfono alternativo<input class="col"
                           id="telefonoAlternativoInput" title="Teléfono" maxlength="14" onblur="validarTelefono(this)" style="text-transform: uppercase;" ></div>         
                           <div class="CRMPRINCIPALES col-6 float-left altaCRM text-left deshabilitado ">Teléfono origen<input class="col"
                              id="telefonoFijoInput" title="Teléfono" maxlength="10"  disabled></div>          
                  </div>
                  <div class="CRMPRINCIPALES col-12 float-left altaCRM text-left ">Correo<input class="col"
                     id="clineteCorreoInput" title="Correo" ></div>                
                  <div class="CRMPRINCIPALES col-12 float-left altaCRM text-left deshabilitado">Nombre completo<input class="col"
                     id="nombreCompletoInput" title="Nombre" disabled style="text-transform: uppercase;"  ></div>
                     
                     

                     <div style="visibility: hidden;display: none" class="CRMPRINCIPALES col-12 float-left altaCRM text-left p-2"  >Le corresponde la sucursal de: 
                        <select id="comboSucursalesPersona" class="custom-select form-control">
                        </select>
                     </div>

                

                        
            <div class="CRMPRINCIPALES col-6 float-left altaCRM text-left p-2" style="visibility: hidden;"  >Genero<select id="generoCtoIput"
                  class="custom-select form-control" placeholder="Selecciona un genero">
                  <option value="1" selected >MASCULINO</option>
                  <option value="2">FEMENINO</option>
               </select></div>
            <div class="CRMPRINCIPALES col-6 float-left altaCRM text-left p-2" style="visibility: hidden;" >Fecha nacimiento<input type="date"
                  class="col py-1" id="fechaNacimientoCtoInput" title="Fecha nacimiento"></div>
            <div class="CRMPRINCIPALES col-12 float-left altaCRM text-left p-2" style="visibility: hidden;" >CURP<input class="col py-1"
                  id="curpCtoInput" title="CURP" style="text-transform: uppercase;" maxlength="18"></div>
           
            <div class="CRMPRINCIPALES col-12 float-left altaCRM text-left p-2" style="visibility: hidden;" >¿Esta afiliado a algun programa?<input
                  class="col py-1" id="afiliadoCtoInput" title="Afiliado"></div>

            <!--     
                <div class="CRMPRINCIPALES col-12 float-left altaCRM text-left p-2">CURP<input class="col py-1" id="curpInput" title="CURP" ></div>
                <div class="CRMPRINCIPALES col-6 float-left altaCRM text-left p-2">Estado<select id="estadoInput" class="custom-select form-control" onchange="consultarCiudadDelEstado()" placeholder="Selecciona un estado" >                 
                </select></div>
                <div class="CRMPRINCIPALES col-6 float-left altaCRM text-left p-2">Ciudad<select id="ciudadInput" class="custom-select form-control" placeholder="Selecciona una ciudad" >                 
               </select></div>               
               -->

            




            <!--
                <div class="CRMPRINCIPALES col-6 float-left altaCRM text-left p-2">Código postal<input class="col py-1" id="codigoPostalInput" title="Código postal" ></div>
                <div class="CRMPRINCIPALES col-6 float-left altaCRM text-left p-2">Colonia<input class="col py-1" id="coloniaInput" title="Colonia" ></div>
                <div class="CRMPRINCIPALES col-6 float-left altaCRM text-left p-2">Calle<input class="col py-1" id="calleInput" title="CALLE" ></div>
                <div class="CRMPRINCIPALES col-4 float-left altaCRM text-left p-2">Número exterior<input class="col py-1" id="numeroExteriorInput" title="Número exterior" ></div>
                <div class="CRMPRINCIPALES col-4 float-left altaCRM text-left p-2">Número interior<input class="col py-1" id="numeroInteriorInput" title="Número interior" ></div>
               <div class="CRMPRINCIPALES col-6 float-left altaCRM text-left p-2">RFC<input class="col py-1" id="rfcInput" title="RFC" ></div>
               <div class="CRMPRINCIPALES col-6 float-left altaCRM text-left p-2">NSS<input class="col py-1" id="nssInput" title="NSS" ></div>               
               <div class="CRMPRINCIPALES col-4 float-left altaCRM text-left p-2">País<input class="col py-1" id="paisInput" title="País" ></div>   -->
            <div class="CRMPRINCIPALES col-8 float-left altaCRM text-left p-5"></div>
            <div class="CRMTELEFONOS col-6 float-left altaCRM text-left p-2">Teléfono<input class="col py-1"
                  id="telefonoInput" onblur="consultarPortabilidad()" title="Teléfono"></div>
            <div class="CRMTELEFONOS col-6 float-left altaCRM text-left p-2">Tipo<select id="tipoTelefonoIput"
                  class="custom-select form-control">
                  <option value="PERSONAL" selected>PERSONAL</option>
                  <option value="MOVIL">MOVIL</option>
               </select></div>
            <div class="CRMTELEFONOS col-4 float-left altaCRM text-left p-2">Nir<input class="col py-1" id="nirInput"
                  title="Nir" disabled></div>
            <div class="CRMTELEFONOS col-4 float-left altaCRM text-left p-2">Serie<input class="col py-1"
                  id="serieInput" title="Serie" disabled></div>
            <div class="CRMTELEFONOS col-4 float-left altaCRM text-left p-2">Red<input class="col py-1" id="redInput"
                  title="Red" disabled></div>
            <div class="CRMTELEFONOS col-12 float-left altaCRM text-left p-2">Compañia<input class="col py-1"
                  id="compaInput" title="Compañia" disabled></div>
            <div class="CRMTELEFONOS col-12 float-left altaCRM text-left p-2">
               <table id="gridTelefonos" class="display responsive nowrap text-left" width="100%"></table>
            </div>
         
            <div class="CRMCORREOS col-12 float-left altaCRM text-left p-2">
               <table id="gridCorreos" class="display responsive nowrap text-left" width="100%"></table>
            </div>
         </div>
    `)

    $("#displayTipificacion").before(`
    <div id="buscarCliente" class="col-5 float-left text-center text-white pt-3"
    style="background: #00000091;overflow-y: scroll;display:none">
    <input id="buscar" onblur="consultarCliente('listClientes', '')" onkeypress="return runScript(event)"
       style="margin-bottom: 10px; width: 100%;padding: 11px;border: none;border-bottom: solid 5px #28a745;outline: none;"
       placeholder="Inserte Correo, Telefono, Nombre o folio de la persona">
    <div class="d-flex justify-content-between">
       <button onclick="nuevoCliente()" id="btnNuevoCliente" type="button" class="btn col btn-info mb-3">Nueva
          persona</button>
    </div>
    <div class="loader" style="display: none;">
       <div class=" spinner-grow text-success" role="status">
          <span class="sr-only">Loading...</span>
       </div>
       <div class=" spinner-grow text-dark" role="status">
          <span class="sr-only">Loading...</span>
       </div>
    </div>
    <ul id="listClientes" class="list-group text-left text-dark d-none">
    </ul>
    <table id="example" class="display responsive nowrap text-left" width="100%"></table>
 </div>
    `)

}



function pintarBusquedaDeCliente2(){

   

    $("#displayCliente").html(`
    <h2>Persona</h2>
    <div class="d-flex justify-content-between">
       <button onclick="seleccionarCliente()" id="seleccionarCliente" type="button"
          class="btn col btn-info mx-1" style="display: none;">Seleccionar esta persona</button>
       <button onclick="editarCliente()" id="editarCliente" type="button" class="btn col btn-success mx-1"
          style="display: none;">Editar esta persona</button>
       <button onclick="cancelarBusquedaSelect()" id="cancelarSeleccion" type="button"
          class="btn col btn-danger mx-1" style="display: none;">Cancelar búsqueda</button>
       <button onclick="quitarTipificacion()" id="quitarTipificacion" type="button"
          class="btn col btn-danger mx-1" style="display: none;">Cerrar tipificación</button>
    </div>

    <ul class="list-group mb-3 text-left">

       <li class="list-group-item transparente datoCliente">Folio de la persona: <span class="text-white"
             id="idCliente"></span></li>
       <li class="list-group-item transparente datoCliente">Nombre: <span class="text-white"
             id="nombreCliente"></span></li>
       <li class="list-group-item transparente datoCliente">Teléfonos: <span class="text-white"
             id="telefonoCliente"></span></li>
       <li class="list-group-item transparente datoCliente">Correo electrónico: <span class="text-white"
             id="correoCliente"></span></li>
       <li class="list-group-item transparente datoCliente" style="visibility: hidden;">Contacto: <span class="text-white"
                id="datoContacto"></span></li>
       <li class="list-group-item transparente datoCliente" style="visibility: hidden;" >CURP: <span class="text-white" id="datoCURP"></span>
       </li>
       <li class="list-group-item transparente datoCliente" style="visibility: hidden;" >Fecha de nacimiento: <span class="text-white"
             id="datoFechaNac"></span></li>
       <li class="list-group-item transparente datoCliente" style="visibility: hidden;" >Genero: <span class="text-white"
             id="datoGenero"></span></li>               
       <li class="list-group-item transparente datoCliente" style="visibility: hidden;">¿Esta afiliado a algun programa? <span
             class="text-white" id="datoAfilio"></span></li>            
    </ul>
        `)

      

    $("#displayCliente").after(`
    <div id="displayClienteNuevo" class="col-6 float-left text-center text-white pt-3"
            style="background: #00000091;overflow-y: scroll;display: none;">
            <div class="alert alert-success" id="actuaGuarda" style="display: none;"></div>
            <h3>Datos de la persona que llama</h3>
            <div class="d-flex justify-content-between bd-highlight flex-wrap">
               <button onclick="pestanasCRM('CRMPRINCIPALES')" id="CRMPRINCIPALES" type="button"
                  class="btn  btn-aux-crm col btn-dark mx-1">Datos principales</button>               
               <button onclick="insertarCliente()" id="CRMINSCLIENTE" type="button"
                  class="btn col btn-info mx-1">Guardar</button>
               <button onclick="insertarCorreo()" id="CRMINSCORREOS" type="button" class="btn col btn-info mx-1"
                  style="display:none">Guardar correo</button>
               <button onclick="insertarTelefono()" id="CRMINSTELEFONO" type="button" class="btn col btn-info mx-1"
                  style="display:none">Guardar telefono</button>
               <button onclick="cancelarAltaCliente()" id="btnCancelarAltaCliente" type="button" class="btn col-1 btn-danger mx-1"><span
                     class="icon-cross"></span></button>
               <button onclick="pestanasCRM('CRMTELEFONOS')" id="CRMTELEFONOS" type="button"
                  class="btn btn-aux-crm col btn-dark mx-1" style="visibility: hidden;display: none" >+ Teléfonos</button>
               <button onclick="pestanasCRM('CRMCORREOS')" id="CRMCORREOS" type="button"
                  class="btn btn-aux-crm col btn-dark mx-1" style="visibility: hidden;display: none" >+ Correos</button>
            </div>
            <div class="CRMPRINCIPALES col-6 float-left altaCRM text-left deshabilitado">Folio persona:<input
                  class="col " id="idClienteInput" title="Id cliente" disabled></div>
            <div class="CRMPRINCIPALES col-12 float-left altaCRM text-left ">Nombres<input
                  onblur="crearNombreCompleto()" class="col " id="primerNombreInput" title="Nombre"
                  style="text-transform: uppercase;" onkeyup="this.value=Letras(this.value)" ></div>
            <!--   <div class="CRMPRINCIPALES col-6 float-left altaCRM text-left ">Segundo nombre<input onblur="crearNombreCompleto()" class="col " id="segundoNombreInput" title="Nombre" ></div> -->
            <div class="CRMPRINCIPALES col-6 float-left altaCRM text-left ">Apellido paterno<input
                  onblur="crearNombreCompleto()" class="col " id="apellidoPaternoInput" title="Nombre"
                  style="text-transform: uppercase;" onkeyup="this.value=Letras(this.value)" ></div>
            <div class="CRMPRINCIPALES col-6 float-left altaCRM text-left ">Apellido materno<input
                  onblur="crearNombreCompleto()" class="col " id="apellidoMaternoInput" title="Nombre"
                  style="text-transform: uppercase;" onkeyup="this.value=Letras(this.value)" ></div>
           


                  <div class="CRMPRINCIPALES col-6 float-left altaCRM text-left "  >Estado
                     <select id="comboEstadoPersona" onchange="cmboMuncipioPersonaBuscar()" class="custom-select form-control">
                     </select>
                  </div>
                  <div class="CRMPRINCIPALES col-6 float-left altaCRM text-left "  >Municipio
                     <select id="comboMunicipioPersona" class="custom-select form-control" >
                     </select>
                  </div>
                 

                  <div class="CRMPRINCIPALES col-12 float-left altaCRM text-left p-0">
                    
                  <div class="CRMPRINCIPALES col-6 float-left altaCRM text-left ">Teléfono movil<input class="col"
                        id="telefonoMovilInput" title="Teléfono" maxlength="14" onblur="validarTelefono(this)"  style="text-transform: uppercase;"></div>
                        <div class="CRMPRINCIPALES col-6 float-left altaCRM text-left ">Teléfono alternativo<input class="col"
                           id="telefonoAlternativoInput" title="Teléfono" maxlength="14" onblur="validarTelefono(this)" style="text-transform: uppercase;" ></div>         
                           <div class="CRMPRINCIPALES col-6 float-left altaCRM text-left deshabilitado ">Teléfono origen<input class="col"
                              id="telefonoFijoInput" title="Teléfono" maxlength="10"  disabled></div>          
                  </div>
                  <div class="CRMPRINCIPALES col-12 float-left altaCRM text-left ">Correo<input class="col"
                     id="clineteCorreoInput" title="Correo"  ></div>                
                  <div class="CRMPRINCIPALES col-12 float-left altaCRM text-left deshabilitado">Nombre completo<input class="col"
                     id="nombreCompletoInput" title="Nombre" disabled style="text-transform: uppercase;"  ></div>
                     
                     

                     <div style="visibility: hidden;display: none" class="CRMPRINCIPALES col-12 float-left altaCRM text-left p-2"  >Le corresponde la sucursal de: 
                        <select id="comboSucursalesPersona" class="custom-select form-control">
                        </select>
                     </div>

                

                        
            <div class="CRMPRINCIPALES col-6 float-left altaCRM text-left p-2" style="visibility: hidden;"  >Genero<select id="generoCtoIput"
                  class="custom-select form-control" placeholder="Selecciona un genero">
                  <option value="1" selected >MASCULINO</option>
                  <option value="2">FEMENINO</option>
               </select></div>
            <div class="CRMPRINCIPALES col-6 float-left altaCRM text-left p-2" style="visibility: hidden;" >Fecha nacimiento<input type="date"
                  class="col py-1" id="fechaNacimientoCtoInput" title="Fecha nacimiento"></div>
            <div class="CRMPRINCIPALES col-12 float-left altaCRM text-left p-2" style="visibility: hidden;" >CURP<input class="col py-1"
                  id="curpCtoInput" title="CURP" style="text-transform: uppercase;" maxlength="18"></div>
           
            <div class="CRMPRINCIPALES col-12 float-left altaCRM text-left p-2" style="visibility: hidden;" >¿Esta afiliado a algun programa?<input
                  class="col py-1" id="afiliadoCtoInput" title="Afiliado"></div>

            <!--     
                <div class="CRMPRINCIPALES col-12 float-left altaCRM text-left p-2">CURP<input class="col py-1" id="curpInput" title="CURP" ></div>
                <div class="CRMPRINCIPALES col-6 float-left altaCRM text-left p-2">Estado<select id="estadoInput" class="custom-select form-control" onchange="consultarCiudadDelEstado()" placeholder="Selecciona un estado" >                 
                </select></div>
                <div class="CRMPRINCIPALES col-6 float-left altaCRM text-left p-2">Ciudad<select id="ciudadInput" class="custom-select form-control" placeholder="Selecciona una ciudad" >                 
               </select></div>               
               -->

            




            <!--
                <div class="CRMPRINCIPALES col-6 float-left altaCRM text-left p-2">Código postal<input class="col py-1" id="codigoPostalInput" title="Código postal" ></div>
                <div class="CRMPRINCIPALES col-6 float-left altaCRM text-left p-2">Colonia<input class="col py-1" id="coloniaInput" title="Colonia" ></div>
                <div class="CRMPRINCIPALES col-6 float-left altaCRM text-left p-2">Calle<input class="col py-1" id="calleInput" title="CALLE" ></div>
                <div class="CRMPRINCIPALES col-4 float-left altaCRM text-left p-2">Número exterior<input class="col py-1" id="numeroExteriorInput" title="Número exterior" ></div>
                <div class="CRMPRINCIPALES col-4 float-left altaCRM text-left p-2">Número interior<input class="col py-1" id="numeroInteriorInput" title="Número interior" ></div>
               <div class="CRMPRINCIPALES col-6 float-left altaCRM text-left p-2">RFC<input class="col py-1" id="rfcInput" title="RFC" ></div>
               <div class="CRMPRINCIPALES col-6 float-left altaCRM text-left p-2">NSS<input class="col py-1" id="nssInput" title="NSS" ></div>               
               <div class="CRMPRINCIPALES col-4 float-left altaCRM text-left p-2">País<input class="col py-1" id="paisInput" title="País" ></div>   -->
            <div class="CRMPRINCIPALES col-8 float-left altaCRM text-left p-5"></div>
            <div class="CRMTELEFONOS col-6 float-left altaCRM text-left p-2">Teléfono<input class="col py-1"
                  id="telefonoInput" onblur="consultarPortabilidad()" title="Teléfono"></div>
            <div class="CRMTELEFONOS col-6 float-left altaCRM text-left p-2">Tipo<select id="tipoTelefonoIput"
                  class="custom-select form-control">
                  <option value="PERSONAL" selected>PERSONAL</option>
                  <option value="MOVIL">MOVIL</option>
               </select></div>
            <div class="CRMTELEFONOS col-4 float-left altaCRM text-left p-2">Nir<input class="col py-1" id="nirInput"
                  title="Nir" disabled></div>
            <div class="CRMTELEFONOS col-4 float-left altaCRM text-left p-2">Serie<input class="col py-1"
                  id="serieInput" title="Serie" disabled></div>
            <div class="CRMTELEFONOS col-4 float-left altaCRM text-left p-2">Red<input class="col py-1" id="redInput"
                  title="Red" disabled></div>
            <div class="CRMTELEFONOS col-12 float-left altaCRM text-left p-2">Compañia<input class="col py-1"
                  id="compaInput" title="Compañia" disabled></div>
            <div class="CRMTELEFONOS col-12 float-left altaCRM text-left p-2">
               <table id="gridTelefonos" class="display responsive nowrap text-left" width="100%"></table>
            </div>
         
            <div class="CRMCORREOS col-12 float-left altaCRM text-left p-2">
               <table id="gridCorreos" class="display responsive nowrap text-left" width="100%"></table>
            </div>
         </div>
    `)



    $("#displayTipificacion").before(`
    <div id="buscarCliente" class="col-5 float-left text-center text-white pt-3"
    style="background: #00000091;overflow-y: scroll;display:none">
    <input id="buscar" onblur="consultarCliente('listClientes', '')" onkeypress="return runScript(event)"
       style="margin-bottom: 10px; width: 100%;padding: 11px;border: none;border-bottom: solid 5px #28a745;outline: none;"
       placeholder="Inserte Correo, Telefono, Nombre o folio de la persona">
    <div class="d-flex justify-content-between">
       <button onclick="nuevoCliente()" id="btnNuevoCliente" type="button" class="btn col btn-info mb-3">Nueva
          persona</button>
    </div>
    <div class="loader" style="display: none;">
       <div class=" spinner-grow text-success" role="status">
          <span class="sr-only">Loading...</span>
       </div>
       <div class=" spinner-grow text-dark" role="status">
          <span class="sr-only">Loading...</span>
       </div>
    </div>
    <ul id="listClientes" class="list-group text-left text-dark d-none">
    </ul>
    <table id="example" class="display responsive nowrap text-left" width="100%"></table>
 </div>
    `)

}

function pintarTecladoEnLlamada(){

      if (!$('#teclado_').is(':visible')) {

         $("#teclado_").addClass("d-flex")
         $("#teclado_").removeClass("d-none")
         $("#btnVerTeclado").addClass("bg-info")
         $("#btnVerTeclado").removeClass("bg-secondary")
         $("#imgUser").hide()
         

      }else{

         $("#teclado_").removeClass("d-flex")
         $("#teclado_").addClass("d-none")
         $("#btnVerTeclado").removeClass("bg-info")
         $("#btnVerTeclado").addClass("bg-secondary")   
         $("#imgUser").show()
      }

}