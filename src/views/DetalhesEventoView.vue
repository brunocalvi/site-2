<template>
  <HeaderInclude></HeaderInclude>

  <div class="titulo-evento-principal">
    <h3>{{ dadosEvento.nome }}</h3>
  </div>

  <section class="area-detalhes-evento">
    <div class="container">
      <div class="row">
        <div class="col-md-5">
          <div>
            <img :src="revisaLogoEvento(dadosEvento.logo)" :alt="dadosEvento.nome" class="img-detalhes">
          </div>
        </div>

        <div class="col-md-7">
          <div class="row">
            <div class="col-md-12 lista-generos-detalhe">
              <ul>
                <template v-for="(genero, index) in generos" :key="index">
                <li class="button-genero">#{{ genero }}</li>
                </template>
              </ul>
            </div>
            
            <div class="col-md-12 list-dados">
              <ul>
                <li>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="icon-det bi bi-currency-dollar" viewBox="0 0 16 16">
                    <path d="M4 10.781c.148 1.667 1.513 2.85 3.591 3.003V15h1.043v-1.216c2.27-.179 3.678-1.438 3.678-3.3 0-1.59-.947-2.51-2.956-3.028l-.722-.187V3.467c1.122.11 1.879.714 2.07 1.616h1.47c-.166-1.6-1.54-2.748-3.54-2.875V1H7.591v1.233c-1.939.23-3.27 1.472-3.27 3.156 0 1.454.966 2.483 2.661 2.917l.61.162v4.031c-1.149-.17-1.94-.8-2.131-1.718zm3.391-3.836c-1.043-.263-1.6-.825-1.6-1.616 0-.944.704-1.641 1.8-1.828v3.495l-.2-.05zm1.591 1.872c1.287.323 1.852.859 1.852 1.769 0 1.097-.826 1.828-2.2 1.939V8.73z"/>
                  </svg>  
                  Valores entre {{ gt_moeda }}{{ minimo }} à {{ gt_moeda }}{{ maximo }}
                </li>

                <li>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-geo-alt icon-det" viewBox="0 0 16 16">
                    <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A32 32 0 0 1 8 14.58a32 32 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10"/>
                    <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4m0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
                  </svg> 
                  Endereço: {{ dadosEvento.endereco }} - {{ dadosEvento.cidade }} - {{ dadosEvento.estado }}
                </li>

                <li>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-house icon-det" viewBox="0 0 16 16">
                    <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5z"/>
                  </svg> 
                  Local: {{ dadosEvento.local }}
                </li>

                <li>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-exclamation-circle-fill icon-det" viewBox="0 0 16 16">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4m.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2"/>
                  </svg> 
                  Classificação: {{ dadosEvento.classificacao == 0 ? 'Livre': '+' + dadosEvento.classificacao }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Start datas -->
  <div class="section-datas">
    <!-- Título -->
    <div class="titulo-evento-principal">
      <h3 class="title-date-hor">Selecione abaixo o Dia e Horário</h3>
    </div>

    <div class="container">
      <div class="st_calender_tabs">
        <b-tabs>
          <b-tab v-for="(data, index) in datas" :key="index">
            <!-- Slot do título com HTML -->
            <template #title>
              <div class="data-mes">{{  data.mes }}</div>
              <div class="data-layer">{{ data.dia }}</div>
              <div class="data-semana">{{ data.semana }}</div>
            </template>

            <!-- Conteúdo da aba -->
            <div class="section-area-pega-data">
              <template v-for="(hora, index2) in data.hora" :key="index2">
                <router-link :to="{ 
                  name: 'ingressos', 
                  params: { 
                    eve_cod: data.evento[index2], 
                    eve_nome: preparaTituloLink(dadosEvento.nome) 
                  }
                }">
                <div class="btn-hora-evento">{{ hora }}</div>
                </router-link>
              </template>
              <div class="clear-both"></div>
            </div>
          </b-tab>
        </b-tabs>
      </div>
    </div>
  </div>
  <!-- End datas -->

  <FooterInclude></FooterInclude>
</template>

<script>
import HeaderInclude from './includes/HeaderInclude.vue';
import FooterInclude from './includes/FooterInclude.vue';

import endPointEvento from '@/services/endPointEvento.js';
import { revisaLogoEvento, colecaoData, preparaTituloLink } from '@/utils/formDadosEvento.js';

