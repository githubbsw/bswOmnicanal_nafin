const querys = require('../querys/notificacionColaEspera');
const poolCC = require('../cnn/databaseCC');
const util = require('util');

module.exports.consultQueue = async () => {

    const ResultQueue = await poolCC.query(querys.consultQueue ,[]);
    return ResultQueue;

}