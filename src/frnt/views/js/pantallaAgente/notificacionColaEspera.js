const { ipcRenderer } = require('electron');

var numeroEntrante;

function NotificationQueueStart(agenteId) 
 {
    setInterval(() => {
        ipcRenderer.send('consultQueue', agenteId);
    }, 5000);
    
    
      
}

function showNotificationQueue (mensaje) 
 { 
    const notification = new window.Notification(
        'Llamada en espera',
        {
          body: mensaje,
          icon: '../../../../img/agente.png',
        }
      );    
}

ipcRenderer.on('consultQueueResult', async (event, numero) => {
    if(numero[0].cuantos!=0)
        if(numeroEntrante!=numero[0].numero)
        {
            numeroEntrante=numero[0].numero;
            showNotificationQueue(numero[0].mensaje);
        }
});

