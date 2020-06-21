<template>
  <div id="app">
    <v-toolbar
      dark
      prominent
      src="./assets/header.png"
    >
      <img src="https://www.pontotel.com.br/wp-content/uploads/2020/05/gen_logo_26fffaab80f60db1b12ef1e67fd0f0c7.png" alt="Minha Figura">	
      <v-toolbar-title>Desafio - Douglas Gomes</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>mdi-export</v-icon>
      </v-btn>
    </v-toolbar>
     <div class="container mt-3">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>