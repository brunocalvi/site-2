<template>
  <HeaderInclude></HeaderInclude>

  <div class="titulo-evento-principal">
    <h3>{{ dadosEvento.nome }}</h3>
  </div>

  <div class="container">
    <div class="row">
      <div class="col-md-5">
        <div>
          <img :src="revisaLogoEvento(dadosEvento.logo)" :alt="dadosEvento.nome" class="img-detail-event">
        </div>
        <div></div>
      </div>

      <div class="col-md-7">  
        <p>Escolha abaixo o setor(es) e as quantidades desejadas</p>
      </div>
    </div>
  </div>

  <FooterInclude></FooterInclude>
</template>

<script>
import HeaderInclude from './includes/HeaderInclude.vue';
import FooterInclude from './includes/FooterInclude.vue';

import endPointEvento from '@/services/endPointEvento.js';
import { revisaLogoEvento } from '@/utils/formDadosEvento.js';

export default {
  components: {
    HeaderInclude, FooterInclude
  },
  data() {
    return {
      dadosEvento: {},
      pdv_id: process.env.VUE_APP_PDV_SITE,
    }
  },
  async created() {
    const config = this.$route.meta.config;
    const pdv_id = sessionStorage.getItem('pdv_id');
    this.eve_cod = this.$route.params.eve_cod; 

    if(pdv_id != undefined || pdv_id != null) {
      this.pdv_id = pdv_id; 
    }

    if(config) {
      this.gt_moeda = config.gt_moeda;
    }

    this.dadosEvento = await endPointEvento.dadosEvento({ 
      eve_cod: this.eve_cod,
      pdv_id: this.pdv_id,
    });

    if(this.dadosEvento.statusId != '00' || this.dadosEvento.ativo != '1') {
      this.$router.push('/');
    }

  

  },
  methods: {
    revisaLogoEvento,
  }
}
</script>

<style>
.img-detail-event {
  max-height: 400px;
  border-radius: 10px;
  max-width: 550px;
  margin-bottom: 1rem;
}
</style>