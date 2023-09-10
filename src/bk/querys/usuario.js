module.exports.Estaenreceso =  "SELECT BTESTAGNTT sts FROM bstntrn.btestagnt where  BTESTAGNTUSR = ? and BTESTAGNTMOTIVOID != 'FJLA' ";

module.exports.consultarEstAgente = "SELECT btagenteOutStsExt estatus FROM bstntrn.btagenteoutbound where btAgenteOutId = ?";

module.exports.actualizarMulticanal = `UPDATE bdnrh.nrhemdbmcinteracciones  
    SET nrhemdbmcinteraccioneslestatus = 0 
    WHERE NRHEMUSERID = ?;`

module.exports.ActualizarEstatusLlamada = "UPDATE bstntrn.bstnstatusllamada set estatusLlamada = ? ,IdLlamada = ?  where userid = ? "



module.exports.consultarEstAgenteInb = "SELECT btagenteInbtStsExt estatus FROM bstntrn.btagenteinbound where btAgenteInbId = ?";

module.exports.CerrarSesion =  "DELETE FROM bstntrn.monac WHERE monacID=?";

module.exports.updateMovimientosUsuario =  " UPDATE  bstntrn.btmpersonal "
                    +" SET btmpersonalDURS= FLOOR(TIME_TO_SEC(TIMEDIFF(current_time(), BTMPERSONALHINI))), btmpersonalFFIN = ?,btmpersonalHFIN=? ,btmpersonalDUR = SUBSTR(TIMEDIFF(current_time(), BTMPERSONALHINI),1,8) "
                    +" WHERE SIOUSUARIOID= ?  and btmpersonalRECID= 'SBSC' AND  btmpersonalFFIN IS NULL  AND btmpersonalHFIN IS NULL ";
      
module.exports.calcularIdmonacH =   "SELECT COALESCE(MAX(monacHID)+1,1) AS id FROM bstntrn.monach";

module.exports.InsertarSesionTrabajoHistorial= "INSERT INTO bstntrn.monach"
+"   (monacHID,monacID,"
 +"  monacAP,"
 +"   monacF,"
 +"  monacH,"
+"  monacUA,"
+"  monacIP,"
+"  monacEST,"
+"  monacOD,"
+"  monacIDEQUIPO,"
+"  monacRAN)"
+"  VALUES"
+" ((SELECT COALESCE(MAX(monacHID)+1,1) AS id FROM bstntrn.monach as id),?,'Agente',CURDATE(),current_time(),'Programa del agente',?,?,'',?,'0')";

module.exports.actulizarAgenteOutbound="UPDATE bstntrn.btagenteoutbound SET btagenteOutStsExt = ?,btAgenteOutSesion = ? WHERE btAgenteOutId = ? ";

module.exports.actulizarAgenteInbound="UPDATE bstntrn.btagenteinbound SET btagenteInbtStsExt = ?,btAgenteInbSesion = ?  WHERE btAgenteInbId = ? ";

module.exports.actulizarAgenteInboundNoIp = "UPDATE bstntrn.btagenteinbound SET btagenteInbtStsExt = ?,btAgenteInbSesion = ?  WHERE btAgenteInbId = ? ";


module.exports.insertarMovimientos= " INSERT INTO bstntrn.btmpersonal (btmpersonalIDN, SIOUSUARIOID, btmpersonalRECID, btmpersonalFINI,btmpersonalHINI,btcrecesoNOMC,BTMPERSONALFFIN,BTMPERSONALHFIN,BTMPERSONALDUR,BTMPERSONALDURS,BTCAPPVERSION) " + 
" VALUES ((SELECT COALESCE(MAX(btmpersonalIDN)+1,1) AS id FROM bstntrn.btmpersonal AS ID),?,?, ?, DATE_SUB(current_time(),INTERVAL ? SECOND ),?,? ,? ,SEC_TO_TIME(?),?, ?) " ;

module.exports.consultarRespuestas = "SELECT bstrtId, bstrtDsc, bstrtrrespTipo, bstrttipo, bstrtShortcuts, bstrtcamp, bstrtcanal FROM bstntrn.bstrt where bstrtcamp = ? "; // and bstrtcanal = ?";

module.exports.consultarTipoRespuesta = " SELECT bstrttId, bstrttTipo FROM bstntrn.bstrtt ;";

module.exports.consultarConfTipificacion = `SELECT crmmevcita aceptaCita, crmmevcitpreg pregunta FROM crmbd.crmmev where crmmevid = ? ;`

