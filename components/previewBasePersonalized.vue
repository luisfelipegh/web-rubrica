<template>
  <div>
    <v-btn class="text-capitalize" outlined rounded color="primary" @click.stop="prepare()">Vista Previa</v-btn>
    <v-dialog persistent v-model="dialog">
      <v-card>
        <v-card-title class="headline">Previsualización de la rúbrica</v-card-title>
        <v-simple-table dense lass="define">
          <thead>
            <tr>
              <th class="text-left test">Nivel</th>
              <th class="text-left test">Categoria</th>
              <th class="text-left test">Total nivel</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item) in current.levels" :key="item.name">
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
          </tbody>
        </v-simple-table>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn
            class="text-capitalize"
            color="primary"
            rounded
            @click="
              dialog = false
            "
          >Ok</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    base: {
      default: {},
      required: true
    }
  },
  data() {
    return {
      dialog: false,
      current:{}
    }
  },
  methods: {
    prepare() {
        this.current.levels= Object.assign([],this.base.levels.filter(x => x.categories.length > 0))
        this.current.porcentaje =this.base.totalPorcentaje
        this.$forceUpdate()
        this.dialog = true
    }
  }
}
</script>
<style >
</style>