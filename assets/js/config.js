
let routes = require('./routes').default

let config = {
    api:{
        url:''
    },
    routes:routes,
    menuLateral:[
        {
            icon: 'dashboard',
            title: 'Base de Rúbrica',
            to: routes.rubricBase
          }
    ]
}


export default config