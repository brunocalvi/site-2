<template>
  <Swiper :slidesPerView="1"
    :spaceBetween="30"
    :pagination="{
      clickable: true,
    }"
    :navigation="true"
    :lazy="true"
    :modules="modules"
    class="mySwiper">
    <SwiperSlide v-for="banner in banners" :key="banner.id">

      <template v-if="banner.link.length > 1">
        <a :href="`https://${banner.link}`">
          <img :src="`${site}images/banners/${banner.path}`" :alt="banner.titulo" class="img-banner" loading="lazy">
          <div class="swiper-lazy-preloader swiper-lazy-preloader-white"></div>
        </a>
      </template>
      <template v-else>
        <img :src="`${site}images/banners/${banner.path}`" :alt="banner.titulo" class="img-banner" loading="lazy">
        <div class="swiper-lazy-preloader swiper-lazy-preloader-white"></div>
      </template>
      
    </SwiperSlide>
  </Swiper>
</template>

<script>
import axios from "axios";

// Slides
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// import obrigatorios do modulo de slides
import { EffectFade, Pagination, Navigation } from 'swiper/modules';

export default {
  components: { 
    Swiper, SwiperSlide 
  },
  data() {
    return {
      modules: [EffectFade, Pagination, Navigation],
      banners: [],
      site: process.env.VUE_APP_URL_SITE
    }
  },
  created() {
    axios.get(`${this.site}api/banners.php`)
    .then((res) => {
      this.banners = res.data || [];
    }).catch((e) => {
      console.error(e);
    });
  },
}
</script>

<style>
.img-banner {
  max-height: 385px;
  width: 100%;
  border-radius: 10px;
  margin: 4rem auto;
}
.swiper-button-prev,
.swiper-button-next {
  color: #fff;
  width: 40px;
  height: 40px;
  -webkit-border-radius: 100%;
  -moz-border-radius: 100%;
  border-radius: 100%;
  background: rgb(36, 28, 28, 0.6);
  font-size: 1px;
  padding: 1rem;
}
.swiper-button-prev:after, 
.swiper-button-next:after {
  font-size: 15px;
}
.swiper-pagination-bullet {
  background-color: #fff;
  border: 4px solid #000;
  width: 18px;
  height: 18px;
}
</style>