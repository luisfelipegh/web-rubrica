<template>
  <v-app id="inspire">
    <v-content>
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
                color="primary"
                dark
              >
              <v-spacer></v-spacer>
                  <h3>
                  Rúbrica de Evaluación
                  </h3>
                  <v-spacer></v-spacer>
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field
                    label="Correo"
                    name="login"
                    prepend-icon="person"
                    type="text"
                  ></v-text-field>
                  <v-text-field
                    label="Contraseña"
                    name="password"
                    prepend-icon="lock"
                    type="password"
                  ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" rounded>Ingresar</v-btn>
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

export default {
  layout:'blank',
  components: {
  },
  beforeMount() {},
  data(){
    return{
    currentData: {},
    loading: false,
    message: '',
    user: {},
    useruid: ''
    }
  },
  methods: {
    /**
     * Inicializa un documento de cases
     */
    async getUser(user) {
      let url = config.api.url + 'catalog/acl_users/' + user
      let response = await this.$axios.get(url, this.getOptions())
      let result = response.data
      return Object.assign({}, result.info[0].doc)
    },
    login() {
     
    }
  }
}
</script>
<style>

</style>
