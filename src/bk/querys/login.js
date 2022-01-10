


module.exports.consultarOpcPrc = "SELECT idN, nombre, valor FROM bstntrn.spcpagtopcprc WHERE version  = ?;"


module.exports.actualizarMulticanal = `UPDATE bdnrh.nrhemdbmcinteracciones 
    SET nrhemdbmcinteraccioneslestatus = 1 
    WHERE NRHEMUSERID = ?;`

module.exports.ActualizarEstatusLlamada = "UPDATE bstntrn.bstnstatusllamada set estatusLlamada = ? ,IdLlamada = ?  where userid = ? "


module.exports.validaUsuario = "SELECT a.SSUSRID, a.SSUSRDSC, a.SSUSRPSW, a.SSUSRKEY "
    + " FROM siogen01.ssusri a  INNER JOIN cnuser b  ON b.CNUSERID = a.SSUSRID WHERE a.SSUSRID = ?";

module.exports.nombreUsuario = "SELECT A.SSUSRID,A.SSUSRDSC,A.SSUSRPSW,ifnull(A.SSUSRKEY,-1) SSUSRKEY,ifnull(B.CNCDIRID,-1) CNCDIRID, ifnull(B.CNUSERACC,'si') CNUSERACC ,ifnull(B.CNUSERESTATUS,'1') CNUSERESTATUS , ifnull(B.CNUSERCATCOL,'no') CNUSERCATCOL,B.CNUSERFOTO," +
    " ifnull(C.SMSUSERNOM,-1) SMSUSERNOM, ifnull(C.SMSUSERKEY,-1) SMSUSERKEY FROM  ssusri A" +
    " INNER JOIN CNUSER B ON B.CNUSERID = A.SSUSRID " +
    "  LEFT JOIN SMSUSER C ON B.SMSUSERID = C.SMSUSERID" +
    " WHERE A.SSUSRID = ?";

module.exports.consultarUsuario2= " SELECT NRHEMDBIDG, NRHEMUSERID, GROUP_CONCAT(bstnCanalIDN) canales " + 
    "FROM bdnrh.nrhemdbmc WHERE NRHEMUSERID = ? " + 
    "GROUP BY NRHEMDBIDG; ";

    /*
module.exports.consultarPorId = " SELECT cnuserid id, cnuserdsc nombre, btAgenteInbExt extension,CNUSERSERIN servidorin,ifnull(servin.servidorespasedominio,'0') domin,btAgenteOutExt extensionOutbound," +
    +" CNUSERSEROUT servidorout,ifnull(servout.servidorespasedominio,'0') domout, b.btsupervisonoml supervisor "
    + " FROM siogen01.cnuser a  "
    + " left join bstntrn.btsupervisor b on a.cnusersupervisor = b.btsupervisoidn"
    + " left join espejoshistoricos.servidorespase servin on a.CNUSERSERIN = servin.servidorespaseid "
    + " left join espejoshistoricos.servidorespase servout on a.CNUSERSEROUT = servout.servidorespaseid "
    + " left join bstntrn.btagenteinbound ain on a.cnuserid = ain.btAgenteInbId "
    + " left join bstntrn.btagenteoutbound aout on a.cnuserid = aout.btAgenteOutId "
    + " WHERE cnuserID = ?  and CNUSERBAJA='N' ";
    */

module.exports.insertarMovimientos = "INSERT INTO bstntrn.btmpersonal (btmpersonalIDN, SIOUSUARIOID, btmpersonalRECID, btmpersonalFINI,btmpersonalHINI,BTCRECESONOMC, BTCAPPVERSION) "
    + " VALUES (?,?,'SBSC', ?,?,'SESION SC', ?)";

module.exports.actulizarAgenteOutbound = "UPDATE bstntrn.btagenteoutbound SET btagenteOutStsExt = ?,btAgenteOutSesion = ?, marcador = ?, btagenteouthorallam = now() WHERE btAgenteOutId = ? ";

module.exports.actulizarAgenteInbound = "UPDATE bstntrn.btagenteinbound SET btagenteInbtStsExt = ?,btAgenteInbSesion = ? , marcador = ? WHERE btAgenteInbId = ? ";

module.exports.actulizarAgenteInboundNoIp = "UPDATE bstntrn.btagenteinbound SET btagenteInbtStsExt = ?,btAgenteInbSesion = ?  WHERE btAgenteInbId = ? ";

