
module.exports.consultQueueOut =  'SELECT btAgenteCmpId cmp FROM bstntrn.btagenteoutbound where btAgenteOutId = ?;';
module.exports.consultQueue =  'SELECT cuantos, numero FROM bstntrn.llamadaenespera where id = 999 and campania = ? ;';