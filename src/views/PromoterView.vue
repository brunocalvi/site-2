<template>
  <HeaderInclude></HeaderInclude>

  <section class="area-card-promoter">
    <section class="container">
      <template v-if="bannerAtivo == 'S'">
        <img v-show="pathbanner != ''" :src="`${site}images/banner-parceiro/${pathbanner}`" alt="Parceiro" class="img-banner-paceiro" loading="lazy">
      </template>
      
      <h3 class="titulo-eventos">{{ nomeProd }}</h3>
    </section>

    <div class="container">
      <div class="row">
        <template v-for="evento in produtor" :key="evento.codigo">
          <CardProdutor 
            :nome="evento.nome" 
            :lista_eventos="evento.lista_eventos"
            :codigo="evento.codigo"
            :logo="evento.logo"
            :data="evento.data"
            :lista_datas="evento.lista_datas"
            :local="evento.local"
            :cidade="evento.cidade"
            :estado="evento.estado"
          >
          </CardProdutor>
        </template>

        <template v-if="produtor == undefined || produtor == ''">
          <div class="alerta-encontrou-nada">
            <div>
              <h3>Sem resultados</h3>
              <p>Não encontramos nenhum evento desse produtor.</p>
              <p>Tente buscar na pesquisa ou entre em contato com o produtor.</p>
            </div>
          </div>
        </template>
      </div>        
    </div>
  </section>

  <FooterInclude></FooterInclude>
</template>

<script>
import HeaderInclude from './includes/HeaderInclude.vue';
import FooterInclude from './includes/FooterInclude.vue';
import CardProdutor from '@/components/cards/CardProdutor.vue';

import endPointEvento from '@/services/endPointEvento';
import endPointSite from '@/services/endPointSite';

export default {
  components: {
    HeaderInclude, FooterInclude, CardProdutor
  },
  data() {
    return {
      gt_evento_pai: 'N',
      gmet: this.tipoGmet(),
      produtor: {},
      produtorSite: {},
      proid: '',
      site: process.env.VUE_APP_URL_SITE,
      nomeProd: 'Eventos Disponíves',
      pathbanner: undefined,
      bannerAtivo: 'N',
    }
  },
  async created() {
    this.proid = this.$route.params.proid;
    const config = this.$route.meta.config;

    if(config) {
      this.gt_evento_pai = config.gt_evento_pai;
    }

    if(this.proid == undefined) {
      this.$router.push('/');
    }

    let data = {
      gmet: this.gmet,
      proid: this.proid,  
    }

    this.produtorSite = await endPointSite.visualizaParceiro(this.proid);
    this.produtor = await endPointEvento.eventosProdutor(data);

    this.nomeProd = this.produtorSite == undefined ? this.nomeProd : this.produtorSite.nome;
    this.pathbanner = this.produtorSite == undefined ? this.pathbanner : this.produtorSite.path_banner; 
    this.bannerAtivo = this.produtorSite == undefined ? this.bannerAtivo : this.produtorSite.ativo_banner; 
  },
  methods: {
    tipoGmet() {
      if(this.evento_pai == 'N') {
        return 1;
      } else {
        return 7;
      }
    },
  }
}
</script>

<style>
.area-card-promoter {
  background-color: #f1f1f1;
  padding-bottom: 2rem;
}
.alerta-encontrou-nada {
  text-align: center;
  min-height: 30vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
.alerta-encontrou-nada h3 {
  font-size: 16px;
  color: #000;
  font-weight: 700;
}
.alerta-encontrou-nada p {
  font-weight: 400;
  color: #4c576c;
  margin-bottom: 4px;
}
.area-card-promoter .fist-upper {
  font-family: 'Lato', sans-serif;
  font-size: 16px;
  line-height: 23px;
  color: #707070;
  padding-right: 0 !important;
  overflow-x: hidden;
}
.titulo-eventos {
  color: #000000;
  text-transform: uppercase;
  font-weight: bold;
  position: relative;
  font-family: 'Poppins', sans-serif;
  text-align: center;
  font-size: 32px;
  margin-bottom: 4rem;
  padding-top: 1rem;
}
.titulo-eventos:before {
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
.titulo-eventos:after {
  content: '';
  border: 1px solid #dddddd;
  width: 170px;
  position: absolute;
  bottom: -20px;
  left: 0;
  right: 0;
  margin: 0px auto;
}
.img-banner-paceiro {
  width: 100%;
  margin-bottom: 2rem;
}
</style>