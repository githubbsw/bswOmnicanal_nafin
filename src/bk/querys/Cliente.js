module.exports.consultar =   " 	SELECT  "+
                            " cliente.btclienteNUMERO id,  "+
                            " cliente.btclientePNOMBRE primerNombre,  "+
                           // " cliente.btclienteSNOMBRE segundoNombre,  "+
                            " cliente.btclienteAPATERNO apellidoPaterno,  "+
                            " cliente.btclienteAMATERNO apellidoMaterno, btclienteestadoid estado, btclienteciudadid municipio , btclientesuc sucursal, "+
                          /*  " cliente.btclienteRFC rfc,  "+
                            " cliente.btclienteNSS nss,  "+
                            " cliente.btclienteCURP curp,  "+
                            " cliente.btclienteCPID codigoPostal,  "+
                            " cliente.btclienteNEXTERIOR numeroExterior,  "+
                            " cliente.btclienteNINTERIOR numeroInterior,  "+
                            " cliente.btclienteCALLE calle,  "+
                            " cliente.btclienteCOLONIA colonia,  "+
                            " BTCLIENTECIUDADID ciudad,  "+
                            " BTCLIENTEESTADOID estado,  "+
                            " btclienteciudnoml ciudadDSC,  "+ 
                            " btclienteedonoml estadoDSC,  "+
                            " cliente.btclientePAIS pais,  "+
                            " btclientegenero genero, "+
                            "  cast(cast(btclientefnac as date) as char(10)) fechaNacimiento, "+ */
                            " ifnull(( select BTCLIENTECORREO from bstntrn.btclientecorreo where BTCLIENTECORREONOCTEID = cliente.btclienteNUMERO order by BTCLIENTECORREOID desc limit 1),'')  correoElectronico,  "+
                           // " cliente.btclienteREGIMEN regimen,  "+
                            " cliente.BTCLIENTENCOMPLETO nombrecompleto,  "+                    
                            " CONCAT(ifnull(( select BTCLIENTETELNO from bstntrn.btclientetel where BTCLIENTETELNOCTEID = cliente.btclienteNUMERO and BTCLIENTETELTIPO='PERSONAL'order by BTCLIENTETELCONSID desc limit 1),''), ' (PERSONAL)',"  + 
                            " ifnull(( select BTCLIENTETELNO from bstntrn.btclientetel where BTCLIENTETELNOCTEID = cliente.btclienteNUMERO and BTCLIENTETELTIPO='ALTERNATIVO'order by BTCLIENTETELCONSID desc limit 1) ,'') , ' (ALTERNATIVO)' , "  + 
                            " ifnull(( select BTCLIENTETELNO from bstntrn.btclientetel where BTCLIENTETELNOCTEID = cliente.btclienteNUMERO and BTCLIENTETELTIPO='MOVIL'order by BTCLIENTETELCONSID desc limit 1),'') , ' (MOVIL)' ) telefonos   ,"  +

                            " cliente.btclientegenid generoCtoIput,  "+
                            " cast(cast(cliente.btclientefnac  as date) as char(10)) fechaNacimientoCtoInput,  "+
                            " cliente.btclientecurp curpCtoInput,  "+
                            " cliente.btclientectoafiliado afiliadoCtoInput, "+          
                             " ifnull(( select BTCLIENTETELNO from bstntrn.btclientetel where BTCLIENTETELNOCTEID = cliente.btclienteNUMERO and BTCLIENTETELTIPO='PERSONAL'order by BTCLIENTETELCONSID desc limit 1),'') telefonoFijoInput , "  +
                             " ifnull(( select BTCLIENTETELNO from bstntrn.btclientetel where BTCLIENTETELNOCTEID = cliente.btclienteNUMERO and BTCLIENTETELTIPO='ALTERNATIVO'order by BTCLIENTETELCONSID desc limit 1),'') telefonoAlternativoInput , "  +
                             " ifnull(( select BTCLIENTETELNO from bstntrn.btclientetel where BTCLIENTETELNOCTEID = cliente.btclienteNUMERO and BTCLIENTETELTIPO='MOVIL'order by BTCLIENTETELCONSID desc limit 1),'') telefonoMovilInput, "  +
                             " ifnull(cliente.btclientecmp,'') campana "  +
                           " FROM bstntrn.btcliente  as cliente  "+
                            " left JOIN bstntrn.btclientetel as tel ON tel.BTCLIENTETELNOCTEID = cliente.BTCLIENTENUMERO  "+
                            " left JOIN bstntrn.btclientecorreo as correos ON correos.BTCLIENTECORREONOCTEID = cliente.BTCLIENTENUMERO "+
                         /*  " left join bstntrn.btclienteedo as edo on edo.btclienteedoid=BTCLIENTEESTADOID "+
                            " left join bstntrn.btclienteciud as ciud on edo.btclienteedoid=ciud.bnstredoid and btclienteciudid=BTCLIENTECIUDADID "+ */
                            " where 1 = 1 and cliente.btclienteNUMERO!=0 ";


