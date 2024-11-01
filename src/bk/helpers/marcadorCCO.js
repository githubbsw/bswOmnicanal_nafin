const querys = require('../querys/marcadorCCO');
const poolMarcadorCCO = require('../cnn/databaseCCO');
const pool = require('../cnn/database');
const util = require('util');
const fs = require('fs');


module.exports.consultarFechaHora = async (id) => {
    var hora = await poolMarcadorCCO.query(querys.consultarFechaHora, []);
    var horaLlam = await poolMarcadorCCO.query(querys.consultarFechaHoraServer, [id]);
    return { hora, horaLlam }
}

module.exports.consultaridllamOut = async (datos) => {
    try {
        if (datos.marcacionManulaAct) {
            await pool.query(querys.ActualizarAgenteOut, ["EN LLAMADA", datos.telefonoCliente, datos.idAgente]);
            var datosSalida = {};
            const llamada = await poolMarcadorCCO.query(querys.consultarIdLlamadaOut, [datos.telefonoCliente]);
            if (llamada.length == 0) {
                await pool.query(querys.ActualizarAgenteOut, ["DISPONIBLE", datos.telefonoCliente, datos.idAgente]);
                return "LLAMADA_NO_REALIZADA";
            }
            await pool.query(querys.ActualizarEstatusLlamada, ["llamada", llamada[0].id, datos.idAgente])
            await poolMarcadorCCO.query(querys.updateIdLlamada, [llamada[0].idN, llamada[0].id]);
            datosSalida.idLlamada = llamada[0].id;
            datosSalida.fecha = llamada[0].fecha;
            datosSalida.telefonoCliente = datos.telefonoCliente;
            return datosSalida;

        } else if (datos.marcacionManual4) { //Marcacion manual con pad numerico
            await pool.query(querys.InsertarContactos, [datos.idAgente, datos.telefonoCliente,datos.campanaId]);
            await pool.query(querys.ActualizarAgenteOut, ["EN LLAMADA", datos.telefonoCliente, datos.idAgente]);
            const ds = await pool.query(querys.consultarClienteSalida, [datos.idAgente, datos.telefonoCliente]);
            var datosSalida = {};
            if (ds.length > 0) {
                datosSalida = ds[0]
            }
            const camposReservados = await pool.query(querys.consultarCamposReservados, [datosSalida.noCliente, datosSalida.btAgenteCmpId, datosSalida.id]);
            datosSalida.camposReservados = camposReservados
            const llamada = await poolMarcadorCCO.query(querys.consultarIdLlamadaOut, [datos.telefonoCliente]);
            if (llamada.length == 0) {
                //volver a consultar el ide de llamada, porque le agregamos un filtro de hora, para que no tomara el id del registro de cola
                const llamada = await poolMarcadorCCO.query(querys.consultarIdLlamadaOut, [datos.telefonoCliente]);
               
            }
            if (llamada.length == 0) {
                await pool.query(querys.ActualizarAgenteOut, ["DISPONIBLE", datos.telefonoCliente, datos.idAgente]);
                return "LLAMADA_NO_REALIZADA";
            }
            datosSalida.idLlamada =  new Date().getTime()+"." +datos.extension;
            datosSalida.idLlamada_ = llamada[0].id;
            datosSalida.fecha = llamada[0].fecha;
            await pool.query(querys.ActualizarEstatusLlamada, ["llamada", llamada[0].id, datos.idAgente])
            await pool.query(querys.guardarTipificacionLlamada, [datosSalida.id, datosSalida.idLlamada, datos.idAgente, datos.extension, datos.telefonoCliente, datosSalida.btAgenteCmpId]);
            await pool.query(querys.ActualizaridLlamada, [datosSalida.idLlamada, datos.idAgente]);
            await pool.query(querys.GuardarTipificacionCAbeceroConRutaOut, [
                llamada[0].fechaI, llamada[0].horaI, datosSalida.noCliente,
                datosSalida.idLlamada, datos.idAgente, datos.extension,
                datos.telefonoCliente, datos.canalId, datosSalida.btAgenteCmpId,
                datos.ipCRM,datosSalida.idLlamada_]);
            const folio = await pool.query(querys.consultarIdInsercionObjeto, [datosSalida.noCliente, datosSalida.idLlamada, datos.idAgente]);
            await poolMarcadorCCO.query(querys.updateIdLlamada, [llamada[0].idN, llamada[0].id]);
            datosSalida.idFolio = folio[0].ID;
            datosSalida.telefonoCliente = datos.telefonoCliente;
            console.log(datosSalida)
            return datosSalida;
        } else {
            await pool.query(querys.ActualizarAgenteOut, ["EN LLAMADA", datos.telefonoCliente, datos.idAgente]);
            const ds = await pool.query(querys.consultarClienteSalida, [datos.idAgente, datos.telefonoCliente]);
            var datosSalida = {};
            if (ds.length > 0) {
                datosSalida = ds[0]
            }
            const camposReservados = await pool.query(querys.consultarCamposReservados, [datosSalida.noCliente, datosSalida.btAgenteCmpId, datosSalida.id]);
            datosSalida.camposReservados = camposReservados
            const llamada = await poolMarcadorCCO.query(querys.consultarIdLlamadaOut, [datos.telefonoCliente]);
            if (llamada.length == 0) {
                await pool.query(querys.ActualizarAgenteOut, ["DISPONIBLE", datos.telefonoCliente, datos.idAgente]);
                return "LLAMADA_NO_REALIZADA";
            }
            datosSalida.idLlamada =  new Date().getTime()+"." +datos.extension;
            datosSalida.idLlamada_ = llamada[0].id;
            datosSalida.fecha = llamada[0].fecha;
            await pool.query(querys.ActualizarEstatusLlamada, ["llamada", llamada[0].id, datos.idAgente])
            await pool.query(querys.guardarTipificacionLlamada, [datosSalida.id, datosSalida.idLlamada, datos.idAgente, datos.extension, datos.telefonoCliente, datosSalida.btAgenteCmpId]);
            await pool.query(querys.ActualizaridLlamada, [datosSalida.idLlamada, datos.idAgente]);
            await pool.query(querys.GuardarTipificacionCAbeceroAutomatica, [
                llamada[0].fechaI, llamada[0].horaI, datosSalida.noCliente,
                datosSalida.idLlamada, datos.idAgente, datos.extension,
                datos.telefonoCliente, datos.canalId, datosSalida.btAgenteCmpId,
                datos.ipCRM,datosSalida.idLlamada_, datosSalida.btAgenteCmpId]);
            const folio = await pool.query(querys.consultarIdInsercionObjeto, [datosSalida.noCliente, datosSalida.idLlamada, datos.idAgente]);
            await poolMarcadorCCO.query(querys.updateIdLlamada, [llamada[0].idN, llamada[0].id]);
            datosSalida.idFolio = folio[0].ID;
            datosSalida.telefonoCliente = datos.telefonoCliente;
            console.log(datosSalida)
            return datosSalida;
        }

    } catch (error) {
        console.log(error)
        let data = JSON.stringify(error);
        fs.writeFileSync('log.txt', data);
        return "NO";
    }


}

