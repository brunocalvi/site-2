<template>
  <Swiper :slides-per-view="2" :loop="false" :pagination="{ clickable: true }" :breakpoints="responsiveSettings">
    <SwiperSlide v-for="parceiro in parceiros" :key="parceiro.id">
      <router-link :to="{ name: 'produtor', params: { proid: parceiro.id }}">
        <img :src="`${site}images/logo-parceiro/${parceiro.path_logo}`" :alt="parceiro.nome" class="img-logo-par">
      </router-link>
    </SwiperSlide>
  </Swiper>
</template>

<script>
// Slides
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import 'swiper/css/pagination';
import endPointSite from "@/services/endPointSite";

export default {
  components: { 
    Swiper, SwiperSlide 
  },
  data() {
    return {
      parceiros: [],
      site: process.env.VUE_APP_URL_SITE,
      prefixo: process.env.VUE_APP_PREFIXO,
      responsiveSettings: {
        '640': {
          slidesPerView: 2,
          spaceBetween: 20,
        },
        '768': {
          slidesPerView: 4,
          spaceBetween: 40,
        },
        '1024': {
          slidesPerView: 6,
          spaceBetween: 50,
        },
      }
    }
  },
  async created() {
    this.parceiros = await endPointSite.listaParceiros();
  },
}
</script>

<style>
.img-logo-par {
  opacity: 0.4;
  -webkit-transition: all 0.5s;
  -o-transition: all 0.5s;
  -ms-transition: all 0.5s;
  -moz-transition: all 0.5s;
  transition: all 0.5s;
}
.img-logo-par:hover {
  opacity: 1;
}
</style>