<template>
  <div>
    <v-dialog persistent v-model="previewR" v-if="toPreview!=undefined">
      <v-card>
        <v-card-title class="headline">Previsualización de la rúbrica</v-card-title>
        <v-simple-table dense>
          <thead>
            <tr>
              <th class="text-left">Nivel</th>
              <th class="text-left">Categoria</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item,index) in toPreview.json.levels" :key="item.name">
              <td v-if="item.categories.length!=0">{{index+1}} - {{ item.name }}</td>
              <td>
                <v-simple-table dense>
                  <tbody>
                    <tr v-for="(item2,index) in item.categories" :key="item2.name">
                      <td>{{index+1}} -{{ item2.category }}</td>
                      <v-simple-table dense>
                        <tbody>
                          <tr v-for="(item3,index) in item2.skills" :key="item3.index">
                            <td>{{index+1}} -{{ item3.text }}</td>
                          </tr>
                        </tbody>
                      </v-simple-table>
                    </tr>
                  </tbody>
                </v-simple-table>
              </td>
            </tr>
          </tbody>
        </v-simple-table>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn color="primary" rounded @click="previewR = false; toPreview=undefined">Ok</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- DIALOGO ELIMINAR -->
    <v-dialog v-model="dialogDelete" persistent max-width="290">
      <v-card>
        <v-card-title class="headline"
          >¿Desea eliminar el dato seleccionado?</v-card-title
        >
        <v-card-text
          >Al eliminar no se podrá recuperar posteriormente.</v-card-text
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click.native="dialogDelete = false" rounded>No</v-btn>
          <v-btn color="primary" rounded @click.native="confirmDelete()"
            >Sí</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- LISTA -->
    <v-layout row justify-center wrap>
      <v-flex xs12>
        <v-card>
          <v-card-title>
            Plantillas de Rúbricas
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              rounded
              @click.stop="$router.push(config.routes.rubricBaseNew)"
              >Crear Rúbrica</v-btn
            >
          </v-card-title>
          <v-card-text>
            <v-data-table :headers="headers" :items="items">
              <template slot="items" slot-scope="props">
                <tr>
                  <td>{{ props.item.nombre }}</td>
                  <td>{{ props.item.semestre }}</td>
                  <td>{{ props.item.usuario_creacion }}</td>
                
                    
                    
                </tr>
              </template>
              <template v-slot:item.action="{ item }">
                <!-- <preview-base :base="item" /> -->
                <v-icon small class="pr-2" @click="preview(item)"
                      >remove_red_eye</v-icon
                    >
                <v-icon small @click="deleteItem(item)">
                  delete
                </v-icon>
              </template>
              <template slot="no-data"
                >No se encontraron Rúbricas</template
              >
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import config from '@/assets/js/config'

export default {
  data() {
    return {

      dialogView:false,
      messageInfo: '',
      dialogInfo: false,
      config: config,
      dialogDelete: false,
      headers: [
        { text: 'Nombre', value: 'nombre' },
        { text: 'Semetre', value: 'semestre' },
        { text: 'Usuario', value: 'json.usuario_creacion' },
        { text: 'Acciones', value: 'action', sortable: false }
      ],
      items: [],
      loading: false,
      toDelete: undefined,
      toPreview:undefined,
      previewR :false
    }
  },
  beforeMount() {
    this.loadData()
  },
  methods: {
    preview(item){
      this.toPreview =item 
this.previewR=true
    },
    deleteItem(item) {
      this.dialogDelete = true
      this.toDelete = item
    },
    confirmDelete() {
      let url = 'rubricas/' + this.toDelete.id
      let token = this.$cookie.get(config.cookie.token)
      var options = {
        headers: { Authorization: 'Bearer ' + token }
      }
      console.log(options)
      this.loading = true
      this.$axios
        .delete(url, {}, options)
        .then(async res => {
          let data = res
          this.dialogDelete = false
          this.loadData()
        })
        .catch(err => {
          this.dialogDelete = false
          this.dialogInfo = true
          this.messageInfo = 'Error al eliminar'
          console.log(err)
        })
        .finally(() => {
          this.loading = false
        })
      this.loading = false
    },
    async loadData() {
      let data = await this.getAllData()
      if (data.status == 200) {
        this.items = data.data
        console.log(data)
      }
    },
    async getAllData() {
      let url = 'rubricas/'
      let token = this.$cookie.get(config.cookie.token)
      var options = {
        headers: { Authorization: 'Bearer ' + token }
      }
      console.log(options)
      this.loading = true
      let response = await this.$axios.get(url, options)
      this.loading = false
      return response
    }
  }
}
</script>
