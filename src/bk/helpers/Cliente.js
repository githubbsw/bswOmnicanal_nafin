const querys = require('../querys/Cliente');
const queryCC = require('../querys/marcadorCC');
const pool = require('../cnn/database');

module.exports.consultar = async (criterios, datosPaginacion) => {

    var objResult = {};
    try {

        var criteriosSeleccion = "";
        var criteriosSeleccion2 = "";
        /*if (/^([&a-zA-Z\-0-9\s])*$/.test(criterios)) {
            criteriosSeleccion = " and  cliente.btclienterfc like CONCAT('%','" + criterios + "','%')  group by id  order by telefonos,  id desc limit ? , ? ";
            criteriosSeleccion2 = " and cliente.btclienterfc like CONCAT('%','" + criterios + "','%')";
        }*/
        if (criterios!="") {
            criteriosSeleccion2 = " and cliente.btclienterfc like CONCAT('%','" + criterios + "','%')";
            criteriosSeleccion = " and  cliente.btclienterfc like CONCAT('%','" + criterios + "','%') " +
            "order by btclienteNUMERO DESC, btclienterfc  ";
        }

        const resultado1 = await pool.query(querys.consultarTotal + criteriosSeleccion2);
        //const resultado = await pool.query(querys.consultar + criteriosSeleccion + " limit 0, 20", [datosPaginacion.inicio, datosPaginacion.limite]);
        const resultado = await pool.query(querys.consultar + criteriosSeleccion + " limit ? , ? ", [datosPaginacion.inicio, datosPaginacion.limite]);
        
        objResult.valor = resultado;
        objResult.total = resultado1[0].total;
        return objResult;

    } catch (error) {

        objResult.valor = [];
        objResult.total = 0;
        return objResult;
    }


}

module.exports.consultarTotal = async (criterios) => {
    var objResult = {};
    var criteriosSeleccion = "";
    if (/^([a-zA-Z\s])*$/.test(criterios)) {
        criteriosSeleccion = " and cliente.BTCLIENTENCOMPLETO like CONCAT('%','" + criterios + "','%') ";
    }
    else if (/^([0-9\s])*$/.test(criterios)) {
        criteriosSeleccion = " and tel.BTCLIENTETELNO like  CONCAT('%','" + criterios + "','%') ";
    }
    else if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(criterios)) {
        criteriosSeleccion = " and correos.BTCLIENTECORREO like  CONCAT('%','" + $criterios + "','%') ";
    }

    const resultado = await pool.query(querys.consultarTotal + criteriosSeleccion);

    objResult.valor = resultado;
    return objResult;

}

