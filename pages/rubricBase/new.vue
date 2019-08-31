<template>
   <v-layout
    justify-center
    align-center
  >
    <v-flex
      xs12
      sm12
      md12
    >
      <v-card>
        <v-card-title class="headline">
         <strong> 
           <center>
           Creación de la Rúbrica </center></strong>

        <v-switch v-model="vertical" label="Vista Vertical"></v-switch>
        </v-card-title>
        <v-stepper
      v-model="e1"
      :vertical="vertical"
      :alt-labels="false"
    >
      <template v-if="vertical">
        <template v-for="n in levels" >
          <v-stepper-step
            :key="`${n.id}-step`"
            :complete="e1 > n.id"
            :step="n.id"
            :editable="editable"
          >
             {{ n.name }}
          </v-stepper-step>
          <v-stepper-content
            :key="`${n.id}-content`"
            :step="n.id"
          >
            <v-card
              class="mb-12"
            >
             <v-container>
      <v-row>

        <v-col cols="12" sm="6" md="4">
          <v-text-field
            label="Categoría"
          ></v-text-field>
        </v-col>
         <v-col cols="12" sm="6" md="6">
        
<v-textarea
 class="px-2"
          name="input-7-1"
          label="Descripción de categoría "
          value="The Woodman set to work at once, and so sharp was his axe that the tree was soon chopped nearly through."
          hint="Hint text"
        ></v-textarea>
        </v-col>
         <v-col cols="12" sm="6" md="2">
        
     <v-btn
              color="primary"
              @click="aggregate()"
            >
              Crear
            </v-btn>
        </v-col>
      </v-row>
             </v-container>
           
  
              </v-card>
           
              <v-btn
              color="primary"
              @click="Save()"
            >
              Crear
            </v-btn>
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
            >
              {{n.name}}
            </v-stepper-step>
            <v-divider
              v-if="n.id !== steps"
              :key="n.id"
            ></v-divider>
          </template>
        </v-stepper-header>

        <v-stepper-items>
          <v-stepper-content
            v-for="n in levels"
            :key="`${n.id}-content`"
            :step="n.id"
          >
            <v-card
              class="mb-12"
              color="grey lighten-1"
              height="200px"
            >
             <v-container>
      <v-row>

        <v-col cols="12" sm="6" md="4">
          <v-text-field
            label="Categoría"
          ></v-text-field>
        </v-col>
         <v-col cols="12" sm="6" md="6">
        
<v-textarea
 class="px-2"
          name="input-7-1"
          label="Descripción de categoría "
          value="The Woodman set to work at once, and so sharp was his axe that the tree was soon chopped nearly through."
          hint="Hint text"
        ></v-textarea>
        </v-col>
         <v-col cols="12" sm="6" md="2">
        
     <v-btn
              color="primary"
              @click="aggregate()"
            >
              Crear
            </v-btn>
        </v-col>
      </v-row>
             </v-container>

            <!-- <v-data-table
            :headers="headers"
            :items="currentData[n]"
            :items-per-page="5"
            class="elevation-1"
          ></v-data-table> -->
  </v-card>
            <v-btn
              color="primary"
              @click="nextStep(n.id)"
            >
              Agregar
            </v-btn>
              <v-btn
              color="primary"
              @click="Save()"
            >
              Crear
            </v-btn>
          </v-stepper-content>
        </v-stepper-items>
      </template>
    </v-stepper>
        <v-card-actions>
        </v-card-actions>
    </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  data(){
    return{
      headers:[ { text: 'Categoria', value: 'category' },{ text: 'Descripción', value: 'description' }],
      e1: 1,
      editable:true,
      vertical:true,
      levels:[
        {
          id:1,
          name:'Conocimiento'
        },
        {
          id:2,
          name:'Comprensión'
        },
        {
          id:3,
          name:'Sintesis'
        },
        {
          id:4,
          name:'Aplicación'
        },
        {
          id:5,
          name:'Análisis'
        },
        {
          id:6,
          name:'Evaluación'
        }
      ]
    }
  },
  
  watch:{
    steps (val) {
        if (this.e1 > val) {
          this.e1 = val
        }
      },vertical () {
        this.e1 = 2
        requestAnimationFrame(() => this.e1 = 1) // Workarounds
      },
  },
  methods:{
    onInput (val) {
        this.levels = parseInt(val)
      },
      nextStep (n) {
        if (n === this.levels) {
          this.e1 = 1
        } else {
          this.e1 = n + 1
        }
      }
  }
}
</script>

