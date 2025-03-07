
module.exports.consultarIdLlamada = "select llamadasEntrantesIdn idN, llamadasEntrantesId id , llamadasEntrantesFecha fecha, CAST(llamadasEntrantesFecha AS DATE) fechaI, DATE_FORMAT(llamadasEntrantesFecha,'%H:%i:%s') horaI, llamadasEntranteidivr idivr from llamadasentrantes "
    + " where cast( llamadasEntrantefecha as date) = ?  and llamadasEntrantesExt = ? and llamadasEntranteIdUsado  = '0' and llamadasEntrantesNum=? "
    + " order by llamadasEntrantefecha desc limit 1 ";

module.exports.consultarIdLlamadaSinTelefono = "select llamadasEntrantesIdn idN, llamadasEntrantesId id , llamadasEntrantesFecha fecha, CAST(llamadasEntrantesFecha AS DATE) fechaI, DATE_FORMAT(llamadasEntrantesFecha,'%H:%i:%s') horaI, llamadasEntranteidivr idivr  from llamadasentrantes "
+ " where cast( llamadasEntrantefecha as date) = ?  and llamadasEntrantesExt = ? and llamadasEntranteIdUsado  = '0'  "
+ " order by llamadasEntrantefecha desc limit 1 ";

module.exports.consultarIdLlamadaSinExtensionTransf = "select llamadasEntrantesIdn idN, llamadasEntrantesId id , llamadasEntrantesFecha fecha, CAST(llamadasEntrantesFecha AS DATE) fechaI, DATE_FORMAT(llamadasEntrantesFecha,'%H:%i:%s') horaI, llamadasEntranteidivr idivr "+ 
"  from llamadasentrantes "
+ " where cast( llamadasEntrantefecha as date) = ?  and llamadasEntranteIdUsado  = '0'  and llamadasEntrantesNum=? "
+ " order by llamadasEntrantefecha desc limit 1 ";

module.exports.fechas____ = `select now() fecha,  CAST(now() AS DATE) fechaI, DATE_FORMAT(now(),'%H:%i:%s') horaI ;`

module.exports.consultarFechaHora = "select DATE_FORMAT(now(), '%H:%i:%s') hora, DATE_FORMAT(now(), '%Y-%m-%d') fecha "   ;


module.exports.consultarFechaHoraServer_ = `select TIME(adjusted_time) AS hora, DATE(adjusted_time) AS fecha from
    (SELECT ADDDATE(calldate, INTERVAL duration SECOND) AS adjusted_time   FROM cdr  where uniqueid = ?) AS subquery; `;


/*
module.exports.consultarFechaHoraServer = `select DATE_FORMAT(ADDDATE(calldate, INTERVAL duration second), "%H:%i:%s") hora, 
    DATE_FORMAT(ADDDATE(calldate, INTERVAL duration second), "%Y-%m-%d") fecha  , uniqueid id 
    FROM cdr where disposition = "ANSWERED" and dcontext = "ext-local" and dst = ? and src = ? 
    and DATE_FORMAT(calldate, '%Y-%m-%d') = ? order by hora desc limit 1;     ;`
*/
module.exports.consultarFechaHoraServer = `select TIME(adjusted_time) AS hora, DATE(adjusted_time) AS fecha, id
    from (
        SELECT ADDDATE(calldate, INTERVAL duration SECOND) AS adjusted_time, uniqueid id   
        FROM cdr  
        where disposition = "ANSWERED" and dcontext = "ext-local" and dst = ? and src = ? 
        AND calldate >= ? 
        AND calldate < DATE_ADD(?, INTERVAL 1 DAY) 
    ) AS subquery
    order by hora desc limit 1;`;

module.exports.updateIdFinLlamadaCRM = `UPDATE bstntrn.btcrm1
    SET btcrm1idllamadaalt = ? , btcrm1colgo= ? 
    WHERe SUBSTRING_INDEX(BTCRM1IDLLAMADA,'.',2)   =   SUBSTRING_INDEX(?,'.',2) and  BTCRM1FECHA >= curdate() `;


module.exports.ActualizarAgente = "UPDATE bstntrn.btagenteinbound set btagenteInbtStsExt = ? , btagenteinbhorallam = now(), btagenteNumeroCli = ?, btagentenombrecli = '',btagenteIdLlamada = ? where btAgenteInbId  = ? ";