module.exports.consultarTotal = "SELECT count(*) total "+
                    "FROM bstntrn.btcliente  as cliente  "+
                    "left JOIN bstntrn.btclientetel as tel ON tel.BTCLIENTETELNOCTEID = cliente.BTCLIENTENUMERO  "+
                    "left JOIN bstntrn.btclientecorreo as correos ON correos.BTCLIENTECORREONOCTEID = cliente.BTCLIENTENUMERO where 1 = 1 and cliente.btclienteNUMERO!=0 ";

module.exports.insertar =  " INSERT INTO bstntrn.btcliente "
                    + " (btclienteNUMERO, "
                    + " btclientePNOMBRE, "
                    + " btclienteAPATERNO, "
                    + " btclienteAMATERNO, "
                    + " btclienteNCOMPLETO, "                
                    + " btclienteCORRELEC, BTCLIENTENCOMPLETO2, "                
                    + " btclientegenid ,  "
                    + " btclientefnac ,  "
                    + " btclientecurp ,  "
                    + " btclientectoafiliado, btclienteestadoid, btclienteciudadid, btclientesuc "
                    + " )" 
                    + " VALUE(?,UPPER(?),UPPER(?),UPPER(?),UPPER(?),?,?,?,?,UPPER(?),?, ?, ?, ? ) "; 

module.exports.calcularId =  "SELECT IFNULL(MAX(btclienteNUMERO),0)+1 AS id FROM bstntrn.btcliente";

module.exports.actualizar =" UPDATE bstntrn.btcliente SET"
                    + " btclientePNOMBRE = UPPER(?), "
                 //   + " btclienteSNOMBRE = ?, "
                    + " btclienteAPATERNO = UPPER(?), "
                    + " btclienteAMATERNO = UPPER(?), "
                    + " btclienteNCOMPLETO = UPPER(?), "
                 /*   + " btclienteRFC = ?, "
                    + " btclienteNSS = ? ,"
                    + " btclienteCURP = ?, "
                    + " btclienteCPID = ?, "
                    + " btclienteNEXTERIOR = ?, "
                    + " btclienteNINTERIOR = ?, "
                    + " btclienteCALLE = ?, "
                    + " btclienteCOLONIA = ?, "
                    + " BTCLIENTECIUDADID = ?, "
                    + " BTCLIENTEESTADOID = ?, "
                    + " btclientePAIS = ?, "
                    + " btclienteDCOMPLETA = ?, " */
                    + " btclienteCORRELEC = ? ,BTCLIENTENCOMPLETO2=? , "
                  /*  +" btclientegenero= ? , btclientefnac= ?  "*/             
                    + " btclientegenid = ? ,  "
                    + " btclientefnac= ? ,  "
                    + " btclientecurp= ? ,  "
                    +  " btclientectoafiliado= ? , btclienteestadoid = ?, btclienteciudadid = ?, btclientesuc = ? "
                    + " WHERE btclienteNUMERO = ? ";


