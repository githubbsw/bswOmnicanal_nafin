const fs = require('fs');
const Cryptr = require('cryptr');
const cryptr = new Cryptr('bsw2019');

var conf = {
  conexiones: [
    {
      id: 1,
      select: false,
      nombre: "10.230/10.245",
      canalDefault: "IBD",
      vers: "SDB-10",
      mysql: {
        crm:{
          ip: "10.25.10.245",
          usuario: "bswcrm_user",
          contrasena: "Entrada2020$",
          baseDatos: "siogen01",
        },
        cc:{    
          ip: "10.25.10.230",
          usuario: "bswcc_user",
          contrasena: "Entrada2020$",
          baseDatos: "asteriskcdrdb",
        },
        cco:{    
          ip: "172.16.41.235",
          usuario: "bswcc_user",
          contrasena: "Entrada2020$",
          baseDatos: "asteriskcdrdb",
        },
        mde: {
          ip: "10.25.10.231",
          usuario: "bswcrm_user",
          contrasena: "Entrada2020$",
          baseDatos: "inmc",
        }
      }
    },
    {
      id: 2,
      select: false,
      nombre: "10.234/10.245",
      canalDefault: "IBD",
      vers: "SDB-10-2",
      mysql: {
        crm:{
          ip: "10.25.10.245",
          usuario: "bswcrm_user",
          contrasena: "Entrada2020$",
          baseDatos: "siogen01",
        },
        cc:{    
          ip: "10.25.10.234",
          usuario: "bswcc_user",
          contrasena: "Entrada2020$",
          baseDatos: "asteriskcdrdb",
        },
        cco:{    
          ip: "172.16.41.235",
          usuario: "bswcc_user",
          contrasena: "Entrada2020$",
          baseDatos: "asteriskcdrdb",
        },
        mde: {
          ip: "10.25.10.231",
          usuario: "bswcrm_user",
          contrasena: "Entrada2020$",
          baseDatos: "inmc",
        }
      }
    },
    {
      id: 3,
      select: false,
      nombre: "41.237/10.245",
      canalDefault: "IBD",
      vers: "SDB-10-4",
      mysql: {
        crm:{
          ip: "10.25.10.245",
          usuario: "bswcrm_user",
          contrasena: "Entrada2020$",
          baseDatos: "siogen01",
        },
        cc:{    
          ip: "172.16.41.237",
          usuario: "bswcc_user",
          contrasena: "Entrada2020$",
          baseDatos: "asteriskcdrdb",
        },
        cco:{    
          ip: "172.16.41.235",
          usuario: "bswcc_user",
          contrasena: "Entrada2020$",
          baseDatos: "asteriskcdrdb",
        },
        mde: {
          ip: "10.25.10.231",
          usuario: "bswcrm_user",
          contrasena: "Entrada2020$",
          baseDatos: "inmc",
        }
      }
    },
    {
      id: 4,
      select: false,
      nombre: "41.230/41.245",
      canalDefault: "IBD",
      vers: "SDB-10",
      mysql: {
        crm:{
          ip: "172.16.41.245",
          usuario: "bswcrm_user",
          contrasena: "Entrada2020$",
          baseDatos: "siogen01",
        },
        cc:{    
          ip: "172.16.41.230",
          usuario: "bswcc_user",
          contrasena: "Entrada2020$",
          baseDatos: "asteriskcdrdb",
        },
        cco:{    
          ip: "172.16.41.235",
          usuario: "bswcc_user",
          contrasena: "Entrada2020$",
          baseDatos: "asteriskcdrdb",
        },
        mde: {
          ip: "172.16.41.240",
          usuario: "bswcrm_user",
          contrasena: "Entrada2020$",
          baseDatos: "inmc",
        }
      }
    },
    {
      id: 5,
      select: false,
      nombre: "41.236/41.247",
      canalDefault: "IBD",
      vers: "SDB-10-3",
      mysql: {
        crm:{
          ip: "172.16.41.247",
          usuario: "bswcrm_user",
          contrasena: "Entrada2020$",
          baseDatos: "siogen01",
        },
        cc:{    
          ip: "172.16.41.236",
          usuario: "bswcc_user",
          contrasena: "Entrada2020$",
          baseDatos: "asteriskcdrdb",
        },
        cco:{    
          ip: "172.16.41.229",
          usuario: "bswcc_user",
          contrasena: "Entrada2020$",
          baseDatos: "asteriskcdrdb",
        },
        mde: {
          ip: "10.25.10.231",
          usuario: "bswcrm_user",
          contrasena: "Entrada2020$",
          baseDatos: "inmc",
        }
      }
    },
    {
      id: 6,
      select: false,
      nombre: "41.238/41.247",
      canalDefault: "IBD",
      vers: "SDB-10-2",
      mysql: {
        crm:{
          ip: "172.16.41.247",
          usuario: "bswcrm_user",
          contrasena: "Entrada2020$",
          baseDatos: "siogen01",
        },
        cc:{    
          ip: "172.16.41.238",
          usuario: "bswcc_user",
          contrasena: "Entrada2020$",
          baseDatos: "asteriskcdrdb",
        },
        cco:{    
          ip: "172.16.41.229",
          usuario: "bswcc_user",
          contrasena: "Entrada2020$",
          baseDatos: "asteriskcdrdb",
        },
        mde: {
          ip: "10.25.10.231",
          usuario: "bswcrm_user",
          contrasena: "Entrada2020$",
          baseDatos: "inmc",
        }
      }
    },
    {
      id: 7,
      selet: false,
      nombre: "41.230/41.247",
      canalDefault: "IBD",
      vers: "SDB-10",
      mysql: {
        crm:{
          ip: "172.16.41.247",
          usuario: "bswcrm_user",
          contrasena: "Entrada2020$",
          baseDatos: "siogen01",
        },
        cc:{    
          ip: "172.16.41.230",
          usuario: "bswcc_user",
          contrasena: "Entrada2020$",
          baseDatos: "asteriskcdrdb",
        },
        cco:{    
          ip: "172.16.41.229",
          usuario: "bswcc_user",
          contrasena: "Entrada2020$",
          baseDatos: "asteriskcdrdb",
        },
        mde: {
          ip: "10.25.10.231",
          usuario: "bswcrm_user",
          contrasena: "Entrada2020$",
          baseDatos: "inmc",
        }
      }
    },
    {
      id: 8,
      select: false,
      nombre: "41.239/41.247",
      canalDefault: "IBD",
      vers: "SDB-10",
      mysql: {
        crm:{
          ip: "172.16.41.247",
          usuario: "bswcrm_user",
          contrasena: "Entrada2020$",
          baseDatos: "siogen01",
        },
        cc:{    
          ip: "172.16.41.239",
          usuario: "bswcc_user",
          contrasena: "Entrada2020$",
          baseDatos: "asteriskcdrdb",
        },
        cco:{    
          ip: "172.16.41.229",
          usuario: "bswcc_user",
          contrasena: "Entrada2020$",
          baseDatos: "asteriskcdrdb",
        },
        mde: {
          ip: "10.25.10.231",
          usuario: "bswcrm_user",
          contrasena: "Entrada2020$",
          baseDatos: "inmc",
        }
      }
    }
    
  ]
}


const conexiones = cryptr.encrypt(JSON.stringify(conf));

let cnn = {
  conexiones
};

let data = JSON.stringify(cnn);
fs.writeFileSync('cnn2020.json', data);