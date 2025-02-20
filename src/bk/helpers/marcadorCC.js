const querys = require('../querys/marcadorCC');
const poolMarcador = require('../cnn/databaseCC');
const pool = require('../cnn/database');
const util = require('util');
const fs = require('fs');

module.exports.consultarFechaHora = async (datos) => { 
    try {
        // datos.motivoColgar
        var hora = await poolMarcador.query(querys.consultarFechaHora, []);
        // se cambia query para optimizacion let date =  await poolMarcador.query(`select  date_format(now(), "%Y-%m-%d") fecha, date_format(now(), "%H:%i:%s") hora`); 
        let date =  await poolMarcador.query(`select  CURDATE()  fecha, CURTIME() hora`);  
        var horaLlam = "";
        if (datos.id_ != "") {
            var horaLlam = await poolMarcador.query(querys.consultarFechaHoraServer_, [ datos.id_]);
            await pool.query(querys.updateIdFinLlamadaCRM, [datos.id_,datos.motivoColgar, datos.id]);
        } else {
            horaLlam = await poolMarcador.query(querys.consultarFechaHoraServer, [datos.extension, datos.telefono, date[0].fecha, date[0].fecha]);
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
        fs.appendFileSync(nombreParaArchivoLog(), 'marcadorCC 50 - '+new Date()+'\r\n' + error +'\r\n');
        return "NO"
    }

}


module.exports.cancelarllamada = async (datos) => { 
    try {       
        //datos.motivo
        await pool.query(querys.proposito, [datos.motivoCancelar, datos.acw, datos.id]);
        return "OK"
    } catch (error) {
        fs.appendFileSync(nombreParaArchivoLog(), 'marcadorCC 60 - '+new Date()+'\r\n' + error +'\r\n');        
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
        fs.appendFileSync(nombreParaArchivoLog(), 'marcadorCC 80 - '+new Date()+'\r\n' + error +'\r\n');      
        return "NO"
    }

}


module.exports.consultaridllamivrcrm = async (datos) => {
    //console.log('tipificacion ' + datos.telefonoCliente)
    var paraDebug="";
    try {
        var insertarCabecero=false;
        var date =  await poolMarcador.query(`select  date_format(now(), "%Y-%m-%d") fecha, date_format(now(), "%H:%i:%s") hora`);
        var telefonoDesconocido = datos.telefonoCliente;
       
        var llamada = await poolMarcador.query(querys.consultarIdLlamada, [date[0].fecha, datos.extension,datos.telefonoCliente]);
        paraDebug = "llamada " + llamada;
        if (llamada.length == 0) {
            // sí entra aqui, es porque la llamada no tiene numero telefono y va a buscar por extension
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
        
        const datosIvr = await poolMarcador.query(querys.consultarRutaIVR, [datos.idivr]);
        if (datosIvr.length > 0) {
            datos = Object.assign(datos, datosIvr[0]);
        }
        datos.tipxQueue = "";
        const tipxQueue = await pool.query(querys.consultarTipxQueue, [datos.idAgente]);
        if (tipxQueue.length > 0){
            datos.tipxQueue = tipxQueue[0].valorCampo;
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
        fs.appendFileSync(nombreParaArchivoLog(), 'marcadorCC 170 - '+new Date()+'\r\n' + error +'\r\n');
        datos.error="NO"
        return datos;
    }



}

module.exports.actulizarAgente = async (objAgt) => {
    try{
        await pool.query(querys.ActualizarAgente, [objAgt.estatus, "", "", objAgt.IdAgente]);
        await pool.query(querys.ActualizarEstatusLlamada, ["sin llamada", "", objAgt.IdAgente]);
    }catch (error){
        fs.appendFileSync(nombreParaArchivoLog(), 'marcadorCC 180 - '+new Date()+'\r\n' + error +'\r\n');
        
    }
    return "ok";
}

module.exports.guardarNombre = async (objAgt) => {
    try{
        const clienteCRM12 = await pool.query(querys.consultarClienteCRM12, [objAgt.idFolio]);
        
        if ((parseInt(clienteCRM12[0].total) == 0)|| clienteCRM12[0].cliente==objAgt.idCliente ) {
            console.log("No Tiene tipificacion")
            await pool.query(querys.ActulizarClienteCrm, [objAgt.idCliente, objAgt.idLlamada, objAgt.idAgente]);
            await pool.query(querys.guardarNombre, ['EN LLAMADA',objAgt.idLlamada, objAgt.telefonoCliente, objAgt.nombrecliente, objAgt.idAgente]);
            
            return "ok";
        } else {        
            console.log("Tiene tipificacion")
            await pool.query(querys.ActulizarClienteCrm, [objAgt.idCliente, objAgt.idLlamada, objAgt.idAgente]);
            await pool.query(querys.guardarNombre, ['EN LLAMADA',objAgt.idLlamada, objAgt.telefonoCliente, objAgt.nombrecliente, objAgt.idAgente]);
            return "ok";
        }
    }catch(error){
        let data = JSON.stringify(error);
        fs.appendFileSync(nombreParaArchivoLog(), 'marcadorCC 210 - '+new Date() +'\r\n' + error +'\r\n');
            
    }
    return "ok";
}

module.exports.insertarPausa = async (datos) => {


    try {
        const acumulado_ = await this.consultarAcumulado(datos);
        await pool.query(querys.insertarPausa, [datos.idLlamada, datos.idAgente, datos.extension, datos.telefono, datos.idLlamada, acumulado_]);
        const consultarUltimaPausa = await pool.query(querys.consultarUltimaPausa, [datos.idAgente, datos.extension, datos.telefono, datos.idLlamada]);
        console.log(consultarUltimaPausa)
        return consultarUltimaPausa;
    } catch (error) {
        fs.appendFileSync(nombreParaArchivoLog, 'marcadorCC 220 - '+new Date() + error +'\r\n');
        
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
        fs.appendFileSync(nombreParaArchivoLog, 'marcadorCC 250 - '+new Date() + error +'\r\n');
        
        return "NO"
    }

}

module.exports.recuperarIdLlamadaIn = async (datos) => {
    try {
        var insertarCabecero=false;
        var date =  await poolMarcador.query(`select  date_format(now(), "%Y-%m-%d") fecha, date_format(now(), "%H:%i:%s") hora`);
        console.log('date ' +[date[0].fecha, datos.extension])
        var telefonoDesconocido = datos.telefonoCliente;
       
        var llamada = await poolMarcador.query(querys.recuperarIdLlamada, [date[0].fecha, date[0].fecha, datos.extension,datos.telefonoCliente]);
        if (llamada.length == 0) {
            // sí entra aqui, es porque la llamada no tiene numero telefono y va a buscar por extension
             llamada = await poolMarcador.query(querys.recuperarIdLlamadaSinTelefono, [date[0].fecha, date[0].fecha, datos.extension]);
        }
        if (llamada.length == 0) {
            // sí entra aqui, es porque la llamada es una transferencia y no los datos no  tienen extension
            llamada = await poolMarcador.query(querys.recuperarIdLlamadaSinExtensionTransf, [date[0].fecha, date[0].fecha, datos.telefonoCliente]);
            
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
        
        const datosIvr = await poolMarcador.query(querys.consultarRutaIVR, [datos.idivr]);
        if (datosIvr.length > 0) {
            datos = Object.assign(datos, datosIvr[0]);
        }
        datos.tipxQueue = "";
        const tipxQueue = await pool.query(querys.consultarTipxQueue, [datos.idAgente]);
        if (tipxQueue.length > 0){
            datos.tipxQueue = tipxQueue[0].valorCampo;
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
        fs.appendFileSync(nombreParaArchivoLog, 'marcadorCC 340 - '+new Date() + error +'\r\n');
        
        datos.error="NO"
        return datos;
    }
}

const nombreParaArchivoLog = () => {
    var d = new Date();
    if(d.getDate()<10){
        dd = '0'+d.getDate();
    }
    else{
        dd = d.getDate();
    }
    if((d.getMonth()+1)<10){
        mm = '0'+(d.getMonth()+1);
    }
    else{
        mm = (d.getMonth()+1);
    }  
    var nomArchivoLog = "C:/Logs/LOG_"+d.getFullYear() + mm + dd+'.txt';
    return   nomArchivoLog;
  }
  module.exports.consultarUltimaInteraccion = async (rfc) => {
    
    const clienteCRMDia = await pool.query(querys.consultarClienteCRMDia, [rfc]);
    if(clienteCRMDia.length>=3)
    {
        return clienteCRMDia;
    }else
    {
        var registrosDia = (clienteCRMDia.length);
        var faltantes = 3- registrosDia;
        const clienteCRMHis = await pool.query(querys.consultarClienteCRMHis, [rfc, faltantes]);
        const clienteCRMDiaActualizado = clienteCRMDia.concat(clienteCRMHis);

        return clienteCRMDiaActualizado;
    }
}