module.exports.consultarPorLlaves =  " SELECT "
                    + " btclienteNUMERO id, "
                    + " btclientePNOMBRE primerNombre, "
                    + " btclienteAPATERNO apellidoPaterno, "
                    + " btclienteAMATERNO apellidoMaterno, "
                    + " btclienteNCOMPLETO nombreCompleto, "
                    + " ( select BTCLIENTECORREO from bstntrn.btclientecorreo where BTCLIENTECORREONOCTEID = A.btclienteNUMERO order by BTCLIENTECORREOID desc limit 1)   correoElectronico , "
                 
                    + " btclientegenid generoCtoIput,  "
                    + "  cast(cast(btclientefnac as date) as char(10)) fechaNacimientoCtoInput,  "
                    + " btclientecurp curpCtoInput,  "
                    + " btclientectoafiliado afiliadoCtoInput,  "  
                    + " ( select BTCLIENTETELNO from bstntrn.btclientetel where BTCLIENTETELNOCTEID = A.btclienteNUMERO and BTCLIENTETELTIPO='PERSONAL'order by BTCLIENTETELCONSID desc limit 1) telefonoFijoInput , "  
                    + " ( select BTCLIENTETELNO from bstntrn.btclientetel where BTCLIENTETELNOCTEID = A.btclienteNUMERO and BTCLIENTETELTIPO='ALTERNATIVO'order by BTCLIENTETELCONSID desc limit 1) telefonoAlternativoInput , "  
                    + " ( select BTCLIENTETELNO from bstntrn.btclientetel where BTCLIENTETELNOCTEID = A.btclienteNUMERO and BTCLIENTETELTIPO='MOVIL'order by BTCLIENTETELCONSID desc limit 1) telefonoMovilInput "  
                    
                    + " FROM bstntrn.btcliente A "
                 + " WHERE btclienteNUMERO  = ? and btclienteNUMERO!=0 ";                 

 module.exports.consultarInsertTel =  "SELECT count(*)total FROM bstntrn.btclientetel where BTCLIENTETELNOCTEID = ?  and BTCLIENTETELNO = UPPER(?) and BTCLIENTETELTIPO= ?;";



 module.exports.insertarTelefono =  " INSERT INTO bstntrn.btclientetel "
                    + " (BTCLIENTETELNOCTEID, BTCLIENTETELCONSID, BTCLIENTETELNIR, BTCLIENTETELSERIE, BTCLIENTETELNUM, BTCLIENTETELCIA, BTCLIENTETELTTELEFONOID, BTCLIENTETELNO, BTCLIENTETELTIPO) "
                    + " VALUE(?, (SELECT IFNULL(MAX(a.BTCLIENTETELCONSID),0) +1 AS id FROM bstntrn.btclientetel as a) , ?, ?, 0 , ?, 1 , UPPER(?), ?) ";

module.exports.actualizarTelefono =  " update bstntrn.btclientetel  cross join (SELECT IFNULL(MAX(BTCLIENTETELCONSID),0) +1 AS id FROM bstntrn.btclientetel  as t)  t "
+ " set   BTCLIENTETELCONSID = id   where   BTCLIENTETELNOCTEID = ?  and BTCLIENTETELNO = UPPER(?) and BTCLIENTETELTIPO= ?; ";

