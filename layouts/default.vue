<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" :mini-variant="miniVariant" :clipped="clipped" fixed app>
      <v-list>
        <v-list-item v-for="(item, i) in items" :key="i" :to="item.to" router exact>
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" fixed app >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-btn icon @click.stop="miniVariant = !miniVariant">
          <v-icon>keyboard_arrow_right</v-icon>
        </v-btn>
      <strong>Rúbrica de Evaluación</strong>
      <v-spacer></v-spacer>
      <a href="/home" class="pt-1"></a>
      <img src="@/static/img/company_logo.png" width="130" href="/home/" />
      <v-spacer></v-spacer>
      <v-menu>
        <template v-slot:activator="{ on }">
          <v-btn text class="text-capitalize" color="primary" dark v-on="on">
            {{user.nombre}} <v-icon>expand_more</v-icon></v-btn>
        </template>
        <v-list>
          <v-list-item @click="Perfil()">
            <v-list-item-title>Perfil</v-list-item-title>
          </v-list-item>
          <v-list-item @click="close()">
            <v-list-item-title>Salir</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
    <v-footer :fixed="fixed" class="font-weight-medium">
      <v-col class="text-center" cols="12">
        <span>LuisFelipeG - JuanesQuintero - KevinOspina - SebasRamirez</span>
      </v-col>
    </v-footer>
  </v-app>
</template>

<script>
import config from '@/assets/js/config'

export default {
  data() {
    return {
      user: '',
      config: config,
      clipped: true,
      drawer: true,
      fixed: false,
      items:[],
      principales: config.menuLateral,
      miniVariant: false,
      right: true,
      rightDrawer: false
    }
  },
  beforeMount() {
    this.loadData()
  },
  methods: {
    async loadData() {
      let user = this.$cookie.get(config.cookie.usuario)
      if (user) {
        this.user = this.$cookie.get(config.cookie.usuario)
        let usuario = await this.getUser(this.user)
        this.user= usuario.data
        this.items = Object.assign([],this.principales.filter(x=> x.rol.includes(this.user.tipo)))
      }
    },
    validUsuario() {},
    close() {
      this.$router.push('/')
    },
    perfil() {
      this.$router.push('/')
    },
    async getUser(correo) {
      let url = 'usuarios/' + correo
      let token = this.$cookie.get(config.cookie.token)
      var options = {
        headers: { token: token }
      }
      this.loading = true
      let response = await this.$axios.get(url, options)
      this.loading = false
      return response
    }
  }
}
</script>


<style>
</style>
