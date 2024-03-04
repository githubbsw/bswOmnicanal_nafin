const querys = require('../querys/notificacionColaEspera');
const poolCC = require('../cnn/databaseCC');
const poolCRM = require('../cnn/database');

const util = require('util');

module.exports.consultQueue = async (agenteId) => {
    const QueueOut = await poolCRM.query(querys.consultQueueOut ,[agenteId]);
    
    if(QueueOut.length!=0)
    {
        var cmp=QueueOut[0].cmp;
        var ResultQueue= await poolCC.query(querys.consultQueue ,[cmp]);
        if(ResultQueue.length != 0 )
        {
            return ResultQueue;
            
        }  
        else{
            ResultQueue = '[{cuantos:0,numero:0}]';
        }
    }
    else
    {
        ResultQueue = '[{cuantos:0,numero:0}]';
    }   
    return ResultQueue;

}