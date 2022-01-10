ipcRenderer.on('getUsuarioModulosResult', (event, datos) => {
    $("#comboPerfil").html("");

    usuarioOk = datos;
    $("#usuario").html(datos.CNUSERID +" - " +datos.CNUSERDSC);
    datos.AREAS.forEach(area => {
        $("#comboPerfil").append("<option value='"+area.RPFARESID+"-"+area.RPFLINEA+"'>"+area.RPFARESIDC+"</option>")
    });

    var area = {}
    area.RPFARESID = datos.AREAS[0].RPFARESID;
    area.RPFLINEA = datos.AREAS[0].RPFLINEA;
    ipcRenderer.send('getModulosArea', area)
})

ipcRenderer.on('getModulosAreaResult', (event, datos) => {
    $("#comboModulos").html("");
    datos.forEach(modulo => {
        $("#comboModulos").append("<option value='"+modulo.CNESMNID+"-"+modulo.RPFLINEA+"'>"+modulo.CNESMNDSC+"</option>")
    });
    var objModulo = {CNESMNID: datos[0].CNESMNID, RPFLINEA: datos[0].RPFLINEA};
    ipcRenderer.send('getArbol', objModulo)
})


function cambioModulo(){

    var modulo = $("#comboModulos").val().split("-");
    var objModulo = {CNESMNID: modulo[0], RPFLINEA: modulo[1]};
    ipcRenderer.send('getArbol', objModulo)
}

ipcRenderer.on('getArbolResult', async(event, datos) => {
    nodos = datos;
    await normalizaNodos(datos);
    await generanodosRaiz();
    await dibujarBtnsCont()

    
})

function cambioPerfil(){

    var perfil = $("#comboPerfil").val().split("-");
    var objPerfil = {RPFARESID: perfil[0], RPFLINEA: perfil[1]};
    ipcRenderer.send('getModulosArea', objPerfil)
}



function normalizaNodos(nodos) {
    nodos.splice(0,1);
    for(var i = 0 ; i < nodos.length; i++){
        nodos[i].RPFLINEA=i;
        nodos[i].RPFARESID=0;
        nodos[i].RPFARES1ID=i;
        nodos[i].RPFTPES1PADREID = getPadreNormalizado(nodos[i], nodos).RPFARES1ID;
    }
}

function getPadreNormalizado(nodo) {
    if(nodo.CNESMN03 == "" ){
        var nodoTemp = new Object();
        nodoTemp.RPFLINEA=-1;
        nodoTemp.RPFARESID=0;
        nodoTemp.RPFARES1ID=-1;
        nodoTemp.RPFTPES1PADREID = -1;
        return nodoTemp;
    }
    var j=1;
    while(nodo["CNESMN" + rellenaCeros(j, 2)] != "" ){
        j++
    }
    for(var i = 0 ; i < nodos.length; i++){
        var es = true;
        for (var k = 1 ; k < j-1 ; k++){
            var cnesk = "CNESMN" + rellenaCeros(k, 2);
            if(nodos[i][cnesk] != nodo[cnesk]){
                es = false;
                break;
            }
        }
        var cnesk = "CNESMN" + rellenaCeros(j-1, 2);
        if(nodos[i][cnesk] != ""){
            es = false;
        }
        if(es == true){
            return nodos[i];
        }
    }
}


function generanodosRaiz() {
    nodosRaiz = [];
    for(var nodo in nodos){
        var esRaiz = true;
        for(var nodoPrueba in nodos){
            if(nodos[nodoPrueba].RPFARES1ID == nodos[nodo].RPFTPES1PADREID
            && nodos[nodoPrueba].RPFARESID == nodos[nodo].RPFARESID){
                esRaiz=false;
            }
        }
        if(esRaiz==true && tieneHijos(nodos[nodo])==true){
            nodosRaiz.push(nodos[nodo]);
        }
    }
}


