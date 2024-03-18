
module.exports.consultQueueOut =  `SELECT usr.NRHEMUSERID agente,msj.NRHEM06IDmsj cola, msj.NRHEM06MSJ mensaje, cuantos, numero  FROM bdnrh.nrhemdb usr 
inner join bdnrh.nrhem06mnsj msj on usr.NRHEM06ID = msj.NRHEM06IDmsj 
inner join bstntrn.llamadaenespera le on msj.NRHEM06IDmsj = le.cola
where NRHEMUSERID = ? `;
