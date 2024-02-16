
module.exports.consultarIdLlamada = "select llamadasEntrantesId id , llamadasEntrantesFecha fecha, CAST(llamadasEntrantesFecha AS DATE) fechaI, DATE_FORMAT(llamadasEntrantesFecha,'%H:%i:%s') horaI from llamadasentrantes "
    + " where cast( llamadasEntrantefecha as date) = curdate() and llamadasEntrantesExt = ? "
    + " order by llamadasEntrantefecha desc limit 1 ";

module.exports.consultarFechaHora = "select DATE_FORMAT(now(), '%H:%i:%s') hora, DATE_FORMAT(now(), '%Y-%m-%d') fecha "   ;

module.exports.consultarFechaHoraServer = `select DATE_FORMAT(ADDDATE(calldate, INTERVAL duration second), "%H:%i:%s") hora, 
DATE_FORMAT(ADDDATE(calldate, INTERVAL duration second), "%Y-%m-%d") fecha  
FROM cdr where uniqueid = ?
`
module.exports.ActualizaridLlamada = " UPDATE bstntrn.BTESTAGNT SET BTESTAGNTCALLID = ? WHERE BTESTAGNTUSR = ? ";

module.exports.ActualizarEstatusLlamada = "UPDATE bstntrn.bstnstatusllamada set estatusLlamada = ? ,IdLlamada = ?  where userid = ? "

module.exports.GuardarTipificacionCAbeceroConRuta = "INSERT INTO bstntrn.btcrm1 "
    + "(BTCRM1FOLIO,BTCRM1FECHA,BTCRM1HORA,BTCRM1CLIENTENUMERO,BTCRM1IDLLAMADA,BTCRM1ATENDIO,BTCRM1ATENDIONOMBRE,BTCRM1EXTENSION,BTCRMTELEFONO,"
    + " BTCRM1CANAL,BTCRMSUPERVISOR,BTCRMIVRRUTA,BTCRMCAMPO01,BTCRMCAMPO02,BTCRMCAMPO03,BTCRMCAMPO04,BTCRMCAMPO05,BTCRMCAMPO06,BTCRMCAMPO07,crmsemaforizacionestatusid, BTCRM1IPSERVIDOR) "
    + " VALUES ((SELECT IFNULL(MAX(BTCRM1FOLIO),0)+1 FROM bstntrn.btcrm1 as BTCRM1FOLIO), ? ,"
    + "?,?,?,?,?,?,?,?,'32',?,?,?,?,?,?,?,?,'2', ?)";


module.exports.ConsultarIdInsercionObjeto = " SELECT BTCRM1FOLIO ID FROM bstntrn.btcrm1 WHERE BTCRM1CLIENTENUMERO = ? AND BTCRM1IDLLAMADA = ? AND  BTCRM1ATENDIO = ? LIMIT 1 ";

module.exports.ActualizarAgenteOut = " UPDATE bstntrn.btagenteoutbound set btagenteoutStsExt = ? , btagenteouthorallam = now(), btagenteouttelefonocliente = ? where btAgenteoutId  = ? ";

module.exports.ActualizarAgenteFin = " UPDATE bstntrn.btagenteoutbound set btagenteoutStsExt = ? , btagenteOutClienteId = ?, btagenteOutTelefonoCliente = '' where btAgenteoutId  = ? ";

module.exports.ActualizarAgenteOut_ = "  UPDATE bstntrn.btagenteoutbound set btagenteoutStsExt = ? , btagenteOutClienteId = ?, btAgenteCmpId = ?,  btagenteouthorallam = now(), btagenteouttelefonocliente = ?  where btAgenteoutId  = ? ";


module.exports.guardarNombre = " UPDATE bstntrn.btagenteinbound SET btagenteNombreCli = ? WHERE btAgenteInbId = ? ; ";

module.exports.ActulizarClienteCrm = " UPDATE bstntrn.btcrm1 SET BTCRM1CLIENTENUMERO = ? WHERE BTCRM1IDLLAMADA= ? AND BTCRM1ATENDIO= ? AND BTCRMTELEFONO = ?; ";

module.exports.consultarClienteCRM12 = " SELECT count(*) total FROM  bstntrn.btcrm12 WHERE BTCRM1FOLIO= ? limit 1 ; ";

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



//CONSULTAS PARA OUTBOUND

module.exports.consultarClienteSalida = `select c.btContactoConsecutivo id,c.btContactoNombreCliente nombreCompleto,btagenteOutTelefonoCliente telefonoCliente,b.btcampanadescripcion motivoLlamada, 
    edo.BTEDOSDSC estado,btcontactoMunicipio municipio,btcontactoNoCliente noCliente,btAgenteOutNombre nombreAgente,a.btAgenteOutExt,a.btAgenteCmpId, btcontactomotivo obs, e.bstncanalidn canalid 
    FROM bstntrn.btagenteoutbound a inner join bstntrn.btcampanas b on a.btAgenteCmpId = b.btcampanaid 
    inner join bstntrn.btcontacto c on a.btAgenteCmpId = c.btContactoCmpId and a.btAgenteOutClienteId = c.btContactoConsecutivo 
    left join bstntrn.btedos edo on c.btcontactoEstadoid = edo.BTEDOSID 
    inner join bstntrn.bstncanal e on e.bstncanalid = b.bstncanalid 
    WHERE btAgenteOutId = ? and btagenteOutTelefonoCliente = ? and b.bstncanalid in ('OBD','WCAL','CALL'); `;

