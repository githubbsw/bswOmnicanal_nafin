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
      nombre: "10.235/10.245",
      canalDefault: "IBD",
      vers: "SDB-10-3",
      mysql: {
        crm:{
          ip: "10.25.10.245",
          usuario: "bswcrm_user",
          contrasena: "Entrada2020$",
          baseDatos: "siogen01",
        },
        cc:{    
          ip: "10.25.10.235",
          usuario: "bswcc_user",
          contrasena: "Entrada2020$",
          baseDatos: "asteriskcdrdb",
        },
        cco:{    
          ip: "10.25.10.230",
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
      nombre: "41.234/41.245",
      canalDefault: "IBD",
      vers: "SDB-10-2",
      mysql: {
        crm:{
          ip: "172.16.41.245",
          usuario: "bswcrm_user",
          contrasena: "Entrada2020$",
          baseDatos: "siogen01",
        },
        cc:{    
          ip: "172.16.41.234",
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
          ip: "172.16.41.231",
          usuario: "bswcrm_user",
          contrasena: "Entrada2020$",
          baseDatos: "inmc",
        }
      }
    },
    {
      id: 5,
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
          ip: "172.16.41.231",
          usuario: "bswcrm_user",
          contrasena: "Entrada2020$",
          baseDatos: "inmc",
        }
      }
    },
     {
      id: 6,
      select: false,
      nombre: "41.172/41.171",
      canalDefault: "IBD",
      vers: "SDB-10-CAP",
      mysql: {
        crm:{
          ip: "172.16.41.172",
          usuario: "bswcrm_user",
          contrasena: "Entrada2020$",
          baseDatos: "siogen01",
        },
        cc:{    
          ip: "172.16.41.171",
          usuario: "bswcc_user",
          contrasena: "Entrada2020$",
          baseDatos: "asteriskcdrdb",
        },
        cco:{    
          ip: "172.16.41.171",
          usuario: "bswcc_user",
          contrasena: "Entrada2020$",
          baseDatos: "asteriskcdrdb",
        },
        mde: {
          ip: "172.16.41.172",
          usuario: "bswcrm_user",
          contrasena: "Entrada2020$",
          baseDatos: "inmc",
        }
      }
    },
    {
     id: 7,
     select: false,
     nombre: "41.247/41.239",
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
         ip: "172.16.41.239",
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
   {//conexion infonavit
    id: 9,
    select: false,
    nombre: "54.231/54.230",
    canalDefault: "IBD",
    vers: "SDB-10",
    mysql: {
      crm:{
        ip: "10.25.54.231",
        usuario: "bswcrm_user",
        contrasena: "Entrada2020$",
        baseDatos: "siogen01",
      },
      cc:{    
        ip: "10.25.54.230",
        usuario: "bswcc_user",
        contrasena: "Entrada2020$",
        baseDatos: "asteriskcdrdb",
      },
      cco:{    
        ip: "10.25.54.231",
        usuario: "bswcc_user",
        contrasena: "Entrada2020$",
        baseDatos: "asteriskcdrdb",
      },
      mde: {
        ip: "10.25.54.231",
        usuario: "bswcrm_user",
        contrasena: "Entrada2020$",
        baseDatos: "inmc",
      }
    }
  }

    /*{
      id: 1,
      select: false,
      nombre: "10.230/10.245",
      canalDefault: "IBD",
      vers: "SDB-10",
      mysql: {
        crm:{
          ip: "172.16.41.245",
          usuario: "development",
          contrasena: "mCpcP37Usm35LncV_",
          baseDatos: "siogen01",
        },
        cc:{    
          ip: "172.16.41.230",
          usuario: "bswcc_user",
          contrasena: "mCpcP37Usm35LncV_",
          baseDatos: "asteriskcdrdb",
        },
        cco:{    
          ip: "172.16.41.230",
          usuario: "bswcc_user",
          contrasena: "mCpcP37Usm35LncV_",
          baseDatos: "asteriskcdrdb",
        },
        mde: {
          ip: "172.16.41.231",
          usuario: "development",
          contrasena: "mCpcP37Usm35LncV_",
          baseDatos: "inmc",
        }
      }
    },
    {
      id: 2,
      select: false,
      nombre: "15.5/15.8",
      canalDefault: "IBD",
      vers: "SDB-15",
      mysql: {
        crm:{
          ip: "172.16.15.8",
          usuario: "development",
          contrasena: "mCpcP37Usm35LncV_",
          baseDatos: "siogen01",
        },
        cc:{    
          ip: "172.16.15.5",
          usuario: "bswcc_user",
          contrasena: "mCpcP37Usm35LncV_",
          baseDatos: "asteriskcdrdb",
        },
        cco:{    
          ip: "172.16.15.5",
          usuario: "bswcc_user",
          contrasena: "mCpcP37Usm35LncV_",
          baseDatos: "asteriskcdrdb",
        },
        mde: {
          ip: "172.16.15.8",
          usuario: "development",
          contrasena: "mCpcP37Usm35LncV_",
          baseDatos: "inmc",
        }
      }
    },
    {
      id: 3,
      select: false,
      nombre: "10.234/10.245",
      canalDefault: "IBD",
      vers: "SDB-10-2",
      mysql: {
        crm:{
          ip: "172.16.41.245",
          usuario: "development",
          contrasena: "mCpcP37Usm35LncV_",
          baseDatos: "siogen01",
        },
        cc:{    
          ip: "172.16.41.234",
          usuario: "bswcc_user",
          contrasena: "mCpcP37Usm35LncV_",
          baseDatos: "asteriskcdrdb",
        },
        cco:{    
          ip: "172.16.41.230",
          usuario: "bswcc_user",
          contrasena: "mCpcP37Usm35LncV_",
          baseDatos: "asteriskcdrdb",
        },
        mde: {
          ip: "172.16.41.231",
          usuario: "development",
          contrasena: "mCpcP37Usm35LncV_",
          baseDatos: "inmc",
        }
      }
    },
    {
      id: 4,
      select: false,
      nombre: "15.6/15.7",
      canalDefault: "IBD",
      vers: "SDB-15",
      mysql: {
        crm:{
          ip: "172.16.15.7",
          usuario: "development",
          contrasena: "mCpcP37Usm35LncV_",
          baseDatos: "siogen01",
        },
        cc:{    
          ip: "172.16.15.6",
          usuario: "bswcc_user",
          contrasena: "mCpcP37Usm35LncV_",
          baseDatos: "asteriskcdrdb",
        },
        cco:{    
          ip: "172.16.15.6",
          usuario: "bswcc_user",
          contrasena: "mCpcP37Usm35LncV_",
          baseDatos: "asteriskcdrdb",
        },
        mde: {
          ip: "172.16.15.7",
          usuario: "development",
          contrasena: "mCpcP37Usm35LncV_",
          baseDatos: "inmc",
        }
      }
    },
    {
      id: 5,
      select: false,
      nombre: "10.230/15.7",
      canalDefault: "IBD",
      vers: "SDB-15-2",
      mysql: {
        crm:{
          ip: "172.16.15.7",
          usuario: "development",
          contrasena: "mCpcP37Usm35LncV_",
          baseDatos: "siogen01",
        },
        cc:{    
          ip: "172.16.41.230",
          usuario: "bswcc_user",
          contrasena: "mCpcP37Usm35LncV_",
          baseDatos: "asteriskcdrdb",
        },
        cco:{    
          ip: "172.16.41.230",
          usuario: "bswcc_user",
          contrasena: "mCpcP37Usm35LncV_",
          baseDatos: "asteriskcdrdb",
        },
        mde: {
          ip: "172.16.15.7",
          usuario: "development",
          contrasena: "mCpcP37Usm35LncV_",
          baseDatos: "inmc",
        }
      }
    },
    {
      id: 6,
      select: false,
      nombre: "10.204/10.203",
      canalDefault: "IBD",
      vers: "SDB-15-3",
      mysql: {
        crm:{
          ip: "10.25.10.203",
          usuario: "development",
          contrasena: "mCpcP37Usm35LncV_",
          baseDatos: "siogen01",
        },
        cc:{    
          ip: "10.25.10.204",
          usuario: "bswcc_user",
          contrasena: "mCpcP37Usm35LncV_",
          baseDatos: "asteriskcdrdb",
        },
        cco:{    
          ip: "10.25.10.204",
          usuario: "bswcc_user",
          contrasena: "mCpcP37Usm35LncV_",
          baseDatos: "asteriskcdrdb",
        },
        mde: {
          ip: "10.25.10.203",
          usuario: "development",
          contrasena: "mCpcP37Usm35LncV_",
          baseDatos: "inmc",
        }
      }
    },
    {
      id: 7,
      select: false,
      nombre: "10.205/10.203",
      canalDefault: "IBD",
      vers: "SDB-15-4",
      mysql: {
        crm:{
          ip: "10.25.10.203",
          usuario: "development",
          contrasena: "mCpcP37Usm35LncV_",
          baseDatos: "siogen01",
        },
        cc:{    
          ip: "10.25.10.205",
          usuario: "bswcc_user",
          contrasena: "mCpcP37Usm35LncV_",
          baseDatos: "asteriskcdrdb",
        },
        cco:{    
          ip: "10.25.10.205",
          usuario: "bswcc_user",
          contrasena: "mCpcP37Usm35LncV_",
          baseDatos: "asteriskcdrdb",
        },
        mde: {
          ip: "10.25.10.203",
          usuario: "development",
          contrasena: "mCpcP37Usm35LncV_",
          baseDatos: "inmc",
        }
      }
    },
    {
      id: 8,
      select: false,
      nombre: "CRM3",
      canalDefault: "IBD",
      vers: "CRM3",
      mysql: {
        crm:{
          ip: "31.220.59.240",
          usuario: "development",
          contrasena: "Entrada2019$",
          baseDatos: "siogen01",
        },
        cc:{    
          ip: "93.188.164.92",
          usuario: "bswcc_user",
          contrasena: "Entrada2019",
          baseDatos: "asteriskcdrdb",
        },
        cco:{    
          ip: "93.188.164.92",
          usuario: "bswcc_user",
          contrasena: "Entrada2019",
          baseDatos: "asteriskcdrdb",
        },
        mde: {
          ip: "31.220.59.240",
          usuario: "development",
          contrasena: "Entrada2019$",
          baseDatos: "inmc",
        }
      }
    },   
    {
      id: 9,
      select: false,
      nombre: "57.151/57.149",
      canalDefault: "IBD",
      vers: "SDB-12",
      mysql: {
        crm:{
          ip: "187.188.57.151",
          usuario: "development",
          contrasena: "mCpcP37Usm35LncV_",
          baseDatos: "siogen01",
        },
        cc:{    
          ip: "187.188.57.149",
          usuario: "bswcc_user",
          contrasena: "mCpcP37Usm35LncV_",
          baseDatos: "asteriskcdrdb",
        },
        cco:{    
          ip: "187.188.57.149",
          usuario: "bswcc_user",
          contrasena: "mCpcP37Usm35LncV_",
          baseDatos: "asteriskcdrdb",
        },
        mde: {
          ip: "172.16.41.231",
          usuario: "development",
          contrasena: "mCpcP37Usm35LncV_",
          baseDatos: "inmc",
        }
      }
    },*/
   /* {
      id: 1,
      select: false,
      nombre: "41.203/41.212",
      canalDefault: "IBD",
      vers: "SDB-11",
      mysql: {
        crm:{
          ip: "172.16.41.212",
          usuario: "development",
          contrasena: "mCpcP37Usm35LncV_",
          baseDatos: "siogen01",
        },
        cc:{    
          ip: "172.16.41.211",
          usuario: "development",
          contrasena: "mCpcP37Usm35LncV",
          baseDatos: "asteriskcdrdb",
        },
        cco:{    
          ip: "172.16.41.211",
          usuario: "development",
          contrasena: "mCpcP37Usm35LncV",
          baseDatos: "asteriskcdrdb",
        },
        mde: {
          ip: "172.16.41.213",
          usuario: "development",
          contrasena: "mCpcP37Usm35LncV_",
          baseDatos: "inmc",
        }
      }
    },
    {
      id: 2,
      select: false,
      nombre: "41.204/41.212",
      canalDefault: "IBD",
      vers: "SDB-12",
      mysql: {
        crm:{
          ip: "172.16.41.212",
          usuario: "development",
          contrasena: "mCpcP37Usm35LncV_",
          baseDatos: "siogen01",
        },
        cc:{    
          ip: "172.16.41.211",
          usuario: "development",
          contrasena: "mCpcP37Usm35LncV",
          baseDatos: "asteriskcdrdb",
        },
        cco:{    
          ip: "172.16.41.211",
          usuario: "development",
          contrasena: "mCpcP37Usm35LncV",
          baseDatos: "asteriskcdrdb",
        },
        mde: {
          ip: "172.16.41.210",
          usuario: "development",
          contrasena: "mCpcP37Usm35LncV_",
          baseDatos: "inmc",
        }
      }
    },
    {
      id: 3,
      select: false,
      nombre: "41.205/41.212",
      canalDefault: "IBD",
      vers: "SDB-13",
      mysql: {
        crm:{
          ip: "172.16.41.212",
          usuario: "development",
          contrasena: "mCpcP37Usm35LncV_",
          baseDatos: "siogen01",
        },
        cc:{    
          ip: "172.16.41.211",
          usuario: "development",
          contrasena: "mCpcP37Usm35LncV",
          baseDatos: "asteriskcdrdb",
        },
        cco:{    
          ip: "172.16.41.211",
          usuario: "development",
          contrasena: "mCpcP37Usm35LncV",
          baseDatos: "asteriskcdrdb",
        },
        mde: {
          ip: "172.16.41.210",
          usuario: "development",
          contrasena: "mCpcP37Usm35LncV_",
          baseDatos: "inmc",
        }
      }
    },
    {
      id: 4,
      select: false,
      nombre: "41.206/41.212",
      canalDefault: "IBD",
      vers: "SDB-14",
      mysql: {
        crm:{
          ip: "172.16.41.212",
          usuario: "development",
          contrasena: "mCpcP37Usm35LncV_",
          baseDatos: "siogen01",
        },
        cc:{    
          ip: "172.16.41.211",
          usuario: "development",
          contrasena: "mCpcP37Usm35LncV",
          baseDatos: "asteriskcdrdb",
        },
        cco:{    
          ip: "172.16.41.211",
          usuario: "development",
          contrasena: "mCpcP37Usm35LncV",
          baseDatos: "asteriskcdrdb",
        },
        mde: {
          ip: "172.16.41.210",
          usuario: "development",
          contrasena: "mCpcP37Usm35LncV_",
          baseDatos: "inmc",
        }
      }
    },
    {
      id: 5,
      select: false,
      nombre: "41.220/41.212",
      canalDefault: "IBD",
      vers: "SDB-15",
      mysql: {
        crm:{
          ip: "172.16.41.212",
          usuario: "development",
          contrasena: "mCpcP37Usm35LncV_",
          baseDatos: "siogen01",
        },
        cc:{    
          ip: "172.16.41.211",
          usuario: "development",
          contrasena: "mCpcP37Usm35LncV",
          baseDatos: "asteriskcdrdb",
        },
        cco:{    
          ip: "172.16.41.211",
          usuario: "development",
          contrasena: "mCpcP37Usm35LncV",
          baseDatos: "asteriskcdrdb",
        },
        mde: {
          ip: "172.16.41.210",
          usuario: "development",
          contrasena: "mCpcP37Usm35LncV_",
          baseDatos: "inmc",
        }
      }
    },
    {
      id: 6,
      select: false,
      nombre: "41.221/41.212",
      canalDefault: "IBD",
      vers: "SDB-16",
      mysql: {
        crm:{
          ip: "172.16.41.212",
          usuario: "development",
          contrasena: "mCpcP37Usm35LncV_",
          baseDatos: "siogen01",
        },
        cc:{    
          ip: "172.16.41.211",
          usuario: "development",
          contrasena: "mCpcP37Usm35LncV",
          baseDatos: "asteriskcdrdb",
        },
        cco:{    
          ip: "172.16.41.211",
          usuario: "development",
          contrasena: "mCpcP37Usm35LncV",
          baseDatos: "asteriskcdrdb",
        },
        mde: {
          ip: "172.16.41.210",
          usuario: "development",
          contrasena: "mCpcP37Usm35LncV_",
          baseDatos: "inmc",
        }
      }
    },{
      id: 7,
      select: false,
      nombre: "10.230/10.212",
      canalDefault: "IBD",
      vers: "SDB-17",
      mysql: {
        crm:{
          ip: "172.16.41.212",
          usuario: "development",
          contrasena: "mCpcP37Usm35LncV_",
          baseDatos: "siogen01",
        },
        cc:{    
          ip: "172.16.41.230",
          usuario: "bswcc_user",
          contrasena: "Entrada2020$",
          baseDatos: "asteriskcdrdb",
        },
        cco:{    
          ip: "172.16.41.230",
          usuario: "bswcc_user",
          contrasena: "mCpcP37Usm35LncV_",
          baseDatos: "asteriskcdrdb",
        },
        mde: {
          ip: "172.16.41.231",
          usuario: "development",
          contrasena: "Entrada2020$",
          baseDatos: "inmc",
        }
      }
    },
    {
      id: 8,
      select: false,
      nombre: "10.234/10.212",
      canalDefault: "IBD",
      vers: "SDB-18",
      mysql: {
        crm:{
          ip: "172.16.41.212",
          usuario: "development",
          contrasena: "mCpcP37Usm35LncV_",
          baseDatos: "siogen01",
        },
        cc:{    
          ip: "172.16.41.234",
          usuario: "bswcc_user",
          contrasena: "Entrada2020$",
          baseDatos: "asteriskcdrdb",
        },
        cco:{    
          ip: "172.16.41.230",
          usuario: "bswcc_user",
          contrasena: "Entrada2020$",
          baseDatos: "asteriskcdrdb",
        },
        mde: {
          ip: "172.16.41.231",
          usuario: "bswcrm_user",
          contrasena: "Entrada2020$",
          baseDatos: "inmc",
        }
      }
    },*//*,{
      id: 11,
      select: false,
      nombre: "41.203/245",
      canalDefault: "IBD",
      vers: "SDB-19",
      mysql: {
        crm:{
          ip: "172.16.41.245",
          usuario: "bswcrm_user",
          contrasena: "Entrada2020$",
          baseDatos: "siogen01",
        },
        cc:{    
          ip: "172.16.41.211",
          usuario: "development",
          contrasena: "mCpcP37Usm35LncV",
          baseDatos: "asteriskcdrdb",
        },
        cco:{    
          ip: "172.16.41.211",
          usuario: "development",
          contrasena: "mCpcP37Usm35LncV",
          baseDatos: "asteriskcdrdb",
        },
        mde: {
          ip: "172.16.41.213",
          usuario: "development",
          contrasena: "mCpcP37Usm35LncV_",
          baseDatos: "inmc",
        }
      }
    },
    {
      id: 12,
      select: false,
      nombre: "41.204/245",
      canalDefault: "IBD",
      vers: "SDB-20",
      mysql: {
        crm:{
          ip: "172.16.41.245",
          usuario: "bswcrm_user",
          contrasena: "Entrada2020$",
          baseDatos: "siogen01",
        },
        cc:{    
          ip: "172.16.41.211",
          usuario: "development",
          contrasena: "mCpcP37Usm35LncV",
          baseDatos: "asteriskcdrdb",
        },
        cco:{    
          ip: "172.16.41.211",
          usuario: "development",
          contrasena: "mCpcP37Usm35LncV",
          baseDatos: "asteriskcdrdb",
        },
        mde: {
          ip: "172.16.41.210",
          usuario: "development",
          contrasena: "mCpcP37Usm35LncV_",
          baseDatos: "inmc",
        }
      }
    },
    {
      id: 13,
      select: false,
      nombre: "41.205/245",
      canalDefault: "IBD",
      vers: "SDB-21",
      mysql: {
        crm:{
          ip: "172.16.41.245",
          usuario: "bswcrm_user",
          contrasena: "Entrada2020$",
          baseDatos: "siogen01",
        },
        cc:{    
          ip: "172.16.41.211",
          usuario: "development",
          contrasena: "mCpcP37Usm35LncV",
          baseDatos: "asteriskcdrdb",
        },
        cco:{    
          ip: "172.16.41.211",
          usuario: "development",
          contrasena: "mCpcP37Usm35LncV",
          baseDatos: "asteriskcdrdb",
        },
        mde: {
          ip: "172.16.41.210",
          usuario: "development",
          contrasena: "mCpcP37Usm35LncV_",
          baseDatos: "inmc",
        }
      }
    },
    {
      id: 14,
      select: false,
      nombre: "41.206/245",
      canalDefault: "IBD",
      vers: "SDB-22",
      mysql: {
        crm:{
          ip: "172.16.41.245",
          usuario: "bswcrm_user",
          contrasena: "Entrada2020$",
          baseDatos: "siogen01",
        },
        cc:{    
          ip: "172.16.41.211",
          usuario: "development",
          contrasena: "mCpcP37Usm35LncV",
          baseDatos: "asteriskcdrdb",
        },
        cco:{    
          ip: "172.16.41.211",
          usuario: "development",
          contrasena: "mCpcP37Usm35LncV",
          baseDatos: "asteriskcdrdb",
        },
        mde: {
          ip: "172.16.41.210",
          usuario: "development",
          contrasena: "mCpcP37Usm35LncV_",
          baseDatos: "inmc",
        }
      }
    },
    {
      id: 15,
      select: false,
      nombre: "41.220/245",
      canalDefault: "IBD",
      vers: "SDB-23",
      mysql: {
        crm:{
          ip: "172.16.41.245",
          usuario: "bswcrm_user",
          contrasena: "Entrada2020$",
          baseDatos: "siogen01",
        },
        cc:{    
          ip: "172.16.41.211",
          usuario: "development",
          contrasena: "mCpcP37Usm35LncV",
          baseDatos: "asteriskcdrdb",
        },
        cco:{    
          ip: "172.16.41.211",
          usuario: "development",
          contrasena: "mCpcP37Usm35LncV",
          baseDatos: "asteriskcdrdb",
        },
        mde: {
          ip: "172.16.41.210",
          usuario: "development",
          contrasena: "mCpcP37Usm35LncV_",
          baseDatos: "inmc",
        }
      }
    },
    {
      id: 16,
      select: false,
      nombre: "41.221/245",
      canalDefault: "IBD",
      vers: "SDB-24",
      mysql: {
        crm:{
          ip: "172.16.41.245",
          usuario: "bswcrm_user",
          contrasena: "Entrada2020$",
          baseDatos: "siogen01",
        },
        cc:{    
          ip: "172.16.41.211",
          usuario: "development",
          contrasena: "mCpcP37Usm35LncV",
          baseDatos: "asteriskcdrdb",
        },
        cco:{    
          ip: "172.16.41.211",
          usuario: "development",
          contrasena: "mCpcP37Usm35LncV",
          baseDatos: "asteriskcdrdb",
        },
        mde: {
          ip: "172.16.41.210",
          usuario: "development",
          contrasena: "mCpcP37Usm35LncV_",
          baseDatos: "inmc",
        }
      }
    },{
      id: 17,
      select: false,
      nombre: "15.5/15.8",
      canalDefault: "IBD",
      vers: "SDB-15",
      mysql: {
        crm:{
          ip: "172.16.15.8",
          usuario: "bswcrm_user",
          contrasena: "Entrada2020$",
          baseDatos: "siogen01",
        },
        cc:{    
          ip: "172.16.15.5",
          usuario: "bswcc_user",
          contrasena: "Entrada2020$",
          baseDatos: "asteriskcdrdb",
        },
        cco:{    
          ip: "172.16.15.5",
          usuario: "bswcc_user",
          contrasena: "Entrada2020$",
          baseDatos: "asteriskcdrdb",
        },
        mde: {
          ip: "172.16.15.8",
          usuario: "bswcrm_user",
          contrasena: "Entrada2020$",
          baseDatos: "inmc",
        }
      }
    },*/

  ]
}


const conexiones = cryptr.encrypt(JSON.stringify(conf));

let cnn = {
  conexiones
};

let data = JSON.stringify(cnn);
fs.writeFileSync('cnn2020.json', data);