module.exports.insertar = async (obj) => {
    var id=null;
    var result= null;
    try
    {
        if(obj.rfc!=""){

            //var existeRfc =  await pool.query(querys.buscarRfc, [obj.rfc]);
            //if(existeRfc[0].rfcs==0)
            //{
                id = await pool.query(querys.calcularId, []);
                await pool.query(querys.insertar, [id[0].id,
                obj.primerNombre,
                obj.apellidoPaterno,
                obj.apellidoMaterno,
                obj.nombreCompleto,
                obj.correoElectronico, 
                obj.nombrecompleto2,
                obj.genero,
                "",
                "",
                "", obj.estado, "", "",obj.rfc,obj.pyme,obj.regimen,obj.sector,obj.edad,
                obj.telefono,obj.tipotelefono,obj.Extesion,obj.codigoPostal,
                obj.Actividad,obj.ActividadOtro,
                obj.Medio,obj.OtroCanal]);
            //}
            //else
            //{
                //result = {
                //    result: "Este cliente ya fue dado de alta.",
                //    valores: "{}",
                //    resultado:"{}"
                //}
                //return result;
            //}
        }

        //inserta telefono
        var exiTel=0;
        if(obj.telefono!=""){
            exiTel =  await pool.query(querys.actualizarTelefono, [id[0].id, obj.telefono, 'PERSONAL']);
            if(exiTel.affectedRows==0){ 
                await pool.query(querys.insertarTelefono, [id[0].id, "", "","", obj.telefono, 'PERSONAL']);
            }
        }
        //insertar correo    
        if(obj.correo!=""){
        exiCorreo = await pool.query(querys.actualizarCorreo, [id[0].id, obj.correo]);
        if (exiCorreo.affectedRows==0){ 
            await pool.query(querys.insertarCorreo, [id[0].id, obj.correo]);
        } 
        }
        
        const valores = await this.consultarPorLlaves(id[0].id)
        const resultado = await pool.query(querys.consultarClientes , [id[0].id]);
        result = {
            result: "OK",
            valores: valores[0],
            resultado: resultado[0]
        }

        if(obj.idFolio!=null && obj.idFolio!=undefined)
        {
            const clienteCRM12 = await pool.query(querys.consultarClienteCRM12, [obj.idFolio]);
            if(clienteCRM12.length>0)
                if (parseInt(clienteCRM12[0].total) == 0 || clienteCRM12[0].cliente==id[0].id  ) {
                    var actualizo = await pool.query(querys.actualizarCrm, [id[0].id, obj.idFolio]);
                    if(actualizo.affectedRows==0){ 
                        await pool.query(querys.insertarCrm, [id[0].id , obj.idLlamada, obj.idAgente, obj.nombreAgente, obj.extension, obj.telefonoCliente, obj.canalId, obj.rutaIVR,  obj.urls, obj.idLlamada]);
                        }
                    await pool.query(querys.guardarNombre, ['EN LLAMADA',obj.idLlamada, obj.telefonoCliente, obj.nombreCompleto, obj.idAgente]);
                }
            const clienteCRM1 = await pool.query(querys.consultarClienteCRM1, [obj.idFolio]);
            if(clienteCRM1.length>0)
                if (parseInt(clienteCRM1[0].total) > 0 || clienteCRM1[0].cliente!=id[0].id  ) {  
                    await pool.query(queryCC.ActulizarClienteCrm, [id[0].id, obj.idLlamada, obj.idAgente]); 
                    await pool.query(querys.guardarNombre, ['EN LLAMADA',obj.idLlamada, obj.telefonoCliente, obj.nombreCompleto, obj.idAgente]);                   
                }
            result = {
                result: "OK",
                valores: valores[0],
                resultado: resultado[0]
            } 
        }
    }
    catch(error)
    {
        result = {
            result: "Huvo un error, en el alta del cliente. ["+error+"]",
            valores: "{}",
            resultado:error
        }
        console.error("error alta cliente - " + error);
    }


    return result;
}

module.exports.insertarEdicion = async (obj) => {
    var id=null;
    var result= null;
    try
    {
        if(obj.rfc!=""){


                id = await pool.query(querys.calcularId, []);
                await pool.query(querys.insertar, [id[0].id,
                obj.primerNombre,
                obj.apellidoPaterno,
                obj.apellidoMaterno,
                obj.nombreCompleto,
                obj.correoElectronico, 
                obj.nombrecompleto2,
                obj.genero,
                "",
                "",
                "", obj.estado, "", "",obj.rfc,obj.pyme,obj.regimen,obj.sector,obj.edad,
                obj.telefono,obj.tipotelefono,obj.Extesion,obj.codigoPostal,
                obj.Actividad,obj.ActividadOtro,
                obj.Medio,obj.OtroCanal]);
            
        }

        //inserta telefono
        var exiTel=0;
        if(obj.telefono!=""){
            exiTel =  await pool.query(querys.actualizarTelefono, [id[0].id, obj.telefono, 'PERSONAL']);
            if(exiTel.affectedRows==0){ 
                await pool.query(querys.insertarTelefono, [id[0].id, "", "","", obj.telefono, 'PERSONAL']);
            }
        }
        //insertar correo    
        if(obj.correo!=""){
        exiCorreo = await pool.query(querys.actualizarCorreo, [id[0].id, obj.correo]);
        if (exiCorreo.affectedRows==0){ 
            await pool.query(querys.insertarCorreo, [id[0].id, obj.correo]);
        } 
        }
        
        const valores = await this.consultarPorLlaves(id[0].id)
        const resultado = await pool.query(querys.consultarClientes , [id[0].id]);
        result = {
            result: "OK",
            valores: valores[0],
            resultado: resultado[0]
        }

        if(obj.idFolio!=null && obj.idFolio!=undefined)
        {
            const clienteCRM12 = await pool.query(querys.consultarClienteCRM12, [obj.idFolio]);
            if(clienteCRM12.length>0)
                if (parseInt(clienteCRM12[0].total) == 0 || clienteCRM12[0].cliente==id[0].id  ) {
                    var actualizo = await pool.query(querys.actualizarCrm, [id[0].id, obj.idFolio]);
                    if(actualizo.affectedRows==0){ 
                        await pool.query(querys.insertarCrm, [id[0].id , obj.idLlamada, obj.idAgente, obj.nombreAgente, obj.extension, obj.telefonoCliente, obj.canalId, obj.rutaIVR,  obj.urls, obj.idLlamada]);
                        }
                    await pool.query(querys.guardarNombre, [ obj.nombreCompleto, obj.idAgente]);
                } 
            const clienteCRM1 = await pool.query(querys.consultarClienteCRM1, [obj.idFolio]);
            if(clienteCRM1.length>0)
                if (parseInt(clienteCRM1[0].total) > 0 || clienteCRM1[0].cliente!=id[0].id  ) {  
                    await pool.query(queryCC.ActulizarClienteCrm, [id[0].id, obj.idLlamada, obj.idAgente]); 
                    await pool.query(querys.guardarNombre, [obj.nombreCompleto, obj.idAgente]);     
                    result = {
                        result: "OK",
                        valores: valores[0],
                        resultado: resultado[0]
                    }    
                }
        }
    }
    catch(error)
    {
        result = {
            result: "Huvo un error, en el alta del cliente. ["+error+"]",
            valores: "{}",
            resultado:error
        }
        console.error("error alta cliente - " + error);
    }


    return result;
}

