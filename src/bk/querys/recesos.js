module.exports.consultarIdUsuarioExt =  " SELECT btestagntUSR id FROM bstntrn.btestagnt where btestagntUSR=? " ;

module.exports.InsertarSolictarReceso = " INSERT INTO bstntrn.btestagnt (btestagntT, btestagntCALLID, btestagntUSR, btestagntMOTIVO, btestagntMOTIVOID) " + 
" VALUES (?,?,?,?,?) " ;

module.exports.ActuaizaSolictarReceso = " UPDATE  bstntrn.btestagnt " + 
" SET btestagntT=?, btestagntCALLID=?, btestagntMOTIVO=?, btestagntMOTIVOID=? " + 
" WHERE btestagntUSR=? " ;

module.exports.ActuaizaSolictarRecesoInbound= " UPDATE  bstntrn.btagenteinbound " + 
" SET btagenteInbtStsExt=?, btagenteInbStsReceso=? " + 
" WHERE btAgenteInbId=? " ;

module.exports.ActuaizaSolictarRecesoOut = `UPDATE  bstntrn.btagenteoutbound 
SET btagenteOutStsExt = ?, btagenteOutStsReceso = ? WHERE btAgenteOutId = ?;`;

module.exports.actualizarEstatus= " UPDATE  bstntrn.btestagnt " + 
" SET btestagntT=?,btestagntSALRECESO = null " + 
" WHERE btestagntUSR=? " ;

module.exports.actualizarEstatusSalirReceso= " UPDATE  bstntrn.btestagnt " + 
" SET btestagntT=?,btestagntSALRECESO = NOW() " + 
" WHERE btestagntUSR=? " ;

module.exports.updateMovimientosUsuario= " UPDATE  bstntrn.btmpersonal " + 
" SET btmpersonalDURS= FLOOR(TIME_TO_SEC(TIMEDIFF(current_time(), BTMPERSONALHINI))), " +
" btmpersonalFFIN = ? ,btmpersonalHFIN= ?,btmpersonalDUR= SUBSTR(TIMEDIFF(current_time(), BTMPERSONALHINI),1,8) " + 
" WHERE SIOUSUARIOID= ? AND btmpersonalFINI = CURDATE() and btmpersonalRECID= 'SBSC' AND  btmpersonalFFIN IS NULL  AND btmpersonalHFIN IS NULL " ;

module.exports.InsertarSesionTrabajoHistorial= " INSERT INTO bstntrn.monach (monacHID,monacID,monacAP, monacF, monacH, monacUA, monacIP, monacEST, " + 
" monacOD,monacIDEQUIPO,monacRAN) " +
" VALUES ((SELECT COALESCE(MAX(monacHID)+1,1) AS id FROM bstntrn.monach AS ID),?,'Agente',CURDATE(),current_time(),'Programa del agente',?,?,'',?,'0') " ;

module.exports.insertarMovimientos= " INSERT INTO bstntrn.btmpersonal (btmpersonalIDN, SIOUSUARIOID, btmpersonalRECID, btmpersonalFINI,btmpersonalHINI,btcrecesoNOMC, BTCAPPVERSION) " + 
" VALUES ((SELECT COALESCE(MAX(btmpersonalIDN)+1,1) AS id FROM bstntrn.btmpersonal AS ID),?,?, ?,? ,? , ?) " ;

module.exports.consultarMovimientos=  " SELECT SIOUSUARIOID usuario, btmpersonalRECID idReceso , btmpersonalFINI fechaInicial,  btmpersonalHINI horaInicial, " + 
" btmpersonalFFIN fechaFinal, btmpersonalHFIN horaFin , btmpersonalDUR duracion, btmpersonalDURS duracionSeg, " + 
" btcrecesoNOMC descTipoReceso FROM bstntrn.btmpersonal where SIOUSUARIOID = ? and btmpersonalFINI=CURDATE() and   (btmpersonalagt is null  or  btmpersonalagt !='S') ORDER BY btmpersonalIDN DESC" ;

