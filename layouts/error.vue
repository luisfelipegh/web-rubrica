<template>
  <v-app dark>
    <v-layout column justify-center>
      <v-card>
       <center>
            <h1 v-if="error.statusCode === 404">{{ pageNotFound }}</h1>
            <h1 v-else>{{ otherError }}</h1>
        
          <img src="@/static/img/company_logo_error.png" width="500" />
       <br/>
        <NuxtLink to="/home">Página de inicio</NuxtLink>
         </center>
        <v-card-actions></v-card-actions>
      </v-card>
    </v-layout>
  </v-app>
</template>

<script>
export default {
  layout: 'empty',
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  head() {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError
    return {
      title
    }
  },
  data() {
    return {
      pageNotFound: '404 Página no encontrada',
      otherError: 'Ah ocurrido un error'
    }
  }
}
</script>

<style scoped>
h1 {
  font-size: 20px;
}
</style>
