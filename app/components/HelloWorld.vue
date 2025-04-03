<template>
  <v-container class="fill-height">
    <v-responsive class="align-center fill-height mx-auto" style="height: 100vh;">
      <v-img
        class="mb-4"
        height="150"
        src="~/assets/logo.png"
      />

      <div class="text-center">
        <div class="text-body-2 font-weight-light mb-n1">Welcome to</div>

        <h1 class="text-h2 font-weight-bold">Vuetify</h1>
      </div>

      <div class="py-4" />

      <v-row>
        <v-col cols="12" style="height: 500px; position: relative;">
          <atoms-dockable-panel 
            v-if="panels.includes('viewport-panel')"
            id="viewport-panel" 
            title="Viewport" 
            :initial-width="800"
            :initial-height="400"
            :initial-top="50"
            :initial-left="50"
            window-url=""
            @destroy="removePanel"
            @popout="handlePopout"
          >
            <atoms-babylon-viewport sceneId="defaultScene"></atoms-babylon-viewport>
          </atoms-dockable-panel>
        </v-col>
        
        <v-col cols="6">
          
        </v-col>
        <atoms-dockable-panel 
          v-if="panels.includes('hello-panel')" 
          id="hello-panel" 
          title="Hello Panel"
          @destroy="removePanel"
        >
          <p>Hello world</p>
        </atoms-dockable-panel>
        <v-col cols="6">
          
        </v-col>

        <v-col cols="6">
         
        </v-col>

        <v-col cols="6">
          
        </v-col>
      </v-row>
    </v-responsive>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const panels = ref(['viewport-panel', 'hello-panel']);

function removePanel(event: { id: string }) {
  panels.value = panels.value.filter(id => id !== event.id);
}

function handlePopout(event: { id: string, url: string }) {
  // Vous pouvez gérer ici la logique supplémentaire lors de l'ouverture en fenêtre
  console.log(`Panel ${event.id} opened in new window at ${event.url}`);
}
</script>

<style scoped>
.v-container {
  min-height: 100vh;
}
</style>