module.exports.actualizar = async (obj) => {
    await pool.query(querys.actualizar, [
        obj.primerNombre,
        obj.apellidoPaterno,
        obj.apellidoMaterno,
        obj.nombreCompleto,
        obj.rfc,
        obj.pyme,
        obj.correoElectronico,
        obj.nombrecompleto2, 
        obj.generoCtoIput,
        obj.fechaNacimientoCtoInput,
        obj.curpCtoInput,
        obj.afiliadoCtoInput, obj.estado, obj.municipio, obj.sucursal,
        obj.id]);

    var exiTel=0;
    if(obj.telefonoFijoInput!="" && obj.telefonoFijoInput!=undefined){
        exiTel =  await pool.query(querys.actualizarTelefono, [obj.id, obj.telefonoFijoInput, 'PERSONAL']);
        if(exiTel.affectedRows==0){ 
            await pool.query(querys.insertarTelefono, [obj.id, obj.nir, obj.serie, obj.razon, obj.telefonoFijoInput, 'PERSONAL']);
        }
    }
    if(obj.telefonoMovilInput!="" && obj.telefonoFijoInput!=undefined){
        exiTel =  await pool.query(querys.actualizarTelefono, [obj.id, obj.telefonoMovilInput, 'MOVIL']);
        if(exiTel.affectedRows==0){ 
            await pool.query(querys.insertarTelefono, [obj.id, obj.nir, obj.serie, obj.razon, obj.telefonoMovilInput, 'MOVIL']);
        } 
    }
    if(obj.telefonoAlternativoInput!="" && obj.telefonoFijoInput!=undefined){
        exiTel =  await pool.query(querys.actualizarTelefono, [obj.id, obj.telefonoAlternativoInput, 'ALTERNATIVO']);
        if(exiTel.affectedRows==0){ 
            await pool.query(querys.insertarTelefono, [obj.id, obj.nir, obj.serie, obj.razon, obj.telefonoAlternativoInput, 'ALTERNATIVO']);
        } 
    }
    //insertar correo    
    if(obj.correoElectronico!="" && obj.telefonoFijoInput!=undefined){
     exiCorreo = await pool.query(querys.actualizarCorreo, [obj.id, obj.correoElectronico]);
    if (exiCorreo.affectedRows==0){ 
        await pool.query(querys.insertarCorreo, [obj.id, obj.correoElectronico]);
    } 
    }
  
    const valores = await this.consultarPorLlaves(obj.id)
    const resultado = await pool.query(querys.consultarClientes , [obj.id]);
    var result = {
        result: "OK",
        valores: valores[0],
        resultado: resultado[0]
    }

    if(obj.idFolio!=null && obj.idFolio!=undefined)
    {
        const clienteCRM12 = await pool.query(querys.consultarClienteCRM12, [obj.idFolio]);
        if(clienteCRM12.length>0)
            if (parseInt(clienteCRM12[0].total) == 0 || clienteCRM12[0].cliente==obj.id ) {
                var actualizo = await pool.query(querys.actualizarCrm, [obj.id, obj.idFolio]);
                if(actualizo.affectedRows==0)
                { 
                    await pool.query(querys.insertarCrm, [obj.id , obj.idLlamada, obj.idAgente, obj.nombreAgente, obj.extension, obj.telefonoCliente, obj.canalId, obj.rutaIVR,  obj.urls, obj.idLlamada]);
                }
                await pool.query(querys.guardarNombre, ['EN LLAMADA',obj.idLlamada, obj.telefonoCliente, obj.nombreCompleto, obj.idAgente]);
            } 
        const clienteCRM1 = await pool.query(querys.consultarClienteCRM1, [obj.idFolio]);
        if(clienteCRM1.length>0)
            if (parseInt(clienteCRM1[0].total) > 0 || clienteCRM1[0].cliente!=obj.id )  {      
                await pool.query(queryCC.ActulizarClienteCrm, [obj.id, obj.idLlamada, obj.idAgente]); 
                await pool.query(querys.guardarNombre, ['EN LLAMADA',obj.idLlamada, obj.telefonoCliente, obj.nombreCompleto, obj.idAgente]); 
                
            }

    }


    return result;

}

