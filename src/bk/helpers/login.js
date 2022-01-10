const querys = require('../querys/login');
const pool = require('../cnn/database');
const util = require('util');
const { app } = require('electron')

const  { databaseCC } = require('../cnn/keys');
const  { databaseCCO } = require('../cnn/keys');



module.exports.consultarOpcPrc = async (vars) => {


    const opcPrc = await pool.query(querys.consultarOpcPrc, [vars]);
    return opcPrc;

}

module.exports.validarUsuario = async (datos, event) => {

    const retorno = {};
    const usuario = await pool.query(querys.validaUsuario, [datos.usuarioid.trim()]);

    if (usuario.length > 0) {

        let nuevoUsurio = JSON.parse(JSON.stringify(usuario[0]));
        let key = "Espartacus2019bswcenter" + datos.usuarioid.trim();
        if (nuevoUsurio.SSUSRPSW == "") {

            retorno.valido = false;
            retorno.mensaje = "El usuario " + datos + " no existe";
            event.reply("validarUsuarioResult", retorno);

        } else {

            var url = datos.url + "?psw=" + datos.pssw + "&llave=" + key + "&pswdb=" + nuevoUsurio.SSUSRPSW;
            console.log(url)
            var request = require('request');
            request = util.promisify(request);
            var validar = await request(url);
            if (validar.error) {
                retorno.valido = false;
                retorno.mensaje = "Ocurrio un error al validar el usuario";

            } else {
                if (validar.body == "true") {
                    console.log(validar.body);
                    retorno.valido = true;
                    retorno.mensaje = "Bienvenido!!";
                    //event.reply("validarUsuarioResult", retorno); 
                } else {
                    retorno.valido = false;
                    retorno.mensaje = "Contraseña no valida";
                    //event.reply("validarUsuarioResult", retorno);
                }
            }
        }

    } else {

        retorno.valido = false;
        retorno.mensaje = "Usuario no existe";
        event.reply("validarUsuarioResult", retorno);
    }
    return retorno;
}

module.exports.consultarNombre = async (usuarioid) => {

    const usuario = await pool.query(querys.nombreUsuario, [usuarioid.trim()]);
    return usuario;
}

module.exports.consultarPorId = async (usuarioid, marcador) => {
    console.log(await app.getVersion())
    var dispAgt = await pool.query(querys.consultarDisponibilidadAgente, [usuarioid.trim()]);
    var fechaFin = "";
    if(dispAgt.length != 0){
        fechaFin = dispAgt[0].BTMPERSONALFFIN
    }
    if(fechaFin != null){
        /*var  datosusuario = await pool.query(querys.consultarPorId_, [usuarioid.trim()]);
        if(datosusuario.length == 0){
            datosusuario = await pool.query(querys.consultarPorId, [usuarioid.trim()]);
        }*/
        var  datosusuario = await pool.query(querys.consultarIdAgenteOk, [usuarioid.trim(), usuarioid.trim()]);
       
        var receso = await pool.query(querys.Estaenreceso, [usuarioid]);
        if(receso.length == 0){
            receso = [{sts:"DIS"}]
        }

        datosusuario.forEach(e => {
            e.estatusRec = receso[0].sts;
        });


        //datosusuario[0].estatusRec = receso[0].sts;
        if (receso[0].sts != "RES") {
            if (datosusuario.length > 0) {
                let date =  await pool.query(`select  date_format(now(), "%Y-%m-%d") fecha, date_format(now(), "%H:%i:%s") hora`);   
                var idMax = await pool.query(querys.calcularIdbtmpersonal, [usuarioid.trim()]);
                await pool.query(querys.insertarMovimientos, [idMax[0].id, usuarioid.trim(), date[0].fecha, date[0].hora, await app.getVersion()]);
                //await pool.query(querys.actulizarAgenteOutbound, ["DISPONIBLE", "S", databaseCCO.host , usuarioid.trim()]); //se cambio hasta que se conecte el softhpone
                await pool.query(querys.actulizarAgenteInbound, ["DISPONIBLE", "S", databaseCC.host, usuarioid.trim()]);
                await pool.query(querys.updateMovimientosRecesoUsuario, [date[0].fecha, date[0].hora, usuarioid.trim()]);
                await pool.query(querys.actulizarRecesos, [usuarioid.trim()]);
                await pool.query(querys.actualizarMulticanal, [usuarioid.trim()]);
                await pool.query(querys.ActualizarEstatusLlamada, ["sin llamada", "", usuarioid.trim()]);
            }
            return datosusuario;
        }
        else if (receso[0].sts == "RES") {
            let date =  await pool.query(`select  date_format(now(), "%Y-%m-%d") fecha, date_format(now(), "%H:%i:%s") hora`);   
            const infoRec = await pool.query(querys.infoReceso, [date[0].fecha, usuarioid.trim()]);
            await pool.query(querys.ActualizarEstatusLlamada, ["sin llamada", "", usuarioid.trim()]);
            if(infoRec[0].esHoy == "NO"){
                return "RECESO_VENCIDO";
            }else{

                datosusuario.forEach(e => {
                    e.dscReceso = infoRec[0].BTCRECESONOMC;
                    e.horaReceso = infoRec[0].BTMPERSONALHINI;
                });
                //datosusuario[0].dscReceso = infoRec[0].BTCRECESONOMC;
                //datosusuario[0].horaReceso = infoRec[0].BTMPERSONALHINI;
                return datosusuario;
            }
        }
    }else{
        return "USUARIO_LOGUEADO"
    }
}


module.exports.consultarAreas = async (usuarioid) => {

    const areas = await pool.query(querys.consultarAreas, [usuarioid.trim()]);
    return areas;
}

module.exports.consultarCanalesM = async (usuarioid) => {

    const canales = await pool.query(querys.consultarUsuario2, [usuarioid.trim()]);
    return canales;
}


module.exports.limpiarSesiones = async (usuarioid) => {
    await pool.query(querys.actulizarAgenteInboundNoIp, ["NO DISPONIBLE","N",usuarioid.trim()]);
    let date =  await pool.query(`select  date_format(now(), "%Y-%m-%d") fecha, date_format(now(), "%H:%i:%s") hora`);
    await pool.query(querys.updateSesiones, [  date[0].fecha, date[0].hora, usuarioid.trim(), "SBSC", ]);
    await pool.query(querys.actualizarMulticanal, [usuarioid.trim()])   
    
    

    return "ok";
}

module.exports.updateRecesos = async (usuarioid) => {
    await pool.query(querys.actulizarAgenteInboundNoIp, ["NO DISPONIBLE","N",usuarioid.trim()]);
    let date =  await pool.query(`select  date_format(now(), "%Y-%m-%d") fecha, date_format(now(), "%H:%i:%s") hora`);
    await pool.query(querys.updateRecesos_, [date[0].fecha, date[0].hora, usuarioid.trim()]);
    await pool.query(querys.updateRecesos, ["DIS", usuarioid.trim()]);
   
    
    return "ok";
}