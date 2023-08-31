
module.exports.consultarIdLlamada = "select llamadasEntrantesIdn idN, llamadasEntrantesId id , llamadasEntrantesFecha fecha, CAST(llamadasEntrantesFecha AS DATE) fechaI, DATE_FORMAT(llamadasEntrantesFecha,'%H:%i:%s') horaI, llamadasEntranteidivr idivr from llamadasentrantes "
    + " where cast( llamadasEntrantefecha as date) = ?  and llamadasEntrantesExt = ? and llamadasEntranteIdUsado  = '0' and llamadasEntrantesNum=? "
    + " order by llamadasEntrantefecha desc limit 1 ";

module.exports.consultarIdLlamadaSinTelefono = "select llamadasEntrantesIdn idN, llamadasEntrantesId id , llamadasEntrantesFecha fecha, CAST(llamadasEntrantesFecha AS DATE) fechaI, DATE_FORMAT(llamadasEntrantesFecha,'%H:%i:%s') horaI, llamadasEntranteidivr idivr  from llamadasentrantes "
+ " where cast( llamadasEntrantefecha as date) = ?  and llamadasEntrantesExt = ? and llamadasEntranteIdUsado  = '0'  "
+ " order by llamadasEntrantefecha desc limit 1 ";

module.exports.fechas____ = `select now() fecha,  CAST(now() AS DATE) fechaI, DATE_FORMAT(now(),'%H:%i:%s') horaI ;`

module.exports.consultarFechaHora = "select DATE_FORMAT(now(), '%H:%i:%s') hora, DATE_FORMAT(now(), '%Y-%m-%d') fecha "   ;


module.exports.consultarFechaHoraServer_ = `select DATE_FORMAT(ADDDATE(calldate, INTERVAL duration second), "%H:%i:%s") hora, 
DATE_FORMAT(ADDDATE(calldate, INTERVAL duration second), "%Y-%m-%d") fecha  
FROM cdr where uniqueid = ?
`

module.exports.consultarFechaHoraServer = `select DATE_FORMAT(ADDDATE(calldate, INTERVAL duration second), "%H:%i:%s") hora, 
    DATE_FORMAT(ADDDATE(calldate, INTERVAL duration second), "%Y-%m-%d") fecha  , uniqueid id 
    FROM cdr where disposition = "ANSWERED" and dcontext = "ext-local" and dst = ? and src = ? 
    and DATE_FORMAT(calldate, '%Y-%m-%d') = ? order by hora desc limit 1; ;`


module.exports.updateIdFinLlamadaCRM = `UPDATE bstntrn.btcrm1
    SET btcrm1idllamadaalt = ? , btcrm1colgo= ? 
    WHERe SUBSTRING_INDEX(BTCRM1IDLLAMADA,'.',2)   =   SUBSTRING_INDEX(?,'.',2) and cast(BTCRM1FECHA as date) >= cast(now() as date)`


module.exports.ActualizarAgente = "UPDATE bstntrn.btagenteinbound set btagenteInbtStsExt = ? , btagenteinbhorallam = now(), btagenteNumeroCli = ?, btagentenombrecli = '',btagenteIdLlamada = ? where btAgenteInbId  = ? ";

module.exports.ActualizaridLlamada = " UPDATE bstntrn.BTESTAGNT SET BTESTAGNTCALLID = ? WHERE BTESTAGNTUSR = ? ";

module.exports.ActualizarEstatusLlamada = "UPDATE bstntrn.bstnstatusllamada set estatusLlamada = ? ,IdLlamada = ?  where userid = ? "

module.exports.consultarRutaIVR = " SELECT concat(registrodeivrruta,'|',registrodeivrcamp01,'|',registrodeivrcamp02)rutaIVR,ifnull(registrodeivrcamp01,'')campo01,ifnull(registrodeivrcamp02,'')campo02,ifnull(registrodeivrcamp03,'')campo03," +
    " ifnull(registrodeivrcamp04,'')campo04,ifnull(registrodeivrcamp05,'')campo05,ifnull(registrodeivrcamp06,'')campo06,ifnull(registrodeivrcamp07,'')campo07 " +
    " FROM registrodeivr where registrodeidllamada=? and cast(registrodeivrfecha as date) =cast(now() as date) order by registrodeivrfecha desc limit 1 ";


