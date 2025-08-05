<template>
  <Swiper :navigation="true" :modules="modules" :breakpoints="responsiveSettings">
    <SwiperSlide v-for="destaque in destaques" :key="destaque.codigo">
      <div class="item prs_feature_slider_item_wrapper">
        <router-link 
          :to="{ name: pagina(destaque.lista_eventos), 
          params: { 
            eve_cod: codigoEvento(destaque.codigo, destaque.lista_eventos), 
            eve_nome: preparaTituloLink(destaque.nome) 
          }}">

          <div class="prs_feature_img_box_wrapper">
            <div class="prs_feature_img">
              <img :src="revisaLogoEvento(destaque.logo)" :alt="destaque.nome" class="img-emphasis">
            </div>

            <div class="prs_feature_img_cont ajust-info">
              <h2>{{ destaque.nome }}</h2>
              <div class="prs_ft_small_cont_left">
                <p>{{ ajustaDataCard(destaque.data, destaque.lista_datas) }}</p>
                <hr/>
              </div>

              <ul>
                <li>
                  <p class="fist-upper">{{ destaque.local }}</p>
                  <p class="fist-upper">{{ destaque.cidade }}, {{ destaque.estado }}</p>
                </li>
                <li><p>{{ destaque.horario }}</p></li>
              </ul>
            </div>
          </div>

        </router-link>
      </div> 
    </SwiperSlide>
  </Swiper>
</template>

<script>
import axios from "axios";
import { preparaTituloLink, revisaLogoEvento, ajustaDataCard } from '@/utils/formDadosEvento.js';

// Slides
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import 'swiper/css/navigation';

// import obrigatorios do modulo de slides
import { Navigation } from 'swiper/modules';

export default {
  components: { 
    Swiper, SwiperSlide 
  },
  props: { 
    evento_pai: String 
  },
  data() {
    return {
      modules: [Navigation],
      destaques: [],
      prefixo: process.env.VUE_APP_PREFIXO,
      link: process.env.VUE_APP_LINK_SISTEMA,
      key: process.env.VUE_APP_WS_KEY,
      pdv: process.env.VUE_APP_PDV_SITE,
      gmet: this.tipoGmet(),
      responsiveSettings: {
        '640': {
          slidesPerView: 1,
          spaceBetween: 20,
        },
        '768': {
          slidesPerView: 2,
          spaceBetween: 20,
        },
        '1024': {
          slidesPerView: 3,
          spaceBetween: 25,
        },
      }
    }
  },
  created() {
    axios.get(`${this.link}ws/geral/evento.asp?key=${this.key}&gmet=${this.gmet}&par1=&par2=${this.pdv}&par3=S`)
    .then((res) => {
      this.destaques = res.data.Lista || [];
    }).catch((e) => {
      console.error(e);
    });
  },
  methods: {
    preparaTituloLink,
    revisaLogoEvento,
    ajustaDataCard,
    tipoGmet() {
      if(this.evento_pai == 'N') {
        return 15;
      } else {
        return 7;
      }
    },
    pagina(eve_cod) {
      if(eve_cod == undefined) {
        return 'ingressos';
      } else {
        if(eve_cod.includes(',')) {
          return 'detalhes_evento';
        } else {
          return 'ingressos';
        }
      }
    },
    codigoEvento(codigo, lista_eventos) {
      if(lista_eventos == undefined) {
        return codigo;
      } else {
        return lista_eventos;
      }
    }
  }
}
</script>

<style>
.prs_feature_img {
  text-align: center;
  -webkit-border-top-left-radius: 10px;
  -moz-border-top-left-radius: 10px;
  border-top-left-radius: 10px;
  -webkit-border-top-right-radius: 10px;
  -moz-border-top-right-radius: 10px;
  border-top-right-radius: 10px;
  background-color: #ddd;
}
.prs_feature_slider_item_wrapper img {
  -webkit-border-top-right-radius: 10px;
  -moz-border-top-right-radius: 10px;
  border-top-right-radius: 10px;
  -webkit-border-top-left-radius: 10px;
  -moz-border-top-left-radius: 10px;
  border-top-left-radius: 10px;
  width: 100%;
  min-height: 280px;
  max-height: 280px;
}
.ajust-info {
  min-height: 220px;
}
.prs_feature_img_cont {
  float: left;
  width: 100%;
  padding: 30px;
  padding-top: 21px;
  border: 1px solid #eeeeee;
  background: #ffffff;
  border-top: 0;
  -webkit-border-bottom-left-radius: 10px;
  -moz-border-bottom-left-radius: 10px;
  border-bottom-left-radius: 10px;
  -webkit-border-bottom-right-radius: 10px;
  -moz-border-bottom-right-radius: 10px;
  border-bottom-right-radius: 10px;
  -webkit-box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.10);
  -moz-box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.10);
  -o-box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.10);
  -ms-box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.10);
  box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.10);
  -webkit-transition: all 0.5s;
  -o-transition: all 0.5s;
  -ms-transition: all 0.5s;
  -moz-transition: all 0.5s;
  transition: all 0.5s;
}
.prs_upcom_movie_content_box_inner h2, .ajust-info h2 {
  min-height: 70px;
}
.prs_feature_img_cont h2 {
  font-size: 20px;
  color: var(--primeira-cor);
  font-weight: bold;
  text-transform: uppercase;
  -webkit-transition: all 0.5s;
  -o-transition: all 0.5s;
  -ms-transition: all 0.5s;
  -moz-transition: all 0.5s;
  transition: all 0.5s;
  text-decoration: none;
}
.prs_ft_small_cont_left {
  width: 100%;
  padding-top: 10px;
}
.ajust-info ul {
  list-style: none;
  padding: 0;
}
.prs_feature_img_cont li {
  float: left;
}
.prs_feature_img_cont li:last-child {
  float: right;
}
.ajust-info p {
  font-family: 'Lato', sans-serif;
  font-size: 16px;
  line-height: 23px;
  color: #707070;
  padding-right: 0 !important;
  overflow-x: hidden;
}
.section-area-bra {
  background-color: #fff;
  padding: 3rem 0;
}
hr {
  margin-top: 20px;
  margin-bottom: 20px;
  border: 0;
  border-top: 1px solid #9b9b9b;
}
</style>