module.exports.consultarTipificacionLlamada = `SELECT  a.BTCRM1IDLLAMADA idLlamada, ifnull( c.bnstrfubfolio , "NOTINEFUB") folioFubUnico, b.btclienteestadoid idEstado, DATE_FORMAT( b.btclientefnac, "%Y-%m-%d") fechaNac, c.bnstrfubtram tramite, a.BTCRM1FOLIO folio, 
    a.BTCRM1CLIENTENUMERO idCliente, c.bnstrfubcli idFub, b.btclientepnombre nombre, b.btclienteapaterno apPat, b.btclienteamaterno appMat, b.btclientencompleto nombreCom, 
    c.bnstrfubsucursalid, c.bnstrfubfolcita, c.bnstrfubfechacita, c.bnstrfubhoracita, a.btcrm1tram, a.btcrm1folcita, date_format( a.btcrm1feccita, "%d-%m-%Y") btcrm1feccita , a.btcrm1horcita,
    (SELECT GROUP_CONCAT((BTCLIENTECORREO) SEPARATOR '<br>') as correos FROM bstntrn.btclientecorreo where BTCLIENTECORREONOCTEID = a.BTCRM1CLIENTENUMERO ) correoElectronico, 
    (SELECT crmrespleyenda FROM crmbd.crmrespdetalle where crmrespcabecerofolio= a.BTCRM1FOLIO and crmrespidpadre = ?  and crmrespidpregunta = ? ) cita ,
    ifnull(( select BTCLIENTETELNO from bstntrn.btclientetel where BTCLIENTETELNOCTEID = a.BTCRM1CLIENTENUMERO and BTCLIENTETELTIPO='PERSONAL'order by BTCLIENTETELCONSID desc limit 1),( select BTCLIENTETELNO from bstntrn.btclientetel where BTCLIENTETELNOCTEID = a.BTCRM1CLIENTENUMERO and BTCLIENTETELTIPO='MOVIL'order by BTCLIENTETELCONSID desc limit 1) ) telefonoFijoInput
    FROM bstntrn.btcrm1 a 
    left join bstntrn.btcliente b on a.BTCRM1CLIENTENUMERO = b.btclientenumero  
    left join crmfub.bnstrfub c on a.BTCRM1CLIENTENUMERO = c.bnstrfubcli and c.bnstrfubidinter = a.BTCRM1IDLLAMADA
    WHERE a.BTCRM1IDLLAMADA= ?  AND a.BTCRM1ACTSIG = "NO";`

    module.exports.consultarCampanaOC = ` SELECT btAgenteCmpId campanaPertenece
    FROM bstntrn.btagenteoutbound A 
    LEFT JOIN bstntrn.btestagnt B ON A.btAgenteOutId = B.BTESTAGNTUSR 
    LEFT JOIN bstntrn.btcontacto C ON (C.btcontactoconsecutivo = A.btAgenteOutClienteId and C.btcontactocmpid = A.btagentecmpid) 
    where btAgenteOutId =? limit 1;`

module.exports.actCitaCRM = `UPDATE bstntrn.btcrm1 SET btcrm1suc = ?, 
    btcrm1tram = ?, btcrm1folcita = ?, btcrm1feccita = ?, btcrm1horcita  = ?
    WHERE BTCRM1IDLLAMADA = ? and BTCRM1CLIENTENUMERO = ? and BTCRM1FOLIO = ? ;`

module.exports.actCitaFUB = `UPDATE crmfub.bnstrfub
    SET bnstrfubsucursalid = ?, bnstrfubfolcita =  ?,
    bnstrfubfechacita = ?, bnstrfubhoracita = ? WHERE bnstrfubcli = ? AND bnstrfubidinter = ? ;`

module.exports.consultarCita = "SELECT fncsolhordsc FROM siofnc.fncsol where fncsolid = ? ;"

module.exports.consultarNumTransferencias = "SELECT estadostransferdesc DSC, estadostransfertel TEL FROM bstntrn.estadostransfer ;"

module.exports.consultaVersion = `SELECT valor FROM bstntrn.spcpagtopcprc where version = 'SDB-60'`;

module.exports.editarEstatusExt = `UPDATE bstntrn.btagenteinbound SET btagenteinboundactivo = ? WHERE btAgenteInbId=?;`;

module.exports.editarEstatusExtOBD = `UPDATE bstntrn.btagenteoutbound SET btagenteoutboundactivo = ? WHERE btAgenteOutId=?;`;

module.exports.editarEstatusOBD = `UPDATE bstntrn.btagenteoutbound SET btagenteOutStsExt=?, btagenteoutboundactivo = ? WHERE btAgenteOutId=?;`;