module.exports.consultarPorLlaves = async (llave) => {
    const datos = await pool.query(querys.consultarPorLlaves, [llave]);
    return datos;

}

module.exports.insertarTelefono = async (telefono) => {
    const exiTel = await pool.query(querys.consultarInsertTel, [telefono.cliente, telefono.telefono,telefono.tipo]);
    if (exiTel[0].total == 0) {
        await pool.query(querys.insertarTelefono, [telefono.cliente, telefono.nir, telefono.serie, telefono.razon, telefono.telefono, telefono.tipo]);
    }
}

module.exports.insertarCorreo = async (correo) => {
    const exiCorreo = await pool.query(querys.consultarInsertCorreo, [correo.cliente, correo.correo]);
    console.log("holaaa " + exiCorreo[0].total + " " + correo)
    if (exiCorreo[0].total == 0) {
        await pool.query(querys.insertarCorreo, [correo.cliente, correo.correo]);
    }
}

module.exports.consultarPortabilidad = async (telefono) => {
    const portabilidad = await pool.query(querys.consultarPortabilidad, [telefono, telefono]);
    return portabilidad;
}

/* 
module.exports.consultarEstados = async () => 
{
    const datos =await pool.query(querys.consultarEstados,[]);
    return datos; 
}

module.exports.consultarCiudad = async () => 
{
    const datos =await pool.query(querys.consultarCiudad,[]);
    return datos; 
}

  */

module.exports.consultarTelefonos = async (idCliente) => {
    const telefonos = await pool.query(querys.consultarTelefonos, [idCliente]);
    return telefonos;
}

module.exports.consultarCorreos = async (idCliente) => {
    const correos = await pool.query(querys.consultarCorreos, [idCliente]);
    return correos;
}


module.exports.consultarContactos = async (idUsuario) => {
    const contactos = await pool.query(querys.consultarContactos, [idUsuario]);
    return contactos;
}


module.exports.consultarEstados = async () => {
    const estados = await pool.query(querys.consultarEstados, []);
    return estados;
}

module.exports.consultarMunicipio = async (id) => {
    const mun = await pool.query(querys.consultarMunicipio, [id]);
    return mun;
}


module.exports.consultarCombosCliente = async () => {
    const regimen =await pool.query(querys.consultarCombosRegimen, []);
    const sector =await pool.query(querys.consultarCombosSector, []);
    const edad =await pool.query(querys.consultarCombosEdad, []);
    const genero =await pool.query(querys.consultarCombosGenero, []);
    const actividad =await pool.query(querys.consultarCombosActividad, []);
    const medio =await pool.query(querys.consultarCombosMedio, []);
    const res=
    {
        regimen:regimen,
        sector:sector,
        edad:edad,
        genero:genero,
        actividad:actividad,
        medio:medio
    }
    return res;
}

