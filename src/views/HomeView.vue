<template>
  <HeaderInclude></HeaderInclude>

  <div class="container">
    <Banners></Banners>
  </div>

  <section class="section-area">
    <div class="container">
      <h3 class="titulo-home-eventos">Eventos em destaque</h3>
      <Destaques></Destaques>
    </div>
  </section>

  <section class="section-area">
    <div class="container">
      <h3 class="titulo-home-eventos">Eventos</h3>
      <Eventos></Eventos>
    </div>
  </section>

  <section class="section-area-bra">
    <div class="container">
      <h3 class="titulo-home-eventos">Parceiros</h3>
      <Parceiros></Parceiros>
    </div>
  </section>

  <Newsletter></Newsletter>
  
  <FooterInclude></FooterInclude>
</template>

<script>
import HeaderInclude from "@/views/includes/HeaderInclude.vue";
import Banners from '@/views/includes/BannersInclude.vue';
import Destaques from '@/components/cards/DestaquesComp.vue';
import FooterInclude from "@/views/includes/FooterInclude.vue";
import Newsletter from "@/views/includes/NewsletterInclu.vue";
import Eventos from "@/components/cards/EventosComp.vue";
import Parceiros from "@/views/includes/ParceirosInclude.vue";

export default {
  components: { 
    HeaderInclude, Banners, Destaques, FooterInclude, Newsletter, Eventos, Parceiros
  },
  data() {
    return {
      gt_evento_pai: 'N',
    }
  },
  created() {
    const config = this.$route.meta.config;

    if(config) {
      this.gt_evento_pai = config.gt_evento_pai;
    }
    
    localStorage.removeItem("pdv_id");
  },
}
</script>

<style>
.section-area {
  background: #f1f1f1;
  padding-top: 94px;
  padding-bottom: 90px;
}
</style>