module.exports.actualizarCorreo =  " update bstntrn.btclientecorreo  cross join (SELECT IFNULL(MAX(BTCLIENTECORREOID),0) +1 AS id FROM bstntrn.btclientecorreo  as t)  t "
+ " set   BTCLIENTECORREOID = id   where   BTCLIENTECORREONOCTEID = ?  and BTCLIENTECORREO = ?; ";


 module.exports.consultarInsertCorreo = "SELECT count(*)total FROM bstntrn.btclientecorreo where BTCLIENTECORREONOCTEID = ?  and BTCLIENTECORREO = ? ;"; 

 module.exports.insertarCorreo = " INSERT INTO bstntrn.btclientecorreo "
                    + " (BTCLIENTECORREONOCTEID, BTCLIENTECORREOID, BTCLIENTECORREO) "
                    + " VALUE(?, (SELECT IFNULL(MAX(a.BTCLIENTECORREOID),0) +1  AS id FROM bstntrn.btclientecorreo as a) , ?) ";


 module.exports.consultarPortabilidad ="SELECT NIR, SERIE, RAZON_SOCIAL, TIPO_DE_RED FROM  BSTNTRN.BTPORTABILIDAD WHERE NIR_Y_SERIE =  SUBSTRING(?, 1, 6) AND (SUBSTRING(?, 7, 10) between NUMERACION_INICIAL  and NUMERACION_FINAL )";

 module.exports.consultarTelefonos = "SELECT BTCLIENTETELNO, BTCLIENTETELTIPO FROM bstntrn.btclientetel where BTCLIENTETELNOCTEID = ? ";

 module.exports.consultarCorreos = "SELECT  BTCLIENTECORREO FROM bstntrn.btclientecorreo where BTCLIENTECORREONOCTEID = ?";


 module.exports.consultarContactos = `SELECT A.btContactoConsecutivo id,  A.btContactoCmpId idCampana, A.btContactoSts contactoStatus, A.btContactoTel01 contactoTele,  
 ifnull(A.btContactoTipoTel01,'') tipoTele,ifnull(A.btContactoTel02,'') contactoTele2 ,  ifnull(A.btContactoTipoTel02,'') tipoTele2 ,  
 ifnull(A.btContactoTel03,'') contactoTele3,  ifnull(A.btContactoTipoTel03,'') tipoTele3 , A.btContactoNombreCliente nombreCliente, 
 ifnull(A.btcontactoMotivo,'') motivo, A.btContactoConsecutivo consecutivo, A.btcontactoNoCliente idCliente, A.btContactoCountTel01 intentos,  
 btcontactoNoCliente Nocliente, btcontactoRFC RFC, btcontactoCURP CURP, btcontactoNSS NSS 
 FROM bstntrn.btcontacto AS A  
 WHERE btcontactoagenteid = ?`;



 module.exports.consultarEstados ="SELECT bnstredoid ID , bnstredonoml DSC FROM crmfub.bnstredo; ";

 module.exports.consultarMunicipio ="SELECT bnstrmunid ID , bnstrmunnoml DSC , bnstredoid IDEDO FROM crmfub.bnstrmun  where bnstredoid = ? ; ";

 module.exports.consultarCiudad ="SELECT btclienteciudid ID, btclienteciudnoml DSC , bnstredoid EDO  FROM bstntrn.btclienteciud ";

 module.exports.consultarClienteCRM12 = " SELECT count(*) total ,  BTCRM1CLIENTENUMERO cliente FROM  bstntrn.btcrm12 WHERE BTCRM1FOLIO= ? limit 1 ; ";
 
 module.exports.actualizarCrm = "update bstntrn.btcrm1 set BTCRM1CLIENTENUMERO=? where BTCRM1FOLIO= ? and BTCRM1FECHA=cast(now() as date) ";
 module.exports.guardarNombre = " UPDATE bstntrn.btagenteinbound SET btagenteNombreCli = ? WHERE btAgenteInbId = ? ; ";

 module.exports.insertarCrm = "INSERT INTO bstntrn.btcrm1 "
 + "(BTCRM1FOLIO,BTCRM1FECHA,BTCRM1HORA,BTCRM1CLIENTENUMERO,BTCRM1IDLLAMADA,BTCRM1ATENDIO,BTCRM1ATENDIONOMBRE,BTCRM1EXTENSION,BTCRMTELEFONO, "
 + " BTCRM1CANAL,BTCRMSUPERVISOR,BTCRMIVRRUTA,crmsemaforizacionestatusid, BTCRM1IPSERVIDOR, btcrm1colgo) "
 + " VALUES ((SELECT IFNULL(MAX(BTCRM1FOLIO),0)+1 FROM bstntrn.btcrm1 as BTCRM1FOLIO),"
 + " cast(now() as date) , cast(cast(now() as time) as char(8)) ,?,?,?,?,?,?,?,32,?,2, ?, 'Desconexion')";