module.exports.updateMovimientosRecesoUsuario = " UPDATE  bstntrn.btmpersonal "
    + " SET btmpersonalDURS= FLOOR(TIME_TO_SEC(TIMEDIFF(current_time(), BTMPERSONALHINI))), btmpersonalFFIN = ? ,btmpersonalHFIN= ?, btmpersonalDUR= SUBSTR(TIMEDIFF(current_time(), BTMPERSONALHINI),1,8) "
    + " WHERE SIOUSUARIOID= ? and btmpersonalRECID <> 'SBSC' AND  btmpersonalFFIN IS NULL  AND btmpersonalHFIN IS NULL ";

module.exports.actulizarRecesos = "UPDATE bstntrn.btestagnt SET BTESTAGNTT = 'DIS' WHERE BTESTAGNTUSR = ? ";

/*
module.exports.consultarPorId = " SELECT cnuserid id, cnuserdsc nombre, btAgenteInbExt extension,CNUSERSERIN servidorin,ifnull(servin.servidorespasedominio,'0') domin,btAgenteOutExt extensionOutbound," +
    " CNUSERSEROUT servidorout,ifnull(servout.servidorespasedominio,'0') domout, b.btsupervisonoml supervisor " +
    " FROM siogen01.cnuser a  " +
    " left join bstntrn.btsupervisor b on a.cnusersupervisor = b.btsupervisoidn" +
    " left join espejoshistoricos.servidorespase servin on a.CNUSERSERIN = servin.servidorespaseid " +
    " left join espejoshistoricos.servidorespase servout on a.CNUSERSEROUT = servout.servidorespaseid " +
    " left join bstntrn.btagenteinbound ain on a.cnuserid = ain.btAgenteInbId " +
    " left join bstntrn.btagenteoutbound aout on a.cnuserid = aout.btAgenteOutId " +
    " WHERE cnuserID = ?  and CNUSERBAJA='N' ";
*/
module.exports.consultarPorId = "SELECT cnuserid id, cnuserdsc nombre, btAgenteInbExt extension,CNUSERSERIN servidorin,ifnull(servin.servidorespasedominio,'0') domin,btAgenteOutExt extensionOutbound, "     
    +"CNUSERSEROUT servidorout,ifnull(servout.servidorespasedominio,'0') domout, b.btsupervisonoml supervisor, b.nrhgempid proyecto, "
    +"cmp.bstnCanalId,b.btsupervisorcanal,cmp.btcmasiva,cmp.btcindividual,cmp.btcmodalidad,cmp.btcasigancion,cmp.btcampanaid campanaid,cmp.btcampanadescripcion cmpdsc, cmp.btscript scrip, cmp.btcampanastefrm tiempoFRM, cmp.btcampanastetip tiempoTip  "
    +"FROM siogen01.cnuser a  "
    +"inner join bstntrn.btsupervisor b on a.cnusersupervisor = b.btsupervisoidn "
    +"inner join bstntrn.bstncanal cnl on b.btsupervisorcanal = cnl.bstnCanalIDN "
    +"inner join bstntrn.btcampanas cmp on b.btsupervisorcamp = cmp.btcampanaid and cnl.bstnCanalId = cmp.bstnCanalId "
    +"left join espejoshistoricos.servidorespase servin on a.CNUSERSERIN = servin.servidorespaseid "
    +"left join espejoshistoricos.servidorespase servout on a.CNUSERSEROUT = servout.servidorespaseid "
    +"left join bstntrn.btagenteinbound ain on a.cnuserid = ain.btAgenteInbId "
    +"left join bstntrn.btagenteoutbound aout on a.cnuserid = aout.btAgenteOutId "
    +"WHERE cnuserID = ?  and CNUSERBAJA = 'N'; ";


