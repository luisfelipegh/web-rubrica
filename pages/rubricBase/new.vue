<template>
  <v-layout justify-center align-center>
    <v-dialog v-model="dialogInfo" persistent max-width="290">
      <v-card>
        <v-card-title class="headline">Mensaje</v-card-title>
        <v-card-text>{{messageInfo}}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" rounded @click.native="closeDialog()">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-flex xs12 sm12 md12>
      <v-card>
        <v-card-title class="headline">
          <strong>
            <center>Creación de la Rúbrica</center>
          </strong>
          <v-spacer></v-spacer>
          <v-switch v-model="vertical" label="Vista Vertical"></v-switch>
        </v-card-title>
        <v-form ref="form" lazy-validation>
          <v-row class="pl-5">
            <v-col cols="12" sm="6" md="4">
              <v-text-field required v-model="currentData.nombre" label="Nombre de la rúbrica"></v-text-field>
            </v-col>
          </v-row>
        </v-form>
        <v-stepper v-model="e1" :vertical="vertical" :alt-labels="false">
          <template v-if="vertical">
            <template v-for="n in currentData.levels">
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
                    <v-form ref="formData">
                      <v-row>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field v-model="category" label="Categoría"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                          <!-- -->
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
                            <tr v-for="(item) in n.categories" :key="item.name">
                              <td>{{ item.category }}</td>
                              <td>
                                <v-simple-table dense>
                                  <tbody>
                                    <tr v-for="(item2) in item.skills" :key="item2.name">
                                      <td>{{ item2.text }}</td>
                                    </tr>
                                  </tbody>
                                </v-simple-table>
                              </td>
                              <td class="text-center">
                                <v-icon
                                  class="mr-2"
                                  color="primary"
                                  @click="deleteItem(n, item)"
                                >delete</v-icon>
                                <v-icon class="mr-2" color="primary" @click="editItem(n, item)">edit</v-icon>
                              </td>
                            </tr>
                          </tbody>
                        </v-simple-table>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card>
                <hr>
                <v-card-actions>
                  <v-row>
                     <v-col cols="12" sm="12" md="3">
                      <v-btn
                      text
                        class="text-capitalize"
                        color="primary"
                        rounded
                        @click="ClearCategory(n)"
                      >Limpiar Nivel</v-btn>
                    </v-col>
                    <v-col cols="12" sm="12" md="2">
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
                v-for="n in currentData.levels"
                :key="`${n.id}-content`"
                :step="n.id"
              >
                <v-card class="card-items mb-12">
                  <v-container>
                    <h3>Agregar las categorias de {{ n.name }}</h3>
                    <v-form ref="formData">
                      <v-row>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field v-model="category" label="Categoría"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                          <!-- -->
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
                            <tr v-for="(item) in n.categories" :key="item.name">
                              <td>{{ item.category }}</td>
                              <td>
                                <v-simple-table dense>
                                  <tbody>
                                    <tr v-for="(item2) in item.skills" :key="item2.name">
                                      <td>{{ item2.text }}</td>
                                    </tr>
                                  </tbody>
                                </v-simple-table>
                              </td>
                              <td class="text-center">
                                <v-icon class="mr-2" color="primary" @click="editItem(n, item)">edit</v-icon>
                                <v-icon
                                  class="mr-2"
                                  color="primary"
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
                <v-card-actions>
                    <v-row>
                     <v-col cols="12" sm="12" md="3">
                      <v-btn
                      text
                        class="text-capitalize"
                        color="primary"
                        rounded
                        @click="ClearCategory(n)"
                      >Limpiar Nivel</v-btn>
                    </v-col>
                    <v-col cols="12" sm="12" md="8">
                    </v-col>
                    <v-col cols="12" sm="12" md="1">
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
          <preview-base :base="currentData" />
          <v-btn
            :disabled="e1<=currentData.levels.length"
            class="ml-3 text-capitalize"
            color="primary"
            rounded
            @click="saveData()"
          >Guardar Rúbrica</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import config from '@/assets/js/config'
import previewBase from '@/components/previewBase'
import loading from '@/components/loading'

export default {
  components: {
    previewBase,loading
  },
  data() {
    return {
      routeIndexRubric: config.routes.rubricBase,
      messageInfo: '',
      typeMessage: '',
      dialogInfo: false,
      headers: [
        { text: 'Categoria', value: 'category' },
        { text: 'Habilidades', value: 'skills' },
        { text: 'Acciones', value: 'action' }
      ],
      e1: 1,
      loading: false,
      steps: 0,
      //
      activator: null,
      attach: null,
      colors: ['green', 'purple', 'indigo', 'cyan', 'teal', 'orange'],
      editing: null,
      index: -1,
      nonce: 1,
      menu: false,
      x: 0,
      search: null,
      y: 0,
      //
      skills: [],
      category: '',
      editable: true,
      vertical: false,
      currentData: {
        nombre: '',
        levels: [
          {
            id: 1,
            name: 'Conocimiento',
            categories: []
          },
          {
            id: 2,
            name: 'Comprensión',
            categories: []
          },
          {
            id: 3,
            name: 'Sintesis',
            categories: []
          },
          {
            id: 4,
            name: 'Aplicación',
            categories: []
          },
          {
            id: 5,
            name: 'Análisis',
            categories: []
          },
          {
            id: 6,
            name: 'Evaluación',
            categories: []
          }
        ]
      }
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
    saveData() {
      let levels = Object.assign(
        [],
        this.currentData.levels.filter(x => x.categories.length > 0)
      )
      if (this.currentData.nombre != '' && levels.length > 0) {
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
          creador: this.$cookie.get(config.cookie.usuario)
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
          })
          .finally(() => {
            this.loading = false
          })
        this.loading = false
      } else {
        this.messageInfo = 'Error por favor revisa los campos'
        this.dialogInfo = true
        this.typeMessage = 'error'
      }
    },
    edit(index, item) {
      if (!this.editing) {
        this.editing = item
        this.index = index
      } else {
        this.editing = null
        this.index = -1
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
    },
    ClearCategory(level) {
      let level_modify = this.currentData.levels.find(x => x.id === level.id)
      level_modify.categories = []
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
    },
    onInput(val) {
      this.currentData.levels = parseInt(val)
    },
    nextStep(n) {
      if (n === this.levels) {
        this.e1 = 1
      } else {
        this.e1 = n + 1
      }
    }
  }
}
</script>

<style>
.card-items {
  /* background-color: rgb(255, 255, 255) !important; */
  /* box-shadow: -1px -1px 0px gray, 1px -1px 0px gray, -1px 1px 0px gray,
    1px 1px 0px gray; */
  border-radius: 10px 10px 10px 10px;
  -moz-border-radius: 10px 10px 10px 10px;
  -webkit-border-radius: 10px 10px 10px 10px;
  border: 2px solid #656565 !important;
}
</style>