module.exports.consultaTipoReceso=  " SELECT btcrecesoID id, btcrecesoNOMP rDescripcion, btcrecesoNOMC rCorto, " + 
" btcrecesoNOML rLargo, btcrecesoMAXTMP rTiempo, btcrecesoMAXREC rRecesos " + 
" FROM bstntrn.btcreceso " ;

module.exports.consultaRecesoAuto=  " SELECT BTESTAGNTT,BTESTAGNTMOTIVO,BTESTAGNTMOTIVOID FROM BSTNTRN.BTESTAGNT WHERE BTESTAGNTUSR = ? " ;

module.exports.consultaRecesoAutoMDE=  " SELECT count(*) atencion FROM inmc.imc WHERE  inmcestid=1  and imcagente=? " ;


module.exports.updateMovimientosRecesoUsuario= " UPDATE  bstntrn.btmpersonal "
    +" SET btmpersonalDURS= FLOOR(TIME_TO_SEC(TIMEDIFF(current_time(), BTMPERSONALHINI))), btmpersonalFFIN = ? ,btmpersonalHFIN= ?, btmpersonalDUR= SUBSTR(TIMEDIFF(current_time(), BTMPERSONALHINI),1,8) "
    +" WHERE SIOUSUARIOID= ? and btmpersonalRECID <> 'SBSC' AND  btmpersonalFFIN IS NULL  AND btmpersonalHFIN IS NULL ";

module.exports.actulizarRecesos= "UPDATE bstntrn.btestagnt SET BTESTAGNTT = 'DIS' WHERE BTESTAGNTUSR = ? ";

module.exports.actulizarAgenteOutbound= "UPDATE bstntrn.btagenteoutbound SET btagenteOutStsExt = ?,btAgenteOutSesion = ? WHERE btAgenteOutId = ? ";

module.exports.actulizarAgenteInbound= "UPDATE bstntrn.btagenteinbound SET btagenteInbtStsExt = ?,btAgenteInbSesion = ?  WHERE btAgenteInbId = ? ";


module.exports.actulizarAgenteInboundNoIp = "UPDATE bstntrn.btagenteinbound SET btagenteInbtStsExt = ?,btAgenteInbSesion = ?  WHERE btAgenteInbId = ? ";


module.exports.tiempoTotalConexion= " select sec_to_time(SUM(TIME_TO_SEC( TIMEDIFF (STR_TO_DATE( CONCAT( BTMPERSONALFFIN, '' , BTMPERSONALHFIN ), '%Y-%m-%d %H:%i:%s'), " +
                                    " STR_TO_DATE( CONCAT( BTMPERSONALFINI, '' , BTMPERSONALHINI ), '%Y-%m-%d %H:%i:%s' )))))tiempoTotalConexion from bstntrn.btmpersonal " +
                                    " WHERE   SIOUSUARIOID = ?  and btmpersonalRECID='SBSC' and btmpersonalFINI=CURDATE() and   (btmpersonalagt is null  or  btmpersonalagt !='S')" ;


module.exports.tiempoTotalReceso= "  SELECT SEC_TO_TIME(SUM(BTMPERSONALDURS))tiempoTotalReceso from bstntrn.btmpersonal  where "+
                                    " (btmpersonalRECID='RALI' or btmpersonalRECID='REPS'or btmpersonalRECID='REAL'or btmpersonalRECID='CPTN'or btmpersonalRECID='COMI') "+
                                    " and SIOUSUARIOID = ? and btmpersonalFINI=CURDATE() and   (btmpersonalagt is null  or  btmpersonalagt !='S') " ;                                    


module.exports.tiempoTotalEfectivo= " Select (?) tiempoTotalEfectivo";

module.exports.horaActual= " Select current_time() horaActual";
