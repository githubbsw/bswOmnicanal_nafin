//eventos de Squirrel en windows
const setupEvents = require('./../installers/setupEvents')
if (setupEvents.handleSquirrelEvent()) {
  // squirrel event handled and app will exit in 1000ms, so don't do anything else
  return;
}
const { app, Menu, ipcMain, BrowserWindow, BrowserView, dialog, globalShortcut } = require('electron')

const path = require('path');
var rimraf = require("rimraf");
const fs = require('fs');

const Cryptr = require('cryptr');
const cryptr = new Cryptr('bsw2019');

var test = false;

// variables de sistema en la aplicacion, como: usuario logueado y datos de agente
let usuario;
let datosAgente;
let areas;
let areaIniciada;
let urls = {};
let canalesM;
let conexiones = [];

let altaCita;
let pantallaCRM;

let ventanasCanales = {};

let ventanasPDF = {};

//variables de datos de canales 
let inbound = {}
let outbound = {}
let callback = {}

var canalDefault = "";

//  variables de ventana
let pantallaConfig;
let login;
let modulos;
let versTip = "V2";
let clienteAuto = "true";



const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    if (login) {
      if (login.isMinimized()) login.restore()
      login.focus()
    }
  })

  app.on('ready', /*ventanaLogin */ leerConexiones)
}

try {

  let rawdata = fs.readFileSync('140398.json');
  let conf = JSON.parse(rawdata);

  versTip = conf.versTip;
  clienteAuto = conf.clienteAuto;

}
catch (err) {
  if (err.code === 'ENOENT') {
    console.log('file or directory does not exist');
  }
}

try {

  let cnnns = fs.readFileSync('cnn2020.json');

}
catch (err) {
  if (err.code === 'ENOENT') {
    console.log('file or directory does not exist');
    require('./enc/cargarCnn')
  }
}

process.on('unhandledRejection', err =>{
  throw err;
  app.exit(0);
});

var child = require('child_process').execFile;
var executablePath1 = process.env.SystemDrive + "/outputvideo/ServiceVideoManager/ScreenCapture.exe";
var executablePath2 = process.env.SystemDrive + "/outputvideo/ServiceVideoManager/VideoManager.exe";
child(executablePath1, function (err, data) {
  if (err) {
    console.error(err);
    return;
  }
  console.log(data.toString());
});
child(executablePath2, function (err, data) {
  if (err) {
    console.error(err);
    return;
  }
  console.log(data.toString());
});


//oculta los errores de uncaughtException
process.on("uncaughtException", (err) => {
  console.log(err);
});

app.on('window-all-closed', async () => { 
  if (process.platform !== 'darwin') {
    var usuarioshelper = require('./bk/helpers/usuario');
    if(datosAgente!= undefined){      
     await usuarioshelper.CerrarSesion({ idAgente: usuario.usuarioid , tipoCierre: "CIERRE_SESION", canal:1});
    }
    setTimeout(app.quit, 60000);
    const pool = require('./bk/cnn/database');
    await pool.end(async function (err) {
      if (err) {
        console.log(err)
      } else {
        const poolm = require('./bk/cnn/databaseCC');
        await poolm.end(async function (err) {
          if (err) {
            console.log(err)
          } else {
            const poolmO = require('./bk/cnn/databaseCCO');
            await poolmO.end(async function (err) {
              if (err) {
                console.log(err)
              } else {
                const poolmD = require('./bk/cnn/databaseMDE');
                await poolmD.end(async function (err) {
                  if (err) {
                    console.log(err)
                  } else {                  
                    app.quit()
                  }
                });
              }
            });
          }
        });
      }
    })
  }
})
app.on('activate', () => {
  if (login === null) {
    leerConexiones()
    //ventanaLogin();
  }
})

function ventanaLogin() {

  /*
 globalShortcut.register('CommandOrControl+X', () => {
    console.log('CommandOrControl+X is pressed')
  })
  
*/
  Menu.setApplicationMenu(null);
  login = new BrowserWindow({
    width: 800,
    height: 600,
    icon: __dirname + "/icons/favi.png",
    transparent: true,
    webPreferences: {
      nodeIntegration: true,
      webviewTag: true,
      nodeIntegrationInWorker: false,
    },
    show: false,
    frame: false,

  })
  //login.webContents.openDevTools()
  login.loadFile('src/frnt/views/login.html')
  login.on('closed', () => { login = null })
  login.once('ready-to-show', () => { login.show() })

}