function tieneHijos(nodoPadre){
    for(var nodo in nodos){
        if(nodoPadre.RPFARES1ID == nodos[nodo].RPFTPES1PADREID && nodoPadre.RPFARESID == nodos[nodo].RPFARESID){
           if(nodos[nodo].CNESMNRUDS != "" || nodos[nodo].CNESMNRUTA != "" ){
            return true;
            }
        }
    }
    return false;
}


function rellenaCeros(valor, noCeros) {
	var concat = valor;
	for(; concat.toString().length < noCeros;){
		concat="0"+concat.toString();
	}
	return concat;
}


function dibujarBtnsCont()
	{ 

        $("#accordionModulos").html("");
        var esPrimero = true;
        nodosRaiz.forEach(nodoRaiz => {

            var show = "show";
            if(!esPrimero){
                show= "";
            }
            $("#accordionModulos").append(


            '               <div class="card">  '  + 
            '               <div class="card-header px-0" id="heading-'+nodoRaiz.RPFLINEA+'">  '  + 
            '                 <h2 class="mb-0" style="text-align: left;">  '  + 
            '                   <button style="color: #495057;" class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapse-'+nodoRaiz.RPFLINEA+'" aria-expanded="true" aria-controls="collapse-'+nodoRaiz.RPFLINEA+'">  '  + 
                                nodoRaiz.CNESDSOP+
            '                   </button>  '  + 
            '                 </h2>  '  + 
            '               </div>  '  + 
            '             '  + 
            '               <div id="collapse-'+nodoRaiz.RPFLINEA+'" class="collapse '+show+'" aria-labelledby="heading-'+nodoRaiz.RPFLINEA+'" data-parent="#accordionModulos">  '  + 
            '                 <div class="card-body p-1">  '  + 
            '                 </div>  '  + 
            '               </div>  '  + 
            '            </div>  ' 

            );
            esPrimero = false;
            dibujarBtns(nodoRaiz)


        })
	}
	
	function dibujarBtns(nodoSeleccionada){
	
		var nodosPintar = []
		for(var nodo in nodos){			

				if(nodoSeleccionada.RPFARES1ID == nodos[nodo].RPFTPES1PADREID && nodoSeleccionada.RPFARESID == nodos[nodo].RPFARESID){
					nodosPintar.push(nodos[nodo]);
				}
         }
         
        $("#collapse-"+nodoSeleccionada.RPFLINEA).find(".card-body").html("");
        nodosPintar.forEach(nodoPintar => {

            if(nodoPintar.CNESMN1ICONO == ""){
                nodoPintar.CNESMN1ICONO = "file.svg";
            }
            if(nodoPintar.CNESMN1BGCOLO == ""){
                nodoPintar.CNESMN1BGCOLO = "#EEEEF7";
            }
            if(nodoPintar.CNESMN1TEXTCOLOR == ""){
                nodoPintar.CNESMN1TEXTCOLOR = "#000";
            }


            $("#collapse-"+nodoSeleccionada.RPFLINEA).find(".card-body").append(

                "   <button title='"+ nodoPintar.CNESDSOP + "' onClick='verAplicacion("+ JSON.stringify(nodoPintar) +")' " +
                " style='border:solid #DBDBDB 1px; background-color:"+ nodoPintar.CNESMN1BGCOLO + ";color: "+nodoPintar.CNESMN1TEXTCOLOR+";font-size: 13px;text-overflow: ellipsis; white-space: nowrap; " +
                " overflow: hidden; text-align: left; outline: none;' type='button' class='btn btn-dark  btn-lg py-1 mx-0 col-12'>  "  + 
                "   <img src='img/iconosMenu/"+ nodoPintar.CNESMN1ICONO + "' alt='Icon' class='mr-2' style='padding: 5px;height: 40px;width: 40px;'>" +
                nodoPintar.CNESDSOP + 
                "   </button>  "  
            )


        })
	
	}