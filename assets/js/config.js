
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
            to: routes.rubricBase
        },
        {
            icon: 'supervisor_account',
            title: 'Grupos',
            to: routes.groups
        },
        {
            icon: 'supervisor_account',
            title: 'Equipos',
            to: routes.teams
        },
        {
            icon: 'person',
            title: 'Usuarios',
            to: routes.users
        }
          
    ],
    cookie:{
        token :'token',
        usuario:'usuario'
    }
}


export default config