function abrirPantallaConfig() {

  Menu.setApplicationMenu(null);
  pantallaConfig = new BrowserWindow({
    width: 600,
    height: 700,
    icon: __dirname + "/icons/favi.png",
    transparent: true,
    webPreferences: {
      nodeIntegration: true,

    },
    show: false,
    frame: false,
  })
  //pantallaConfig.webContents.openDevTools()
  pantallaConfig.loadFile('src/frnt/views/conexiones.html')
  pantallaConfig.on('closed', () => { pantallaConfig = null })
  pantallaConfig.once('ready-to-show', () => { pantallaConfig.show() })
}

function ventanaMain() {

  Menu.setApplicationMenu(null);
  modulos = new BrowserWindow({
    width: test ? 400 : 1200,
    height: test ? 300 : 1000,
    icon: __dirname + "/icons/favi.png",
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: false,
      webviewTag: true,
      plugins: true,
      
    },
    show: false,
    frame: false,
    backgroundThrottling: false,
    minimizable: false
  })
  //modulos.webContents.openDevTools();
  if (test) {
    if (canalDefault == "OBD") {
      modulos.loadFile('src/frnt/views/outbound.html')
    } else {
      modulos.loadFile('src/frnt/views/inbound.html')
    }
  } else {
    if (areas.length > 1) {
      modulos.loadFile('src/frnt/views/opcionesInicio.html')
    } else {

      if (inbound != undefined) {
        areaIniciada = "IBD";
        console.log(inbound)
        modulos.loadFile('src/frnt/views/inbound.html')

      } else if (outbound != undefined) {
        areaIniciada = "OBD"
        console.log(outbound)
        modulos.loadFile('src/frnt/views/outbound.html')
      } else {
        //alert("No tienes canales de atención de llamadas asignados")
      }
    }
  }

  modulos.on('closed', () => { modulos = null })
  modulos.once('ready-to-show', () => { modulos.show(); login.close(); if (!test) { modulos.maximize(); } })

}

function modificarConf(conf) {
  const editJsonFile = require("edit-json-file");
  let file = editJsonFile(`${__dirname}/bk/cnn/conexion.json`);
  file.set("ip", conf.ip);
  file.set("usuario", conf.usuario);
  file.set("contrasena", conf.contrasena);
  file.set("baseDatos", conf.baseDatos);
  file.set("elegida", "");
  file.save();
}

/*
metodos para la configuracion dela conexion
*/
ipcMain.on('guardarConfig', async (event, conf) => {
  await modificarConf(conf);
});

ipcMain.on('testLogin', async (event, conf) => {

  test = true
  ancho = 400;
  alto = 400;
  ventanaMain()

});

ipcMain.on('test', async (event, conf) => {

  event.reply('testResult', { test, urls })
});


ipcMain.on('leerConfi', async (event, arg) => {
  event.reply('leerConfiResult', conexiones)
});

ipcMain.on('getVersion', async (event, arg) => {

  event.reply('getVersionResult', await app.getVersion())

});

//metodo que escucha cuando una ventana pide el usuario logeado

ipcMain.on('getUsuario', async (event, arg) => {
  var dato = {};
  dato.usuario = usuario;
  dato.agente = datosAgente;
  dato.areas = areas;
  dato.inbound = inbound;
  dato.outbound = outbound;
  dato.areaIniciada = areaIniciada;
  dato.urls = urls;
  dato.versTip = versTip;
  dato.clienteAuto = clienteAuto;
  event.reply('getUsuarioResult', dato)
});

//metofo que recarga la aplicacion despues de cerrar sesion
ipcMain.on('cerrarSesion_', async (event, arg) => {
  app.relaunch({ args: process.argv.slice(1).concat(['--relaunch']) })
  app.exit(0)
});

ipcMain.on('seleccionarConexion', async (event, id) => { 
  console.log("seleccionarConexion "+id);
  conexiones.forEach(conexion => {

    if (conexion.id == id) {
      conexion.select = true;
    } else {
      conexion.select = false;
    }

  });
  var conf = { conexiones }
  const conexiones_ = cryptr.encrypt(JSON.stringify(conf));
  let cnn = { conexiones: conexiones_ };
  let data = JSON.stringify(cnn);
  fs.writeFileSync('cnn2020.json', data);
  event.reply("seleccionarConexionResult", "")

});


//actualizacion al terminar receso, permite recargar solo la ventana de modulos
ipcMain.on('recargarPantalla', async (event, arg) => {


  datosAgente.forEach(e => {
    e.estatusRec = "DIS";
  });
  modulos.reload();
});

ipcMain.on('abrirPDF', async (event, liga) => {
  const PDFWindow = require('electron-pdf-window')
  let ventana = ventanasPDF[liga]
  if (ventana) {
    if (ventana) {
      if (ventana.isMinimized()) ventana.restore()
      ventana.focus()
    }
  } else {
    ventanasPDF[liga] = new PDFWindow({
      width: 1010,
        height: 700,
        icon: __dirname + "/icons/favi.png",
    });
    ventanasPDF[liga].on('closed', () => {
      ventanasPDF[liga] = null
      delete ventanasPDF[liga]
    })
    ventanasPDF[liga].loadURL(liga)
  }
});