module.exports.actualizarContacto = async (datos) => {
    await pool.query(querys.actualizarContacto, [datos.estatus, datos.id, datos.idCampana]);
    return "ok";
}

module.exports.actulizarAgente = async (objAgt) => {
    await pool.query(querys.ActualizarEstatusLlamada, ["sin llamada", "", objAgt.IdAgente]);
    await pool.query(querys.ActualizarAgenteFin, [objAgt.estatus, "", objAgt.IdAgente]);
    return "ok";
}

module.exports.guardarNombre = async (objAgt) => {
    if (parseInt(clienteCRM12[0].total) == 0) {
        console.log("No Tiene tipificacion")
        await pool.query(querys.guardarNombre, [objAgt.nombrecliente, objAgt.idAgente]);
        await pool.query(querys.ActulizarClienteCrm, [objAgt.idCliente, objAgt.idLlamada, objAgt.idAgente, objAgt.telefonoCliente]);
        return "ok";
    } else {
        return "Esta llamada ya fue tipificada, no es posible cambiar el cliente seleccionado.";
    }

}

module.exports.ActualizarAgenteExtesionConectada = async (objAgt) => {
    await pool.query(querys.ActualizarAgenteExtesionConectada, [objAgt.estatus, "", objAgt.IdAgente]);
    return "ok";
}

