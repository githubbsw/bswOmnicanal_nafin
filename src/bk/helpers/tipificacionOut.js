
const querys = require('../querys/tipificacionOut');
const pool = require('../cnn/database');

module.exports.consultarScript = async (IdAgente) => 
{
    var objResult=await pool.query(querys.consultarScript,[IdAgente]);					
    return objResult; 
}

module.exports.ConsultaClienteSalida = async (obj) => 
{
    var DS=await pool.query(querys.ConsultaClienteSalida,[obj.IdAgente,obj.TelefonoCliente]);
    DS=await pool.query(querys.ConsultarCamposReservados,[DS[0].NoCliente,DS[0].IdCampana,DS[0].id]);	
    return DS; 
}

module.exports.consultarEstatus = async (obj) => 
{
    var status=await pool.query(querys.consultarEstatus,[]);	
    return status; 
}

module.exports.consultarTipificacion = async (idEstatus,idcampania) => 
{
    var tipificacion = await pool.query(querys.consultarTipificacion,[idEstatus,idEstatus,idcampania]);	
    return tipificacion; 
}

module.exports.GuardarEstatus  = async (obj) => 
{
    console.log(obj)
    await pool.query(querys.GuardarTipificacionContacto,[obj.estatusLlamada,obj.consecutivo,obj.campana]);	
    await pool.query(querys.GuardarTipificacion,[obj.estatusLlamada,obj.estatusLlamadaDsc,obj.tipificacionLlamada,obj.tipificacionLlamadaDsc,obj.observaciones, obj.tipificacionLlamadarRemarcar, obj.idLlamada]);	
    return "ok"; 
}


module.exports.consultarActCRM = async (idAgente) => 
{
    var consultarActCRM = await pool.query(querys.consultarActCRM,[idAgente]);	
    return consultarActCRM;
}


module.exports.completarActividad = async (datos) => 
{
    var completarActividad = await pool.query(querys.completarActividad,[datos.cliente, datos.folio]);	
    return completarActividad;
}