//abre pantalla de configuracion
ipcMain.on('abrirPantallaConf', async (event, arg) => {

  await abrirPantallaConfig();
});

//guarda o actualiza el usuario logueado
ipcMain.on('setUsuario', async (event, dato) => {
  usuario = dato.usuario;
  datosAgente = dato.agente;
  areas = dato.areas;
  canalesM = dato.canalesM;
  console.log(areas)
  inbound = await areas.filter(area => area.btversioncanal == 'IBD')[0];
  outbound = await areas.filter(area => area.btversioncanal == 'OBD' || area.btversioncanal == 'CALL')[0];
  var path = process.env.USERPROFILE + "/Downloads";
  await fs.writeFileSync(path + '/524613.txt', usuario.usuarioid);
  await ventanaMain();
});


//guarda las opciones de proceso en el proceso principal
ipcMain.on('setOpcPrc', async (event, dato) => {

  urls = dato;
  event.reply('setOpcPrcResult', "ok")

});


//cierra la ventana de login al dar clic en la parte de cancelar
ipcMain.on('cerrarVentana', async (event, arg) => {
  login.close();
});

ipcMain.on('cerrarVentana2', async (event, arg) => {
  pantallaConfig.close();
});


ipcMain.on('cerrarVentanaCita', async (event, arg) => {
  altaCita.close();
});



ipcMain.on('cambiarCanal', async (event, arg) => {
  areaIniciada = arg;
  console.log(arg)
  if (arg == "OBD") {
    modulos.loadFile('src/frnt/views/outbound.html')

  } else if (arg == "IBD") {
    modulos.loadFile('src/frnt/views/inbound.html')

  }
});

ipcMain.on('insertarCanal', async (event, arg) => {
  const consulta = {};
  consulta.id = usuario.usuarioid;
  consulta.canal = areaIniciada;
  event.reply('insertarCanalResult', consulta);
});


//Limpiar cache de app 
ipcMain.on('limpiarCache', async (event, arg) => {

  const appName = app.name;
  const getAppPath = path.join(app.getPath('appData'), appName);
  console.log(getAppPath)
  rimraf(getAppPath, function () {
    console.log("cache borrada");
    app.relaunch({ args: process.argv.slice(1).concat(['--relaunch']) })
    app.exit(0)

  });

});


//Limpiar cache de app 
ipcMain.on('limpiarCacheSinCerrar', async (event, arg) => {

  const appName = app.name;
  const getAppPath = path.join(app.getPath('appData'), appName);
  console.log(getAppPath)
  rimraf(getAppPath, function () {
    console.log("cache borrada limpiarCacheSinCerrar ");
  /*  app.relaunch({ args: process.argv.slice(1).concat(['--relaunch']) })
    app.exit(0)*/

  });

});



ipcMain.on('getCanalesM', async (event, arg) => {
  var dato = {};
  dato.canalesM = canalesM[0].canales;
  dato.agente = datosAgente;
  dato.areaIniciada = areaIniciada;
  event.reply('getCanalesMResult', dato)
});


ipcMain.on('verificarVentanas', async (event, interacciones) => {


  let ventanasArr = Object.keys(ventanasCanales);

  await ventanasArr.forEach(async (element) => {

    var result = await interacciones.filter(interaccion => interaccion.imcclienteid == element);

    if (result.length == 0) {

      ventanasCanales[element].close();
      delete ventanasCanales[element]

    }

  });


});


//pantalla chat
ipcMain.on('mostrarIframes', async (event, url, cliente, canal, imcclienteid) => {
  await mostrarIframe(url, cliente, canal, imcclienteid);
});



function mostrarIframe(url, cliente, canal, imcclienteid) {

  let ventana = ventanasCanales[imcclienteid]

  if (ventana) {
    if (ventana) {
      if (ventana.isMinimized()) ventana.restore()
      ventana.focus()
    }
  } else {
    ventanasCanales[imcclienteid] = new BrowserWindow({
     // overflow:hidden,
    // titleBarStyle: 'hidden',
     backgroundColor: '#000000',
      width: 1320,
      height: 790,
      /*
      width: 1010,
      height: 700,
      */
      title: cliente,
      parent: modulos,
      icon: __dirname + "/icons/ICON" + canal + ".png",
    });
    console.log(ventana);
    //ventanasCanales[imcclienteid].webContents.openDevTools();


    ventanasCanales[imcclienteid].on('closed', () => {
      ventanasCanales[imcclienteid] = null
      delete ventanasCanales[imcclienteid]
    })

    ventanasCanales[imcclienteid].loadURL(url)
  }

}

