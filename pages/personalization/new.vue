
<template>
  <div>
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
              <v-text-field disabled v-model="currentData.base.nombre_creador" label="Nombre del creador"></v-text-field>
            </v-col>
          </v-row>
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
                            color="primary"
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
                <v-card-actions>
                  <v-row>
                    <v-col cols="12" sm="12" md="2">
                      <v-btn
                        class="text-capitalize"
                        color="primary"
                        rounded
                        @click="nextStep(n.id)"
                      >Agregar Nivel</v-btn>
                    </v-col>
                    <v-col cols="12" sm="12" md="3">
                      <v-btn
                        class="text-capitalize"
                        color="primary"
                        rounded
                        @click="ClearCategory(n)"
                      >Limpiar Nivel</v-btn>
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
                            color="primary"
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
                    <v-col cols="12" sm="12" md="2">
                      <v-btn
                        class="text-capitalize"
                        color="primary"
                        rounded
                        @click="nextStep(n.id)"
                      >Agregar Nivel</v-btn>
                    </v-col>
                    <v-col cols="12" sm="12" md="3">
                      <v-btn
                        class="text-capitalize"
                        color="primary"
                        rounded
                        @click="ClearCategory(n)"
                      >Limpiar Nivel</v-btn>
                    </v-col>
                  </v-row>
                </v-card-actions>
              </v-stepper-content>
            </v-stepper-items>
          </template>
        </v-stepper>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
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

export default {
  data() {
    return {
    e1: 1,
      loading: false,
      category: '',
      steps: 0,
      editable:true,
      skills:[],
      search:'',
        vertical:false,
        dialogInfo:false,
        messageInfo:'',
        currentData : {},
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
  methods: {
      nextStep(n) {
      if (n === this.levels) {
        this.e1 = 1
      } else {
        this.e1 = n + 1
      }
    },
    async loadData() {
      let idPlantilla = this.$cookie.get(config.cookie.idPlantilla)
      if(idPlantilla !=undefined){
          this.getAllDataPlantillas(idPlantilla)
        }else{
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
      if (response.status == 200) {
          this.currentData.base=response.data
          this.currentData.levels= Object.assign([],response.data.json.levels)
      }
      this.$forceUpdate()
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
  }
}
</script>