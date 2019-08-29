import Vuex from 'vuex'
import cookie from './modules/cookie'
import auth from './modules/auth'

const createStore = () => {
  return new Vuex.Store({
    modules: {
      cookie,
      auth,
    }
  })
}

export default createStore