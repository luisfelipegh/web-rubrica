
<template>
  <div>
    <loading :dialog="loading" />

    <v-dialog v-model="dialogInfo" persistent max-width="290">
      <v-card>
        <v-card-title class="headline">Mensaje</v-card-title>
        <v-card-text>{{ messageInfo }}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" class="text-capitalize" rounded @click.native="closeDialog">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-flex xs12 sm12 md12>
      <v-card>
        <v-card-title class="headline">
          <strong>
            <center>Personalización de la Rúbrica</center>
          </strong>
          <v-spacer></v-spacer>
          <v-switch v-model="vertical" label="Vista Vertical"></v-switch>
        </v-card-title>
        <center>Información de la plantilla seleccionada</center>
        <v-row class="pl-5" v-if="currentData.base">
          <v-col cols="12" sm="6" md="4">
            <v-text-field disabled v-model="currentData.base.nombre" label="Nombre de la base"></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field
              disabled
              v-model="currentData.base.nombre_creador"
              label="Nombre del creador"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-form v-model="valid" ref="formData" lazy-validation>
          <v-row class="pl-5">
            <v-col cols="12" sm="6" md="4">
              <v-text-field
                required
                :rules="nameRules"
                v-model="currentData.nombre"
                :disabled="editing"
                label="Nombre Personalizado"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-text-field
                v-if="editing"
                required
                :rules="nameRules"
                v-model="currentData.nombre_creador"
                :disabled="editing"
                label="Nombre del personalizador"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-form>
        <v-stepper v-model="e1" :vertical="vertical" :alt-labels="false">
          <template v-if="vertical">
            <template v-for="(n,index) in currentData.levels">
              <v-stepper-step
                :key="`${n.id}-step`"
                :complete="e1 > n.id"
                :step="n.id"
                :editable="editable"
              >{{ n.name }}</v-stepper-step>
              <v-stepper-content :key="`${n.id}-content`" :step="n.id">
                <v-card class="card-items mb-12">
                  <v-container>
                    <h3>Agregar las categorias de {{ n.name }}</h3>
                    <v-form ref="formData2">
                      <v-row>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field v-model="category" label="Categoría"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                          <v-combobox
                            v-model="skills"
                            :filter="filter"
                            :hide-no-data="!search"
                            :items="skills"
                            :search-input.sync="search"
                            label="Agregar habilidades"
                            multiple
                            hide-selected
                            small-chips
                            solo
                          >
                            <template v-slot:no-data>
                              <v-list-item>
                                <span class="subheading">Agregar</span>
                                <v-chip label small>{{ search }}</v-chip>
                              </v-list-item>
                            </template>
                            <template
                              v-slot:selection="{
                                attrs,
                                item,
                                parent,
                                selected
                              }"
                            >
                              <v-chip
                                v-if="item === Object(item)"
                                v-bind="attrs"
                                :input-value="selected"
                                label
                                small
                              >
                                <span class="pr-2">{{ item.text }}</span>
                                <v-icon small @click="parent.selectItem(item)">close</v-icon>
                              </v-chip>
                            </template>
                            <template v-slot:item="{ index, item }">
                              <v-text-field
                                v-if="editing === item"
                                v-model="editing.text"
                                autofocus
                                flat
                                background-color="transparent"
                                hide-details
                                solo
                                @keyup.enter="edit(index, item)"
                              ></v-text-field>
                              <v-chip v-else dark label small>
                                {{
                                item.text
                                }}
                              </v-chip>
                              <div class="flex-grow-1"></div>
                              <v-list-item-action @click.stop>
                                <v-btn icon @click.stop.prevent="edit(index, item)">
                                  <v-icon>
                                    {{
                                    editing !== item ? 'close' : 'check'
                                    }}
                                  </v-icon>
                                </v-btn>
                              </v-list-item-action>
                            </template>
                          </v-combobox>
                        </v-col>
                        <v-col cols="12" sm="6" md="2">
                          <v-btn
                            class="text-capitalize"
                           outlined
                            rounded
                            @click="aggregateItem(n)"
                          >Agregar</v-btn>
                        </v-col>
                      </v-row>
                    </v-form>
                    <v-row>
                      <v-col cols="12" sm="12">
                        <v-simple-table dense v-if="n.categories.length > 0">
                          <thead>
                            <tr>
                              <th class="text-left">Categoría</th>
                              <th class="text-left">Habilidades</th>
                              <th class="text-center">Acciones</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="(item,index2) in n.categories" :key="item.name">
                              <td>{{ item.category }}</td>
                              <td>
                                <v-simple-table dense>
                                  <tbody>
                                    <tr v-for="(item2,index3) in item.skills" :key="item2.name">
                                      <td class="tempo">{{ item2.text }}</td>
                                      <td>
                                        <v-text-field
                                          type="number"
                                          :min="0"
                                          :max="100"
                                          @change="changePorcentaje(index,index2,index3)"
                                          v-model="item2.porcentaje"
                                          label="Porcentaje"
                                        ></v-text-field>
                                      </td>
                                    </tr>
                                  </tbody>
                                </v-simple-table>
                              </td>
                              <td class="text-center">
                                <v-icon class="mr-2" @click="editItem(n, item)">edit</v-icon>
                                <v-icon
                                  class="mr-2"
                                  @click="deleteItem(n, item)"
                                >delete</v-icon>
                              </td>
                            </tr>
                          </tbody>
                        </v-simple-table>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card>
                <row v-if="n.totalNivel>0">
                  <v-col>
                    <span>{{n.totalNivel}} % Para el nivel {{ n.name }}</span>
                  </v-col>
                </row>
                <hr />
                <v-card-actions>
                  <v-row>
                    <v-col  cols="12" sm="3" md="2">
                      <v-btn
                      text
                        class="text-capitalize"
                        color="primary"
                        rounded
                        @click="returnStep(n.id)"
                      >  <v-icon rigth >navigate_before</v-icon> Atras</v-btn>
                    </v-col>
                       <v-col cols="12" sm="3" md="3">
                      <v-btn
                        text
                        class="text-capitalize"
                        color="primary"
                        rounded
                        @click="ClearCategory(n)"
                      >  Limpiar Nivel  </v-btn>
                    </v-col>
                    <v-col  cols="12" sm="3" md="2">
                      <v-btn
                      text
                        class="text-capitalize"
                        color="primary"
                        rounded
                        @click="nextStep(n.id)"
                      >Siguiente <v-icon left >navigate_next</v-icon></v-btn>
                    </v-col>
                  </v-row>
                </v-card-actions>
              </v-stepper-content>
            </template>
          </template>
          <template v-else>
            <v-stepper-header>
              <template v-for="n in currentData.levels">
                <v-stepper-step
                  :key="`${n.id}-step`"
                  :complete="e1 > n.id"
                  :step="n.id"
                  :editable="editable"
                >{{ n.name }}</v-stepper-step>
                <v-divider v-if="n.id !== steps" :key="n.id"></v-divider>
              </template>
            </v-stepper-header>
            <v-stepper-items>
              <v-stepper-content 
                v-for="(n,index) in currentData.levels"
                :key="`${n.id}-content`"
                :step="n.id"
              >
                <v-card class="card-items mb-12">
                  <v-container>
                    <h3>Agregar las categorias de {{ n.name }}</h3>
                    <v-form ref="formData2">
                      <v-row>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field v-model="category" label="Categoría"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                          <v-combobox
                            v-model="skills"
                            :filter="filter"
                            :hide-no-data="!search"
                            :items="skills"
                            :search-input.sync="search"
                            label="Agregar habilidades"
                            multiple
                            hide-selected
                            small-chips
                            solo
                          >
                            <template v-slot:no-data>
                              <v-list-item>
                                <span class="subheading">Agregar</span>
                                <v-chip label small>{{ search }}</v-chip>
                              </v-list-item>
                            </template>
                            <template
                              v-slot:selection="{
                                attrs,
                                item,
                                parent,
                                selected
                              }"
                            >
                              <v-chip
                                v-if="item === Object(item)"
                                v-bind="attrs"
                                :input-value="selected"
                                label
                                small
                              >
                                <span class="pr-2">{{ item.text }}</span>
                                <v-icon small @click="parent.selectItem(item)">close</v-icon>
                              </v-chip>
                            </template>
                            <template v-slot:item="{ index, item }">
                              <v-text-field
                                v-if="editing === item"
                                v-model="editing.text"
                                autofocus
                                flat
                                background-color="transparent"
                                hide-details
                                solo
                                @keyup.enter="edit(index, item)"
                              ></v-text-field>
                              <v-chip v-else dark label small>
                                {{
                                item.text
                                }}
                              </v-chip>
                              <div class="flex-grow-1"></div>
                              <v-list-item-action @click.stop>
                                <v-btn icon @click.stop.prevent="edit(index, item)">
                                  <v-icon>
                                    {{
                                    editing !== item ? 'close' : 'check'
                                    }}
                                  </v-icon>
                                </v-btn>
                              </v-list-item-action>
                            </template>
                          </v-combobox>
                        </v-col>
                        <v-col cols="12" sm="6" md="2">
                          <v-btn
                            class="text-capitalize"
                           outlined
                            rounded
                            @click="aggregateItem(n)"
                          >Agregar</v-btn>
                        </v-col>
                      </v-row>
                    </v-form>
                    <v-row>
                      <v-col cols="12" sm="12">
                        <v-simple-table dense v-if="n.categories.length > 0">
                          <thead>
                            <tr>
                              <th class="text-left">Categoría</th>
                              <th class="text-left">Habilidades</th>
                              <th class="text-center">Acciones</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="(item,index2) in n.categories" :key="item.name">
                              <td>{{ item.category }}</td>
                              <td>
                                <v-simple-table dense>
                                  <tbody>
                                    <tr v-for="(item2,index3) in item.skills" :key="item2.name">
                                      <td class="tempo">{{ item2.text }}</td>
                                      <td>
                                        <v-text-field
                                          type="number"
                                          :min="0"
                                          :max="100"
                                          @change="changePorcentaje(index,index2,index3)"
                                          v-model="item2.porcentaje"
                                          label="Porcentaje"
                                        ></v-text-field>
                                      </td>
                                    </tr>
                                  </tbody>
                                </v-simple-table>
                              </td>
                              <td class="text-center">
                                <v-icon class="mr-2"  @click="editItem(n, item)">edit</v-icon>
                                <v-icon
                                  class="mr-2"
                                  @click="deleteItem(n, item)"
                                >delete</v-icon>
                              </td>
                            </tr>
                          </tbody>
                        </v-simple-table>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card>

                <row v-if="n.totalNivel>0">
                  <v-col>
                    <span>{{n.totalNivel}} % Para el nivel {{ n.name }}</span>
                  </v-col>
                </row>
                <hr />
                <v-card-actions>
                  <v-row>
                    <v-col  cols="12" sm="3" md="2">
                      <v-btn
                      text
                        class="text-capitalize"
                        color="primary"
                        rounded
                        @click="returnStep(n.id)"
                      >  <v-icon rigth >navigate_before</v-icon> Atras</v-btn>
                    </v-col>
                       <v-col cols="12" sm="3" md="3">
                      <v-btn
                        text
                        class="text-capitalize"
                        color="primary"
                        rounded
                        @click="ClearCategory(n)"
                      >  Limpiar Nivel  </v-btn>
                    </v-col>
                    <v-col  cols="12" sm="3" md="2">
                      <v-btn
                      text
                        class="text-capitalize"
                        color="primary"
                        rounded
                        @click="nextStep(n.id)"
                      >Siguiente <v-icon left >navigate_next</v-icon></v-btn>
                    </v-col>
                  </v-row>
                </v-card-actions>
              </v-stepper-content>
            </v-stepper-items>
          </template>
        </v-stepper>
        <v-card-actions>
          <v-btn
            outlined
            class="ml-3 text-capitalize"
             color="primary"
            rounded
            @click="$router.push(routeIndexRubric)"
          >Cancelar Rúbrica</v-btn>
          <v-spacer></v-spacer>
          <span>Total de porcentaje es {{currentData.totalPorcentaje}} %</span>
          <v-spacer></v-spacer>
          <preview-base :base="currentData" />
          <v-btn v-if="currentData.levels"
            :disabled="e1<=currentData.levels.length"
            class="ml-3 text-capitalize"
            color="primary"
            rounded
            @click="saveData()"
          >Guardar Rúbrica</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </div>
