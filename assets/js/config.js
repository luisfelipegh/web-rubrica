
let routes = require('./routes').default

let config = {
    api:{
        url:''
    },
    routes:routes,
    menuLateral:[
        {
            icon: 'dashboard',
            title: 'Plantillas Rúbrica',
            to: routes.rubricBase
        }
          
    ]
}


export default config