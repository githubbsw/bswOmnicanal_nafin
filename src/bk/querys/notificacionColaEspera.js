
module.exports.consultQueueOut =  'SELECT btAgenteCmpId cmp FROM bstntrn.btagenteinbound where btAgenteInbId = ?;';
module.exports.consultQueue =  'SELECT cuantos, numero FROM bstntrn.llamadaenespera where id = 999 and campania = ? ;';