module.exports.consultarClientes =   " 	SELECT  "+
                            " cliente.btclienteNUMERO id,  "+
                            " cliente.btclientePNOMBRE primerNombre,  "+
                           // " cliente.btclienteSNOMBRE segundoNombre,  "+
                            " cliente.btclienteAPATERNO apellidoPaterno,  "+
                            " cliente.btclienteAMATERNO apellidoMaterno, btclienteestadoid estado, btclienteciudadid municipio , btclientesuc sucursal, "+
                          /*  " cliente.btclienteRFC rfc,  "+
                            " cliente.btclienteNSS nss,  "+
                            " cliente.btclienteCURP curp,  "+
                            " cliente.btclienteCPID codigoPostal,  "+
                            " cliente.btclienteNEXTERIOR numeroExterior,  "+
                            " cliente.btclienteNINTERIOR numeroInterior,  "+
                            " cliente.btclienteCALLE calle,  "+
                            " cliente.btclienteCOLONIA colonia,  "+
                            " BTCLIENTECIUDADID ciudad,  "+
                            " BTCLIENTEESTADOID estado,  "+
                            " btclienteciudnoml ciudadDSC,  "+ 
                            " btclienteedonoml estadoDSC,  "+
                            " cliente.btclientePAIS pais,  "+
                            " btclientegenero genero, "+
                            "  cast(cast(btclientefnac as date) as char(10)) fechaNacimiento, "+ */
                            " ( select BTCLIENTECORREO from bstntrn.btclientecorreo where BTCLIENTECORREONOCTEID = cliente.btclienteNUMERO order by BTCLIENTECORREOID desc limit 1)  correoElectronico,  "+
                           // " cliente.btclienteREGIMEN regimen,  "+
                            " cliente.BTCLIENTENCOMPLETO nombrecompleto,  "+
                            " CONCAT(( select BTCLIENTETELNO from bstntrn.btclientetel where BTCLIENTETELNOCTEID = cliente.btclienteNUMERO and BTCLIENTETELTIPO='PERSONAL'order by BTCLIENTETELCONSID desc limit 1), ' (PERSONAL)', "  +
                            " ( select BTCLIENTETELNO from bstntrn.btclientetel where BTCLIENTETELNOCTEID = cliente.btclienteNUMERO and BTCLIENTETELTIPO='ALTERNATIVO'order by BTCLIENTETELCONSID desc limit 1)  , ' (ALTERNATIVO)' , "  +
                            " ( select BTCLIENTETELNO from bstntrn.btclientetel where BTCLIENTETELNOCTEID = cliente.btclienteNUMERO and BTCLIENTETELTIPO='MOVIL'order by BTCLIENTETELCONSID desc limit 1) , ' (MOVIL)' ) telefonos ,"  +

                          
                            " cliente.btclientegenid generoCtoIput,  "+
                            " cast(cast(cliente.btclientefnac  as date) as char(10)) fechaNacimientoCtoInput,  "+
                            " cliente.btclientecurp curpCtoInput,  "+
                            " cliente.btclientectoafiliado afiliadoCtoInput, "+          
                             " ( select BTCLIENTETELNO from bstntrn.btclientetel where BTCLIENTETELNOCTEID = cliente.btclienteNUMERO and BTCLIENTETELTIPO='PERSONAL'order by BTCLIENTETELCONSID desc limit 1) telefonoFijoInput , "  +
                             " ( select BTCLIENTETELNO from bstntrn.btclientetel where BTCLIENTETELNOCTEID = cliente.btclienteNUMERO and BTCLIENTETELTIPO='ALTERNATIVO'order by BTCLIENTETELCONSID desc limit 1) telefonoAlternativoInput , "  +
                             " ( select BTCLIENTETELNO from bstntrn.btclientetel where BTCLIENTETELNOCTEID = cliente.btclienteNUMERO and BTCLIENTETELTIPO='MOVIL'order by BTCLIENTETELCONSID desc limit 1) telefonoMovilInput "  +
                           " FROM bstntrn.btcliente  as cliente  "+
                            " left JOIN bstntrn.btclientetel as tel ON tel.BTCLIENTETELNOCTEID = cliente.BTCLIENTENUMERO  "+
                            " left JOIN bstntrn.btclientecorreo as correos ON correos.BTCLIENTECORREONOCTEID = cliente.BTCLIENTENUMERO "+
                         /*  " left join bstntrn.btclienteedo as edo on edo.btclienteedoid=BTCLIENTEESTADOID "+
                            " left join bstntrn.btclienteciud as ciud on edo.btclienteedoid=ciud.bnstredoid and btclienteciudid=BTCLIENTECIUDADID "+ */
                            " where 1 = 1 and cliente.btclienteNUMERO=? ";