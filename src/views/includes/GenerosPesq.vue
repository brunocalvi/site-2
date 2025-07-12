<template>
  <Swiper :slides-per-view="2" :pagination="{ clickable: true }" :breakpoints="responsiveSettings">
    <SwiperSlide>
      <a :href="`${prefixo}/pesquisa?busca=S&txt_genero=6`">
        <div class="icone-genero">
          <span class="i-genero">
            <i class="ri-star-line"></i>
          </span>
          <span class="tex-genero">Balada</span>
        </div>
      </a>
    </SwiperSlide>

    <SwiperSlide>
      <a :href="`${prefixo}/pesquisa?busca=S&txt_genero=5`">
        <div class="icone-genero">
          <span class="i-genero">
            <i class="ri-star-line"></i>
          </span>
          <span class="tex-genero">Rock</span>
        </div>
      </a>
    </SwiperSlide>

    <SwiperSlide>
      <a :href="`${prefixo}/pesquisa?busca=S&txt_genero=7`">
        <div class="icone-genero">
          <span class="i-genero">
            <i class="ri-star-line"></i>
          </span>
          <span class="tex-genero">Stand UP</span>
        </div>
      </a>
    </SwiperSlide>

    <SwiperSlide>
      <a :href="`${prefixo}/pesquisa?busca=S&txt_genero=2`">
        <div class="icone-genero">
          <span class="i-genero">
            <i class="ri-star-line"></i>
          </span>
          <span class="tex-genero">Sertanejo</span>
        </div>
      </a>
    </SwiperSlide>

    <SwiperSlide>
      <a :href="`${prefixo}/pesquisa?busca=S&txt_genero=1`">
        <div class="icone-genero">
          <span class="i-genero">
            <i class="ri-star-line"></i>
          </span>
          <span class="tex-genero">Forró</span>
        </div>
      </a>
    </SwiperSlide>

    <SwiperSlide>
      <a :href="`${prefixo}/pesquisa?busca=S&txt_genero=4`">
        <div class="icone-genero">
          <span class="i-genero">
            <i class="ri-star-line"></i>
          </span>
          <span class="tex-genero">Futebol</span>
        </div>
      </a>
    </SwiperSlide>
  </Swiper>
</template>

<script>
// Slides
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import 'swiper/css/pagination';

export default {
  components: { Swiper, SwiperSlide },
  data() {
    return {
      prefixo: process.env.VUE_APP_PREFIXO,
      responsiveSettings: {
        '640': {
          slidesPerView: 2,
          spaceBetween: 20,
        },
        '768': {
          slidesPerView: 3,
          spaceBetween: 40,
        },
        '1024': {
          slidesPerView: 6,
          spaceBetween: 50,
        },
      }
    }
  }
}
</script>

<style>

</style>