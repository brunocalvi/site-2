<template>
  <HeaderInclude></HeaderInclude>

  <div class="container mg-t-b">
    <h2 class="section-title__title">{{ texto.titulo }}</h2>
    <div v-html="texto.conteudo"></div>
  </div>

  <FooterInclude></FooterInclude>
</template>

<script>
import HeaderInclude from './includes/HeaderInclude.vue';
import FooterInclude from './includes/FooterInclude.vue';

import endPointSite from '@/services/endPointSite.js';

export default {
  components: {
    HeaderInclude, FooterInclude
  },
  data() {
    return {
      id: '',
      texto: {},
    }
  },
  watch: {
    '$route.params.id': {
      immediate: true,
      handler(novoId) {
        this.id = novoId || '';
        if (this.id) {
          this.atualizaTexto();
        }
      }
    }
  },
  methods: {
    async atualizaTexto() {
      try {
        const resultado = await endPointSite.visualizaTexto(this.id);
        this.texto = resultado;

        if(resultado.redireciona == 'S') {
          window.location.href = resultado.link;
        } 

        if(resultado.ativo == 'N') {
          this.$router.push('/');
        } 
      } catch (erro) {
        console.error('Erro ao buscar texto:', erro);
      }
    }
  }
}
</script>

<style>
.section-title__title {
  text-align: center;
  margin-top: 130px;
  margin-bottom: 20px;
  font-family: 'Poppins', sans-serif;
  line-height: 1.1;
  font-weight: 400;
  color: #222222;
  margin: 0;
  padding: 0;
}
.mg-t-b {
  margin: 2rem auto;
}
</style>