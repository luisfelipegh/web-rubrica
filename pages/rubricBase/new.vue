<template>
  <v-layout justify-center align-center>
    <v-flex xs12 sm12 md12>
      <v-card>
        <v-card-title class="headline">
          <strong>
            <center>Creación de la Rúbrica</center>
          </strong>
          <v-spacer></v-spacer>
          <v-switch v-model="vertical" label="Vista Vertical"></v-switch>
        </v-card-title>
        <v-stepper v-model="e1" :vertical="vertical" :alt-labels="false">
          <template v-if="vertical">
            <template v-for="n in levels">
              <v-stepper-step
                :key="`${n.id}-step`"
                :complete="e1 > n.id"
                :step="n.id"
                :editable="editable"
              >{{ n.name }}</v-stepper-step>
              <v-stepper-content :key="`${n.id}-content`" :step="n.id">
                  <v-card class="card-items mb-12 card-items">
                  <v-container>
                    <h3>Agregar las categorias de {{n.name}}</h3>
                    <v-form ref="formData">
                      <v-row>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field v-model="category" label="Categoría"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                          <v-textarea
                            class="px-2"
                            name="input-7-1"
                            label="Descripción de categoría"
                            v-model="description"
                          ></v-textarea>
                        </v-col>

                        <v-col cols="12" sm="6" md="2">
                          <v-btn color="primary" rounded @click="aggregateItem(n)">Agregar</v-btn>
                        </v-col>
                      </v-row>
                    </v-form>
                    <v-row>
                      <v-col cols="12" sm="12">
                        <v-data-table :headers="headers" :items="n.categories" hide-default-footer>
                          <template slot="items" slot-scope="props">
                            <tr>
                              <td>{{ props.item.category}}</td>
                              <td>{{ props.item.description}}</td>
                            </tr>
                          </template>
                          <template v-slot:item.action="{ item }">
                            <v-icon small class="mr-2" @click="deleteItem(n,item)">delete</v-icon>
                          </template>

                          <template slot="no-data">No se encontraron Categorias</template>
                        </v-data-table>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card>
                <v-card-actions>
                  <v-btn color="primary"  rounded @click="nextStep(n.id)">Agregar Categoria</v-btn>
                  <v-btn color="primary" rounded @click="ClearCategory(n)">Limpiar Categoria</v-btn>
                </v-card-actions>
              </v-stepper-content>
            </template>
          </template>
          <template v-else>
            <v-stepper-header>
              <template v-for="n in levels">
                <v-stepper-step
                  :key="`${n.id}-step`"
                  :complete="e1 > n.id"
                  :step="n.id"
                  :editable="editable"
                >{{n.name}}</v-stepper-step>
                <v-divider v-if="n.id !== steps" :key="n.id"></v-divider>
              </template>
            </v-stepper-header>

            <v-stepper-items>
              <v-stepper-content v-for="n in levels" :key="`${n.id}-content`" :step="n.id">
                <v-card class="card-items mb-12 card-items">
                  <v-container>
                    <h3>Agregar las categorias de {{n.name}}</h3>
                    <v-form ref="formData">
                      <v-row>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field v-model="category" label="Categoría"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                          <v-textarea
                            class="px-2"
                            name="input-7-1"
                            label="Descripción de categoría"
                            v-model="description"
                          ></v-textarea>
                        </v-col>

                        <v-col cols="12" sm="6" md="2">
                          <v-btn color="primary" rounded @click="aggregateItem(n)">Agregar</v-btn>
                        </v-col>
                      </v-row>
                    </v-form>
                    <v-row>
                      <v-col cols="12" sm="12">
                        <v-data-table :headers="headers" :items="n.categories" hide-default-footer>
                          <template slot="items" slot-scope="props">
                            <tr>
                              <td>{{ props.item.category}}</td>
                              <td>{{ props.item.description}}</td>
                            </tr>
                          </template>
                          <template v-slot:item.action="{ item }">
                            <v-icon small class="mr-2" @click="deleteItem(n,item)">delete</v-icon>
                          </template>

                          <template slot="no-data">No se encontraron Categorias</template>
                        </v-data-table>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card>
                <v-card-actions>
                  <v-btn color="primary" rounded @click="nextStep(n.id)">Agregar Categoria</v-btn>
                  <v-btn color="primary" rounded @click="ClearCategory(n)">Limpiar Categoria</v-btn>
                </v-card-actions>
              </v-stepper-content>
            </v-stepper-items>
          </template>
        </v-stepper>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" rounded @click="Save()">Guardar Rúbrica</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  data() {
    return {
      headers: [
        { text: 'Categoria', value: 'category' },
        { text: 'Descripción', value: 'description' },
        { text: 'Acciones', value: 'action' }
      ],
      e1: 1,
      steps: 0,
      category: '',
      description: '',
      categories: [],
      editable: true,
      vertical: true,
      currentData: {},
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
  },

  watch: {
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
    ClearCategory(level){
let level_modify = this.levels.find(x => x.id === level.id)
level_modify.categories=[]
    },
    deleteItem(n, item) {
      let level_modify = this.levels.find(x => x.id === n.id)
      var i = level_modify.categories.indexOf( item );
      if ( i !== -1 ) {
          level_modify.categories.splice( i, 1 );
      }
    },
    aggregateItem(item) {
      if (this.category != '' && this.description != '') {
        let new_category = {
          category: this.category,
          description: this.description,
          action: ''
        }
        let level_modify = this.levels.find(x => x.id === item.id)
        level_modify.categories.push(new_category)
        this.category = ''
        this.description = ''
      }
    },
    onInput(val) {
      this.levels = parseInt(val)
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
  box-shadow: -1px -1px 0px gray, 1px -1px 0px gray, -1px 1px 0px gray,
    1px 1px 0px gray;
  border-radius: 10px 10px 10px 10px;
  -moz-border-radius: 10px 10px 10px 10px;
  -webkit-border-radius: 10px 10px 10px 10px;
  border: 2px solid #656565 !important;
}
</style>

