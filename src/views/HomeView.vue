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
  },
}
</script>

<style>
.titulo-home-eventos {
  color: #000000;
  text-transform: uppercase;
  font-weight: bold;
  position: relative;
  font-family: 'Poppins', sans-serif;
  text-align: center;
  font-size: 32px;
  margin-bottom: 4rem;
}
.titulo-home-eventos:before {
  content: '';
  border: 2px solid var(--primeira-cor);
  width: 30px;
  position: absolute;
  bottom: -21px;
  left: 0;
  right: 0;
  margin: 0px auto;
  z-index: 1;
}
.titulo-home-eventos:after {
  content: '';
  border: 1px solid #dddddd;
  width: 170px;
  position: absolute;
  bottom: -20px;
  left: 0;
  right: 0;
  margin: 0px auto;
}
.section-area {
  background: #f1f1f1;
  padding-top: 94px;
  padding-bottom: 90px;
}
</style>