module.exports.insertarPausa = async (datos) => {
    const acumulado_ = await this.consultarAcumulado(datos);
    await pool.query(querys.insertarPausa, [datos.idLlamada, datos.idAgente, datos.extension, datos.telefono, datos.idLlamada, acumulado_]);
    const consultarUltimaPausa = await pool.query(querys.consultarUltimaPausa, [datos.idAgente, datos.extension, datos.telefono, datos.idLlamada]);
    console.log(consultarUltimaPausa)
    return consultarUltimaPausa;
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

module.exports.marcacionManual = async (datos) => {
    var url = datos.marcionManual + "?accion=MarcacionManual" +
        "&telefono=" + datos.telefono +
        "&agente=" + datos.agente +
        "&extension=" + datos.extension +
        "&folioCRM=" + datos.folio;
    var request = require('request');
    request = util.promisify(request);
    var validar = await request(url);
    return JSON.parse(validar.body)
}

module.exports.GenerarLlamada = async (objAgt) => {
    const enreus = await pool.query(querys.consultarReus, [objAgt.telefono,objAgt.campana]);
    if (enreus[0].enreus == 0) {
        this.generarllamada_out(objAgt.extension,objAgt.servidor,objAgt.telefono,objAgt.campana,objAgt.idinteraccion,objAgt.url);
        return "ok";
    }
    else
    {
        return "enreus";
    }
}

module.exports.generarllamada_out = async (extension,servidor,telefono,campana,idinteraccion,urlgenerarllamada) => {
    var url = urlgenerarllamada+"?funcion=Generarllamada&server="+servidor+"&extesion="+extension+"&telefono="+telefono+"&idinteraccion="+idinteraccion+"&campana="+campana;
    //var url = "http://172.16.41.240:8080/AsteriskWebService/ADObnicanalServlet?funcion=Generarllamada&server="+servidor+"&extesion="+extension+"&telefono="+telefono+"&idinteraccion="+idinteraccion+"&campana="+campana;
            console.log(url)
            var request = require('request');
            request = util.promisify(request);
            var validar = await request.post(url);
            if (validar.error) {
                retorno.valido = false;
                retorno.mensaje = "Ocurrio un error al generar la llamada";

            }
}

module.exports.recuperarIdLlamadaOut = async (datos) => {
    try {
        if (datos.marcacionManulaAct) {
            await pool.query(querys.ActualizarAgenteOut, ["EN LLAMADA", datos.telefonoCliente, datos.idAgente]);
            var datosSalida = {};
            const llamada = await poolMarcadorCCO.query(querys.reparaIdLlamadaOut, [datos.telefonoCliente]);
            if (llamada.length == 0) {
                await pool.query(querys.ActualizarAgenteOut, ["DISPONIBLE", datos.telefonoCliente, datos.idAgente]);
                return "LLAMADA_NO_REALIZADA";
            }
            await pool.query(querys.ActualizarEstatusLlamada, ["llamada", llamada[0].id, datos.idAgente])
            await poolMarcadorCCO.query(querys.updateIdLlamada, [llamada[0].idN, llamada[0].id]);
            datosSalida.idLlamada = llamada[0].id;
            datosSalida.fecha = llamada[0].fecha;
            datosSalida.telefonoCliente = datos.telefonoCliente;
            return datosSalida;

        } else if (datos.marcacionManual4) { //Marcacion manual con pad numerico
            await pool.query(querys.InsertarContactos, [datos.idAgente, datos.telefonoCliente,datos.campanaId]);
            await pool.query(querys.ActualizarAgenteOut, ["EN LLAMADA", datos.telefonoCliente, datos.idAgente]);
            const ds = await pool.query(querys.consultarClienteSalida, [datos.idAgente, datos.telefonoCliente]);
            var datosSalida = {};
            if (ds.length > 0) {
                datosSalida = ds[0]
            }
            const camposReservados = await pool.query(querys.consultarCamposReservados, [datosSalida.noCliente, datosSalida.btAgenteCmpId, datosSalida.id]);
            datosSalida.camposReservados = camposReservados
            const llamada = await poolMarcadorCCO.query(querys.consultarIdLlamadaOut, [datos.telefonoCliente]);
            if (llamada.length == 0) {
                //volver a consultar el ide de llamada, porque le agregamos un filtro de hora, para que no tomara el id del registro de cola
                const llamada = await poolMarcadorCCO.query(querys.consultarIdLlamadaOut, [datos.telefonoCliente]);
               
            }
            if (llamada.length == 0) {
                await pool.query(querys.ActualizarAgenteOut, ["DISPONIBLE", datos.telefonoCliente, datos.idAgente]);
                return "LLAMADA_NO_REALIZADA";
            }
            datosSalida.idLlamada =  new Date().getTime()+"." +datos.extension;
            datosSalida.idLlamada_ = llamada[0].id;
            datosSalida.fecha = llamada[0].fecha;
            await pool.query(querys.ActualizarEstatusLlamada, ["llamada", llamada[0].id, datos.idAgente])
            await pool.query(querys.guardarTipificacionLlamada, [datosSalida.id, datosSalida.idLlamada, datos.idAgente, datos.extension, datos.telefonoCliente, datosSalida.btAgenteCmpId]);
            await pool.query(querys.ActualizaridLlamada, [datosSalida.idLlamada, datos.idAgente]);
            await pool.query(querys.GuardarTipificacionCAbeceroConRutaOut, [
                llamada[0].fechaI, llamada[0].horaI, datosSalida.noCliente,
                datosSalida.idLlamada, datos.idAgente, datos.extension,
                datos.telefonoCliente, datos.canalId, datosSalida.btAgenteCmpId,
                datos.ipCRM,datosSalida.idLlamada_]);
            const folio = await pool.query(querys.consultarIdInsercionObjeto, [datosSalida.noCliente, datosSalida.idLlamada, datos.idAgente]);
            await poolMarcadorCCO.query(querys.updateIdLlamada, [llamada[0].idN, llamada[0].id]);
            datosSalida.idFolio = folio[0].ID;
            datosSalida.telefonoCliente = datos.telefonoCliente;
            console.log(datosSalida)
            return datosSalida;
        } else {
            await pool.query(querys.ActualizarAgenteOut, ["EN LLAMADA", datos.telefonoCliente, datos.idAgente]);
            const ds = await pool.query(querys.consultarClienteSalida, [datos.idAgente, datos.telefonoCliente]);
            var datosSalida = {};
            if (ds.length > 0) {
                datosSalida = ds[0]
            }
            const camposReservados = await pool.query(querys.consultarCamposReservados, [datosSalida.noCliente, datosSalida.btAgenteCmpId, datosSalida.id]);
            datosSalida.camposReservados = camposReservados
            const llamada = await poolMarcadorCCO.query(querys.consultarIdLlamadaOut, [datos.telefonoCliente]);
            if (llamada.length == 0) {
                await pool.query(querys.ActualizarAgenteOut, ["DISPONIBLE", datos.telefonoCliente, datos.idAgente]);
                return "LLAMADA_NO_REALIZADA";
            }
            datosSalida.idLlamada =  new Date().getTime()+"." +datos.extension;
            datosSalida.idLlamada_ = llamada[0].id;
            datosSalida.fecha = llamada[0].fecha;
            await pool.query(querys.ActualizarEstatusLlamada, ["llamada", llamada[0].id, datos.idAgente])
            await pool.query(querys.guardarTipificacionLlamada, [datosSalida.id, datosSalida.idLlamada, datos.idAgente, datos.extension, datos.telefonoCliente, datosSalida.btAgenteCmpId]);
            await pool.query(querys.ActualizaridLlamada, [datosSalida.idLlamada, datos.idAgente]);
            await pool.query(querys.GuardarTipificacionCAbeceroAutomatica, [
                llamada[0].fechaI, llamada[0].horaI, datosSalida.noCliente,
                datosSalida.idLlamada, datos.idAgente, datos.extension,
                datos.telefonoCliente, datos.canalId, datosSalida.btAgenteCmpId,
                datos.ipCRM,datosSalida.idLlamada_, datosSalida.btAgenteCmpId]);
            const folio = await pool.query(querys.consultarIdInsercionObjeto, [datosSalida.noCliente, datosSalida.idLlamada, datos.idAgente]);
            await poolMarcadorCCO.query(querys.updateIdLlamada, [llamada[0].idN, llamada[0].id]);
            datosSalida.idFolio = folio[0].ID;
            datosSalida.telefonoCliente = datos.telefonoCliente;
            console.log(datosSalida)
            return datosSalida;
        }

    } catch (error) {
        console.log(error)
        let data = JSON.stringify(error);
        fs.writeFileSync('log.txt', data);
        return "NO";
    }


}