<template>
  <v-app id="inspire">
    <v-content>
      <loading :dialog="loading"></loading>
      <v-container
        class="fill-height"
        fluid
      >
        <v-row
          align="center"
          justify="center"
        >
          <v-col
            cols="12"
            sm="8"
            md="4"
          >
            <v-card class="elevation-12">
              <v-toolbar
                dark
              >
                  <h3>
                  Rúbrica de Evaluación
                  </h3>
                  <v-spacer></v-spacer>
                  <img src="@/static/img/company_logo.png" width="130" />
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field
                     v-model="currentData.email"
                    label="Correo"
                    name="login"
                    :rules="[rules.required, rules.email]"
                    prepend-icon="person"
                    type="text"
                  ></v-text-field>
                  <v-text-field
                     v-model="currentData.password"
                    label="Contraseña"
                    name="password"
                    prepend-icon="lock"
                    type="password"
                  ></v-text-field>
                </v-form>
              </v-card-text>
                 <v-progress-linear :v-if="loading" indeterminate color="white" class="mb-0"></v-progress-linear>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" rounded @click="login()" >Ingresar</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>
<script>
import loading from '@/components/loading.vue'
import config from '@/assets/js/config'
import routes from '@/assets/js/routes'
import { mapMutations } from 'vuex'
export default {
  layout:'blank',
  components: { loading
  },
  beforeMount() {},
  data(){
    return{
      config:config,
    currentData: {},
    loading: false,
    message: '',
    user: {},
    useruid: '',
    rules:{ email: value => {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return pattern.test(value) || 'Correo Inválido'
          }
        }
    }
  },
  methods: {
    login() {
     this.loading=true
     this.$router.push(routes.home)
    this.loading=false
     console.log(this.currentData);
    }
  }
}
</script>
<style>

</style>