module.exports.GuardarTipificacionCAbeceroConRuta = "INSERT INTO bstntrn.btcrm1 "
    + "(BTCRM1FOLIO,BTCRM1FECHA,BTCRM1HORA,BTCRM1CLIENTENUMERO,BTCRM1IDLLAMADA,BTCRM1ATENDIO,BTCRM1ATENDIONOMBRE,BTCRM1EXTENSION,BTCRMTELEFONO,"
    + " BTCRM1CANAL,BTCRMSUPERVISOR,BTCRMIVRRUTA,BTCRMCAMPO01,BTCRMCAMPO02,BTCRMCAMPO03,BTCRMCAMPO04,BTCRMCAMPO05,BTCRMCAMPO06,BTCRMCAMPO07,crmsemaforizacionestatusid, BTCRM1IPSERVIDOR, btcrm1idllamadaalt, BTCRM1FECINI,BTCRM1HORINI,  " +
    " BTCRM1INTERACCIONFECINI , BTCRM1INTERACCIONHORINI , btcrm1colgo) "
    + " VALUES ((SELECT IFNULL(MAX(BTCRM1FOLIO),0)+1 FROM bstntrn.btcrm1 as BTCRM1FOLIO), ? ,"
    + "?,?,?,?,?,?,?,?,'32',?,?,?,?,?,?,?,?,'2', ?, ?,?,?, ?,?,'Desconexion' ) ";


module.exports.ConsultarIdInsercionObjeto = " SELECT BTCRM1FOLIO ID FROM bstntrn.btcrm1 WHERE BTCRM1CLIENTENUMERO = ? AND BTCRM1IDLLAMADA = ? AND  BTCRM1ATENDIO = ? LIMIT 1 ";

module.exports.guardarNombre = " UPDATE bstntrn.btagenteinbound SET btagenteInbtStsExt=?, btagenteIdLlamada=?, btagenteNumeroCli=?,btagenteNombreCli = ?   WHERE btAgenteInbId = ? ; ";

module.exports.ActulizarClienteCrm = " UPDATE bstntrn.btcrm1 SET BTCRM1CLIENTENUMERO = ? WHERE BTCRM1IDLLAMADA= ? AND BTCRM1ATENDIO= ?  ";

module.exports.consultarClienteCRM12 = " SELECT count(*) total, BTCRM1CLIENTENUMERO cliente  FROM  bstntrn.btcrm12 WHERE BTCRM1FOLIO= ? limit 1; ";

module.exports.insertarPausa = " INSERT INTO BSTNTRN.BTLLAMADAPAUSA (BTLLAMADAPAUSAID,BTLLAMADAPAUSAAGTID, BTLLAMADAPAUSAEXT,BTLLAMADAPAUSATEL, " +
    " BTLLAMADAPAUSALLAMID, BTLLAMADAPAUSAFINI,BTLLAMADAPAUSACUMSEG) " +
    " VALUE((SELECT IFNULL(MAX(BTLLAMADAPAUSAID),0)+1 FROM BSTNTRN.BTLLAMADAPAUSA as BTLLAMADAPAUSAID WHERE BTLLAMADAPAUSALLAMID = ? ), " +
    " ?, ?, ?, ?,NOW(), ?);";

module.exports.actualizarPausa = " UPDATE BSTNTRN.BTLLAMADAPAUSA SET BTLLAMADAPAUSAFFIN = NOW() , " +
    " BTLLAMADAPAUSADURS = DATE_FORMAT(TIMEDIFF(NOW(),BTLLAMADAPAUSAFINI),'%H:%i:%s'), " +
    " BTLLAMADAPAUSADSEGUND = time_to_sec(TIMEDIFF(NOW(),BTLLAMADAPAUSAFINI)), " +
    " BTLLAMADAPAUSAACUM = SEC_TO_TIME(BTLLAMADAPAUSACUMSEG + time_to_sec(TIMEDIFF(NOW(),BTLLAMADAPAUSAFINI))), " +
    " BTLLAMADAPAUSACUMSEG  = BTLLAMADAPAUSACUMSEG + time_to_sec(TIMEDIFF(NOW(),BTLLAMADAPAUSAFINI)) " +
    " WHERE BTLLAMADAPAUSAAGTID = ? AND BTLLAMADAPAUSAEXT = ? AND BTLLAMADAPAUSATEL= ? AND  BTLLAMADAPAUSALLAMID = ? AND BTLLAMADAPAUSAID = ? ;";

module.exports.consultarUltimaPausa = " SELECT MAX(BTLLAMADAPAUSAID) MAXIMO FROM BSTNTRN.BTLLAMADAPAUSA WHERE BTLLAMADAPAUSAAGTID = ? AND BTLLAMADAPAUSAEXT = ? " +
    " AND BTLLAMADAPAUSATEL= ? AND  BTLLAMADAPAUSALLAMID = ? ";


