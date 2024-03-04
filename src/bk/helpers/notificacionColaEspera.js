const querys = require('../querys/notificacionColaEspera');
const poolCRM = require('../cnn/database');

const util = require('util');

module.exports.consultQueue = async (agenteId) => {
    const QueueOut = await poolCRM.query(querys.consultQueueOut ,[agenteId]);
    
    if(QueueOut.length!=0)
    {
        
        return QueueOut;

    }
    else
    {
        QueueOut = '[{cuantos:0,numero:0}]';
    }   
    return QueueOut;

}