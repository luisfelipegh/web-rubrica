<template>
  <v-app >
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>

    </v-navigation-drawer>
    
    <v-app-bar
      :clipped-left="clipped"
      fixed
      app
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
     <strong>
                  Rúbrica de Evaluación
                  </strong>
                  <v-spacer></v-spacer>
                   <a href="/home" class="pt-1"></a>

           <img src="@/static/img/company_logo.png" width="130" href="/home/"/>
                  <v-spacer></v-spacer>

         <v-menu>
      <template v-slot:activator="{ on }">
        <v-btn
          color="primary"
          dark
          v-on="on"
        >
          {{user}}
        </v-btn>
      </template>
      <v-list>
       <v-list-item
         @click="Perfil()"
        >
          <v-list-item-title>Perfil</v-list-item-title>
        </v-list-item>
        <v-list-item
         @click="close()"
        >

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
  <v-footer
     :fixed="fixed"
      class="font-weight-medium"
    >
      <v-col
        class="text-center"
        cols="12"
      >
         <span>LuisFelipeG - JuanesQuintero - KevinOspina - SebasRamirez</span> 
      </v-col>
    </v-footer>
  </v-app>
</template>

<script>
import config from '@/assets/js/config'

export default {
  data () {
    return {
      user : '',
      config:config,
      clipped: true,
      drawer: false,
      fixed: false,
      items: config.menuLateral,
      miniVariant: false,
      right: true,
      rightDrawer: false,
    }
  },
  beforeMount(){
    let user = this.$cookie.get(config.cookie.usuario)
    if (user){
      this.user= this.$cookie.get(config.cookie.usuario)
    }
  },
  methods:{

    close(){
      this.$router.push('/')
    },
    perfil(){
      this.$router.push('/')
    }
  }
}
</script>


<style>

</style>
