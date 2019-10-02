
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
            icon: 'view_quilt',
            title: 'Personalizar',
            to: routes.personalization,
            rol:'ADMINISTRADOR-PROFESOR-JEFE'
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
            icon: 'playlist_add',
            title: 'Actividades',
            to: routes.activities,
            rol:'ADMINISTRADOR-PROFESOR-JEFE'
        },
        {
            icon: 'playlist_add_check',
            title: 'Calificaciones',
            to: routes.grades,
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
        idPlantilla:'idPlantilla',
        token :'token',
        usuario:'usuario',
        tipo:'tipo',
        editRubric :'editRubric'
    }
}


export default config