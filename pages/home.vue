<template>
  <v-layout
    column
    justify-center
    align-center
  >
    <v-flex
      xs12
      sm8
      md6
    >
      <div class="text-center">
        <logo />
      </div>
      <v-card>
        <v-card-title class="headline">
         <strong> Bienvenido al software de Rúbrica de Evaluación</strong>
        </v-card-title>
        <center>
        <img src="@/static/img/company_logo.png" width="400" ></center>
        <v-card-actions>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import config from '@/assets/js/config'

export default {
  components: {
  }

}
</script>
