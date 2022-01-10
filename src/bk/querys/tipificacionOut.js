module.exports.consultarScript =  " SELECT btAgenteCmpId id, btcampanadescripcion dsc, "
+ " btnombrepestana1 tab1, btnombrepestana2 tab2, btnombrepestana3 tab3, btnombrepestana4 tab4, btnombrepestana5 tab5, "
+ " btscriptinicial script1, btscript2 script2, btscript3 script3, btscript4 script4, btscript5 script5 "
+ " FROM bstntrn.btagenteoutbound A "
+ " inner join bstntrn.btcampanas B on A.btAgenteCmpId = B.btcampanaid WHERE btAgenteOutId = ? limit 1 ";

module.exports.ConsultaClienteSalida =  " select c.btContactoConsecutivo id,c.btContactoNombreCliente NombreCompleto,btagenteOutTelefonoCliente TelefonoCliente,b.btcampanadescripcion MotivoLlamada, "+
" edo.BTEDOSDSC estado,btcontactoMunicipio municipio,btcontactoNoCliente NoCliente,btAgenteOutNombre NombreAgente,a.btAgenteOutExt,a.btAgenteCmpId, btcontactomotivo obs, e.bstncanalidn canalid" +
" FROM bstntrn.btagenteoutbound a inner join bstntrn.btcampanas b on a.btAgenteCmpId = b.btcampanaid "+
" inner join bstntrn.btcontacto c on a.btAgenteCmpId = c.btContactoCmpId and a.btAgenteOutClienteId = c.btContactoConsecutivo  " +
" left join bstntrn.btedos edo on c.btcontactoEstadoid = edo.BTEDOSID " +
" inner join bstntrn.bstncanal e on e.bstncanalid = b.bstncanalid " +
" WHERE btAgenteOutId = ? and btagenteOutTelefonoCliente = ? and b.bstncanalid in ('OBD','WCAL','CALL'); ";

module.exports.ConsultarCamposReservados = "SELECT sptcamposcriptpr,sptcamposcriptvalor,sptcamposcripttipo FROM bstntrn.sptcamposcript "+
" where sptcamposcriptnocli = ? and sptcamposcriptcmpid = ? and sptcamposcriptconsc = ? ; ";


module.exports.consultarEstatus = " SELECT sptestatusllam, sptestatusllamnoml FROM bstntrn.sptestatusllam; ";

module.exports.consultarTipificacion =  `SELECT sptllamtipid id, sptllamtipdsc dsc, sptremarcar remarcar FROM bstntrn.sptllamtip where sptestatusllam = ? and sptllamcampanaid is null
                                        union  
                                        SELECT sptllamtipid id, sptllamtipdsc dsc, sptremarcar remarcar FROM bstntrn.sptllamtip where sptestatusllam = ? and sptllamcampanaid = ? `;

module.exports.GuardarTipificacionContacto = " UPDATE bstntrn.btcontacto SET btcontactotip1 = ?  WHERE btContactoConsecutivo = ? and btContactoCmpId = ? ";

module.exports.GuardarTipificacion = " UPDATE bstntrn.btcontactotip SET btcontactotip1 = ?, btcontactotip1dsc = ?, btcontactotip2 = ?, btcontactotip2dsc = ?, btcontactotipobs = ?, btcontactotipremarcar = ? WHERE btcontactotipidllam = ? ";

module.exports.consultarActCRM = `SELECT a.BTCRM1FOLIO folio, a.BTCRM1FOLIOORIG folioOrigen, a.BTCRM1IDLLAMADAORIG llamadaOrigen, a.BTCRM1CLIENTENUMERO numeroCliente, 
cte.BTCLIENTEPNOMBRE nombreCliente, a.BTCRMTIPIFCAD actividad, a.BTCRMOTROS otros, a.BTCRM1ATENDIONOMBRE agenteNombre, 
a.BTCRM1ATENDIO idAgente, BTCRM1CANAL canal,
date_format(a.BTCRM1FECINI, "%d-%m-%Y") fecha, a.BTCRM1HORINI hora, 
sem.crmsemaforizacionestatusdsc estatus, a.crmsemaforizacionestatusid estatusId
FROM bstntrn.btcrm1 a
inner join crmbd.crmsemaforizacionestatus sem on a.crmsemaforizacionestatusid = sem.crmsemaforizacionestatusid
inner join bstntrn.btcliente cte on a.BTCRM1CLIENTENUMERO = cte.BTCLIENTENUMERO
where BTCRM1ACTSIG = "SI" and BTCRM1ATENDIO = ? order by a.BTCRM1FOLIO desc `;

module.exports.completarActividad = `UPDATE bstntrn.btcrm1 SET crmsemaforizacionestatusid = '3' WHERE BTCRM1CLIENTENUMERO = ? AND BTCRM1FOLIO = ? ;
`