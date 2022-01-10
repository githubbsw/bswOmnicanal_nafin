const fs = require('fs');
const Cryptr = require('cryptr');
const cryptr = new Cryptr('bsw2019');

var conf = {
  conexiones: [
    {
      id: 1,
    select: false,
    nombre: "44.241/44.230",
    canalDefault: "IBD",
    vers: "SDB-10",
    mysql: {
      crm:{
        ip: "172.16.44.241",
        usuario: "bswcrm_user",
        contrasena: "Entrada2020$",
        baseDatos: "siogen01",
      },
      cc:{    
        ip: "172.16.44.230",
        usuario: "bswcc_user",
        contrasena: "Entrada2020$",
        baseDatos: "asteriskcdrdb",
      },
      cco:{    
        ip: "172.16.44.233",
        usuario: "bswcc_user",
        contrasena: "Entrada2020$",
        baseDatos: "asteriskcdrdb",
      },
      mde: {
        ip: "172.16.44.241",
        usuario: "bswcrm_user",
        contrasena: "Entrada2020$",
        baseDatos: "inmc",
      }
    }
    },
    {
      id: 2,
    select: false,
    nombre: "44.241/44.231",
    canalDefault: "IBD",
    vers: "SDB-10-1",
    mysql: {
      crm:{
        ip: "172.16.44.241",
        usuario: "bswcrm_user",
        contrasena: "Entrada2020$",
        baseDatos: "siogen01",
      },
      cc:{    
        ip: "172.16.44.231",
        usuario: "bswcc_user",
        contrasena: "Entrada2020$",
        baseDatos: "asteriskcdrdb",
      },
      cco:{    
        ip: "172.16.44.233",
        usuario: "bswcc_user",
        contrasena: "Entrada2020$",
        baseDatos: "asteriskcdrdb",
      },
      mde: {
        ip: "172.16.44.241",
        usuario: "bswcrm_user",
        contrasena: "Entrada2020$",
        baseDatos: "inmc",
      }
    }
    },
    {
      id: 3,
    select: false,
    nombre: "44.241/44.232",
    canalDefault: "IBD",
    vers: "SDB-10-2",
    mysql: {
      crm:{
        ip: "172.16.44.241",
        usuario: "bswcrm_user",
        contrasena: "Entrada2020$",
        baseDatos: "siogen01",
      },
      cc:{    
        ip: "172.16.44.232",
        usuario: "bswcc_user",
        contrasena: "Entrada2020$",
        baseDatos: "asteriskcdrdb",
      },
      cco:{    
        ip: "172.16.44.233",
        usuario: "bswcc_user",
        contrasena: "Entrada2020$",
        baseDatos: "asteriskcdrdb",
      },
      mde: {
        ip: "172.16.44.241",
        usuario: "bswcrm_user",
        contrasena: "Entrada2020$",
        baseDatos: "inmc",
      }
    }
    },
    
    
  ]
}


const conexiones = cryptr.encrypt(JSON.stringify(conf));

let cnn = {
  conexiones
};

let data = JSON.stringify(cnn);
fs.writeFileSync('cnn2020.json', data);