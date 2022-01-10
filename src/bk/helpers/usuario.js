const querys = require('../querys/usuario');
const pool = require('../cnn/database');
const { app } = require('electron')

module.exports.CerrarSesion = async (datos) => {
    if(datos.tipoCierre == "CIERRE_SESION"){
        var receso=await pool.query(querys.Estaenreceso, [datos.idAgente]); 
        if(receso.length == 0){
            receso = [{sts:"DIS"}]
        }
        if(receso[0].sts!="RES"){
            await pool.query(querys.CerrarSesion, [datos.idAgente]);   
            let date =  await pool.query(`select  date_format(now(), "%Y-%m-%d") fecha, date_format(now(), "%H:%i:%s") hora`);
            await pool.query(querys.updateMovimientosUsuario, [date[0].fecha, date[0].hora, datos.idAgente]);  
            const max=await pool.query(querys.calcularIdmonacH, []);  
            await pool.query(querys.InsertarSesionTrabajoHistorial, [max[0].id,datos.idAgente,"","2",""]); 
            await pool.query(querys.actulizarAgenteOutbound, ["NO DISPONIBLE","N",datos.idAgente]);
            await pool.query(querys.actulizarAgenteInboundNoIp, ["NO DISPONIBLE","N",datos.idAgente]);     
            await pool.query(querys.actualizarMulticanal, [datos.idAgente])  
            await pool.query(querys.ActualizarEstatusLlamada, ["sin llamada", "", datos.idAgente]); 
        }
        return "ok"
    }else{
            //var estatusAgente = await pool.query(querys.consultarEstAgente, [datos.idAgente]); 


            if(datos.canal == 2 || datos.canal == 9){

                var estatusAgente = await pool.query(querys.consultarEstAgente, [datos.idAgente]);

            }else if(datos.canal == 1){

                var estatusAgente = await pool.query(querys.consultarEstAgenteInb, [datos.idAgente]);
            }

            if( estatusAgente.length > 0 && estatusAgente[0].estatus == "EN LLAMADA" ){
                
                await pool.query(querys.actulizarAgenteOutbound, ["NO DISPONIBLE","N",datos.idAgente]);
                await pool.query(querys.actulizarAgenteInboundNoIp, ["NO DISPONIBLE","N",datos.idAgente]);
                await pool.query(querys.actualizarMulticanal, [datos.idAgente])

                return "PRECIERRE_SESION"
            }else{
                var receso=await pool.query(querys.Estaenreceso, [datos.idAgente]); 
                if(receso.length == 0){
                    receso = [{sts:"DIS"}]
                }
                if(receso[0].sts!="RES"){
                    await pool.query(querys.CerrarSesion, [datos.idAgente]);   
                    let date =  await pool.query(`select  date_format(now(), "%Y-%m-%d") fecha, date_format(now(), "%H:%i:%s") hora`);
                    await pool.query(querys.updateMovimientosUsuario, [date[0].fecha, date[0].hora, datos.idAgente]);  
                    const max=await pool.query(querys.calcularIdmonacH, []);  
                    await pool.query(querys.InsertarSesionTrabajoHistorial, [max[0].id,datos.idAgente,"","2",""]); 
                    await pool.query(querys.actulizarAgenteOutbound, ["NO DISPONIBLE","N",datos.idAgente]);
                    await pool.query(querys.actulizarAgenteInboundNoIp, ["NO DISPONIBLE","N",datos.idAgente]);  
                    await pool.query(querys.actualizarMulticanal, [datos.idAgente])      
                }
                return "ok"
            }
    }
}


module.exports.insertarMovimientoDesconexion = async (idAgente,tiempo) => 
{
    let date =  await pool.query(`select  date_format(now(), "%Y-%m-%d") fecha, date_format(now(), "%H:%i:%s") hora`);   
    await pool.query(querys.insertarMovimientos, [idAgente,"DES", date[0].fecha, tiempo, "DESCONEXION", date[0].fecha, date[0].date, tiempo, tiempo, await app.getVersion()]);        
    return "ok"
}

module.exports.consultarRespuestas = async (datos) => {
    const respuesta = await pool.query(querys.consultarRespuestas, [datos.campana]);//, datos.canal]);        
    return respuesta;
}

module.exports.consultarTipoRespuesta = async () => {
    const tipoResp = await pool.query(querys.consultarTipoRespuesta);        
    return tipoResp;
}

module.exports.consultarConfTipificacion = async (idTipificacion) => {
    const respuesta = await pool.query(querys.consultarConfTipificacion, [idTipificacion]);        
    return respuesta;
}

module.exports.consultarTipificacionLlamada = async (datos) => {
    const respuesta = await pool.query(querys.consultarTipificacionLlamada, [datos.tipificacion,  datos.preguntaCita, datos.id ]);        
    return respuesta;
}

module.exports.consultarCampanaOC = async (datos) => {
    const respuesta = await pool.query(querys.consultarCampanaOC, [datos.agenteid ]);        
    return respuesta;
}

module.exports.actCitaCRM = async (datos) => {
    //const respuesta = await pool.query(querys.consultarCita, [datos.fol]);    
    await pool.query(querys.actCitaCRM, [datos.suc, datos.tram, datos.fol, datos.fecha, 
        datos.fncsolhordsc, datos.idLlam, datos.idCliente, datos.folioCte]);      
    await pool.query(querys.actCitaFUB, [datos.suc, datos.fol, datos.fecha, datos.fncsolhordsc, datos.idCliente, datos.idLlam]);      
    return "OK";
}


module.exports.consultarNumTransferencias = async () => {
    const respuesta = await pool.query(querys.consultarNumTransferencias, []);      
    return respuesta;
}

module.exports.consultaVersion = async () => {
    const consulta = {};
    const version = await pool.query(querys.consultaVersion, []);   
    consulta.version = version;
    return consulta;
}

module.exports.estatusExtension = async (canal) => {
    const consulta = {};
    if (canal.canal == "IBD") {
        await pool.query(querys.editarEstatusExt, ['1', canal.id]);
        await pool.query(querys.editarEstatusExtOBD, ['0', canal.id]);
    } else if (canal.canal == "OBD") {
        await pool.query(querys.editarEstatusExt, ['0', canal.id]);
        await pool.query(querys.editarEstatusExtOBD, ['1', canal.id]);
    }
    return;
}

module.exports.restablecerAgente = async (datos) => {
    const consulta = {};
    if (datos.canal == "OBD") {
        await pool.query(querys.editarEstatusOBD, ['DISPONIBLE', '1', datos.idAgente]);
    }
    return;
}