export default {
  components: {
    HeaderInclude, FooterInclude,
  },
  data() {
    return {
      eve_cod: '',
      pdv_id: process.env.VUE_APP_PDV_SITE,
      gt_evento_pai: 'N',
      gt_moeda: 'R$',
      dadosEvento: {},
      generos: [],
      minimo: '0.00',
      maximo: '0.00',
      datas: {},
      codigos: []
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
      this.gt_evento_pai = config.gt_evento_pai;
      this.gt_moeda = config.gt_moeda;
    }

    await this.carregarEvento(this.eve_cod);
  },
  watch: {
    '$route.params.eve_cod': {
      immediate: false,
      handler(newVal) {
        this.carregarEvento(newVal)
      }
    }
  },
  methods: {
    revisaLogoEvento,
    colecaoData,
    preparaTituloLink,
    async carregarEvento(eveCod) {
      let eve_cods = [];
      this.eve_cod = eveCod;

      this.dadosEvento = await endPointEvento.dadosEvento({ 
        eve_cod: this.eve_cod,
        pdv_id: this.pdv_id,
      });

      if(this.dadosEvento.statusId != '00' || this.dadosEvento.ativo != '1') {
        this.$router.push('/');
        return;
      }

      this.MaisEventosAgrupados = await endPointEvento.buscaMaisEventosPai({
        pdv_id: this.pdv_id,
        txt_nome: this.dadosEvento.nome,
        estado: this.dadosEvento.estado,
        cidade: this.dadosEvento.cidade,
        local: this.dadosEvento.local,
      });

      this.codigos = this.MaisEventosAgrupados.Lista || [];

      this.codigos.forEach(item => {
        eve_cods.push(item.codigo);
      });

      if(this.eve_cod != eve_cods.toString()) {
        this.$router.push({ name: 'detalhes_evento', params: { eve_cod: eve_cods.toString(), eve_nome: this.preparaTituloLink(this.dadosEvento.nome) } }); 
        return;
      }

      this.generos = this.dadosEvento.genero.split(',');

      this.dadosEvento.valores.forEach(val => {
        this.minimo = val.min;
        this.maximo = val.max;
      });

      this.datas = colecaoData(this.dadosEvento.DataHora);
    }
  }
}
</script>

<style>
.area-detalhes-evento,
.section-datas {
  background: #f6f6f6;
  padding: 2rem 0;
}
.lista-generos-detalhe li {
  margin-bottom: 15px;
  margin-right: 15px;
}
.button-genero {
  float: left;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.54);
  letter-spacing: 0;
  width: 75px;
  height: 37px;
  text-align: center;
  line-height: 37px;
  border: 1px solid #d0cfcf;
  border-radius: 4px;
  background-color: var(--primeira-cor);
  color: #fff;
}
.list-dados li {
  color: #797979;
  padding-top: 15px;
  font-size: 16px;
}
.img-detalhes {
  margin: 0 auto;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 330px;
  border-radius: 6px;
  margin-bottom: 1rem;
}
.title-date-hor {
  font-size: 17px;
  color: #fff !important;
}
.st_calender_tabs .nav-tabs {
    border: none;
} 
.st_calender_tabs .nav-link {
  border: 1px solid;
  border-radius: 5px;
  margin-right: 10px;
  width: 65px;
  padding: 0;
  margin-top: 1rem;
  border: 1px solid #c9c9c9;
}
.data-mes {
  width: 100%;
  height: 18px;
  font-size: 13px;
  line-height: 15px;
  font-weight: 600;
  text-align: center;
  color: #fff;
  text-transform: uppercase;
  background: #c9c9c9;
  border-radius: 4px 4px 0px 0px;
}
.data-layer {
  font-size: 25px;
  font-weight: bold;
  line-height: 35px;
  text-align: center;
  color: #c9c9c9;
  text-transform: uppercase;
  width: 100%;
}
.data-semana {
  width: 100%;
  height: 20px;
  font-size: 13px;
  line-height: 17px;
  font-weight: 600;
  text-align: center;
  color: #c9c9c9;
  text-transform: uppercase;
}
.st_calender_tabs .nav-link.active {
  border: 1px solid var(--segunda-cor);
  background-color: #fff;
}
.st_calender_tabs .nav-link.active .data-mes {
  background-color: var(--primeira-cor);
}
.st_calender_tabs .nav-link.active .data-layer,
.st_calender_tabs .nav-link.active .data-semana {
  color: var(--segunda-cor);
}
.section-area-pega-data {
  background: #fff;
  padding: 40px 30px;
  -webkit-border-radius: 10px;
  -moz-border-radius: 10px;
  border-radius: 10px;
  -webkit-box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.10);
  -moz-box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.10);
  -o-box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.10);
  -ms-box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.10);
  box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.10);
  clear: both;
  margin-top: 2rem;
}
.btn-hora-evento {
  float: left;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.54);
  letter-spacing: 0;
  width: 75px;
  height: 37px;
  text-align: center;
  line-height: 37px;
  border: 1px solid #d0cfcf;
  border-radius: 4px;
  margin-right: 10px;
}
</style>