module.exports.ActualizaridLlamada = " UPDATE bstntrn.BTESTAGNT SET BTESTAGNTCALLID = ? WHERE BTESTAGNTUSR = ? ";

module.exports.ActualizarEstatusLlamada = "UPDATE bstntrn.bstnstatusllamada set estatusLlamada = ? ,IdLlamada = ?  where userid = ? "

module.exports.consultarRutaIVR = " SELECT concat(registrodeivrruta,'|',registrodeivrcamp01,'|',registrodeivrcamp02)rutaIVR,ifnull(registrodeivrcamp01,'')campo01,ifnull(registrodeivrcamp02,'')campo02,ifnull(registrodeivrcamp03,'')campo03," +
    " ifnull(registrodeivrcamp04,'')campo04,ifnull(registrodeivrcamp05,'')campo05,ifnull(registrodeivrcamp06,'')campo06,ifnull(registrodeivrcamp07,'')campo07 " +
    " FROM registrodeivr where registrodeidllamada=? and registrodeivrfecha >= curdate() order by registrodeivrfecha desc limit 1 ";


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


module.exports.actualizarContacto = "UPDATE bstntrn.btcontacto SET btContactoSts = ? WHERE btContactoConsecutivo = ? and btContactoCmpId = ? ;";

module.exports.FINTIPIF1= `update bstntrn.btcrm1 
    set BTCRM1FECINI=BTCRM1FECHA, 
    BTCRM1HORINI=BTCRM1HORA, 
    BTCRM1INTERACCIONFECINI=BTCRM1FECHA, 
    BTCRM1INTERACCIONHORINI=BTCRM1HORA ,
    btcrm1colgo= ? 
    where  SUBSTRING_INDEX(BTCRM1IDLLAMADA,'.',2)   =   SUBSTRING_INDEX(?,'.',2)
    and BTCRM1INTERACCIONFECINI is null and  BTCRM1FECHA = curdate() ;`;

    
module.exports.proposito = `	update   bstntrn.btcrm1    
 set   
 BTCRMTIPIFCAD = 'TIPIFICACION CANCELADA',
 crmsemaforizacionestatusid=5 , btcrm1motivoc= ?, btcrm1acw= ?
 WHERe  BTCRM1FECHA = curdate()  
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
    where SUBSTRING_INDEX(BTCRM1IDLLAMADA,'.',2)   =   SUBSTRING_INDEX(?,'.',2) and  BTCRM1FECHA = curdate() ;`

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
    where SUBSTRING_INDEX(crmrespcabeceroidllam,'.',2)   =   SUBSTRING_INDEX(?,'.',2) and crmrespcabecerofecmon =  curdate() ;`



    module.exports.FINTIPIF2CRM = `update bstntrn.btcrm1  
    set BTCRM1FECFIN= cast(now() as date) ,
    BTCRM1HORFIN= cast(cast(now() as time) as char(8)) ,
    BTCRM1DURACION= SUBSTR((SELECT TIMEDIFF( cast(now() as datetime)     ,concat(BTCRM1FECINI,' ',BTCRM1HORINI ) )) ,1,8),
    BTCRM1DURACIONSEG= (SELECT TIME_TO_SEC(TIMEDIFF( cast(now() as datetime),concat(BTCRM1FECINI,' ',BTCRM1HORINI ) ))) , 
    BTCRM1INTERACCIONFECFIN= cast(now() as date), 
    BTCRM1INTERACCIONHORFIN= cast(cast(now() as time) as char(8)) , 
    BTCRM1FECINTERACCIONDUR= SUBSTR((SELECT TIMEDIFF( cast(now() as datetime)   ,concat(BTCRM1INTERACCIONFECINI,' ',BTCRM1INTERACCIONHORINI ) )) ,1,8),
    BTCRM1FECINTERACCIONDURSEG= (SELECT TIME_TO_SEC(TIMEDIFF(cast(now() as datetime)   ,concat(BTCRM1INTERACCIONFECINI,' ',BTCRM1INTERACCIONHORINI ) ))) 
    where SUBSTRING_INDEX(BTCRM1IDLLAMADA,'.',2)   =   SUBSTRING_INDEX(?,'.',2) and BTCRM1FECHA >=  curdate() ;`

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
    where SUBSTRING_INDEX(crmrespcabeceroidllam,'.',2)   =   SUBSTRING_INDEX(?,'.',2) and crmrespcabecerofecmon >= curdate() ;`

    module.exports.insertarllamadastransferencia = " INSERT INTO llamadastransferencia ( " +
    " llamadastransferenciaId,    llamadastransferenciaExt,    llamadastransferenciaNum,    llamadastransferenciaFecha) " +
    " VALUE( " +
    " ?, ?, ?, NOW() );";

    module.exports.updateExtensionEntrantes = `UPDATE llamadasentrantes SET llamadasEntrantesExt = ? WHERE llamadasEntrantesIdn = ? and llamadasEntrantesId = ? ;`  
    module.exports.consultarTipxQueue =   `SELECT NRHEM07ID valorCampo FROM bdnrh.nrhemdb where NRHEMUSERID = ?; `;

    module.exports.recuperarIdLlamada = " select idN,  id , fecha, date(fecha) fechaI, time(fecha) horaI, idivr "
    + " from( "
    + "     select llamadasEntrantesIdn idN, llamadasEntrantesId id , llamadasEntrantesFecha fecha, llamadasEntranteidivr idivr from llamadasentrantes "
    + "     where  llamadasEntrantefecha >= ? AND llamadasEntrantefecha < DATE_ADD(?, INTERVAL 1 DAY)  "
    + "         and llamadasEntrantesExt = ?  and llamadasEntrantesNum=? "
    + "     order by llamadasEntrantefecha desc limit 1 "
    + " )as subquery";