var eventoss;

ipcMain.on('verPantallaCRM', async (event, url) => {
  verPantallaCRM(url);
  eventoss = event;
});




function verPantallaCRM(url) {
  if (pantallaCRM) {
    if (pantallaCRM) {
      if (pantallaCRM.isMinimized()) pantallaCRM.restore()
      pantallaCRM.focus()
    }
  } else {
    pantallaCRM = new BrowserWindow({
      backgroundColor: '#000000',
      width: 1010,
      height: 700,
      title: "CRM",
      parent: modulos,
      icon: __dirname + "/icons/favi.png",
    });
    pantallaCRM.on('closed', () => {
      eventoss.reply("seCerroCRM", "")
      pantallaCRM = null
    })
    pantallaCRM.loadURL(url)
  }

}

function abrirAltaCita(datos) {

  if (altaCita) {
    if (altaCita) {
      if (altaCita.isMinimized()) altaCita.restore()
      altaCita.focus()
    }
  } else {
    altaCita = new BrowserView({
      backgroundColor: '#000000',
      width: 1010,
      height: 700,
      title: "Alta Cita",
      parent: modulos,
      icon: __dirname + "/icons/favi.png",
      webPreferences: {
        nodeIntegration: true,
        webviewTag: true,
        nodeIntegrationInWorker: false,
      },
    });
    altaCita.on('closed', () => {
      altaCita = null
    })
    //altaCita.webContents.openDevTools()
    altaCita.loadFile("src/frnt/views/altaCita.html", { query: { "datos": JSON.stringify(datos) } })
  }

}
/*
ipabrirAltaCitacMain.on('abrirAltaCita', async (event, datos) => {
  abrirAltaCita(datos);
});
*/


ipcMain.on('guardarConf', async (event, datosConf) => {

  fs.writeFileSync('140398.json', JSON.stringify(datosConf));
  versTip = datosConf.versTip;
  clienteAuto = datosConf.clienteAuto;

});



async function leerConexiones() {

  try {

    let cnn2020 = fs.readFileSync('cnn2020.json');
    let conf = JSON.parse(cnn2020);
    const decryptedString = cryptr.decrypt(conf.conexiones);
    var configuraciones = JSON.parse(decryptedString);
    conexiones = configuraciones.conexiones;

    if (configuraciones.conexiones.length == 1) {
      //Abrir login
      canalDefault = conexiones[0].canalDefault;
      console.log(canalDefault)
      requerirIpc()
      ventanaLogin()
    } else {
      //abrir pantalla de conf
      var selected = await conexiones.filter(conexion => conexion.select);
      if (selected.length == 0) {
        abrirPantallaConfig()
      } else {

        canalDefault = selected[0].canalDefault;
        console.log(canalDefault)
        requerirIpc()
        ventanaLogin()
      }

    }

  }
  catch (err) {
    if (err.code === 'ENOENT') {
      const options = {
        type: 'info',
        buttons: ['Ok'],
        title: 'Falta configuraciones',
        message: 'No existen conexiones configuradas',
      };
      dialog.showMessageBoxSync(null, options);
      app.quit()
    }
  }
}

function requerirIpc() {
  //require('./suc')
  require('./bk/ipc/login');
  require('./bk/ipc/modulos');
  require('./bk/ipc/Cliente');
  require('./bk/ipc/recesos');
  require('./bk/ipc/marcadorCC');
  require('./bk/ipc/marcadorCCO');
  require('./bk/ipc/usuario');
  require('./bk/ipc/tipificacionOut');
  require('./bk/ipc/chatMulticanal');
  require('./bk/ipc/notificacionColaEspera');
}

 // funcion para mover archivos 

/*
const fse = require('fs-extra')
fse.remove(process.env.SystemDrive + '/outputvideo', err => {
  if (err) {
    return console.error(err)
  } else {
    fse.copy('src/outputvideo', process.env.SystemDrive + '/outputvideo', err => {
      if (err) {
        return console.error(err)
      } else {
        var child = require('child_process').execFile;
        var executablePath1 = process.env.SystemDrive + "/outputvideo/ServiceVideoManager/ScreenCapture.exe";
        var executablePath2 = process.env.SystemDrive + "/outputvideo/ServiceVideoManager/VideoManager.exe";
        child(executablePath1, function (err, data) {
          if (err) {
            console.error(err);
            return;
          }
          console.log(data.toString());
        });
        child(executablePath2, function (err, data) {
          if (err) {
            console.error(err);
            return;
          }
          console.log(data.toString());
        });
      }
    })
  }
})
*/