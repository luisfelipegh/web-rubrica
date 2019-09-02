
<template>
  <div>
    <!-- DIALOGO ELIMINAR -->
    <v-dialog v-model="dialogDelete" persistent max-width="290">
      <v-card>
        <v-card-title class="headline">¿Desea eliminar el dato seleccionado?</v-card-title>
        <v-card-text>Al eliminar no se podrá recuperar posteriormente.</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" flat @click.native="dialogDelete = false">No</v-btn>
          <v-btn color="green darken-1" flat @click.native="deleteConfirmData()">Sí</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- LISTA -->
    <v-layout row justify-center wrap>
      <v-flex xs12>
        <v-card>
          <v-card-title>
            Plantillas de Rúbricas
            <v-spacer></v-spacer>
            <v-btn color="primary" @click.stop="$router.push(config.routes.rubricBaseNew)">Crear Rúbrica</v-btn>
          </v-card-title>
          <v-card-text>
            <v-data-table :headers="headers" :items="items">
              <template slot="items" slot-scope="props">
                <tr>
                  <td>{{ props.item.codigo}}</td>
                  <td>{{ props.item.nombre}}</td>

                  <td>
                    <v-icon small class="pr-2" @click="editData(props.item)">remove_red_eye</v-icon>
                    <v-icon small class="pl-2" @click="deleteData(props.item)">delete</v-icon>
                  </td>
                </tr>
              </template>
              <template slot="no-data">No se encontraron Rúbricas</template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import config from '@/assets/js/config'

export default {
  data() {
    return {
      config: config,
      dialogDelete: false,
      headers: [
        { text: 'id', value: 'origin' },
        { text: 'Nombre', value: 'destiny' }
      ],
      items: [],
      loading: false
    }
  }
}
</script>