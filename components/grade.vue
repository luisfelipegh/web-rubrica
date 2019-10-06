<template>
  <div>
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-btn icon v-on="on">
          <v-icon small @click="prepare()" class="pr-2">remove_red_eye</v-icon>
        </v-btn>
      </template>
      <span>Ver Calificación</span>
    </v-tooltip>
    <v-dialog persistent v-model="dialog">
      <v-card>
         <div id="printMe">
        <v-card-title class="headline">
          Calificacion de {{base.tipo}}
          <v-spacer></v-spacer>
        </v-card-title>
        <v-row>
          <v-col v-if="base.tipo=='estudiante'">
            <div class="pl-5">
              <span>
                <b>Nombre:</b>
                {{base.nombre}}
              </span>
            </div>
          </v-col>
          <v-col v-if="base.tipo=='equipo' && base.rubrica.calificacion!=undefined">
            <div class="pl-5">
              <span>
                <b>Nombre:</b>
                {{base.nombre}}
              </span>
              <br />
              <b>Integrantes:</b>
              <ul  v-for="item in base.rubrica.calificacion.estudiantesTeam" :key="item.id">
                <li>{{item.nombre}}</li>
              </ul>
            </div>
          </v-col>
          <v-col>
            <div class="pl-5">
          <span>
            <b>Nota:</b>
            {{base.nota}}
          </span>
        </div>
          </v-col>
        </v-row>

        <v-simple-table dense lass="defineaplicacion">
          <thead>
            <tr>
              <th class="text-left test">Nivel</th>
              <th class="text-left test">Categoria</th>
              <th class="text-left test">Total nivel</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item) in base.rubrica.calificacion.levels" :key="item.name">
              <td class="levelPerso" v-if="item.categories.length != 0">
                <b>{{ item.name }}</b>
              </td>
              <td>
                <v-simple-table dense class="defineCateCali">
                  <tbody>
                    <tr v-for="(item2) in item.categories" :key="item2.name">
                      <td  style="width: 150px;" class="labelCatCali">
                        <b>{{ item2.category }}</b>
                      </td>
                      <td style="width: 450px;" class="defineCali">
                        <v-simple-table dense>
                          <tbody>
                            <tr
                              v-for="(item3) in item2.skills"
                              :key="item3.index"
                            >
                              <td style="width: 250px;" class="labelSkillsCali">{{ item3.text }}</td>
                              <td  style="width: 100px;" class="text-right labelSkillsPersoCali">{{ item3.porcentaje }} %</td>
                              <td class="labelnota">
                                Nota: <b>{{item3.nota}}</b>
                              </td>
                            </tr>
                          </tbody>
                        </v-simple-table>
                      </td>
                      <td class="text-right labelCatPersoCali">
                        {{item2.totalCategory}}%
                      </td>
                    </tr>
                  </tbody>
                </v-simple-table>
              </td>
              <td class="text-right labelLevelPersoCali">
                {{item.totalNivel}}%
              </td>
            </tr>
          </tbody>
        </v-simple-table>
       </div>
        <v-card-actions>
          <div class="flex-grow-1"></div>
            <v-btn class="text-capitalize" color="primary" outlined rounded @click="print">
            <v-icon right>print</v-icon>Imprimir
          </v-btn>
          <v-btn class="text-capitalize" color="primary" rounded @click="cancelDialog">
            <v-icon right>cancel</v-icon>Cerrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import config from '@/assets/js/config'
import { mask } from 'vue-the-mask'
export default {
  directives: {
    mask
  },
  props: {
    base: {
      default: {},
      required: true,
    }
  },
  data() {
    return {
      messageInfo: '',
      dialogInfo: false,
      typeMessage: '',
      rubrica: {},
      estudiantesTeam: [],
      config: config,
      dialog: false,
      current: {}
    }
  },
  methods: {
    print(){
       this.$htmlToPaper('printMe');
    },
    cancelDialog() {
      this.dialog = false
    },
    prepare() {
      console.log("hola");
      console.log(this.base);
      
      this.dialog=true
    }
  }
}
</script>
<style >
.nota {
}
.defineCali {
  width: 450px;
}
.labelLevelPersoCali {
  width: 100px;
}
.labelCatPersoCali {
  width: 100px;
}
.labelSkillsPersoCali {
  width: 100px;
}
.labelSkillsCali {
  width: 250px;
}
.levelPerso {
  width: 150px;
}
.labelCatCali {
  width: 150px;
}
.labelnota {
  width: 50px;
}
</style>