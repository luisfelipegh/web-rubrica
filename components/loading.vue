<template>
<div></div>
    <!-- <v-dialog v-model="dialog" persistent width="400">
      <v-card>
        <v-card-text>
          <div>
            <center>
              <b>Cargando...</b>
              <v-progress-linear indeterminate color="primary" class="mb-0"></v-progress-linear>
            </center>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog> -->
</template>

<script>
export default {
  props: {
    dialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {}
  },

  watch: {
    dialog(val) {}
  }
}
</script>