module.exports.consultarIdAgenteOk = `    SELECT NRHEMUSERID id, cnuserdsc nombre, btAgenteInbExt extension,  btsupervisonoml supervisor, btAgenteCmpId campana, nrhgempid proyecto, bstnCanalId, btsupervisorcanal,
b1.btcmasiva,b1.btcindividual,b1.btcmodalidad,b1.btcasigancion,b1.btcampanaid campanaid,b1.btcampanadescripcion cmpdsc, 
b1.btscript scrip , b1.btcampanastefrm tiempoFRM, b1.btcampanastetip tiempoTip, b1.btcampanasmarcacionrapida,bstnCanalId bstnCanalIdAsignado, btcampanadescripcion cmpdsc,
serv1.servidorespaseip servidor
FROM bdnrh.nrhemdbmc a1
inner join bstntrn.btcampanas b1 on a1.btcampanaid = b1.btcampanaid
inner join siogen01.cnuser c1 on c1.cnuserid = a1.NRHEMUSERID
inner join bstntrn.btagenteinbound d1 on a1.NRHEMUSERID = d1.btAgenteInbId
inner join bstntrn.btsupervisor e1 on c1.cnusersupervisor = e1.btsupervisoidn
inner join espejoshistoricos.servidorespase serv1 on serv1.servidorespaseid = a1.servidorespaseid
WHERE bstnCanalIDN = 1 AND NRHEMUSERID  = ?
UNION
SELECT NRHEMUSERID id, cnuserdsc nombre, btAgenteOutExt extension,  btsupervisonoml supervisor, btAgenteCmpId campana, nrhgempid proyecto, b2.bstnCanalId,btsupervisorcanal,
d23.btcmasiva,d23.btcindividual,d23.btcmodalidad,d23.btcasigancion,b2.btcampanaid campanaid,b2.btcampanadescripcion cmpdsc, 
d23.btscript scrip , b2.btcampanastefrm tiempoFRM, b2.btcampanastetip tiempoTip, b2.btcampanasmarcacionrapida,d23.bstnCanalId bstnCanalIdAsignado, d23.btcampanadescripcion cmpdsc,
d2.marcador servidor
FROM bdnrh.nrhemdbmc a2
inner join bstntrn.btcampanas b2 on a2.btcampanaid = b2.btcampanaid
inner join siogen01.cnuser c2 on c2.cnuserid = a2.NRHEMUSERID
inner join bstntrn.btagenteoutbound d2 on a2.NRHEMUSERID = d2.btAgenteOutId
inner join bstntrn.btcampanas d23 on d2.btAgenteCmpId = d23.btcampanaid
inner join bstntrn.btsupervisor e2 on c2.cnusersupervisor = e2.btsupervisoidn
inner join espejoshistoricos.servidorespase serv2 on serv2.servidorespaseid = a2.servidorespaseid
WHERE bstnCanalIDN = 2 AND NRHEMUSERID = ? `;


    
module.exports.consultarPorId_ = `SELECT cnuserid id, cnuserdsc nombre, btAgenteInbExt extension,CNUSERSERIN servidorin,ifnull(servin.servidorespasedominio,'0') domin,btAgenteOutExt extensionOutbound,      
    CNUSERSEROUT servidorout,ifnull(servout.servidorespasedominio,'0') domout, b.btsupervisonoml supervisor, b.nrhgempid proyecto, 
    cmp.bstnCanalId,b.btsupervisorcanal,cmp.btcmasiva,cmp.btcindividual,cmp.btcmodalidad,cmp.btcasigancion,cmp.btcampanaid campanaid,cmp.btcampanadescripcion cmpdsc, 
    cmp.btscript scrip , cmp.btcampanastefrm tiempoFRM, cmp.btcampanastetip tiempoTip  
    FROM siogen01.cnuser a  
    inner join bstntrn.btsupervisor b on a.cnusersupervisor = b.btsupervisoidn 
    left join bstntrn.btagenteoutbound aout on a.cnuserid = aout.btAgenteOutId 
    inner join bstntrn.bstncanal cnl on aout.btAgenteCanalId  = cnl.bstnCanalIDN 
    inner join bstntrn.btcampanas cmp on aout.btAgenteCmpId = cmp.btcampanaid and cnl.bstnCanalId = cmp.bstnCanalId 
    left join espejoshistoricos.servidorespase servin on a.CNUSERSERIN = servin.servidorespaseid 
    left join espejoshistoricos.servidorespase servout on a.CNUSERSEROUT = servout.servidorespaseid 
    left join bstntrn.btagenteinbound ain on a.cnuserid = ain.btAgenteInbId 
    WHERE cnuserID = ? and CNUSERBAJA = 'N'; `;


module.exports.consultarDisponibilidadAgente = "select BTMPERSONALFFIN from  bstntrn.btmpersonal where BTCRECESONOMC = 'SESION SC' and SIOUSUARIOID = ? order by BTMPERSONALIDN desc LIMIT 1 ";

