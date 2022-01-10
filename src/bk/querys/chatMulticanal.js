module.exports.consultarInteracciones = " SELECT imcidn, inmccanalid, inmcestid, imcfecha, imchora, imcagente, imccliente, imctelefono, imccorreo, imcduracion, imcfechainiatn, imchorainiatn, imcclienteid, imcesnuevo,imcsesionid " + 
" FROM inmc.imc WHERE imcagente = ? and inmcestid = 1 ";



module.exports.consultarNoVistosChatFB = " SELECT count(spcfbid) total, spcfbidn id  " + 
"FROM spcfacebook.spcfbmensaje msj  " + 
"inner join spcfacebook.spcfbcontactos cte on msj.spcfbidn = cte.spcfbtcontactosnumero  " + 
"where spcfbfromMe = false and spcfbestatus = 1 and cte.spcfbcontactosagenteasignado = ? group by spcfbidn ";

module.exports.consultarUltimoMensajeChatFB = "SELECT a.spcfbtcontactosnumero id, " + 
"(SELECT spcfbbody FROM spcfacebook.spcfbmensaje where spcfbidn = a.spcfbtcontactosnumero order by spcfbfecha desc limit 1) cuerpo, " + 
"(SELECT spcfbtype FROM spcfacebook.spcfbmensaje where spcfbidn = a.spcfbtcontactosnumero order by spcfbfecha desc limit 1) tipo , " + 
"(SELECT spcfbfecha FROM spcfacebook.spcfbmensaje where spcfbidn = a.spcfbtcontactosnumero order by spcfbfecha desc limit 1) fecha, " + 
"a.spcfbcontactosagenteasignado " + 
"FROM spcfacebook.spcfbcontactos a where a.spcfbcontactosagenteasignado = ?; " + 
"";

module.exports.consultarNoVistosChatWTS = " SELECT count(msj.spcwtid) total, spcwtnumeroCliente id  " + 
"FROM spcwtsapp.spcwtmensaje msj  " + 
"inner join spcwtsapp.spcwtnumeros cte on msj.spcwtnumeroCliente = cte.spcwtnumero  " + 
"where spcwtfromMe = false and msj.spcwestatus = 1 and cte.spcwagenteasignado = ? group by spcwtnumeroCliente ";

module.exports.consultarUltimoMensajeChatWTS = "SELECT spcwtnumero id ,  " + 
"(SELECT spcwtbody FROM spcwtsapp.spcwtmensaje where spcwtnumeroCliente = spcwtnumero order by spcwtfecha desc limit 1) cuerpo,  " + 
"(SELECT spcwttype FROM spcwtsapp.spcwtmensaje where spcwtnumeroCliente = spcwtnumero order by spcwtfecha desc limit 1) tipo , " + 
"(SELECT spcwtfecha FROM spcwtsapp.spcwtmensaje where spcwtnumeroCliente = spcwtnumero order by spcwtfecha desc limit 1) fecha, " + 
"spcwagenteasignado " + 
"FROM spcwtsapp.spcwtnumeros where spcwagenteasignado = ? ; " + 
"";

module.exports.consultarNoVistosChatTW = " SELECT count(spctwid) total, spctwidn id  " + 
"FROM spctwitter.spctwmensaje msj  " + 
"inner join spctwitter.spctwcontactos cte on msj.spctwidn = cte.spctwtcontactosnumero  " + 
"where spctwfromMe = false and spctwestatus = 1 and cte.spctwcontactosagenteasignado = ? group by spctwidn ";

module.exports.consultarUltimoMensajeChatTW = "SELECT a.spctwtcontactosnumero id, " + 
"(SELECT spctwbody FROM spctwitter.spctwmensaje where spctwidn = a.spctwtcontactosnumero order by spctwfecha desc limit 1) cuerpo, " + 
"(SELECT spctwtype FROM spctwitter.spctwmensaje where spctwidn = a.spctwtcontactosnumero order by spctwfecha desc limit 1) tipo , " + 
"(SELECT spctwfecha FROM spctwitter.spctwmensaje where spctwidn = a.spctwtcontactosnumero order by spctwfecha desc limit 1) fecha, " + 
"a.spctwcontactosagenteasignado " + 
"FROM spctwitter.spctwcontactos a where a.spctwcontactosagenteasignado = ?; " + 
"";

module.exports.cambiarEstatusNuevo="UPDATE inmc.imc " + 
"SET imcesnuevo = 1 " + 
"WHERE imcidn = ? ";

module.exports.consultarNoVistosChat="SELECT count(msj.PRTCHMSJID) total, concat(msj.PRTID, '.', msj.PRTCHCLID)  id   " + 
"FROM siogen01.prtchmsj msj   " + 
"inner join siogen01.prtchcl cte on msj.PRTCHCLID = cte.PRTCHCLID     " + 
"where PRTCHMSJQA = '1' and msj.PRTCHMSJVISTO = 0 and cte.CNUSERID = ? and cte.PRTCHCLEST = '2' group by id  ";

module.exports.consultarUltimoMensajeChat=" SELECT concat(a.PRTID, '.', a.PRTCHCLID) id, " + 
"(SELECT PRTCHMSJTXT FROM siogen01.prtchmsj where PRTCHCLID = a.PRTCHCLID and PRTID = a.PRTID order by PRTCHMSJFH desc limit 1 ) cuerpo, " + 
"'chat' tipo, " + 
"(SELECT PRTCHMSJFH FROM siogen01.prtchmsj where PRTCHCLID = a.PRTCHCLID and PRTID = a.PRTID order by PRTCHMSJFH desc limit 1 ) fecha " + 
"FROM siogen01.prtchcl a where a.CNUSERID = ? and a.PRTCHCLEST = 2; ";



module.exports.opcPrcSMS = "SELECT bdsmsopcprocid, bdsmsopcprocdsc, bdsmsopcprocvalor valor FROM bdsms.bdsmsopcproc; ";

module.exports.ACTCRMSMS = `UPDATE bstntrn.btcrm1 SET btcrm1smscode = ? , btcrm1smsfecha = now(), btcrm1smsnumero = ? WHERE BTCRM1IDLLAMADA= ? AND BTCRM1ATENDIO = ?;`

module.exports.consultarPrioridades = `SELECT * FROM bdnrh.nrhemdbmc where NRHEMUSERID  = ? order by nrhemdbmcprioridad asc;`;