module.exports.consultarAcumulado = " SELECT IFNULL(BTLLAMADAPAUSACUMSEG,0) ACUM FROM BSTNTRN.BTLLAMADAPAUSA WHERE BTLLAMADAPAUSAAGTID = ? AND BTLLAMADAPAUSAEXT = ? " +
    " AND BTLLAMADAPAUSATEL= ? AND  BTLLAMADAPAUSALLAMID = ? ORDER BY  BTLLAMADAPAUSAID DESC LIMIT 1  ;";


module.exports.updateIdLlamadaCRM  = `UPDATE bstntrn.btcrm1 
    SET BTCRM1IDLLAMADA =  ? ,BTCRMIVRRUTA  =  ?,BTCRMCAMPO01 =  ?,BTCRMCAMPO02 =  ?,BTCRMCAMPO03 =  ?,BTCRMCAMPO04 =  ?,BTCRMCAMPO05 =  ?,BTCRMCAMPO06 =  ?,BTCRMCAMPO07  =  ? ,
    btcrm1colgo= 'Desconexion'
    WHERE BTCRM1CLIENTENUMERO = ?  AND BTCRM1FOLIO = ? AND BTCRM1IDLLAMADA = ? ;`

module.exports.updateIdLlamada = `UPDATE llamadasentrantes SET llamadasEntranteIdUsado = '1' WHERE llamadasEntrantesIdn = ? and llamadasEntrantesId = ? ;`    

module.exports.consultarIdInsercionObjeto = "SELECT BTCRM1FOLIO ID FROM bstntrn.btcrm1 WHERE BTCRM1CLIENTENUMERO = ? AND BTCRM1IDLLAMADA = ? AND  BTCRM1ATENDIO = ? LIMIT 1 ";

module.exports.consultarScript = "SELECT btscript id FROM bstntrn.btcampanas where btcampanaid = ?;";


module.exports.actualizarContacto = "UPDATE bstntrn.btcontacto SET btContactoSts = ? WHERE btContactoConsecutivo = ? and btContactoCmpId = ? ;"








module.exports.FINTIPIF1= `update bstntrn.btcrm1 
    set BTCRM1FECINI=BTCRM1FECHA, 
    BTCRM1HORINI=BTCRM1HORA, 
    BTCRM1INTERACCIONFECINI=BTCRM1FECHA, 
    BTCRM1INTERACCIONHORINI=BTCRM1HORA ,
    btcrm1colgo= ? 
    where  SUBSTRING_INDEX(BTCRM1IDLLAMADA,'.',2)   =   SUBSTRING_INDEX(?,'.',2)
    and BTCRM1INTERACCIONFECINI is null and cast(BTCRM1FECHA as date) >= cast(now() as date)  ;`

    
module.exports.proposito = `	update   bstntrn.btcrm1    
 set   
 BTCRMTIPIFCAD = 'TIPIFICACION CANCELADA',
 crmsemaforizacionestatusid=5 , btcrm1motivoc= ?, btcrm1acw= ?
 WHERe cast(BTCRM1FECHA as date) = cast(now()  as date) 
 and SUBSTRING_INDEX(BTCRM1IDLLAMADA,'.',2)   =   SUBSTRING_INDEX(?,'.',2)
 and (BTCRMTIPIFCAD is null or BTCRMTIPIFCAD ='')     ;`

module.exports.FINTIPIF2 = `update bstntrn.btcrm1  
    set BTCRM1FECFIN= ? ,
    BTCRM1HORFIN= ? ,
    BTCRM1DURACION= SUBSTR((SELECT TIMEDIFF( ?,concat(BTCRM1FECINI,' ',BTCRM1HORINI ) )) ,1,8),
    BTCRM1DURACIONSEG= (SELECT TIME_TO_SEC(TIMEDIFF( ?,concat(BTCRM1FECINI,' ',BTCRM1HORINI ) ))) , 
    BTCRM1INTERACCIONFECFIN= ?, 
    BTCRM1INTERACCIONHORFIN= ?, 
    BTCRM1FECINTERACCIONDUR= SUBSTR((SELECT TIMEDIFF( ? ,concat(BTCRM1INTERACCIONFECINI,' ',BTCRM1INTERACCIONHORINI ) )) ,1,8),
    BTCRM1FECINTERACCIONDURSEG= (SELECT TIME_TO_SEC(TIMEDIFF(? ,concat(BTCRM1INTERACCIONFECINI,' ',BTCRM1INTERACCIONHORINI ) ))) 
    where SUBSTRING_INDEX(BTCRM1IDLLAMADA,'.',2)   =   SUBSTRING_INDEX(?,'.',2) and cast(BTCRM1FECHA as date) >= cast(now() as date);`

