<template>
  <div class="col-lg-3 col-md-3 col-sm-6 col-xs-6 prs_upcom_slide_first">
    <router-link 
      :to="{ name: pagina(lista_eventos), 
      params: { 
        eve_cod: codigoEvento(codigo, lista_eventos), 
        eve_nome: preparaTituloLink(nome) 
      }}">

      <div class="prs_upcom_movie_box_wrapper">
        <div class="prs_upcom_movie_img_box">
          <img :src="revisaLogoEvento(logo)" :alt="nome" class="img-event-common" />
        </div>

        <div class="prs_upcom_movie_content_box ajust-info">
          <div class="prs_upcom_movie_content_box_inner">
            <h2>{{ nome }}</h2>
            <p class="fist-upper">{{ ajustaDataCard(data, lista_datas) }}</p>
            <p class="fist-upper">{{ local }}</p>
            <p class="fist-upper">{{ cidade }}, {{ estado }}</p>
          </div>

          <div class="prs_upcom_movie_content_box_inner_icon">
            <ul>
              <li>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-cart-check" viewBox="0 0 16 16">
                  <path d="M11.354 6.354a.5.5 0 0 0-.708-.708L8 8.293 6.854 7.146a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0z"/>
                  <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1zm3.915 10L3.102 4h10.796l-1.313 7zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0m7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/>
                </svg>
              </li>
            </ul>
          </div>
        </div>
      </div>

    </router-link>
  </div>
</template>

<script>
import { preparaTituloLink, revisaLogoEvento, ajustaDataCard } from '@/utils/formDadosEvento.js';

export default {
  props: {
    nome: String,
    lista_eventos: String,
    codigo: Number,
    logo: String,
    data: String,
    lista_datas: String,
    local: String,
    cidade: String,
    estado: String,
  },
    data() {
    return {
      prefixo: process.env.VUE_APP_PREFIXO,
    }
  },
  methods: {
    preparaTituloLink,
    revisaLogoEvento,
    ajustaDataCard,
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
    },
  }
}
</script>

<style>

</style>