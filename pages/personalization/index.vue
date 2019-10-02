
<template>
  <div>
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
    <loading :dialog="loading"/>
    <v-dialog persistent v-model="previewR" v-if="toPreview != undefined" max-width="1200">
      <v-card>
        <v-card-title class="headline">Previsualización de la rúbrica
          <v-spacer></v-spacer>
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
        <v-simple-table dense lass="define">
          <thead>
            <tr>
              <th class="text-left test">Nivel</th>
              <th class="text-left test">Categoria</th>
              <th class="text-left test">Total nivel</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item) in toPreview.json.levels" :key="item.name">
              <td class="levelPerso" v-if="item.categories.length != 0">
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
                          <td class="text-right labelSkillsPersoPerso">{{ item3.porcentaje }} %</td>
                        </tr>
                        </tbody>
                      </v-simple-table >
                      </td>
                      <td class="text-right labelCatPersoPerso">
                        <b>{{item2.totalCategory}}%</b>
                      </td>
                    </tr>
                  </tbody>
                </v-simple-table>
              </td>
              <td class="text-right labelLevelPersoPerso">
              <b>{{item.totalNivel}}%</b>
              </td>
            </tr>
            <tr>
              <td></td>
              <td class="text-right">Total</td>
              <td class="text-right"><b>{{toPreview.json.totalPorcentaje}} %</b></td>
            </tr>
          </tbody>
        </v-simple-table>
       
      </v-card>
    </v-dialog>
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
    <v-dialog persistent v-model="dialogCreate" max-width="600">
      <v-card>
        <v-card-title class="headline">Selección de plantilla</v-card-title>
        <div v-if="currentData!=undefined">
          <v-form v-model="valid" ref="formData" lazy-validation>
            <v-row class="px-5">
              <v-col cols="12" sm="12">
                <v-autocomplete
                  label="Selecciona la plantilla"
                  v-model="currentData.toCreate"
                  :items="bases"
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
          <v-btn outlined color="primary" class="text-capitalize" rounded @click="cancelCreate()">
            <v-icon right>cancel</v-icon>Cancelar
          </v-btn>
          <v-btn color="primary" class="text-capitalize" rounded @click="toCreate()">
            <v-icon right>save</v-icon>Personalizar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- LISTA -->
    <v-layout row justify-center wrap>
      <v-flex xs12>
        <v-card>
          <v-card-title>
            Rúbricas Personalizadas
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              class="text-capitalize"
              rounded
              @click.stop="openDialogCreate()"
            >Personalizar Rúbrica</v-btn>
          </v-card-title>
          <v-card-text>
            <v-data-table :loading="loading" :headers="headers" :items="items">
              <template v-slot:item.action="{ item }">
                 <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn icon v-on="on">
                <v-icon small class="pr-2" @click="preview(item)">remove_red_eye</v-icon>
                    </v-btn>
                  </template>
                  <span>Ver Rúbrica</span>
                </v-tooltip>
                 <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn icon v-on="on">
                     <v-icon small class="pr-2" @click="edit(item)">edit</v-icon>
                    </v-btn>
                  </template>
                  <span>Editar Rubrica</span>
                </v-tooltip>
                 <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn icon v-on="on">
                <v-icon small @click="deleteItem(item)">delete</v-icon>
                    </v-btn>
                  </template>
                  <span>Eliminar Grupo</span>
                </v-tooltip>
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
  components:{loading},
  data() {
    return {
      nameRules: [v => !!v || 'Campo requerido'],
      valid: true,
      currentData: {},
      messageInfo: '',
      dialogInfo: false,
      headers: [
        { text: 'Nombre', value: 'nombre' },
        { text: 'Usuario', value: 'nombre_creador' },
        { text: 'Acciones', value: 'action', sortable: false }
      ],
      items: [],
      bases: [],
      loading: false,
      dialogCreate: false,
      toPreview: undefined,
      previewR: false,
      dialogDelete: false
    }
  },
  beforeMount() {
    this.loadData()
    this.getAllDataPlantillas()
  },
  methods: {
    deleteItem(item) {
      this.dialogDelete = true
      this.toDelete = item
    },
    edit(item){
      this.$cookie.set(
          config.cookie.editRubric,
          item.id
        )
        this.$router.push(config.routes.personalizationNew)
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
    preview(item) {
      this.toPreview = item
      this.previewR = true
    },
    toCreate() {
      if (this.$refs.formData.validate()) {
        this.$cookie.set(
          config.cookie.idPlantilla,
          this.currentData.toCreate.id
        )
        this.$router.push(config.routes.personalizationNew)
      }
    },
    cancelCreate() {
      this.dialogCreate = false
      this.currentData = {}
    },
    openDialogCreate() {
      this.dialogCreate = true
    },
    async loadData() {
      let data = await this.getAllData()
      if (data.status == 200) {
        this.items = data.data
      }
    },
    async getAllData() {
      let url = 'rubricas/tipo/PERSONALIZADA'
      let token = this.$cookie.get(config.cookie.token)
      var options = {
        headers: { token: token }
      }
      this.loading = true
      let response = await this.$axios.get(url, options)
      this.loading = false
      return response
    },
    async getAllDataPlantillas() {
      let url = 'rubricas/tipo/BASE'
      let token = this.$cookie.get(config.cookie.token)
      var options = {
        headers: { token: token }
      }
      this.loading = true
      let response = await this.$axios.get(url, options)
      this.loading = false
      if (response.status == 200) {
        this.bases = response.data
      }
    }
  }
}
</script>
<style>
.defineCate{
  width: 450px;
}
.labelLevelPersoPerso{
  width: 100px;
}
.labelCatPersoPerso {
  width: 100px;
}
.labelSkillsPersoPerso {
  width: 100px;
}
.labelSkillsPerso {
  width: 250px;
}
.levelPerso {
  width: 150px;
}
.labelCatPerso {
  width: 150px;
}
</style>