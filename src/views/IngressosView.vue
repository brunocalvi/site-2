<template>
  <HeaderInclude></HeaderInclude>

  <Alert v-if="retorno != undefined" :msg="retorno" @fechar="estadoAlerta"></Alert>

  <div class="titulo-evento-principal">
    <h3>{{ dadosEvento.nome }}</h3>
  </div>

  <template v-if="dadosEvento.qtde_cpf > 0">
    <p class="alert-qtd-comp">Somente será permitida a aquisição de {{ dadosEvento.qtde_cpf }} ingresso(s) por pessoa</p>
  </template>
  
  <div class="container mg-3-auto">
    <div class="row">
      <div class="col-md-5">
        <div>
          <img :src="logo" :alt="dadosEvento.nome" class="img-detail-event">
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

          <template v-for="lote in lotes" :key="lote.gru_id">
            <b-button class="button-setor"
              :class="collapseState[lote.gru_id] ? null : 'collapsed'"
              :aria-expanded="collapseState[lote.gru_id] ? 'true' : 'false'"
              :aria-controls="`collapse-${lote.gru_id}`"
              @click="collapseState[lote.gru_id] = !collapseState[lote.gru_id]"
            >
              {{ lote.nome.split('|')[0] }}
            </b-button>

            <b-collapse :id="`collapse-${lote.gru_id}`" v-model="collapseState[lote.gru_id]">
              <IngressosComp 
                :eve_mostra_taxa="dadosEvento.eve_mostra_taxa"
                :eve_cod="Number(eve_cod)" 
                :pdv_id="Number(pdv_id)" 
                :setor_id="Number(lote.gru_id)"
                @carrinho="carrinhoInicial"
              ></IngressosComp>
            </b-collapse>
          </template>

          <div class="text-right mt-2">
            <span class="total-ingressos">Total: {{ gt_moeda }} {{ formatValor(valorGeral) }}</span>
          </div>

          <template v-if="dadosEvento.eve_link_termo_responsabilidade != ''">
            <div class="st_cherity_img_cont">
              <input type="checkbox" name="termo_evento" id="cbx" style="display: none;" v-model="termoLinkEvet">
              <label for="cbx" class="check">
                  <svg width="18px" height="18px" viewBox="0 0 18 18">
                      <path d="M1,9 L1,3.5 C1,2 2,1 3.5,1 L14.5,1 C16,1 17,2 17,3.5 L17,14.5 C17,16 16,17 14.5,17 L3.5,17 C2,17 1,16 1,14.5 L1,9 Z"></path>
                      <polyline points="1 9 7 14 15 4"></polyline>
                  </svg>
              </label>
              <label for="cbx">
                Li e concordo com o termo de aceitação de compra do ingresso. 
                <a target="_blank" :href="dadosEvento.eve_link_termo_responsabilidade">Ler o termo de aceitação</a>
              </label>
            </div>
          </template> 

          <div class="select-tipo-entrega">
            <b-form-select v-model="selected" :options="formEntrega" required></b-form-select>
          </div>

          <b-button variant="outline-success" class="btn-inicia-compr" @click="vaiParalogin()">Comprar Ingresso</b-button>
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
import IngressosComp from '@/components/IngressosComp.vue';
import Alert from "@/components/alerts/AlertAcao.vue";

import endPointEvento from '@/services/endPointEvento.js';
import endPointPdv from '@/services/endPointPdv.js';
import endPointSetorLote from '@/services/endPointSetorLote.js';

import { revisaLogoEvento, mesCompleto, formatValor } from '@/utils/formDadosEvento.js';
import validacoesIngressos from '@/store/validacoesIngressos.js';
import { guardaIngressoStore } from '@/store/guardaIngressos.js';

