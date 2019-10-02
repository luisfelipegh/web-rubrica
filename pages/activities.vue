<template>
  <div>
    <loading :dialog="loading"></loading>
    <!-- Dialogo de informcacio (NMensajes al usuario) -->
    <v-dialog v-model="dialogInfo" persistent max-width="290">
      <v-card>
        <v-card-title class="headline">Mensaje</v-card-title>
        <v-card-text>{{ messageInfo }}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            class="text-capitalize"
            color="primary"
            rounded
            @click.native="dialogInfo = false"
          >OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Dialogo Crear -->
    <v-dialog persistent v-model="dialogCreate" max-width="600">
      <v-card>
        <v-card-title class="headline">{{editing?'Editar Actividad':'Crear Actividad'}}</v-card-title>
        <div>
          <v-form v-model="valid" ref="formData" lazy-validation>
            <v-row class="px-5">
              <v-col cols="12" sm="6" md="6">
                <v-text-field
                  required
                  v-model="currentData.profesor"
                  label="Profesor"
                  name="Profesor"
                  :rules="[rules.required, rules.email]"
                  type="text"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <v-text-field
                  required
                  :rules="nameRules"
                  v-model="currentData.nombre"
                  label="Nombre"
                  type="text"
                ></v-text-field>
              </v-col>
               <v-col cols="12" sm="6" md="6">
                <v-autocomplete
                 :loading="loading"
                  label="Selecciona la rúbrica"
                  v-model="currentData.rubrica"
                  :items="rubricas"
                  no-data-text="Escribe para buscar"
                  clearable
                  required
                  :rules="nameRules"
                  hide-selected
                  return-object
                  item-text="label"
                >
                  <template v-slot:no-data>
                    <span>No se encontraron plantillas</span>
                  </template>
                </v-autocomplete>
              </v-col>
            </v-row>
          </v-form>
        </div>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn class="text-capitalize" outlined color="primary" rounded @click="cancelCreate()">
            <v-icon right>cancel</v-icon>Cancelar
          </v-btn>
          <v-btn class="text-capitalize" color="primary" rounded @click="create()">
            <v-icon right>save</v-icon>
            {{editing?'Guardar':'Crear'}}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- DIALOGO ELIMINAR -->
    <v-dialog v-model="dialogDelete" persistent max-width="290">
      <v-card>
        <v-card-title class="headline">¿Desea eliminar el dato seleccionado?</v-card-title>
        <v-card-text>Al eliminar no se podrá recuperar posteriormente.</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="text-capitalize" @click.native="dialogDelete = false" rounded>No</v-btn>
          <v-btn class="text-capitalize" color="primary" rounded @click.native="confirmDelete()">Sí</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- LISTA -->
    <v-layout row justify-center wrap>
      <v-flex xs12>
        <v-card>
          <v-card-title>
            Creación de actividades
            <v-spacer></v-spacer>
            <v-btn
              class="text-capitalize"
              color="primary"
              rounded
              @click.stop="dialogCreateOpen()"
            >Crear Actividad</v-btn>
          </v-card-title>
          <v-card-text>
            <v-data-table :headers="headers" :items="items">
              <template v-slot:item.action="{ item }">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn icon v-on="on">
                      <v-icon small class="pr-2" @click="editItem(item)">edit</v-icon>
                    </v-btn>
                  </template>
                  <span>Editar Actividad</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn icon v-on="on">
                      <v-icon small class="pr-2" @click="deleteItem(item)">delete</v-icon>
                    </v-btn>
                  </template>
                  <span>Eliminar Actividad</span>
                </v-tooltip>
              </template>
              <template slot="no-data">No se encontraron actividades</template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import config from '@/assets/js/config'