module.exports.calcularIdbtmpersonal = "SELECT COALESCE(MAX(btmpersonalIDN)+1,1) AS id FROM bstntrn.btmpersonal";

module.exports.Estaenreceso = "SELECT BTESTAGNTT sts FROM bstntrn.btestagnt where  BTESTAGNTUSR = ? and BTESTAGNTMOTIVOID != 'FJLA' ";


module.exports.infoReceso = "select BTMPERSONALHINI,BTCRECESONOMC, if( BTMPERSONALFINI=? ,  'SI', 'NO') esHoy from bstntrn.btmpersonal where SIOUSUARIOID= ?  and BTMPERSONALHFIN IS NULL";


module.exports.consultarAreas = " SELECT  reun.RPFREUNUSRID usuario ,RPFREUNARESID area, RPFLINEA linea,btversion.BTVERSIONDSCC areaTitulo ,BTVERSIONDSCL nombreVersion , BTVERSIONID version, " +
    " opproc.valor generico, opproc.valor2 idcliente,btversioncanal,btversionmevid tipificacion FROM bstntrn.btversion " +
    " inner JOIN bstntrn.btsnareversion as areaVersion ON btversion.BTVERSIONID = areaVersion.btsnareversionidversion " +
    " inner JOIN siogen01.rpfreun as reun ON reun.RPFREUNARESID = areaVersion.btsnareversionaresid and reun.RPFLINEA=areaVersion.btsnareversionlineaid " +
    " INNER JOIN bstntrn.bstopcionesproceso opproc on btversion.BTVERSIONID = opproc.version and opproc.opcionProc = 'opci1' " +
    " where RPFREUNUSRID=? ";
/*
module.exports.consultarAreas =  "SELECT  reun.RPFREUNUSRID usuario ,RPFREUNARESID area, RPFLINEA linea,btversion.BTVERSIONDSCC areaTitulo ,BTVERSIONDSCL nombreVersion , BTVERSIONID version, "+
    "opproc.valor generico, opproc.valor2 idcliente,btversioncanal FROM bstntrn.btversion "+
    "inner JOIN bstntrn.btsnareversion as areaVersion ON btversion.BTVERSIONID = areaVersion.btsnareversionidversion "+
    "inner JOIN siogen01.rpfreun as reun ON reun.RPFREUNARESID = areaVersion.btsnareversionaresid and reun.RPFLINEA=areaVersion.btsnareversionlineaid "+
    "INNER JOIN bstntrn.bstopcionesproceso opproc on btversion.BTVERSIONID = opproc.version and opproc.opcionProc = 'opci1' "+
    "where RPFREUNUSRID= ? ";
*/



module.exports.updateSesiones = `UPDATE  bstntrn.btmpersonal 
SET BTMPERSONALDURS = TIME_TO_SEC(TIMEDIFF(now(), str_to_date( CONCAT(BTMPERSONALFINI,' ', BTMPERSONALHINI), '%Y-%m-%d %H:%i:%s') )) , 
BTMPERSONALDUR  = TIMEDIFF(now(), str_to_date( CONCAT(BTMPERSONALFINI,' ', BTMPERSONALHINI), '%Y-%m-%d %H:%i:%s') ),
BTMPERSONALFFIN = ?, BTMPERSONALHFIN= ?
WHERE SIOUSUARIOID = ?  and BTMPERSONALRECID = ? AND  btmpersonalFFIN IS NULL  AND btmpersonalHFIN IS NULL ;
`;



module.exports.updateRecesos_ = `UPDATE  bstntrn.btmpersonal 
SET BTMPERSONALDURS = TIME_TO_SEC(TIMEDIFF(now(), str_to_date( CONCAT(BTMPERSONALFINI,' ', BTMPERSONALHINI), '%Y-%m-%d %H:%i:%s') )) , 
BTMPERSONALDUR  = TIMEDIFF(now(), str_to_date( CONCAT(BTMPERSONALFINI,' ', BTMPERSONALHINI), '%Y-%m-%d %H:%i:%s') ), 
BTMPERSONALFFIN = ? , BTMPERSONALHFIN= ? 
WHERE SIOUSUARIOID = ?  and BTMPERSONALRECID <> "SBSC" AND  btmpersonalFFIN IS NULL  AND btmpersonalHFIN IS NULL `;


module.exports.updateRecesos = `UPDATE bstntrn.btestagnt SET BTESTAGNTT = ? WHERE BTESTAGNTUSR = ? `;