module.exports.FINTIPIF3 = `update  crmbd.crmrespcabecero   
    set BTCRM1FECFIN= ? ,
    BTCRM1FECHORFIN= ? ,
    BTCRM1FECDUR= SUBSTR((SELECT TIMEDIFF( ?, concat(BTCRM1FEC,' ',BTCRM1FECHORINI ) )     ) ,1,8),
    BTCRM1FECDURSEG= (SELECT TIME_TO_SEC(TIMEDIFF( ?,concat(BTCRM1FEC,' ',BTCRM1FECHORINI ) ))), 
    crmrespcabeceroopcionguardar = ? , 
    BTCRM1INTERACCIONFECFIN= ?,
    BTCRM1INTERACCIONHORFIN= ?,
    BTCRM1FECINTERACCIONDUR= SUBSTR((SELECT TIMEDIFF( ? ,concat(BTCRM1INTERACCIONFECINI,' ',BTCRM1INTERACCIONHORINI ) )) ,1,8),
    BTCRM1FECINTERACCIONDURSEG= (SELECT TIME_TO_SEC(TIMEDIFF(? ,concat(BTCRM1INTERACCIONFECINI,' ',BTCRM1INTERACCIONHORINI ) )))
    where SUBSTRING_INDEX(crmrespcabeceroidllam,'.',2)   =   SUBSTRING_INDEX(?,'.',2) and cast(crmrespcabecerofecmon as date) >= cast(now() as date)  ;`



    module.exports.FINTIPIF2CRM = `update bstntrn.btcrm1  
    set BTCRM1FECFIN= cast(now() as date) ,
    BTCRM1HORFIN= cast(cast(now() as time) as char(8)) ,
    BTCRM1DURACION= SUBSTR((SELECT TIMEDIFF( cast(now() as datetime)     ,concat(BTCRM1FECINI,' ',BTCRM1HORINI ) )) ,1,8),
    BTCRM1DURACIONSEG= (SELECT TIME_TO_SEC(TIMEDIFF( cast(now() as datetime),concat(BTCRM1FECINI,' ',BTCRM1HORINI ) ))) , 
    BTCRM1INTERACCIONFECFIN= cast(now() as date), 
    BTCRM1INTERACCIONHORFIN= cast(cast(now() as time) as char(8)) , 
    BTCRM1FECINTERACCIONDUR= SUBSTR((SELECT TIMEDIFF( cast(now() as datetime)   ,concat(BTCRM1INTERACCIONFECINI,' ',BTCRM1INTERACCIONHORINI ) )) ,1,8),
    BTCRM1FECINTERACCIONDURSEG= (SELECT TIME_TO_SEC(TIMEDIFF(cast(now() as datetime)   ,concat(BTCRM1INTERACCIONFECINI,' ',BTCRM1INTERACCIONHORINI ) ))) 
    where SUBSTRING_INDEX(BTCRM1IDLLAMADA,'.',2)   =   SUBSTRING_INDEX(?,'.',2) and cast(BTCRM1FECHA as date) >= cast(now() as date);`

module.exports.FINTIPIF3CRM = `update  crmbd.crmrespcabecero   
    set BTCRM1FECFIN= cast(now() as date)  ,
    BTCRM1FECHORFIN= cast(cast(now() as time) as char(8)) ,
    BTCRM1FECDUR= SUBSTR((SELECT TIMEDIFF( cast(now() as datetime), concat(BTCRM1FEC,' ',BTCRM1FECHORINI ) )     ) ,1,8),
    BTCRM1FECDURSEG= (SELECT TIME_TO_SEC(TIMEDIFF( cast(now() as datetime),concat(BTCRM1FEC,' ',BTCRM1FECHORINI ) ))), 
    crmrespcabeceroopcionguardar = ? , 
    BTCRM1INTERACCIONFECFIN=  cast(now() as date),
    BTCRM1INTERACCIONHORFIN= cast(cast(now() as time) as char(8)),
    BTCRM1FECINTERACCIONDUR= SUBSTR((SELECT TIMEDIFF( cast(now() as datetime) ,concat(BTCRM1INTERACCIONFECINI,' ',BTCRM1INTERACCIONHORINI ) )) ,1,8),
    BTCRM1FECINTERACCIONDURSEG= (SELECT TIME_TO_SEC(TIMEDIFF(cast(now() as datetime) ,concat(BTCRM1INTERACCIONFECINI,' ',BTCRM1INTERACCIONHORINI ) )))
    where SUBSTRING_INDEX(crmrespcabeceroidllam,'.',2)   =   SUBSTRING_INDEX(?,'.',2) and cast(crmrespcabecerofecmon as date) >= cast(now() as date)  ;`

