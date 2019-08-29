<template>
  <div class="text-xs-center">
    <v-dialog v-model="dialog" persistent width="400">
      <v-card  dark>
        <v-card-text>
            <center><b>
                Cargando...</b>
                </center>
          <v-progress-linear indeterminate color="primary" class="mb-0"></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
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
