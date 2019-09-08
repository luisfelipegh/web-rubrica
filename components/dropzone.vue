<template>
  <vue-dropzone ref="myVueDropzone" id="dropzone" :options="dropzoneOptions"></vue-dropzone>
</template>

<script>
import vue2Dropzone from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.min.css'
import config from '@/assets/js/config'

export default {
  components: {
    vueDropzone: vue2Dropzone
  },
  data: function() {
    return {
      dropzoneOptions: {
        dictDefaultMessage: 'Arrastra tu archivo, ó Clickeame',
        maxFiles: 1,
        acceptedFiles: '.csv',
        url: config.api.url + 'upload',
        thumbnailWidth: 150,
        maxFilesize: 0.5,
        headers: { token: this.this.$cookie.get(config.cookie.token) }
      }
    }
  }
}
</script>