import loading from '@/components/loading'
export default {
  components: { loading },
  data() {
    return {
      nameRules: [v => !!v || 'Campo requerido'],
      valid: true,
      messageInfo: '',
      dialogInfo: false,
      config: config,
      dialogDelete: false,
      headers: [
        { text: 'Codigo', value: 'codigo' },
        { text: 'Nombre', value: 'nombre' },
        { text: 'Profesor', value: 'profesor' },
        { text: 'Acciones', value: 'action', sortable: false }
      ],
      items: [],
      currentData: {},
      loading: false,
      toDelete: undefined,
      toPreview: undefined,
      dialogCreate: false,
      dialogPost: false,
      editing: true,
      rules: {
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Correo Inválido'
        }
      }
    }
  },
  beforeMount() {
    this.currentData.profesor = this.$cookie.get(config.cookie.usuario)
    this.loadData()
  },
  methods: {
    dialogCreateOpen() {
      this.currentData = {}
      this.editing = false
      this.currentData.profesor = this.$cookie.get(config.cookie.usuario)
      this.dialogCreate = true
    },
    editItem(item) {
      this.currentData = Object.assign({}, item)
      this.dialogCreate = true
      this.editing = true
    },
    saveData(data) {
      let url = 'actividades/'
      let token = this.$cookie.get(config.cookie.token)
      var options = {
        headers: { token: token }
      }
      this.loading = true
      if (this.editing) {
        url += data.id
        console.log(data)
        this.$axios
          .put(url, data, options)
          .then(async res => {
            let data = res
            if (data.status == 200) {
              this.dialogCreate = false
              this.typeMessage = 'info'
              this.messageInfo = 'Se guardo correctamente'
              this.currentData = {}
              this.dialogInfo = true
              this.loadData()
            }
          })
          .catch(err => {
            this.typeMessage = 'error'
            this.messageInfo = 'Hubo un error al guardar'
          })
          .finally(() => {
            this.loading = false
          })
        this.loading = false
      } else {
        
        this.$axios
          .post(url, data, options)
          .then(async res => {
            let data = res
            if (data.status == 200) {
              this.dialogCreate = false
              this.typeMessage = 'info'
              this.messageInfo = 'Se guardo correctamente'
              this.currentData = {}
              this.dialogInfo = true
              this.editing = false
              this.loadData()
            }
          })
          .catch(err => {
            this.typeMessage = 'error'
            this.messageInfo = 'Hubo un error al guardar'
          })
          .finally(() => {
            this.loading = false
          })
        this.loading = false
      }
    },
    create() {
      if (this.$refs.formData.validate()) {
        this.saveData(this.currentData)
      } else {
        this.messageInfo = 'Error por favor revisa los campos'
        this.dialogInfo = true
        this.typeMessage = 'error'
      }
    },
    cancelCreate() {
      this.dialogCreate = false
    },
    deleteItem(item) {
      this.dialogDelete = true
      this.toDelete = item
    },
    confirmDelete() {
      let url = 'actividades/' + this.toDelete.id
      let token = this.$cookie.get(config.cookie.token)
      var options = {
        headers: { token: token }
      }
      this.loading = true
      this.$axios
        .delete(url, options)
        .then(async res => {
          let data = res
          if (data.status == 200) {
            this.dialogDelete = false
            this.dialogInfo = true
            this.messageInfo = 'Eliminado Correctamente'
            this.loadData()
          }
        })
        .catch(err => {
          this.dialogDelete = false
          this.dialogInfo = true
          this.messageInfo =
            'Verifica que el la actividad no se haya calificado'
        })
        .finally(() => {
          this.loading = false
        })
      this.loading = false
    },
    async loadData() {
      this.getRubricas()
      let data = await this.getAllData()
      if (data.status == 200 && Array.isArray(data.data)){
        this.items = data.data
      }else {
          this.items = []
      }
    },
    async getAllData() {
      let url = 'actividades/'
      let token = this.$cookie.get(config.cookie.token)
      var options = {
        headers: { token: token }
      }
      this.loading = true
      let response = await this.$axios.get(url, options)
      this.loading = false
      return response
    },
    /**
     * Obtener las plantillas personalizadas
     */
    async getRubricas() {
      let url = 'rubricas/tipo/PERSONALIZADA'
      let token = this.$cookie.get(config.cookie.token)
      var options = {
        headers: { token: token }
      }
      this.loading = true
      let response = await this.$axios.get(url, options)
      this.loading = false
      if (response.status == 200) {
        this.rubricas = response.data
      }
    },
  }
}
</script>