export default {
  components: {
    HeaderInclude, FooterInclude, NewsletterInclu, IngressosComp, Alert 
  },
  data() {
    return {
      dadosEvento: {},
      eve_cod: 0,
      pdv_id: process.env.VUE_APP_PDV_SITE,
      data_verificada: '',
      viraLote: {},
      lotes: [],
      collapseState: {},
      setor_id: '',
      formEntrega: [{ value: null, text: 'Escolha a forma de entrega' }],
      selected: null,
      termoLinkEvet: true,
      valorGeral: 0,
      infoIngresso: [],
      retorno: undefined,
      logo: '',
      guardaIngressos: guardaIngressoStore(),
      //dadosValidacao: guardaIngressos.state.dadosValidacao
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

    this.logo = this.revisaLogoEvento(this.dadosEvento.logo);

    // API para rodar e virar o lote automtico. 
    this.viraLote = await endPointPdv.viraLoteAutomatico({ 
      pdv: this.pdv_id, 
      eve_cod: this.eve_cod 
    });

    // API para pegar os lotes para montar o collapse
    this.lotes = await endPointSetorLote.nomeSetorInfo({
      pdv: this.pdv_id, 
      eve_cod: this.eve_cod 
    });

    let entrega = this.dadosEvento.forma_entrega;
    for (let i = 0; i < entrega.length; i++) {
      this.formEntrega.push({ value: entrega[i].for_ent_id, text: entrega[i].descricao });

      if(entrega.length == 1) {
        this.selected = entrega[i].for_ent_id; 
      }
    }
  },
  methods: {
    revisaLogoEvento,
    mesCompleto,
    formatValor,
    async verificaQtdIngLote() {
      for(let ing in this.infoIngresso) {
        let disp_lote = await endPointSetorLote.verificaQtdLocalVenda({
          eve_cod: this.eve_cod, 
          ite_cod: this.infoIngresso[ing].ite_cod, 
          qtd: this.infoIngresso[ing].qtd, 
          mes_id: this.infoIngresso[ing].mes_id, 
          mas_id: 0,
        });

        disp_lote.nome_setor_lote = this.infoIngresso[ing].nome_setor_lote; 
        return disp_lote;
      }
    },
    estadoAlerta(data) {
     this.retorno = data; 
    },
    carrinhoInicial(value) {
      let somaValores = 0;
      const id = value.ite_cod;

      // Atualiza ou remove
      if(value.qtd === 0) {
        delete this.infoIngresso[id];
      } else {
        this.infoIngresso[id] = value;
      }

      // Recalcula o total apenas com itens > 0
      for(let car in this.infoIngresso) {
        somaValores += this.infoIngresso[car].valorTot * this.infoIngresso[car].qtd;
      }

      this.valorGeral = somaValores;
    },
    async vaiParalogin() {
      let err = undefined;
      let form_entrega = Number(this.selected); 

      if(this.dadosEvento.eve_link_termo_responsabilidade != '' && this.termoLinkEvet == false) {
        err = "SIT-ZR694402 : É necessário aprovar o termo de aceitação.";
      }

      if(this.selected == null) {
        err = "SIT-MW701511 : É necessário selecionar uma forma de entrega.";
      }

      if(Object.keys(this.infoIngresso).length === 0) {
        err = "SIT-CS164439 : É necessário selecionar um ingresso para continuar.";
      }

      let validIng = await validacoesIngressos.dadosIngressos(this.infoIngresso);

      if(validIng != undefined) err = validIng;

      //verifico sem assento -----------------
      try {
        let qtdIngDis = await this.verificaQtdIngLote();

        if(qtdIngDis.statusId != '00') {
          err = `SIS-JW056592 : O ${qtdIngDis.nome_setor_lote} está com o erro: "${qtdIngDis.statusMsg}"`;
        } 
      } catch(e) {
        //console.log("Erro qtd: ", e);
      }

      //dados da forma de entrega -----------------
      const entrega = await endPointEvento.dadosFormaEntrega(form_entrega);
      if(entrega.statusId != '00') err = `SIS-DR166214 : ${entrega.statusMsg}`;

      if(err == undefined) {
        this.retorno = undefined;

        this.guardaIngressos.salvar(this.eve_cod, {
        //this.guardaIngressos.salvar({
          pdv_id: Number(this.pdv_id),
          logo: this.logo,
          form_entrega: form_entrega, 
          eve_cod: Number(this.eve_cod),
          eve_nome: this.dadosEvento.nome,
          eve_limite_meia: this.dadosEvento.limite_meia,
          eve_mostra_taxa: this.dadosEvento.eve_mostra_taxa,
          eve_label_taxa: this.dadosEvento.eve_label_taxa,
          eve_link_termo_resp: this.dadosEvento.eve_link_termo_responsabilidade,
          eve_qtde_cpf: this.dadosEvento.qtde_cpf,
          aceita_pix: this.dadosEvento.eve_aceita_pix,
          aceita_pix_aarin: this.dadosEvento.eve_aceita_pix_aarin,
          aceita_boleto: this.dadosEvento.eve_aceita_boleto, 
          val_taxa_bol: parseFloat(this.dadosEvento.eve_val_taxa_bol.toString().replace(',', '.')),  
          dias_vencto_bol: this.dadosEvento.eve_dias_vencto_bol,
          limite_venda_boleto: this.dadosEvento.eve_limite_venda_boleto,
          pre_cadastro: this.dadosEvento.eve_pre_cadastro,
          forma_ent_valor: Number(entrega.valor),
          forma_ent_descricao: entrega.descricao,
          ingresso: this.infoIngresso, 
          desconto: {},
        });

        // monta url para o mapa se tiver --------------
        let lista_qtde = [];
        let lista_lote = [];
        let mapa_id = 0;
        let tot_ing = 0;
        let img_real = 'N';

        let ingressosMap = this.guardaIngressos.getIngresso(this.eve_cod);

        for(let ing in ingressosMap) {
          if(ingressosMap[ing].mapa_id != 0) {
            lista_qtde.push(ingressosMap[ing].qtd);
            lista_lote.push(ingressosMap[ing].ite_cod);
            mapa_id = ingressosMap[ing].mapa_id;
            img_real = ingressosMap[ing].img_real; 
            tot_ing += ingressosMap[ing].qtd;
          } 
        }

        if(mapa_id != 0 && img_real == 'S') {
          this.$router.push({
            path: '/mapa_img_real',
            query: {
              map_id: mapa_id,
              eve_cod: this.eve_cod,
              lista_lote: lista_lote.toString(),
              tot_ing: tot_ing,
              lista_qtde: lista_qtde.toString(),
              pdv_id: this.pdv_id,
            }
          });

        } else if (mapa_id != 0 && img_real == 'N') {
          this.$router.push({
            path: '/form_mapa',
            query: {
              map_id: mapa_id,
              eve_cod: this.eve_cod,
              lista_lote: lista_lote.toString(),
              tot_ing: tot_ing,
              lista_qtde: lista_qtde.toString(),
              pdv_id: this.pdv_id,
            }
          });

        } else {
          this.$router.push('/validacao');

        }

      } else {
        this.retorno = err;
      }
    }
  }
}
</script>

<style>
.img-detail-event {
  max-height: 400px;
  border-radius: 10px;
  max-width: 550px;
  margin-bottom: 1rem;
  width: 100%;
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
.button-setor {
  width: 100%;
  height: 50px;
  background-color: #333545;
  color: #fff;
  border: 1px solid #ccc;
  font-weight: 100;
}
.total-ingressos {
  font-weight: bold;
  font-family: 'Lato', sans-serif;
  line-height: 23px;
  color: #707070;
}
.area-selec-set-ing .st_cherity_img_cont {
  display: flex;
}
.area-selec-set-ing .st_cherity_img_cont,
.select-tipo-entrega {
  margin-top: 1rem;
}
.btn-inicia-compr {
  margin: 0 auto;
  width: 90%;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;
  height: 45px;
  font-weight: 700;
  text-transform: uppercase;
}
.alert-qtd-comp {
  text-align: center;
  color: red;
  margin-top: 1rem;
  font-weight: 500;
}
</style>