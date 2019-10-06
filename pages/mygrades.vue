
<template>
  <div>
    <v-layout row justify-center wrap>
      <v-flex xs12>
        <v-card>
          <v-card-title>
            Calificaciones {{selectedGroup ? 'de ' + selectedGroup.nombre:''}}
            <v-spacer></v-spacer>
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
import gradeView from '@/components/grade'

export default {
  components: { gradeView},

  data() {
    return {
        config:config,
        loading:false,
        items: [],
        selectedGroup: undefined,
        grupos:[],
        headers: [
        { text: 'Tipo', value: 'tipo' },
        { text: 'Nombre', value: 'equipo' },
        { text: 'Actividad', value: 'actividad' },
        { text: 'Acciones', value: 'action', sortable: false }
      ],
    }
  },
  beforeMount() {
    this.loadData()
  },
  methods:{
    /**
     * Cargar info necesaria
     */
    async loadData() {
      await this.getAllDataGrupos()
      
    },
    async findGrades() {
      this.items = []
      let data = await this.getAllData(this.selectedGroup)
      if (data.status && Array.isArray(data.data)) {
        this.items = data.data
      }
    },
    /**
     * Obtener calificaciones del grupo
     */
    async getAllData(team) {
      let url = `calificaciones/misCalificaciones/${this.$cookie.get(config.cookie.usuario)}/${team.codigo}/`
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
      let url = 'grupos/gruposxestudiante/' + this.$cookie.get(config.cookie.usuario)

      let token = this.$cookie.get(config.cookie.token)
      var options = {
        headers: { token: token }
      }
      this.loading = true
      let response = await this.$axios.get(url, options)
      this.loading = false
      if (response.status == 200 && Array.isArray(response.data)) {
        for (let index = 0; index < response.data.length; index++) {
          const element = response.data[index]
        }
        this.grupos = response.data
      }
    },
  },
  
}
</script>

