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
        <v-card-title class="headline">{{editing?'Editando ': 'Creando '}} Calificación</v-card-title>
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
                <v-autocomplete
                  :loading="loading"
                  label="Selecciona la actividad"
                  v-model="currentData.actividad"
                  :items="aseleccionaractividades"
                  no-data-text="Escribe para buscar"
                  clearable
                  required
                  :rules="nameRules"
                  hide-selected
                  return-object
                  item-text="nombre"
                >
                  <template v-slot:no-data>
                    <span>No se encontraron actividades</span>
                  </template>
                </v-autocomplete>
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
                  :loading="loading"
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
                    <span>No se encontraron {{currentData.type=='estudiante'? 'estudiantes':currentData.type=='equipo'? 'equipos':'items'}}</span>
                  </template>
                </v-autocomplete>
              </v-col>
              <v-col cols="12" sm="6" md="6" v-if="currentData.calificacion">
                <v-text-field
                  label="Calificacion"
                  name="calificacion"
                  disabled
                  v-model="currentData.calificacion.totalNota"
                  type="number"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row class="px-5">
              <v-spacer></v-spacer>
              <grade
                @save-dialog="recibirCalificacion"
                v-if="currentData.calificado!=undefined&&currentData.actividad!=undefined"
                :base="currentData"
              ></grade>
              <v-spacer></v-spacer>
            </v-row>
          </v-form>
        </div>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn class="text-capitalize" outlined color="primary" rounded @click="cancelCreate()">
            <v-icon right>cancel</v-icon>Cancelar
          </v-btn>
          <v-btn
            :disabled="currentData.calificacion==undefined"
            class="text-capitalize"
            color="primary"
            rounded
            @click="create()"
          >
            <v-icon right>save</v-icon>
            {{editing?'Guardar Calificacion ':'Crear Calificacion'}}
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
              :loading="loading"
              return-object
              item-text="nombre"
              @change="findGrades"
            ></v-autocomplete>
            <div v-if="selectedGroup!=undefined">
              <v-data-table :loading="loading" :headers="headers" :items="items">
                <template v-slot:item.action="{ item }">
                  <gradeView :base="item" />
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn icon v-on="on">
                        <v-icon small @click="editItem(item)">edit</v-icon>
                      </v-btn>
                    </template>
                    <span>Editar Calificación</span>
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
import grade from '@/components/gradeBasePersonalized'
import gradeView from '@/components/grade'

export default {
  components: { loading, grade, gradeView },
  data() {
    return {
      nameRules: [v => !!v || 'Campo requerido'],
      valid: true,
      path: 'calificaciones/',
      grupos: [],
      aseleccionaracalificar: [],
      messageInfo: '',
      dialogInfo: false,
      config: config,
      dialogDelete: false,
      headers: [
        { text: 'Fecha', value: 'fecha' },
        { text: 'Tipo', value: 'tipo' },
        { text: 'Nombre', value: 'nombre' },
        { text: 'Actividad', value: 'actividad' },
        { text: 'Nota', value: 'nota' },
        { text: 'Acciones', value: 'action', sortable: false }
      ],
      items: [],
      aseleccionaractividades: [],
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
    recibirCalificacion(data) {
      this.currentData.calificacion = Object.assign({}, data)
      this.$forceUpdate()
    },
    changeType(data) {
      this.currentData.calificacion = undefined
      if (data == 'estudiante') {
        this.currentData.calificado = undefined
        this.findStudents()
      }
      if (data == 'equipo') {
        this.currentData.calificado = undefined
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
      this.findActivities()
      this.currentData.grupo = Object.assign({}, this.selectedGroup)
      this.currentData.nombre = ''
      this.editing = false
      this.dialogCreate = true
    },
    editItem(item) {
      this.findActivities()
      this.changeType(item.rubrica.type)
      this.currentData = Object.assign({}, item.rubrica)
      this.currentData.id = item.id
      this.$forceUpdate()
      this.dialogCreate = true
      this.editing = true
    },
    saveData(data) {
      let url = 'calificaciones/'
      let token = this.$cookie.get(config.cookie.token)
      var options = {
        headers: { token: token }
      }
      this.loading = true
      if (this.editing) {
        let dataNew = {
          actividad: data.actividad.id,
          tipo: data.type,
          grupo: this.selectedGroup.codigo,
          nota: parseFloat(data.calificacion.totalNota).toFixed(2),
          profesor: this.$cookie.get(config.cookie.usuario),
          rubrica: data
        }
        url += '/' + data.id
        this.$axios
          .put(url, dataNew, options)
          .then(async res => {
            let data = res
            if (data.status == 200) {
              this.dialogCreate = false
              this.typeMessage = 'info'
              this.messageInfo = 'Se guardo correctamente'
              this.currentData = { grupo: {} }
              this.dialogInfo = true
              this.findGrades()
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
          actividad: data.actividad.id,
          tipo: data.type,
          grupo: this.selectedGroup.codigo,
          nota: parseFloat(data.calificacion.totalNota).toFixed(2),
          profesor: this.$cookie.get(config.cookie.usuario),
          rubrica: data
        }

        if (data.type == 'equipo') {
          dataNew.calificado = data.calificado.codigo
        } else {
          dataNew.calificado = data.calificado.correo
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
              this.findGrades()
            }
          })
          .catch(err => {
            this.typeMessage = 'error'
            this.messageInfo = 'Hubo un error al guardar'
            this.dialogInfo = true
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
      this.currentData = { grupo: {} }
      this.dialogCreate = false
    },
    deleteItem(item) {
      this.dialogDelete = true
      this.toDelete = item
    },
    confirmDelete() {
      let url = `${this.path}${this.toDelete.id}`
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
            this.findGrades()
          }
        })
        .catch(err => {
          this.dialogDelete = false
          this.dialogInfo = true
          this.messageInfo = 'Hubo un error eliminando'
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
      let url = `${this.path}grupo/${team.codigo}`
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
      if (this.$cookie.get(config.cookie.tipo) != 'ADMINISTRADOR') {
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
      let url = `equipos/xgrupo/${this.selectedGroup.codigo}`
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
    async findActivities() {
      let rol = this.$cookie.get(config.cookie.tipo)
      let url = '/actividades'
      if (rol != 'ADMINISTRADOR') {
        url += '/creador/' + this.$cookie.get(config.cookie.usuario)
      }
      let token = this.$cookie.get(config.cookie.token)
      var options = {
        headers: { token: token }
      }
      this.loading = true
      let response = await this.$axios.get(url, options)
      this.loading = false
      if (response.status == 200 && Array.isArray(response.data)) {
        this.aseleccionaractividades = response.data
      }
    }
  }
}
</script>
