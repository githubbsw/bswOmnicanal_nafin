const querys = require('../querys/chatMulticanal');
const pool = require('../cnn/databaseMDE');
const poolCRM = require('../cnn/database');
const util = require('util');
module.exports.consultarInteracciones = async (canal, idAgente) => 
{	
            var recordset={};
            var facebook={};
            var whatsapp={};
            var chat={};
            var tw={};

            const resultado = await pool.query(querys.consultarInteracciones ,[idAgente]);

            const resultadoPrioridades = await poolCRM.query(querys.consultarPrioridades ,[idAgente]);

            recordset.interacciones = [];
            
            await resultado.forEach( async (e) => {
                if(e.inmccanalid == "F"){
                    e.prioridad = await resultadoPrioridades.filter(p => p.bstnCanalIDN == 11)[0].nrhemdbmcprioridad;
                    recordset.interacciones.push(e)
                }else if(e.inmccanalid == "W"){
                    e.prioridad = await resultadoPrioridades.filter(p => p.bstnCanalIDN == 8)[0].nrhemdbmcprioridad;
                    recordset.interacciones.push(e)
                }else if(e.inmccanalid == "CH"){
                    e.prioridad = await resultadoPrioridades.filter(p => p.bstnCanalIDN == 7)[0].nrhemdbmcprioridad;
                    recordset.interacciones.push(e)
                }else if(e.inmccanalid == "T"){
                    e.prioridad = await resultadoPrioridades.filter(p => p.bstnCanalIDN == 12)[0].nrhemdbmcprioridad;
                    recordset.interacciones.push(e)
                }else if(e.inmccanalid == "S"){
                    e.prioridad = await resultadoPrioridades.filter(p => p.bstnCanalIDN == 3)[0].nrhemdbmcprioridad;
                    recordset.interacciones.push(e)
                }else if(e.inmccanalid == "M"){
                    e.prioridad = await resultadoPrioridades.filter(p => p.bstnCanalIDN == 4)[0].nrhemdbmcprioridad;
                    recordset.interacciones.push(e)
                }
            });

           /* recordset.crmMediosEscritos = [];
            const resultadoPrioridades = await poolCRM.query(querys.consultarPrioridades ,[idAgente]);*/


            await recordset.interacciones.sort(function (a, b) {
                return (a.prioridad - b.prioridad)
            })

            canales=canal.split(",");
			
			for(var i = 0; i < canales.length; i++) {
				
				if(canales[i]=="F"){
					
					const resultado2 = await pool.query(querys.consultarNoVistosChatFB ,[idAgente]);
                    facebook.noVistos=resultado2;
                                        
                    const resultado3 = await pool.query(querys.consultarUltimoMensajeChatFB ,[idAgente]);
                    facebook.ultimosMensajes=resultado3;
                    
					recordset.F= facebook;
					
				}else if(canales[i]=="W") {
                    
                    const resultado4 = await pool.query(querys.consultarNoVistosChatWTS ,[idAgente]);
                    whatsapp.noVistos=resultado4;
                    
                    const resultado5 = await pool.query(querys.consultarUltimoMensajeChatWTS ,[idAgente]);
                    whatsapp.ultimosMensajes=resultado5;

					recordset.W=whatsapp;
					
					
					
				}else if(canales[i]=="CH") {					
                    
                    const resultado9 = await pool.query(querys.consultarNoVistosChat ,[idAgente]);
                    chat.noVistos=resultado9;
                    
                    const resultado8 = await pool.query(querys.consultarUltimoMensajeChat ,[idAgente]);
                    chat.ultimosMensajes=resultado8;

					recordset.CH=chat;	
				}else if(canales[i]="T")
				{                    
                    const resultado5 = await pool.query(querys.consultarNoVistosChatTW ,[idAgente]);
                    tw.noVistos=resultado5;
                    
                    const resultado6 = await pool.query(querys.consultarUltimoMensajeChatTW ,[idAgente]);
                    tw.ultimosMensajes=resultado6;
					
					recordset.T=tw;					
                }
            }
    
					
    return recordset; 

}


module.exports.cambiarEstatusNuevo = async ( idInteraccion) => 
{
    const resultado = await pool.query(querys.cambiarEstatusNuevo ,[idInteraccion]);
    return "ok "+resultado;
}



module.exports.mandarSMS = async (datos) => {
    var url = `${datos.datosSMS.url}?username=${datos.datosSMS.user}&password=${datos.datosSMS.pssw}&number=${datos.datosSMS.prefijoSMS+datos.datosSMS.telefono}&message=${datos.datosSMS.mensaje}`
    console.log(url)
    var request = require('request');
    request = util.promisify(request);
    var validar = await request(url);
    if(JSON.parse( validar.body).success == "true" && datos.guardar == "SI"){
        await poolCRM.query(querys.ACTCRMSMS ,[datos.datosSMS.mensaje, datos.datosSMS.telefono, datos.idLlamada, datos.agente]);
    }
    return JSON.parse( validar.body);

}


module.exports.opcPrcSMS = async () => {

    const opcPrcSMS = await poolCRM.query(querys.opcPrcSMS ,[]);
    return opcPrcSMS;

}



