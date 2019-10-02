<template>
  <div>
    <loading :dialog="loading"></loading>

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
    <v-dialog persistent v-model="dialogCreate" max-width="800">
      <v-card>
        <v-card-title
          class="headline"
        >Calificar </v-card-title>
        <div v-if="currentData!=undefined">
          <v-form v-model="valid" ref="formData" lazy-validation>
            <v-row class="px-5">
              <v-col cols="12" sm="6" md="6">
                <v-text-field
                  required
                  v-model="currentData.grupo.nombre"
                  label="Grupo"
                  name="Grupo"
                  disabled
                  type="text"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="6">
                Calificar:
                <v-radio-group @change="changeType" v-model="currentData.type" row>
                  <v-radio label="Estudiante" value="estudiante"></v-radio>
                  <v-radio label="Equipo" value="equipo"></v-radio>
                </v-radio-group>
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <v-autocomplete
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
               <v-col cols="12" sm="6" md="6">
                <v-autocomplete
                  label="Selecciona el calificado"
                  v-model="currentData.calificado"
                  :items="aseleccionaracalificar"
                  no-data-text="Escribe para buscar"
                  clearable
                  required
                  :rules="nameRules"
                  hide-selected
                  return-object
                  item-text="nombre"
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
            Calificaciones {{selectedGroup ? 'de ' + selectedGroup.nombre:''}}
            <v-spacer></v-spacer>
            <v-btn
              class="text-capitalize"
              v-if="selectedGroup!=undefined"
              color="primary"
              rounded
              @click.stop="dialogCreateOpen()"
            >Realizar Calificación</v-btn>
          </v-card-title>
          <v-card-text>
            <v-autocomplete
              label="Selecciona un grupo"
              v-model="selectedGroup"
              :items="grupos"
              return-object
              item-text="nombre"
              @change="findGrades"
            ></v-autocomplete>
            <div v-if="selectedGroup!=undefined">
              <v-data-table :loading="loading" :headers="headers" :items="items">
                <template v-slot:item.action="{ item }">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn icon v-on="on">
                        <v-icon small class="pr-2">remove_red_eye</v-icon>
                      </v-btn>
                    </template>
                    <span>Ver Calificación</span>
                  </v-tooltip>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn icon v-on="on">
                        <v-icon small @click="deleteItem(item)">delete</v-icon>
                      </v-btn>
                    </template>
                    <span>Eliminar Calificación</span>
                  </v-tooltip>
                </template>
                <template slot="no-data">No se encontraron calificaciones</template>
              </v-data-table>
            </div>
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
      path: 'equipos/',
      grupos: [],
      rubricas: [],
      aseleccionaracalificar:[],
      messageInfo: '',
      dialogInfo: false,
      config: config,
      dialogDelete: false,
      headers: [
        { text: 'Codigo', value: 'codigo' },
        { text: 'Nombre', value: 'nombre' },
        { text: 'Acciones', value: 'action', sortable: false }
      ],
      items: [],
      selectedGroup: undefined,
      selectedTeam: undefined,
      currentData: { grupo: {} },
      loading: false,
      toDelete: undefined,
      dialogCreate: false,
      editing: true,
      toUpload: {}
    }
  },
  beforeMount() {
    this.currentData.profesor = this.$cookie.get(config.cookie.usuario)
    this.loadData()
  },
  methods: {
    changeType(data) {
      if (data == 'estudiante') {
        this.findStudents()
      }
      if (data == 'equipo') {
        this.findTeams()
      }
    },
    async findGrades() {
      this.items = []
      let data = await this.getAllData(this.selectedGroup)
      if (data.status && Array.isArray(data.data)) {
        this.items = data.data
      }
    },
    async dialogCreateOpen() {
      this.currentData.grupo = Object.assign({}, this.selectedGroup)
      this.currentData.nombre = ''
      this.editing = false
      this.dialogCreate = true
    },
    editItem(item) {
      this.currentData = Object.assign({}, item)
      this.dialogCreate = true
      this.editing = true
    },
    saveData(data) {
      let url = 'equipos/'
      let token = this.$cookie.get(config.cookie.token)
      var options = {
        headers: { token: token }
      }
      this.loading = true
      if (this.editing) {
        url += data.grupo + '/' + data.codigo
        this.$axios
          .put(url, data, options)
          .then(async res => {
            let data = res
            if (data.status == 200) {
              this.dialogCreate = false
              this.typeMessage = 'info'
              this.messageInfo = 'Se guardo correctamente'
              this.currentData = { grupo: {} }
              this.dialogInfo = true
              this.findTeams()
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
        let dataNew = {
          grupo: data.grupo.codigo,
          nombre: data.nombre
        }
        this.$axios
          .post(url, dataNew, options)
          .then(async res => {
            let data = res
            if (data.status == 200) {
              this.dialogCreate = false
              this.typeMessage = 'info'
              this.messageInfo = 'Se guardo correctamente'
              this.currentData = { grupo: {} }
              this.dialogInfo = true
              this.editing = false
              this.findTeams()
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
      let url = `${this.path}${this.toDelete.grupo}/${this.toDelete.codigo}`
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
            this.findTeams()
          }
        })
        .catch(err => {
          this.dialogDelete = false
          this.dialogInfo = true
          this.messageInfo = 'Verifica que no hayan estudiantes en el equipo'
        })
        .finally(() => {
          this.loading = false
        })
      this.loading = false
    },
    /**
     * Cargar info necesaria
     */
    async loadData() {
      this.getRubricas()
      let data1 = await this.getAllDataGrupos()
      if (data1.status == 200) {
        for (let index = 0; index < data1.data.length; index++) {
          const element = data1.data[index]
        }
        this.grupos = data1.data
      }
    },
    /**
     * Obtener calificaciones del grupo
     */
    async getAllData(team) {
      let url = `${this.path}xgrupo/${team.codigo}`
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
     * Combo box de seleccionar grupos
     */
    async getAllDataGrupos() {
      let url = 'grupos/'
      if (this.$cookie.get(config.cookie.tipo) == 'PROFESOR') {
        url += 'profesor/' + this.$cookie.get(config.cookie.usuario)
      }
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
     async findStudents() {
      let url = `grupos/estudiantes/${this.selectedGroup.codigo}/${this.selectedGroup.semestre}`
      let token = this.$cookie.get(config.cookie.token)
      var options = {
        headers: { token: token }
      }
      this.loading = true
      let response = await this.$axios.get(url, options)
      this.loading = false
      if (response.status == 200 && Array.isArray(response.data)) {
        this.aseleccionaracalificar = response.data
      }
    },
     async findTeams() {
      let url = `${this.path}xgrupo/${this.selectedGroup.codigo}`
      let token = this.$cookie.get(config.cookie.token)
      var options = {
        headers: { token: token }
      }
      this.loading = true
      let data = await this.$axios.get(url, options)
      this.loading = false
      if (data.status && Array.isArray(data.data)) {
        this.aseleccionaracalificar = data.data
      }
    },
  }
}
</script>
