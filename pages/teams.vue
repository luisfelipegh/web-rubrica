<template>
  <div>
    <v-dialog v-model="dialogInfo" persistent max-width="290">
      <v-card>
        <v-card-title class="headline">Mensaje</v-card-title>
        <v-card-text>{{ messageInfo }}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" rounded @click.native="dialogInfo = false">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog persistent v-model="dialogCreate" max-width="600">
      <v-card>
        <v-card-title class="headline">{{editing?'Editar equipo':'Crear equipo'}} {{selectedGroup?selectedGroup.nombre:''}}</v-card-title>
        <div v-if="currentData!=undefined">
          <v-form v-model="valid" ref="formData" lazy-validation >
            <v-row class="px-5">
              <v-col cols="12" sm="6" md="6" >
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
                <v-text-field
                  :rules="nameRules"
                  required
                  v-model="currentData.nombre"
                  label="Nombre"
                  type="text"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row class="px-5">
            <!-- <v-col cols="12" sm="6" md="6">
              <v-autocomplete
              label="Selecciona los estudiantes"
              v-model="currentData.estudiantes"
              :items="estudiantes"
              multiple
              no-data-text="Escribe para buscar "
              chips
              clearable
              hide-selected
              return-object
              item-text="nombre"
            >
             <template v-slot:no-data>
                <span>No se encontraron estudiantes</span>
              </template>
              </v-autocomplete>
             </v-col> -->
            </v-row>
          </v-form>
        </div>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn color="primary" rounded @click="create()">
            <v-icon right>save</v-icon>
            {{editing?'Guardar':'Crear'}}
          </v-btn>
          <v-btn color="primary" rounded @click="cancelCreate()">
            <v-icon right>cancel</v-icon>Cancelar
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
          <v-btn @click.native="dialogDelete = false" rounded>No</v-btn>
          <v-btn color="primary" rounded @click.native="confirmDelete()">Sí</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- LISTA -->
    <v-layout row justify-center wrap>
      <v-flex xs12>
        <v-card>
          <v-card-title>
            Creación de equipos {{selectedGroup?selectedGroup.nombre:''}}
            <v-spacer></v-spacer>
            <v-btn  v-if="selectedGroup!=undefined" color="primary" rounded @click.stop="dialogCreateOpen()">Crear Equipo</v-btn>
          </v-card-title>
          <v-card-text>
             <v-autocomplete
              label="Selecciona un grupo"
              v-model="selectedGroup"
              :items="grupos"
              return-object
              item-text="nombre"
              @Change="findTeams"
            ></v-autocomplete>
            <div v-if="selectedGroup!=undefined">
            <v-data-table :headers="headers" :items="items">
              <template slot="items" slot-scope="props">
                <tr>
                  <td>{{ props.item.nombre }}</td>
                  <td>{{ props.item.nombre }}</td>
                  <td>{{ props.item.semestre }}</td>
                  <td>{{ props.item.semestre }}</td>
                </tr>
              </template>
              <template v-slot:item.action="{ item }">
                <v-icon small class="pr-2" @click="editItem(item)">edit</v-icon>
                <v-icon small @click="deleteItem(item)">delete</v-icon>
              </template>
              <template slot="no-data">No se encontraron equipos</template>
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
export default {
  components:{
  },
  data() {
    return {
      nameRules: [v => !!v || 'Campo requerido'],
      valid: true,
      dialogView: false,
      path:'equipos/',
      grupos:[],
      messageInfo: '',
      dialogInfo: false,
      config: config,
      dialogDelete: false,
      headers: [
        { text: 'Codigo', value: 'codigo' },
        { text: 'Nombre', value: 'nombre' },
        { text: 'Semetre', value: 'semestre' },
        { text: 'Profesor', value: 'profesor' },
        { text: 'Acciones', value: 'action', sortable: false }
      ],
      items: [],
      selectedGroup:undefined,
      currentData: {grupo:{}},
      loading: false,
      toDelete: undefined,
      toPreview: undefined,
      dialogCreate: false,
      dialogPost:false,
      editing: true,
      fileToImport:undefined,
      toUpload:{},
      estudiantes:[],
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
    removeEst (item) {
        const index = this.currentData.estudiantes.indexOf(item.name)
        if (index >= 0) this.currentData.estudiantes.splice(index, 1)
      },
    async findTeams(){
      this.items =[]
      let data = await this.getAllData(this.selectedGroup)
      if (data.status == 200 && Array.isArray(data.data)) {
        this.items = data.data
      }
    },
    cancelArchivo(){
      this.dialogPost=false;
      this.toUpload={}
    },
    async dialogCreateOpen() {
      let dataest = await this.getAllEstudiantes(this.selectedGroup.codigo,this.selectedGroup.semestre)
      if (dataest.status == 200 && Array.isArray(dataest.data)) {
        this.estudiantes = dataest.data
      }
      this.currentData.grupo = Object.assign({},this.selectedGroup)
      this.editing = false
      this.dialogCreate = true
    },
    editItem(item) {
      this.currentData = Object.assign({}, item)
      this.dialogCreate = true
      this.editing = true
    },
    saveData(data) {
      console.log(data);
      
      // let url = 'equipos/'
      // let token = this.$cookie.get(config.cookie.token)
      // var options = {
      //   headers: { token: token }
      // }
      // this.loading = true
      // if (this.editing) {
      //   url += data.id
      //   console.log(data)
      //   this.$axios
      //     .put(url, data, options)
      //     .then(async res => {
      //       let data = res
      //       if (data.status == 200) {
      //         this.dialogCreate = false
      //         this.typeMessage = 'info'
      //         this.messageInfo = 'Se guardo correctamente'
      //         this.currentData = {}
      //         this.dialogInfo = true
      //         this.loadData()
      //       }
      //     })
      //     .catch(err => {
      //       this.typeMessage = 'error'
      //       this.messageInfo = 'Hubo un error al guardar'
      //     })
      //     .finally(() => {
      //       this.loading = false
      //     })
      //   this.loading = false
      // } else {
      //   this.$axios
      //     .post(url, data, options)
      //     .then(async res => {
      //       let data = res
      //       if (data.status == 200) {
      //         this.dialogCreate = false
      //         this.typeMessage = 'info'
      //         this.messageInfo = 'Se guardo correctamente'
      //         this.currentData = {}
      //         this.dialogInfo = true
      //         this.editing = false
      //         this.loadData()
      //       }
      //     })
      //     .catch(err => {
      //       this.typeMessage = 'error'
      //       this.messageInfo = 'Hubo un error al guardar'
      //     })
      //     .finally(() => {
      //       this.loading = false
      //     })
      //   this.loading = false
      // }
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
      let url = this.path + this.toDelete.id
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
          this.messageInfo = err
        })
        .finally(() => {
          this.loading = false
        })
      this.loading = false
    },
    async loadData() {
      let data1 = await this.getAllDataGrupos()
      if (data1.status == 200) {
        this.grupos = data1.data
      }
    },
     async getAllData(group) {

      let url = this.path
      let token = this.$cookie.get(config.cookie.token)
      var options = {
        headers: { token: token }
      }
      this.loading = true
      let response = await this.$axios.get(url, options)
      this.loading = false
      this.grupos = response.data.data
      return response
    },
    async getAllDataGrupos() {
      let url = 'grupos/'
      let token = this.$cookie.get(config.cookie.token)
      var options = {
        headers: { token: token }
      }
      this.loading = true
      let response = await this.$axios.get(url, options)
      this.loading = false
      return response
    },
    async getAllEstudiantes(id,semestre) {
      let url = `grupos/estudiantes/${id}/${semestre}`
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
