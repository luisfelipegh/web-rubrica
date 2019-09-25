

import VueCookie from 'vue-cookie'
import config from '@/assets/js/config'

const state = {
  token: null,
  userid: null,
  username: null,
  rol: null
}

const mutations = {
  // resetCookie(state) {
  //   state.rol = null
  //   state.token = null
  //   state.userid = null
  //   state.username = null
  //   let keys = Object.keys(state)
  //   keys.forEach(item => {
  //     VueCookie.delete(item)
  //   })
  // },
  // setheader(state, user) {
  //   state.rol = user.rol
  //   state.userid = user.id
  //   state.username = user.name
  //   state.token = user.token
  //   VueCookie.set(config.cookie.token_user, user.token)
  //   VueCookie.set(config.cookie.rol, user.rol)
  //   VueCookie.set(config.cookie.username, user.name)
  //   VueCookie.set(config.cookie.userid, user.id)
  // },
  setCookie(state, item) {
    state[item.key] = item.value
    if (item.value) VueCookie.set(item.key, item.value)
    else VueCookie.delete(item.key)
  }
}

const getters = {
  getCookie: state => key => {
    let data = state[key]
    if (!data) {
      data = VueCookie.get(key)
      state[key] = data
    }
    return data
  },
  // getHeader(state) {
  //   try {
  //     if (!state.token) state.token = VueCookie.get(config.cookie.token)
  //     if (!state.rol) state.rol = VueCookie.get(config.cookie.rol)
  //     if (!state.userid) state.userid = VueCookie.get(config.cookie.userid)
  //     return {
  //       token: state.token,
  //       'user': state.userid,
  //       'rol':state.rol
  //     }
  //   } catch (error) {}
  // },
  // getUser(state) {
  //   try {
  //     if (!state.userid) {
  //       state.userid = VueCookie.get(config.cookie.userid)
  //     }
  //     if (!state.username) {
  //       state.username = VueCookie.get(config.cookie.username)
  //     }
  //     if (!state.rol) {
  //       state.rol = VueCookie.get(config.cookie.rol)
  //     }
  //     if (!state.useruid) {
  //       state.useruid = VueCookie.get(config.cookie.useruid)
  //     }
  //     return {
  //       userid: state.userid,
  //       username: state.username,
  //       rol: state.rol,
  //       useruid: state.useruid
  //     }
  //   } catch (error) {}
  // }
}

const actions = {}

export default {
  state,
  getters,
  actions,
  mutations
}
