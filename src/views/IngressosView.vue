<template>
  <HeaderInclude></HeaderInclude>

  <div class="titulo-evento-principal">
    <h3>{{ dadosEvento.nome }}</h3>
  </div>

  <div class="container mg-3-auto">
    <div class="row">
      <div class="col-md-5">
        <div>
          <img :src="revisaLogoEvento(dadosEvento.logo)" :alt="dadosEvento.nome" class="img-detail-event">
        </div>

        <div class="dado-event-inicial">
          <h3>{{ data_verificada }}</h3>
          <ul>
            <li><b>Endereço:</b> {{ dadosEvento.endereco }} - {{ dadosEvento.cidade }} - {{ dadosEvento.estado }}</li>
            <li><b>Local:</b> {{ dadosEvento.local }}</li>
            <li><b>Abertura das Portas:</b> {{ dadosEvento.horaInicio2 }}</li>
            <template v-if="dadosEvento.horaFim != ''">
              <li><b>Início do Evento:</b> {{ dadosEvento.horaFim }}</li>
            </template>
            <li><b>Classificação:</b> {{ dadosEvento.classificacao == 0 ? 'Livre': '+' + dadosEvento.classificacao }}</li>
          </ul>
        </div>
      </div>

      <div class="col-md-7"> 
        <div class="area-selec-set-ing">
          <div class="st_dtts_bs_heading">
            <p>Escolha abaixo o setor(es) e as quantidades desejadas</p>
          </div> 


























        </div>

      </div>
    </div>
  </div>

  <section class="a-dados-event">
    <div class="container">
      <h3 class="titulo-home-eventos">Dados do Evento</h3>

      <div id="tabs-dados-event">
        <b-tabs pills card>
          <b-tab title="Descrição" active >
            <div v-html="dadosEvento.descricao"></div>
          </b-tab>

          <template v-if="dadosEvento.infogeral != ''">
            <b-tab title="Informações Adicionais" >
              <div v-html="dadosEvento.infogeral"></div>
            </b-tab>
          </template>

          <template v-if="dadosEvento.release != ''">
            <b-tab title="Release" >
              <div v-html="dadosEvento.release"></div>
            </b-tab>
          </template>

          <template v-if="dadosEvento.duvidas != ''">
            <b-tab title="Dúvidas" >
              <div v-html="dadosEvento.duvidas"></div>
            </b-tab>
          </template>

          <template v-if="dadosEvento.eve_mapa != ''">
            <b-tab title="Mapa de Setores">
              <img :src="dadosEvento.eve_mapa" class="w-100">
            </b-tab>
          </template>
        </b-tabs>
      </div>
    </div>
  </section>

  <NewsletterInclu></NewsletterInclu>

  <FooterInclude></FooterInclude>
</template>

<script>
import HeaderInclude from './includes/HeaderInclude.vue';
import FooterInclude from './includes/FooterInclude.vue';
import NewsletterInclu from './includes/NewsletterInclu.vue';

import endPointEvento from '@/services/endPointEvento.js';
import { revisaLogoEvento, mesCompleto } from '@/utils/formDadosEvento.js';

export default {
  components: {
    HeaderInclude, FooterInclude, NewsletterInclu, Collapse
  },
  data() {
    return {
      dadosEvento: {},
      pdv_id: process.env.VUE_APP_PDV_SITE,
      data_verificada: '',
      isExpanded: true,
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


    if(this.dadosEvento.Data.indexOf(' ') !== -1) {
      this.data_verificada = this.dadosEvento.Data; 
    } else {
      let dataArr = this.dadosEvento.Data.split('/');
      this.data_verificada = `${dataArr[0]} de ${mesCompleto(dataArr[1])} de ${dataArr[2]}`;
    }

    console.log(this.dadosEvento);
  },
  methods: {
    revisaLogoEvento,
    mesCompleto
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
.dado-event-inicial h3 {
  font-size: 40px;
  text-transform: uppercase;
  color: var(--primeira-cor);
  font-weight: bold;
  padding-top: 10px;
  font-family: 'Poppins', sans-serif;
  line-height: 1.1;
  margin: 0;
  padding: 0;
}
.dado-event-inicial ul {
  padding: 0;
  color: #797979;
  padding-top: 15px;
  font-size: 16px;
}
.st_dtts_bs_heading {
  background: var(--primeira-cor);
  padding: 12px 20px;
  border-radius: 4px;
}
.st_dtts_bs_heading p {
  font-size: 16px;
  color: #FFFFFF;
  letter-spacing: 1px;
  text-align: center;
  margin: 0;
}
.area-selec-set-ing {
  max-width: 460px;
  margin: 0 auto;
}
.mg-3-auto {
  margin: 3rem auto;
}
.a-dados-event {
  background: #f6f6f6;
  padding: 2rem 0; 
}
#tabs-dados-event .nav-link {
  border: 1px solid #ccc;
  padding: 25px 60px;
  font-family: 'Poppins', sans-serif;
  font-size: 18px;
  text-transform: uppercase;
  font-weight: 600;
  background: #ffffff;
  -webkit-border-radius: 10px;
  -moz-border-radius: 10px;
  border-radius: 10px;
  color: #404040;
  margin: 5px;
}
#tabs-dados-event .nav-link.active {
  background: var(--primeira-cor);
  color: #fff;
}
#tabs-dados-event .tab-content {
  padding: 2rem 0;
}
#tabs-dados-event .card-body {
  min-height: 206px;
  background: #ffffff;
  padding: 40px;
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
</style>