</template>
<script>
import config from '@/assets/js/config'
import loading from '@/components/loading'
import previewBase from '@/components/previewBasePersonalized'

export default {
  components: { loading, previewBase },
  data() {
    return {
      nameRules: [v => !!v || 'Campo requerido'],
      e1: 1,
      loading: false,
      valid: true,
      category: '',
      steps: 0,
      editable: true,
      skills: [],
      search: '',
      vertical: false,
      dialogInfo: false,
      messageInfo: '',
      typeMessage: '',
      currentData: {},
      editing: false,
      routeIndexRubric: config.routes.personalization
    }
  },

  watch: {
    skills(val, prev) {
      if (val.length === prev.length) return
      this.skills = val.map(v => {
        if (typeof v === 'string') {
          v = {
            text: v
          }
          this.skills.push(v)
          this.nonce++
        }
        return v
      })
    },
    steps(val) {
      if (this.e1 > val) {
        this.e1 = val
      }
    },
    vertical() {
      this.e1 = 2
      requestAnimationFrame(() => (this.e1 = 1)) // Workarounds
    }
  },

  beforeMount() {
    this.loadData()
  },
  mounted() {},
  methods: {
    closeDialog() {
      if (this.typeMessage == 'error') {
        this.dialogInfo = false
        this.messageInfo = ''
      }
      if (this.typeMessage == 'info') {
        this.dialogInfo = false
        this.$router.push(this.routeIndexRubric)
        this.messageInfo = ''
      }
    },
    ClearCategory(level) {
      let level_modify = this.currentData.levels.find(x => x.id === level.id)
      level_modify.categories = []
      this.$forceUpdate()
    },
    aggregateItem(item) {
      if (this.category != '' && this.skills.length > 0) {
        let new_category = {
          category: this.category,
          skills: this.skills,
          action: ''
        }
        let level_modify = this.currentData.levels.find(x => x.id === item.id)
        level_modify.categories.push(new_category)
        this.category = ''
        this.skills = []
      }
      this.calculateNewPorcentajes()
      this.$forceUpdate()
    },
    editItem(n, item) {
      let level_modify = this.currentData.levels.find(x => x.id === n.id)
      let i = level_modify.categories.indexOf(item)
      this.skills = level_modify.categories[i].skills
      this.category = level_modify.categories[i].category
      if (i !== -1) {
        level_modify.categories.splice(i, 1)
      }
    },
    deleteItem(n, item) {
      let level_modify = this.currentData.levels.find(x => x.id === n.id)
      var i = level_modify.categories.indexOf(item)
      if (i !== -1) {
        level_modify.categories.splice(i, 1)
      }
      this.calculateNewPorcentajes()
      this.$forceUpdate()
    },
    calculateNewPorcentajes() {
      let total = 0
      for (let index = 0; index < this.currentData.levels.length; index++) {
        const element = this.currentData.levels[index]
        let totalnivel = 0
        for (let index2 = 0; index2 < element.categories.length; index2++) {
          const element2 = element.categories[index2]
          let totalCategory = 0
          for (let index3 = 0; index3 < element2.skills.length; index3++) {
            const element3 = element2.skills[index3]
            if (element3.porcentaje && element3.porcentaje <= 100) {
              total = total + parseFloat(element3.porcentaje)
              totalnivel = totalnivel + parseFloat(element3.porcentaje)
              totalCategory = totalCategory + parseFloat(element3.porcentaje)
            }
          }
          element2.totalCategory = totalCategory
        }
        element.totalNivel = totalnivel
      }
      this.currentData.totalPorcentaje = total
    },
    changePorcentaje(n, index2, index3) {
      if (
        parseFloat(
          this.currentData.levels[n].categories[index2].skills[index3]
            .porcentaje
        ) < 1 ||
        parseFloat(
          this.currentData.levels[n].categories[index2].skills[index3]
            .porcentaje
        ) > 100
      ) {
        this.messageInfo =
          'Los porcentajes son incorrectos mínimo 1, máximo 100'
        this.dialogInfo = true
        this.typeMessage = 'error'
        this.currentData.levels[n].categories[index2].skills[
          index3
        ].porcentaje = 0
      }
      let total = 0
      for (let index = 0; index < this.currentData.levels.length; index++) {
        const element = this.currentData.levels[index]
        let totalnivel = 0
        for (let index2 = 0; index2 < element.categories.length; index2++) {
          const element2 = element.categories[index2]
          let totalCategory = 0
          for (let index3 = 0; index3 < element2.skills.length; index3++) {
            const element3 = element2.skills[index3]
            if (element3.porcentaje && element3.porcentaje <= 100) {
              total = total + parseFloat(element3.porcentaje)
              totalnivel = totalnivel + parseFloat(element3.porcentaje)
              totalCategory = totalCategory + parseFloat(element3.porcentaje)
            }
          }
          element2.totalCategory = totalCategory
        }
        element.totalNivel = totalnivel
      }
      if (total > 100) {
        this.messageInfo = 'Los porcentajes ingresados estan excediento el 100%'
        this.dialogInfo = true
        this.typeMessage='error'
        this.currentData.levels[n].totalNivel =
          this.currentData.levels[n].totalNivel -
          parseFloat(
            this.currentData.levels[n].categories[index2].skills[index3]
              .porcentaje
          )
        this.currentData.levels[n].categories[index2].skills[
          index3
        ].porcentaje = 0
      } else {
        this.currentData.totalPorcentaje = total
      }

      this.$forceUpdate()
    },
    validarPorcentajes() {
      let total = 0
      for (let index = 0; index < this.currentData.levels.length; index++) {
        const element = this.currentData.levels[index]
        let totalnivel = 0
        for (let index2 = 0; index2 < element.categories.length; index2++) {
          const element2 = element.categories[index2]
          for (let index3 = 0; index3 < element2.skills.length; index3++) {
            const element3 = element2.skills[index3]
            if (element3.porcentaje) {
              total = total + parseFloat(element3.porcentaje)
              totalnivel = totalnivel + parseFloat(element3.porcentaje)
            } else {
              return false
            }
          }
        }
        element.totalNivel = totalnivel
      }
      if (total == 100) {
        return true
      } else {
        return false
      }
    },

    calcularTotalNivel(n) {
      for (let index = 0; index < array.length; index++) {
        const element = array[index]
      }
    },
    nextStep(n) {
      if (n === this.currentData.levels) {
        this.e1 = 1
      } else {
        this.e1 = n + 1
      }
    },

    returnStep(n) {
      if (n === this.currentData.levels) {
        this.e1 = 1
      } else {
        this.e1 = n - 1
      }
    },
    async loadData() {
      let idPlantilla = this.$cookie.get(config.cookie.idPlantilla)
      let edit = this.$cookie.get(config.cookie.editRubric)

      if (idPlantilla != '') {
        this.$cookie.set(config.cookie.idPlantilla, '')
        let response = await this.getAllDataPlantillas(idPlantilla)
        if (response.status == 200) {
          this.currentData.levels = Object.assign([], response.data.json.levels)
          this.currentData.base = response.data
          this.editing = false
          this.e1 = 2
          requestAnimationFrame(() => (this.e1 = 1)) // Workarounds
          this.$forceUpdate()
        }
      } else if (edit != undefined) {
        this.$cookie.set(config.cookie.editRubric, '')
        let response = await this.getAllDataPlantillas(edit)

        if (response.status == 200) {
          this.currentData.levels = Object.assign([], response.data.json.levels)
          this.currentData.nombre = response.data.json.nombre
          this.currentData.nombre_creador = response.data.nombre_creador
          this.currentData.base = response.data.json.base
          this.currentData.totalPorcentaje = response.data.json.totalPorcentaje
          this.currentData.personalizada = response.data
          this.editing = true
          this.e1 = 2
          requestAnimationFrame(() => (this.e1 = 1)) // Workarounds
          this.$forceUpdate()
        }
      } else {
        this.$router.push(config.routes.personalization)
      }
    },
    async getAllDataPlantillas(id) {
      let url = `rubricas/one/${id}`
      let token = this.$cookie.get(config.cookie.token)
      var options = {
        headers: { token: token }
      }
      this.loading = true
      let response = await this.$axios.get(url, options)
      this.loading = false
      return response
    },

    saveData() {
      if (this.$refs.formData.validate()) {
        if (this.validarPorcentajes()) {
          console.log(this.currentData.levels)
          let levels = Object.assign(
            [],
            this.currentData.levels.filter(x => x.categories.length > 0)
          )
          if (this.currentData.nombre != undefined && levels.length > 0) {
            if (this.editing) {
              this.loading=true
               let token = this.$cookie.get(config.cookie.token)
              var options = {
                headers: { token: token }
              }
                let url = 'rubricas/' + this.currentData.personalizada.id
              let data = {
                json: Object.assign({}, this.currentData),
                nombre: this.currentData.nombre,
                creador: this.currentData.personalizada.creador,
                tipo: 'PERSONALIZADA'
              }
              data.json.levels = levels
                this.$axios
                .put(url, data, options)
                .then(async res => {
                  let data = res
                  if (data.status == 200) {
                    this.typeMessage = 'info'
                    this.messageInfo = 'Se edito correctamente'
                    this.dialogInfo = true
                  }
                })
                .catch(err => {
                  console.log(err)
                })
                .finally(() => {
                  this.loading = false
                })
              this.loading = false
            } else {
              let url = 'rubricas/'
              let token = this.$cookie.get(config.cookie.token)
              var options = {
                headers: { token: token }
              }
              this.loading = true
              this.currentData.creador = this.$cookie.get(config.cookie.usuario)
              let data = {
                json: Object.assign({}, this.currentData),
                nombre: this.currentData.nombre,
                creador: this.$cookie.get(config.cookie.usuario),
                tipo: 'PERSONALIZADA'
              }
              data.json.levels = levels
              this.$axios
                .post(url, data, options)
                .then(async res => {
                  let data = res
                  if (data.status == 200) {
                    this.typeMessage = 'info'
                    this.messageInfo = 'Se guardo correctamente'
                    this.dialogInfo = true
                  }
                })
                .catch(err => {
                  console.log(err)
                })
                .finally(() => {
                  this.loading = false
                })
              this.loading = false

            }
          } else {
            this.messageInfo =
              'Error por favor ingresa el nombre de la rúbrica personalizada'
            this.dialogInfo = true
            this.typeMessage = 'error'
          }
        } else {
          this.messageInfo =
            'Válida por favor que las categorias cargadas tengan un porcentaje, por el contrario eliminarlo, valida de el porcentaje sea igual a 100%'
          this.dialogInfo = true
          this.typeMessage = 'error'
        }
      } else {
        this.messageInfo =
          'Error por favor ingresa el nombre de la rúbrica personalizada'
        this.dialogInfo = true
        this.typeMessage = 'error'
      }
    },
    filter(item, queryText, itemText) {
      if (item.header) return false
      const hasValue = val => (val != null ? val : '')
      const text = hasValue(itemText)
      const query = hasValue(queryText)

      return (
        text
          .toString()
          .toLowerCase()
          .indexOf(query.toString().toLowerCase()) > -1
      )
    }
  }
}
</script>

<style>
.content{
  height: 400px;
}
.tempo {
  max-width: 300px;
}
</style>