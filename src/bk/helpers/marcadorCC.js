const querys = require('../querys/marcadorCC');
const poolMarcador = require('../cnn/databaseCC');
const pool = require('../cnn/database');
const util = require('util');
const fs = require('fs');

module.exports.consultarFechaHora = async (datos) => { 
    try {
        // datos.motivoColgar
        var hora = await poolMarcador.query(querys.consultarFechaHora, []);
        let date =  await poolMarcador.query(`select  date_format(now(), "%Y-%m-%d") fecha, date_format(now(), "%H:%i:%s") hora`);   
        var horaLlam = "";
        if (datos.id_ != "") {
            var horaLlam = await poolMarcador.query(querys.consultarFechaHoraServer_, [ datos.id_]);
            await pool.query(querys.updateIdFinLlamadaCRM, [datos.id_,datos.motivoColgar, datos.id]);
        } else {
            horaLlam = await poolMarcador.query(querys.consultarFechaHoraServer, [datos.extension, datos.telefono, date[0].fecha,]);
            if (horaLlam.length > 0) {
                await pool.query(querys.updateIdFinLlamadaCRM, [horaLlam[0].id,datos.motivoColgar, datos.id]);
            }
        }
        var datosNuevos = "";
        if (horaLlam.length > 0) {
            datosNuevos = horaLlam[0];
        } else {
            datosNuevos = hora[0];
        }
        /*console.log('FINTIPIF1 ' + datosNuevos.fecha + " " + datosNuevos.hora)
        await pool.query(querys.FINTIPIF1, [datos.motivoColgar, datos.id]);
        console.log('FINTIPIF2 ' + datosNuevos.fecha + " " + datosNuevos.hora)
        await pool.query(querys.FINTIPIF2, [datosNuevos.fecha, datosNuevos.hora, datosNuevos.fecha + " " + datosNuevos.hora, datosNuevos.fecha + " " + datosNuevos.hora,
        datosNuevos.fecha, datosNuevos.hora, datosNuevos.fecha + " " + datosNuevos.hora, datosNuevos.fecha + " " + datosNuevos.hora,
        datos.id]);
        await pool.query(querys.FINTIPIF3, [datosNuevos.fecha, datosNuevos.hora, datosNuevos.fecha + " " + datosNuevos.hora, datosNuevos.fecha + " " + datosNuevos.hora,
            "2",
        datosNuevos.fecha, datosNuevos.hora, datosNuevos.fecha + " " + datosNuevos.hora, datosNuevos.fecha + " " + datosNuevos.hora,
        datos.id]);*/
        await pool.query(querys.updateIdFinLlamadaCRM, [datos.id_,datos.motivoColgar, datos.id]);
        await pool.query(querys.FINTIPIF1, [datos.motivoColgar, datos.id]);
     
        await pool.query(querys.FINTIPIF2CRM, [datos.id]);
        await pool.query(querys.FINTIPIF3CRM, [ "2", datos.id]);
        return "OK"
    } catch (error) {

        return "NO"
    }

}


module.exports.cancelarllamada = async (datos) => { 
    try {       
        //datos.motivo
        await pool.query(querys.proposito, [datos.motivoCancelar, datos.acw, datos.id]);
        return "OK"
    } catch (error) {

        return "NO"
    }

}

module.exports.finalizarCrm = async (datos) => { 
    try {       
       await pool.query(querys.updateIdFinLlamadaCRM, [datos.id_,datos.motivoColgar, datos.id]);
        await pool.query(querys.FINTIPIF1, [datos.motivoColgar, datos.id]);
     
        await pool.query(querys.FINTIPIF2CRM, [datos.id]);
        await pool.query(querys.FINTIPIF3CRM, [ "2", datos.id]);
        return "OK"
    } catch (error) {

        return "NO"
    }

}


