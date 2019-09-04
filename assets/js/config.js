
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
        }
          
    ],
    cookie:{
        token :'token',
        usuario:'usuario'
    }
}


export default config