module.exports.recuperarIdLlamadaSinTelefono = "select idN, id , fecha, date(fecha) fechaI, time(fecha) horaI, idivr  "
+ " from( "
+ "     select llamadasEntrantesIdn idN, llamadasEntrantesId id , llamadasEntrantesFecha fecha, llamadasEntranteidivr idivr  "
+ "     from llamadasentrantes "
+ "     where llamadasEntrantefecha >= ? AND llamadasEntrantefecha < DATE_ADD(?, INTERVAL 1 DAY) and llamadasEntrantesExt = ?   "
+ "     order by llamadasEntrantefecha desc limit 1 "
+ " )as subquery";

module.exports.recuperarIdLlamadaSinExtensionTransf = "select idN, id , fecha, date(fecha) fechaI, time(fecha) horaI, idivr  "
+ " from( "
+ "     select llamadasEntrantesIdn idN, llamadasEntrantesId id , llamadasEntrantesFecha fecha, llamadasEntranteidivr idivr "
+ "     from llamadasentrantes "
+ "     where llamadasEntrantefecha >= ? AND llamadasEntrantefecha < DATE_ADD(?, INTERVAL 1 DAY)   and llamadasEntrantesNum=? "
+ "     order by llamadasEntrantefecha desc limit 1 "
+ " )as subquery";

module.exports.consultarClienteCRMDia = " select concat(DATE_FORMAT(crm1.BTCRM1FECHA, '%d-%m-%Y'),' ', BTCRM1HORA) fecha, crm1.BTCRM1ATENDIONOMBRE agente, IFNULL(crm1.BTCRM1COMENTARIO,'') comentarios "+
            " from  bstntrn.btcrm1 crm1  "+
            " inner join  bstntrn.btcliente  cli on btclientenumero = BTCRM1CLIENTENUMERO  COLLATE latin1_swedish_ci and cli.btclienterfc = ?  "+
            " where  BTCRM1FECHA = curdate() ORDER BY STR_TO_DATE(CONCAT(crm1.BTCRM1FECHA, ' ', crm1.BTCRM1HORA), '%Y-%m-%d %H:%i:%s') DESC "+
            " limit 3 ;";

module.exports.consultarClienteCRMHis = " select concat(DATE_FORMAT(fecha, '%d-%m-%Y'),' ', horaIni) fecha, nomAgente agente, ifnull(cNota_Desc,'') comentarios from crmnafbd.btcrm1 c  "+
            " where rfc  = ? "+
            " order by  STR_TO_DATE(CONCAT(c.fecha, ' ', c.horaIni), '%Y-%m-%d %H:%i:%s') desc limit ? ";

    