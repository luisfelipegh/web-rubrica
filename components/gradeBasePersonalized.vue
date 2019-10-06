<template>
  <div>
    <v-dialog v-model="dialogInfo" persistent max-width="290">
      <v-card>
        <v-card-title class="headline">Mensaje</v-card-title>
        <v-card-text>{{ messageInfo }}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" class="text-capitalize" outlined rounded @click.native="cancelDialogInfo">Cancelar</v-btn>
          <v-btn color="primary" class="text-capitalize" rounded @click.native="closeDialog">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-btn class="text-capitalize" outlined rounded @click.stop="prepare()" right>
      <v-icon>check_circle_outline</v-icon>Calificar
    </v-btn>
    <v-dialog persistent v-model="dialog">
      <v-card>
        <v-card-title class="headline">
          Calificar a {{base.type}}
          <v-spacer></v-spacer>
        </v-card-title>
        <v-row>
          <v-col v-if="base.type=='estudiante'">
            <div class="pl-5">
              <span>
                <b>Nombre:</b>
                {{base.calificado.nombre}}
              </span>
            </div>
          </v-col>
          <v-col v-if="base.type=='equipo'">
            <div class="pl-5">
              <span>
                <b>Nombre:</b>
                {{base.calificado.nombre}}
              </span>
              <br />
              <b>Integrantes:</b>
              <ul v-for="item in estudiantesTeam " :key="item.id">
                <li>{{item.nombre}}</li>
              </ul>
            </div>
          </v-col>
          <v-col>
            <div class="pl-5">
          <span>
            <b>Nota:</b>
            {{current.totalNota}}
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
            <tr v-for="(item,index) in current.levels" :key="item.name">
              <td class="levelPerso" v-if="item.categories.length != 0">
                <b>{{ item.name }}</b>
              </td>
              <td>
                <v-simple-table dense class="defineCateCali">
                  <tbody>
                    <tr v-for="(item2,index2) in item.categories" :key="item2.name">
                      <td class="labelCatCali">
                        <b>{{ item2.category }}</b>
                      </td>
                      <td class="defineCali">
                        <v-simple-table dense>
                          <tbody>
                            <tr
                              class="defineSkills"
                              v-for="(item3,index3) in item2.skills"
                              :key="item3.index"
                            >
                              <td class="labelSkillsCali">{{ item3.text }}</td>
                              <td class="text-right labelSkillsPersoCali">{{ item3.porcentaje }} %</td>
                              <td class="labelnota">
                                <v-text-field
                                  class="nota"
                                  type="number"
                                  :min="0"
                                  :max="5"
                                  :step="0.1"
                                  @change="changeNota(index,index2,index3)"
                                  v-model="item3.nota"
                                  label="Nota"
                                ></v-text-field>
                              </td>
                            </tr>
                          </tbody>
                        </v-simple-table>
                      </td>
                      <td class="text-right labelCatPersoCali">
                        <b>{{item2.totalCategory}}%</b>
                      </td>
                    </tr>
                  </tbody>
                </v-simple-table>
              </td>
              <td class="text-right labelLevelPersoCali">
                <b>{{item.totalNivel}}%</b>
              </td>
            </tr>
          </tbody>
        </v-simple-table>
        <v-card-actions>
          <div class="flex-grow-1"></div>
           <v-btn class="text-capitalize" color="primary" outlined rounded @click="cancelDialog"> <v-icon right>cancel</v-icon>Cancelar</v-btn>
          <v-btn class="text-capitalize" color="primary" rounded @click="saveData"><v-icon right>save</v-icon>Guardar</v-btn>
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
      mask: '####-####-####-####'
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
    cancelDialogInfo(){
        this.messageInfo = ''
        this.typeMessage = ''
        this.dialogInfo = false
    },
     cancelDialog(){
      this.dialog = false
    },
    saveData() {
      if (this.validarNotas()) {
        this.messageInfo = `Nota definitiva es: ${this.current.totalNota}`
        this.typeMessage = 'info'
        this.dialogInfo = true
      } else {
        this.messageInfo = 'Error por favor completa todas las notas'
        this.typeMessage = 'error'
        this.dialogInfo = true
      }
    },
    closeDialog() {
      if (this.typeMessage == 'error') {
        this.dialogInfo = false
        this.messageInfo = ''
        this.typeMessage == ''
      }
      if (this.typeMessage == 'info') {
        this.dialogInfo = false
        this.messageInfo = ''
        this.typeMessage == ''
        let info = Object.assign({},this.current)
        if (this.estudiantesTeam.length>0){
          console.log("entra");
          
        info.estudiantesTeam = this.estudiantesTeam

        }
        this.$emit('save-dialog', info)
        this.dialog=false
      }
    },
    async prepare() {
      if (this.base.type == 'equipo') {
        
        this.getAllEstudiantesTeam(this.base.calificado.codigo)
      }
      if(this.base.calificacion==undefined){
        await this.getRubricas()
      }else{
          this.current.levels = Object.assign(
          [],
         this.base.calificacion.levels
        )
        this.current.porcentaje =  this.base.calificacion.totalPorcentaje
        this.current.totalNota =  this.base.calificacion.totalNota
      } 
      this.$forceUpdate()
      this.dialog = true
    },
    async getAllEstudiantesTeam(item) {
      let url = `estudiantesTeam/${item}`
      let token = this.$cookie.get(config.cookie.token)
      var options = {
        headers: { token: token }
      }
      this.loading = true
      let response = await this.$axios.get(url, options)
      this.loading = false
      if (response.status == 200 && Array.isArray(response.data)) {
        this.estudiantesTeam = response.data
      }
    },
    changeNota(index, index2, index3) {
      if (
        parseFloat(
          this.current.levels[index].categories[index2].skills[index3].nota
        ) < 0 ||
        parseFloat(
          this.current.levels[index].categories[index2].skills[index3].nota
        ) > 5
      ) {
        this.messageInfo = 'Nota incorrecta mínimo 0.0, máximo 5.0'
        this.dialogInfo = true
        this.typeMessage = 'error'
        this.current.levels[index].categories[index2].skills[index3].nota = 0
      } else {
        this.calculateNota()
      }
    },
    calculateNota() {
      let total = 0
      for (let index = 0; index < this.current.levels.length; index++) {
        const element = this.current.levels[index]
        for (let index2 = 0; index2 < element.categories.length; index2++) {
          const element2 = element.categories[index2]
          for (let index3 = 0; index3 < element2.skills.length; index3++) {
            const element3 = element2.skills[index3]
            if (element3.nota && element3.nota <= 5) {
              let notaskill =
                (parseFloat(element3.porcentaje) / 100) *
                parseFloat(element3.nota)
              total = total + notaskill
            }
          }
        }
      }
      this.current.totalNota = parseFloat(total).toFixed(2)
      this.$forceUpdate()
    },
    validarNotas() {
      for (let index = 0; index < this.current.levels.length; index++) {
        const element = this.current.levels[index]
        for (let index2 = 0; index2 < element.categories.length; index2++) {
          const element2 = element.categories[index2]
          for (let index3 = 0; index3 < element2.skills.length; index3++) {
            const element3 = element2.skills[index3]
            if (element3.nota) {
            } else {
              return false
            }
          }
        }
      }
      return true
    },
    /**
     * Obtener las plantillas personalizadas
     */
    async getRubricas() {
      let url = 'rubricas/one/' + this.base.actividad.rubrica
      let token = this.$cookie.get(config.cookie.token)
      var options = {
        headers: { token: token }
      }
      this.loading = true
      let response = await this.$axios.get(url, options)
      this.loading = false
      if (response.status == 200) {
        this.rubrica = response.data
        this.current.levels = Object.assign(
          [],
          this.rubrica.json.levels.filter(x => x.categories.length > 0)
        )
        this.current.porcentaje = this.rubrica.json.totalPorcentaje
        this.current.totalNota = 0.0
      }
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