
let routes = require('./routes').default

let config = {
    api:{
        url:'http://localhost:8000/api/'
    },
    routes:routes,
    menuLateral:[
        {
            icon: 'dashboard',
            title: 'Plantillas Rúbrica',
            to: routes.rubricBase,
            rol:'ADMINISTRADOR-JEFE'
        },
        {
            icon: 'supervisor_account',
            title: 'Grupos',
            to: routes.groups,
            rol:'ADMINISTRADOR-JEFE'
        },
        {
            icon: 'group_work',
            title: 'Equipos',
            to: routes.teams,
            rol:'ADMINISTRADOR-PROFESOR-JEFE'
        },
        {
            icon: 'person',
            title: 'Usuarios',
            to: routes.users,
            rol:'ADMINISTRADOR'
        }
          
    ],
    cookie:{
        token :'token',
        usuario:'usuario',
        tipo:'tipo'
    }
}


export default config