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
            color="primary"
            class="text-capitalize"
            rounded
            @click.native="dialogInfo = false"
          >OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog persistent v-model="previewR" v-if="toPreview != undefined">
      <v-card>
        <v-card-title class="headline">Previsualización de la rúbrica
          <v-spacer/>
          <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn
            class="text-capitalize"
            color="primary"
            rounded
            @click="
              previewR = false
              toPreview = undefined
            "
          >Ok</v-btn>
        </v-card-actions>
        </v-card-title>
          
        <v-simple-table class="define">
          <thead>
            <tr>
              <th class="text-left test">Nivel</th>
              <th class="text-left test">Categoria</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item) in toPreview.json.levels" :key="item.name">
              <td class="level" v-if="item.categories.length != 0">
                <b>{{ item.name }}</b>
              </td>
              <td>
               <v-simple-table dense  class="defineCategories">
                  <tbody>
                    <tr v-for="(item2) in item.categories" :key="item2.name">
                      <td class="labelCatPerso">
                        <b>{{ item2.category }}</b>
                      </td>
                      <td class="defineCate">
                      <v-simple-table dense>
                        <tbody>
                        <tr class="defineSkills" v-for="(item3) in item2.skills" :key="item3.index">
                          <td class="labelSkillsPerso">{{ item3.text }}</td>
                        </tr>
                        </tbody>
                      </v-simple-table >
                      </td>
                    </tr>
                  </tbody>
                </v-simple-table>
              </td>
            </tr>
          </tbody>
        </v-simple-table>
      
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
            Plantillas de Rúbricas
            <v-spacer></v-spacer>
            <v-btn
              class="text-capitalize"
              color="primary"
              rounded
              @click.stop="$router.push(config.routes.rubricBaseNew)"
            >Crear Rúbrica</v-btn>
          </v-card-title>
          <v-card-text>
            <v-data-table :headers="headers" :items="items">
              <template v-slot:item.action="{ item }">
                <!-- <preview-base :base="item" /> -->
                <v-icon small class="pr-2" @click="preview(item)">remove_red_eye</v-icon>
                <v-icon small @click="deleteItem(item)">delete</v-icon>
              </template>
              <template slot="no-data">No se encontraron Rúbricas</template>
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
      dialogView: false,
      messageInfo: '',
      dialogInfo: false,
      config: config,
      dialogDelete: false,
      headers: [
        { text: 'Nombre', value: 'nombre' },
        { text: 'Usuario', value: 'nombre_creador' },
        { text: 'Acciones', value: 'action', sortable: false }
      ],
      items: [],
      loading: false,
      toDelete: undefined,
      toPreview: undefined,
      previewR: false
    }
  },
  beforeMount() {
    this.loadData()
  },
  methods: {
    preview(item) {
      this.toPreview = item
      this.previewR = true
    },
    deleteItem(item) {
      this.dialogDelete = true
      this.toDelete = item
    },
    confirmDelete() {
      let url = 'rubricas/' + this.toDelete.id
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
            this.messageInfo = data.data.info
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
      let data = await this.getAllData()
      if (data.status == 200) {
        this.items = data.data
      }
    },
    async getAllData() {
      let url = 'rubricas/tipo/BASE'
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
.level {
  width: 150px;
}
.labelCat {
  width: 200px;
}
</style>
