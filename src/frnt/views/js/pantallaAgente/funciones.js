function MaysPrimera(string){
    return string.charAt(0).toUpperCase() + string.slice(1);
}
function formatoFecha(fecha){
    var dd = "";
    var mm = "";
    if(fecha.getDate()<10){
        dd = '0'+fecha.getDate();
    }
    else{
        dd = fecha.getDate();
    }
    if((fecha.getMonth()+1)<10){
        mm = '0'+(fecha.getMonth()+1);
    }
    else{
        mm = (fecha.getMonth()+1);
    }
    return fecha.getFullYear() + "-" + mm +"-" + dd;
}

function formatoHora(fecha){
    var HH = "";
    var MM = "";
    var SS = "";
    
    if(fecha.getHours()<10){
        HH = '0'+fecha.getHours();
    }
    else{
        HH = fecha.getHours();
    }
    if(fecha.getMinutes()<10){
        MM = '0'+fecha.getMinutes();
    }
    else{
        MM = fecha.getMinutes();
    }
    if((fecha.getSeconds())<10){
        SS = '0'+(fecha.getSeconds());
    }
    else{
        SS = (fecha.getSeconds());
    }
    return HH + ":" + MM +":" + SS;
}

//FUNCION PARA VALIDAR SI HAY INTERNET
function isOnline() {
    const isOnline = require('is-online');

    // navigator.onLine
    isOnline().then(online => 
    {
        if(online)
        {
            alertaConexionIncio(true,"inicio")
        }
        else
        {
            alertaConexionIncio(false,"inicio")
        }
    });        
}

/* Funcion que pone un 0 delante de un valor si es necesario */
function LeadingZero(Time) {
    return (Time < 10) ? "0" + Time : +Time;
}