const fs = require('fs');
const Cryptr = require('cryptr');
const cryptr = new Cryptr('bsw2019');

var conf = {
  conexiones: [
    {
      id: 1,
      select: false,
      nombre: "10.145/10.144",
      canalDefault: "IBD",
      vers: "SDB-10",
      mysql: {
        crm:{
          ip: "10.25.10.144",
          usuario: "bswcrm_user",
          contrasena: "Entrada2020$",
          baseDatos: "siogen01",
        },
        cc:{    
          ip: "10.25.10.145",
          usuario: "bswcc_user",
          contrasena: "Entrada2020$",
          baseDatos: "asteriskcdrdb",
        },
        cco:{    
          ip: "10.25.10.145",
          usuario: "bswcc_user",
          contrasena: "Entrada2020$",
          baseDatos: "asteriskcdrdb",
        },
        mde: {
          ip: "10.25.10.144",
          usuario: "bswcrm_user",
          contrasena: "Entrada2020$",
          baseDatos: "inmc",
        }
      }
    },
    {
      id: 2,
      select: false,
      nombre: "10.142/10.144",
      canalDefault: "IBD",
      vers: "SDB-10",
      mysql: {
        crm:{
          ip: "10.25.10.144",
          usuario: "bswcrm_user",
          contrasena: "Entrada2020$",
          baseDatos: "siogen01",
        },
        cc:{    
          ip: "10.25.10.142",
          usuario: "bswcc_user",
          contrasena: "Entrada2020$",
          baseDatos: "asteriskcdrdb",
        },
        cco:{    
          ip: "10.25.10.142",
          usuario: "bswcc_user",
          contrasena: "Entrada2020$",
          baseDatos: "asteriskcdrdb",
        },
        mde: {
          ip: "10.25.10.144",
          usuario: "bswcrm_user",
          contrasena: "Entrada2020$",
          baseDatos: "inmc",
        }
      }
    },
    {
      id: 3,
      select: false,
      nombre: "LOCAL",
      canalDefault: "IBD",
      vers: "SDB-10",
      mysql: {
        crm:{
          ip: "192.168.100.71",
          usuario: "bswcrm_user",
          contrasena: "Entrada2020$",
          baseDatos: "siogen01",
        },
        cc:{    
          ip: "192.168.100.72",
          usuario: "bswcc_user",
          contrasena: "Entrada2020$",
          baseDatos: "asteriskcdrdb",
        },
        cco:{    
          ip: "192.168.100.72",
          usuario: "bswcc_user",
          contrasena: "Entrada2020$",
          baseDatos: "asteriskcdrdb",
        },
        mde: {
          ip: "192.168.100.71",
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