<template>
  <div>
    <v-btn rounded color="primary" @click.stop="dialog = true">Ver</v-btn>

    <v-dialog persistent v-model="dialog">
      <v-card>
        <v-card-title class="headline">Previsualización de la rúbrica</v-card-title>

        <table class="egt">
          <tr class="print">
            <th class="print">Niveles</th>
            <th class="print">Categoria</th>
            <th class="print">descripciones</th>
          </tr>
          <tr class="print" v-for="n in base.levels" :key="`${n.id}-row`">
            <td class="print">{{n.name}}</td>
            <td class="print">
              <table >
                <tr v-for="c in n.categories" :key="`${c}-row-category`">
                  <td class="subprint">{{c.category}}</td>
                </tr>
              </table>
            </td>
            <td class="print">
              <!-- <table>
                <tr v-for="s in c.skills" :key="`${s}-row-category-skill`">
                  <td>{{s.text}}</td>
                </tr>
              </table> -->
            </td>
          </tr>
        </table>

        <v-card-actions>
          <div class="flex-grow-1"></div>

          <v-btn color="primary" rounded @click="dialog = false">Ok</v-btn>
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
      dialog: false
    }
  }
}
</script>
<style >
.egt {
  border-collapse: collapse;
}

.egt {
  border: 1px solid black;
}
.print{
  border: 1px solid black;
}
.subprint{
  border-bottom: 1px solid black;
  
}

</style>