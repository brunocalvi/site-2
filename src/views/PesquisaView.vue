<template>
  <HeaderInclude></HeaderInclude>
  
  <div class="container-fluid barra-pesquisa">
    <div class="" data-aos="fade-up" data-aos-duration="1000">
      <b>Faça sua busca detalhada:</b><br/><br/>
    </div>

    <div class="row">
      <div class="col-md-6">
        <div class="form-group">
          <input type="text" class="form-control" id="txt_busca" name="txt_busca" v-model="txt_busca" placeholder="Titulo do evento"/>
        </div>
      </div>
    
      <div class="form-group col-md-6">
        <div class="row justify-content-end">

          <div class="col-md-4 col-lg-3" data-aos="fade-up" data-aos-duration="1000">
            <input type="date" id="txt_dia" name="txt_dia" class="form-control" v-model="txt_dia">
          </div>

          <div class="col-md-4 col-lg-3" data-aos="fade-up" data-aos-duration="1500">
            <div class="dashboard-content__input">
              <select class="form-control" id="txt_estado" name="txt_estado" v-model="txt_estado">
                <option value="" selected>Estado</option>
                <option value="AC">Acre</option>
                <option value="AL">Alagoas</option>
                <option value="AP">Amapá</option>
                <option value="AM">Amazonas</option>
                <option value="BA">Bahia</option>
                <option value="CE">Ceará</option>
                <option value="DF">Distrito Federal</option>
                <option value="ES">Espírito Santo</option>
                <option value="GO">Goiás</option>
                <option value="MA">Maranhão</option>
                <option value="MT">Mato Grosso</option>
                <option value="MS">Mato Grosso do Sul</option>
                <option value="MG">Minas Gerais</option>
                <option value="PA">Pará</option>
                <option value="PB">Paraíba</option>
                <option value="PR">Paraná</option>
                <option value="PE">Pernambuco</option>
                <option value="PI">Piauí</option>
                <option value="RJ">Rio de Janeiro</option>
                <option value="RN">Rio Grande do Norte</option>
                <option value="RS">Rio Grande do Sul</option>
                <option value="RO">Rondônia</option>
                <option value="RR">Roraima</option>
                <option value="SC">Santa Catarina</option>
                <option value="SP">São Paulo</option>
                <option value="SE">Sergipe</option>
                <option value="TO">Tocantins</option>
                <option value="EX">Estrangeiro</option>
              </select>
            </div>
          </div>

          <div class="col-md-4 col-lg-3" data-aos="fade-up" data-aos-duration="2000">
            <div class="dashboard-content__input">
              <select class="select2 form-control" id="txt_genero" name="txt_genero" v-model="txt_genero">
                <option value="">Gêneros</option>
                <option v-for="genero in lista_generos" :key="genero.codigo" :value="genero.codigo">
                  {{ genero.descricao }}
                </option>
              </select>
            </div>
          </div>

          <div class="col-md-4 col-lg-3" data-aos="fade-up" data-aos-duration="1000">
            <div class="dashboard-content__input">
              <select class="select2 form-control" id="txt_cidade" name="txt_cidade" v-model="txt_cidade">
                <option value="">Cidades</option>
                <option v-for="(cidade, index) in lista_cidades" :key="index" :value="cidade.Cidade">
                  {{ cidade.Cidade }}
                </option>
              </select>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>

  <section class="area-mostra-pesquisa">
    <div class="container">
      <div class="row">
        <template v-for="evento in resultado" :key="evento.codigo">
          <CardBusca 
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
          </CardBusca>
        </template>

        <template v-if="resultado == undefined || resultado == ''">
          <div class="alerta-encontrou-nada">
            <div>
              <h3>Sem resultados</h3>
              <p>Não encontramos nada que corresponda à sua busca.</p>
              <p>Tente buscar com outras palavras-chave</p>
            </div>
          </div>
        </template>
      </div>        
    </div>
  </section>

  <FooterInclude></FooterInclude>
</template>

<script>
import HeaderInclude from "@/views/includes/HeaderInclude.vue";
import FooterInclude from "@/views/includes/FooterInclude.vue";
import CardBusca from "@/components/cards/CardBusca.vue";

import endPointPesquisa from "@/services/endPointPesquisa.js";

export default {
 components: { 
    HeaderInclude, FooterInclude, CardBusca
  },
  data() {
    return {
      gt_evento_pai: 'N',
      txt_estado: '',
      txt_genero: '',
      lista_generos: [],
      txt_dia: '',
      txt_busca: '',
      txt_cidade: '',
      lista_cidades: [],
      gmet: this.tipoGmet(),
      resultado: {},
      prefixo: process.env.VUE_APP_PREFIXO,
      temResultado: false
    }
  },
  async created() {
    const config = this.$route.meta.config;

    if(config) {
      this.gt_evento_pai = config.gt_evento_pai;
    }

    let cidadeData = await endPointPesquisa.listaCidadesEstados();
    this.lista_cidades = cidadeData.Cidades || [];

    let generoData = await endPointPesquisa.listaGeneros();
    this.lista_generos = generoData || [];


    this.txt_estado = this.$route.query.txt_estado || '';
    this.txt_genero = this.$route.query.txt_genero || '';
    this.txt_dia = this.$route.query.txt_dia || '';
    this.txt_busca = this.$route.query.txt_busca || '';
    this.txt_cidade = this.$route.query.txt_cidade || '';

    this.atualizaBusca();
  },
  watch: {
    txt_estado: 'updateQuery',
    txt_genero: 'updateQuery',
    txt_dia: 'updateQuery',
    txt_busca: 'updateQuery',
    txt_cidade: 'updateQuery',
  },
  methods: {
    async updateQuery() {
      this.$router.replace({
        name: 'pesquisa',
        query: {
          txt_estado: this.txt_estado,
          txt_genero: this.txt_genero,
          txt_dia: this.txt_dia,
          txt_busca: this.txt_busca,
          txt_cidade: this.txt_cidade,
        }
      });

      this.atualizaBusca();
    },
    tipoGmet() {
      if(this.evento_pai == 'N') {
        return 1;
      } else {
        return 2;
      }
    },
    async atualizaBusca() {
      let arr = [];

      let data = {
        gmet: this.gmet,
        txt_busca: this.txt_busca,
        txt_genero: this.txt_genero,
        estado: this.txt_estado,
        cidade: this.txt_cidade
      };

      let txt_dia = this.txt_dia.split("-");
      let dia = `${txt_dia[2]}/${txt_dia[1]}/${txt_dia[0]}`
    
      arr = await endPointPesquisa.getPesquisa(data); 

      if(this.txt_dia != '') {
        let arrData = [];

        arr.forEach(item => {
          if(item.data == dia) { 
            arrData.push(item);
          }
        });

        this.resultado = arrData; 
      } else {
        this.resultado = arr;
      }
    }
  }
}
</script>

<style>
.barra-pesquisa {
  background-color: #fff;
  padding: 2rem 1rem;
}
.area-mostra-pesquisa {
  background-color: #f1f1f1;
  padding: 2rem 1rem;
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
.dashboard-content__input {
  margin-top: 10px;
}
</style>