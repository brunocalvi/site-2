<template>
  <nav class="navbar navbar-expand-lg menu-top-site">
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/">
        <img :src="`${pathProd}img/header/logo-branco.png`" class="logo-header-white">
      </router-link>

      <button type="button" class="btn btn-final-header navbar-toggler" data-bs-toggle="collapse" data-bs-target="#navbarTogglerMenu" aria-controls="navbarTogglerMenu" aria-expanded="false" aria-label="Toggle navigation">
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-justify-right" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M6 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m-4-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5m0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5m0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5"/>
        </svg>
      </button>

      <div class="collapse navbar-collapse" id="navbarTogglerMenu">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link class="nav-link" to="/">HOME</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/area-usuario">ÁREA USUÁRIO</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/cadastro">CADASTRO</router-link>
          </li>
        </ul>

        <template v-if="$route.path != '/pesquisa'">
          <div class="d-flex">
            <input class="form-control input-pesquisa" type="search" name="txt_busca" v-model="txt_busca" placeholder="Pesquise eventos, shows, teatros ...">
            <router-link class="btn btn-pesquisa-header" :to="'/pesquisa?txt_busca='+txt_busca">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
              </svg>
            </router-link>
          </div>
        </template>

        <div class="area-para-desktop">
          <router-link to="/area-usuario">
            <button type="button" class="btn btn-destaq-layo">ÁREA USUÁRIO</button>
          </router-link>

          <button type="button" class="btn btn-final-header">
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-justify-right" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M6 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m-4-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5m0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5m0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>


export default {
  data() {
    return {
      txt_busca: '',
      pathProd: '/'
    }
  },
  created() {
    this.pathProd = process.env.NODE_ENV === 'production' ? process.env.VUE_APP_PUBLIC_PATH : '/';
  }
}
</script>

<style>

</style>