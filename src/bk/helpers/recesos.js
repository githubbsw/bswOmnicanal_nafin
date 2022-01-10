const querys = require('../querys/recesos');
const pool = require('../cnn/database');
const poolMDE = require('../cnn/databaseMDE');
const { app } = require('electron')

    module.exports.solicitarReceso = async (datos) => 
    {
        var objResult={};
        var usuario = datos.usuario;
        var idllamada = datos.idllamada;
        var itpoRec = datos.itpoRec;
        var descRec = datos.descRec;
        var estatusSol =datos.estatusSol;

        const resultado = await pool.query(querys.consultarIdUsuarioExt, [usuario]);    
        var respuesta ="";
        for(var i=0;i<resultado.length;i++){
            respuesta = resultado[i].id;
        }

        if(respuesta ==""){
            await pool.query(querys.InsertarSolictarReceso, [estatusSol,idllamada,usuario,descRec,itpoRec]);
        }	
        else{
            await pool.query(querys.ActuaizaSolictarReceso, [estatusSol,idllamada,descRec,itpoRec,usuario]);
        }							;		
        return objResult; 
    }

    module.exports.tomarReceso = async (datos) => {
        var usuario = datos.usuario;
        var estatusAgente =datos.estatusAgente;
        var motivodsc = datos.motivodsc;
        var motivoid = datos.motivoid;			
    
        if(estatusAgente=="DIS")
        {
            await pool.query(querys.ActuaizaSolictarRecesoInbound, ["DISPONIBLE","SIN RECESO",usuario]);
            await pool.query(querys.ActuaizaSolictarRecesoOut, ["DISPONIBLE","SIN RECESO",usuario]);
            await pool.query(querys.actualizarEstatus, [estatusAgente,usuario]);
        }
        else if(estatusAgente=="RES")
        {
            await pool.query(querys.ActuaizaSolictarRecesoInbound, ["RECESO","CON RECESO",usuario]);
            await pool.query(querys.ActuaizaSolictarRecesoOut, ["RECESO","CON RECESO",usuario]);
            await pool.query(querys.actualizarEstatusSalirReceso, [estatusAgente,usuario]);
        }
        else
        {
            await pool.query(querys.actualizarEstatus, [estatusAgente,usuario]);
        }
        let date =  await pool.query(`select  date_format(now(), "%Y-%m-%d") fecha, date_format(now(), "%H:%i:%s") hora`);
        await pool.query(querys.updateMovimientosUsuario,[date[0].fecha, date[0].hora, usuario]);
        await pool.query(querys.InsertarSesionTrabajoHistorial,[usuario,"","2",""]);
        await pool.query(querys.insertarMovimientos,[usuario,motivoid, date[0].fecha, date[0].hora, motivodsc,  await app.getVersion()]);
    }

    module.exports.consultarMovimientos = async (usuario) => {
        var objResult={};
        console.log("Usuario"+usuario)
        var resultado=await pool.query(querys.consultarMovimientos,[usuario]);


        var tiempoTotalConexion=await pool.query(querys.tiempoTotalConexion,[usuario]);
        var tiempoTotalReceso=await pool.query(querys.tiempoTotalReceso,[usuario]);

        var tiempoTotalEfectivo=tiempoTotalConexion;

        var horaActual =await pool.query(querys.horaActual,[]);

        objResult.tiempoTotalReceso=tiempoTotalReceso[0].tiempoTotalReceso;
        objResult.tiempoTotalEfectivo=tiempoTotalEfectivo[0].tiempoTotalConexion;
        objResult.horaActual=horaActual[0].horaActual;
        objResult.valor=resultado;					
        return objResult; 
    }

    module.exports.consultaTipoReceso = async () => {
        var objResult={};
        var resultado=await pool.query(querys.consultaTipoReceso);
        objResult.valor=resultado;					
        return objResult; 
    }

    module.exports.consultaRecesoAuto = async (usuario,canales) => {
        var objResult={};
        var resultado=await pool.query(querys.consultaRecesoAuto,[usuario]);
        objResult.valor=resultado;
        objResult.valorMDE=[];
        var arrcanales = canales.split(",");
        for (var i = 0; i < arrcanales.length; i++) {
            if(arrcanales[i] == 7 || arrcanales[i] == 8 || arrcanales[i] == 11|| arrcanales[i] == 12|| arrcanales[i] == 13    ){
                var resultadoReceso =await poolMDE.query(querys.consultaRecesoAutoMDE,[usuario]);
                objResult.valorMDE=resultadoReceso;
                break;
            }

        }
        				
        return objResult; 
    }

    module.exports.terminarReceso = async (usuario) => {         
        var date =  await pool.query(`select  date_format(now(), "%Y-%m-%d") fecha, date_format(now(), "%H:%i:%s") hora`);         
        await pool.query(querys.updateMovimientosRecesoUsuario, [date[0].fecha, date[0].hora, usuario.trim()]);          
        await pool.query(querys.actulizarRecesos, [usuario.trim()]);
        await pool.query(querys.actulizarAgenteOutbound, ["DISPONIBLE","S",usuario.trim()]);
        await pool.query(querys.actulizarAgenteInboundNoIp, ["DISPONIBLE","S",usuario.trim()]);
        
        await pool.query(querys.insertarMovimientos,[usuario,"SBSC", date[0].fecha, date[0].hora, "SESION SC", await app.getVersion()]);
      
    }