module.exports.consultarCamposReservados = "SELECT sptcamposcriptpr,sptcamposcriptvalor,sptcamposcripttipo FROM bstntrn.sptcamposcript where sptcamposcriptnocli = ? and sptcamposcriptcmpid = ? and sptcamposcriptconsc = ? ; ";

module.exports.consultarIdLlamadaOut = "select llamadasEntrantesIdn idN,  llamadasEntrantesId id , llamadasEntrantesFecha fecha, CAST(llamadasEntrantesFecha AS DATE) fechaI, DATE_FORMAT(llamadasEntrantesFecha,'%H:%i:%s') horaI FROM llamadasentrantes WHERE llamadasEntrantesNum = ? and llamadasEntrantesFecha >= adddate(now(), interval -2 minute) and llamadasEntranteIdUsado  = '0' order by  llamadasEntrantesIdn desc limit 1 ";

module.exports.guardarTipificacionLlamada = "insert into bstntrn.btcontactotip (btcontactotipfecha,btcontactotipclienteid,btcontactotipidllam,btcontactotipusr,btcontactotipext,btcontactotiptel,btcontactotipcamp, " +
    "btcontactotip1,btcontactotip1dsc,btcontactotip2,btcontactotip2dsc,btcontactotipobs) " +
    "values (now(),?,?,?,?,?,?,'','','','','') ";


module.exports.updateIdLlamada = `UPDATE llamadasentrantes SET llamadasEntranteIdUsado = '1' WHERE llamadasEntrantesIdn = ? and llamadasEntrantesId = ? ;`    

module.exports.actualizaridLlamadaOut = "UPDATE bstntrn.BTESTAGNT SET BTESTAGNTCALLID = ? WHERE BTESTAGNTUSR = ?"

module.exports.GuardarTipificacionCAbeceroConRutaOut = `INSERT INTO bstntrn.btcrm1 
    (BTCRM1FOLIO,BTCRM1FECHA,BTCRM1HORA,BTCRM1CLIENTENUMERO,BTCRM1IDLLAMADA,BTCRM1ATENDIO,BTCRM1EXTENSION,BTCRMTELEFONO,BTCRM1CANAL,BTCRMNOMCAP, 
    crmsemaforizacionestatusid, BTCRM1IPSERVIDOR,btcrm1idllamadaalt ) 
    VALUES ((SELECT IFNULL(MAX(BTCRM1FOLIO),0)+1 FROM bstntrn.btcrm1 as BTCRM1FOLIO), ?, 
    ?,?,?,?,?,?,?,?,'2', ?,? )`;

module.exports.consultarIdInsercionObjeto = "SELECT BTCRM1FOLIO ID FROM bstntrn.btcrm1 WHERE BTCRM1CLIENTENUMERO = ? AND BTCRM1IDLLAMADA = ? AND  BTCRM1ATENDIO = ? LIMIT 1 ";

module.exports.actualizarContacto = "UPDATE bstntrn.btcontacto SET btContactoSts = ? WHERE btContactoConsecutivo = ? and btContactoCmpId = ? ;"

module.exports.ActualizarAgenteExtesionConectada = " UPDATE bstntrn.btagenteoutbound set btagenteoutStsExt = ? ,btagenteouthorallam = now(), btagenteOutClienteId = ?, btagenteOutTelefonoCliente = '',btAgenteOutSesion = 'S' where btAgenteoutId  = ? ";

module.exports.InsertarContactos = "CALL bstntrn.insertar_Contacto(?, ?, ?);";

module.exports.GuardarTipificacionCAbeceroAutomatica = `INSERT INTO bstntrn.btcrm1 
    (BTCRM1FOLIO,BTCRM1FECHA,BTCRM1HORA,BTCRM1CLIENTENUMERO,BTCRM1IDLLAMADA,BTCRM1ATENDIO,BTCRM1EXTENSION,BTCRMTELEFONO,BTCRM1CANAL,BTCRMNOMCAP, 
    crmsemaforizacionestatusid, BTCRM1IPSERVIDOR,btcrm1idllamadaalt,btcrm1cmp ) 
    VALUES ((SELECT IFNULL(MAX(BTCRM1FOLIO),0)+1 FROM bstntrn.btcrm1 as BTCRM1FOLIO), ?, 
    ?,?,?,?,?,?,?,?,'2', ?,?,? )`;

module.exports.consultarReus = `SELECT case when btbuscarreus = 'SI' 
then (select count(*) from bstntrn.listareus where listareus_telefono = ? limit 1)
else 0 end enreus  FROM bstntrn.btcampanas
where btcampanaid = ? and bstnCanalId = 'OBD';`;