module.exports.consultaridllamivrcrm = async (datos) => {
    //console.log('tipificacion ' + datos.telefonoCliente)
    try {
        var insertarCabecero=false;
        var date =  await poolMarcador.query(`select  date_format(now(), "%Y-%m-%d") fecha, date_format(now(), "%H:%i:%s") hora`);
        console.log('date ' +[date[0].fecha, datos.extension])
        var telefonoDesconocido = datos.telefonoCliente;
       
        var llamada = await poolMarcador.query(querys.consultarIdLlamada, [date[0].fecha, datos.extension,datos.telefonoCliente]);
        if (llamada.length == 0) {
             llamada = await poolMarcador.query(querys.consultarIdLlamadaSinTelefono, [date[0].fecha, datos.extension]);
        }
        if (llamada.length == 0) {
            // sí entra aqui, es porque la llamada es una transferencia y no los datos no  tienen extension
            llamada = await poolMarcador.query(querys.consultarIdLlamadaSinExtensionTransf, [date[0].fecha, datos.telefonoCliente]);
            
            if (llamada.length != 0) {
                //insertar en las tablas de transferencia
                //await poolMarcador.query(querys.insertarllamadastransferencia, [llamada[0].id, datos.extension, datos.telefonoCliente]);
                //actualizar la extension en llamadas entrantes
                await poolMarcador.query(querys.updateExtensionEntrantes, [datos.extension, llamada[0].idN, llamada[0].id]);
            }
            
       }
        if (llamada.length == 0) {
            var llamada2 = await poolMarcador.query(querys.fechas____, []);
            datos.idLlamada_ = ""
            datos.idivr="";
            datos.fecha = llamada[0].fecha;
            datos.fechaI = llamada2[0].fechaI
            datos.horaI = llamada2[0].horaI;           

        } else {
            
            datos.idLlamada_ = llamada[0].id;
            datos.fecha = llamada[0].fecha;
            datos.fechaI = llamada[0].fechaI
            datos.horaI = llamada[0].horaI;
            datos.idivr = llamada[0].idivr;
        }
        if(datos.idLlamada==""){
            insertarCabecero=false;
            datos.idLlamada =  new Date().getTime()+"." +datos.extension;
        }else{
            insertarCabecero=true;
        }
        await pool.query(querys.ActualizarAgente, ["EN LLAMADA", datos.telefonoCliente, datos.idLlamada, datos.idAgente]);
        await pool.query(querys.ActualizaridLlamada, [datos.idLlamada, datos.idAgente]);
        await pool.query(querys.ActualizarEstatusLlamada, ["llamada", datos.idLlamada, datos.idAgente]);
        const resultado = await poolMarcador.query(querys.consultarRutaIVR, [datos.idivr]);
        if (resultado.length > 0) {
            datos = Object.assign(datos, resultado[0]);
        }   

        try {
            await pool.query(querys.GuardarTipificacionCAbeceroConRuta, [datos.fechaI, datos.horaI,
            datos.idCliente, datos.idLlamada, datos.idAgente, datos.nombreAgente, datos.extension,
            datos.telefonoCliente, datos.canalId, datos.rutaIVR, datos.campo01, datos.campo02,
            datos.campo03, datos.campo04, datos.campo05, datos.campo06, datos.campo07, datos.ipCRM, datos.idLlamada_,datos.fechaI, datos.horaI,datos.fechaI, datos.horaI
            ]);
        } catch (error) {           
        }
        
        const idFolio = await pool.query(querys.ConsultarIdInsercionObjeto, [datos.idCliente, datos.idLlamada, datos.idAgente]);
        datos.idFolio = idFolio[0].ID;
        await pool.query(querys.updateIdLlamadaCRM, [datos.idLlamada, datos.rutaIVR, datos.campo01, datos.campo02,
        datos.campo03, datos.campo04, datos.campo05, datos.campo06, datos.campo07 , datos.idCliente, datos.idFolio, datos.idLlamada]);
        if (llamada.length > 0) {
            await poolMarcador.query(querys.updateIdLlamada, [llamada[0].idN, llamada[0].id]);
        }
        datos.idLlamada = datos.idLlamada ;
        await pool.query(querys.ActualizarAgente, ["EN LLAMADA", datos.telefonoCliente, datos.idLlamada, datos.idAgente]);
        await pool.query(querys.ActualizaridLlamada, [datos.idLlamada, datos.idAgente]);
        await pool.query(querys.ActualizarEstatusLlamada, ["llamada", datos.idLlamada, datos.idAgente]);
        datos.motivoColgar="";
        return datos;
    } catch (error) {
        console.log(error)
        let data = JSON.stringify(error);
        fs.writeFileSync('log.txt', new Date() + data + '\r\n');
        datos.error="NO"
        return datos;
    }



}

module.exports.actulizarAgente = async (objAgt) => {
    await pool.query(querys.ActualizarAgente, [objAgt.estatus, "", "", objAgt.IdAgente]);
    await pool.query(querys.ActualizarEstatusLlamada, ["sin llamada", "", objAgt.IdAgente]);
    return "ok";
}

module.exports.guardarNombre = async (objAgt) => {
    const clienteCRM12 = await pool.query(querys.consultarClienteCRM12, [objAgt.idFolio]);
    
    if ((parseInt(clienteCRM12[0].total) == 0)|| clienteCRM12[0].cliente==objAgt.idCliente ) {
        console.log("No Tiene tipificacion")
        await pool.query(querys.ActulizarClienteCrm, [objAgt.idCliente, objAgt.idLlamada, objAgt.idAgente]);
        await pool.query(querys.guardarNombre, ['EN LLAMADA',objAgt.idLlamada, objAgt.telefonoCliente, objAgt.nombrecliente, objAgt.idAgente]);
        
        return "ok";
    } else {        
        console.log("Tiene tipificacion")
        return "Esta llamada ya fue tipificada, no es posible cambiar el cliente seleccionado.";
    }

}

module.exports.insertarPausa = async (datos) => {


    try {
        const acumulado_ = await this.consultarAcumulado(datos);
        await pool.query(querys.insertarPausa, [datos.idLlamada, datos.idAgente, datos.extension, datos.telefono, datos.idLlamada, acumulado_]);
        const consultarUltimaPausa = await pool.query(querys.consultarUltimaPausa, [datos.idAgente, datos.extension, datos.telefono, datos.idLlamada]);
        console.log(consultarUltimaPausa)
        return consultarUltimaPausa;
    } catch (error) {

        return "NO";
    }


}

module.exports.actualizarPausa = async (datos) => {
    console.log(datos)
    await pool.query(querys.actualizarPausa, [datos.idAgente, datos.extension, datos.telefono, datos.idLlamada, datos.idPausa]);
    return "OK"
}

module.exports.consultarAcumulado = async (datos) => {
    const acumulado = await pool.query(querys.consultarAcumulado, [datos.idAgente, datos.extension, datos.telefono, datos.idLlamada]);
    if (acumulado.message) {
        return "";
    } else if (acumulado.length == 0) {
        return "";
    } else {
        return acumulado[0].ACUM;
    }
}
module.exports.insertarTransferencia = async (datos) => { 
    try {       
        //datos.motivo
        var hora =   await poolMarcador.query(querys.insertarllamadastransferencia, [datos.idLlamada, datos.extension, datos.telefonoCliente]);
        return "OK"
    } catch (error) {

        return "NO"
    }

}