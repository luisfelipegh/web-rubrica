<template>
  <div>
    <v-btn class="text-capitalize" rounded outlined color="primary" @click.stop="prepare()">Vista Previa</v-btn>

    <v-dialog persistent v-model="dialog">
      <v-card>
        <v-card-title class="headline">Previsualización de la rúbrica</v-card-title>
        <v-simple-table dense>
          <thead>
            <tr>
              <th class="text-left">Nivel</th>
              <th class="text-left">Categoria</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item) in current.levels" :key="item.name">
              <td v-if="item.categories.length!=0">{{ item.name }}</td>
              <td>
                <v-simple-table dense>
                  <tbody> 
                    <tr v-for="(item2) in item.categories" :key="item2.name">
                      <td>{{ item2.category }}</td>
                      <v-simple-table dense>
                        <tbody>
                          <tr v-for="(item3) in item2.skills" :key="item3.index">
                            <td>{{ item3.text }}</td>
                          </tr>
                        </tbody>
                      </v-simple-table>
                    </tr>
                  </tbody>
                </v-simple-table>
              </td>
            </tr>
          </tbody>
        </v-simple-table>

        <v-card-actions>
          <div class="flex-grow-1"></div>

          <v-btn class="text-capitalize"  color="primary" rounded @click="dialog = false">Ok</v-btn>
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
    //   this.base.levels = this.base.levels.filter(x => x.categories.length > 0)
      this.dialog = true
    }
  }
}
</script>
<style >
</style>