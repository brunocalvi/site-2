<template>
  <HeaderInclude></HeaderInclude>

  <Alert v-if="retorno != undefined" :msg="retorno" @fechar="estadoAlerta"></Alert>

  <div id="area-checkout">
    <div class="container">

      <div class="row py-5 d-both">
        <div class="col-md-12">
          <router-Link :to="{ 
            name: 'ingressos', 
            params: { 
              eve_cod: detalhesCompra.eve_cod, 
              eve_nome: preparaTituloLink(detalhesCompra.eve_nome) 
            }}">
            <button class="Btn-edit-ing">
              <span class="text">Editar</span>
              <span class="icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 16 16">
                  <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z"/>
                </svg>
              </span>
            </button>
          </router-Link>
        </div>

        <div class="col-md-5">
          <div class="cal-title d-both">
            <h4>Detalhes</h4>
          </div>

          <div class="car-right-body bg-white">
            <div class="d-flex-bet">
              <div><img :src="detalhesCompra.logo" :alt="detalhesCompra.eve_nome" class="icon-chekout"></div>

              <div>
                <p>
                  <b>Evento:</b> {{ detalhesCompra.eve_nome }}<br>
                  <b>Ingresso(s):</b><br/> 

                  <template v-for="ing in detalhesCompra.ingresso.filter(i => i)" :key="ing.ite_cod">
                    {{ ing.qtd }}x - {{ ing.nome_setor_lote }}<br> 
                  </template>
                </p>

                <p>
                  <template v-if="detalhesCompra.forma_ent_valor != 0">
                    <b>Taxa entrega:</b> {{ gt_moeda }} {{ formatValor(detalhesCompra.forma_ent_valor, { normalizarVirgula: true }) }}<br/>
                  </template>
                  
                  <b>Valor:</b> {{ gt_moeda }} {{ formatValor(totalevento) }}
                  <span class="label-tax"><small>incluso (Taxa)</small></span>
                </p>
              </div>
            </div>
            <hr>

          <!-- <template v-for="detalhe in detalhesCompra" :key="detalhe.eve_cod">
            <div class="d-flex-bet">
              <div><img :src="detalhe.logo" :alt="detalhe.eve_nome" class="icon-chekout"></div>

              <div>
                <p>
                  <b>Evento:</b> {{ detalhe.eve_nome }}<br>
                  <b>Ingresso(s):</b><br/> 

                  <template v-for="ing in detalhe.ingresso.filter(i => i)" :key="ing.ite_cod">
                    {{ ing.qtd }}x - {{ ing.nome_setor_lote }}<br> 
                  </template>
                </p>

                <p>
                  <template v-if="detalhe.forma_ent_valor != 0">
                    <b>Taxa entrega:</b> {{ gt_moeda }} {{ formatValor(detalhe.forma_ent_valor, { normalizarVirgula: true }) }}<br/>
                  </template>
                  
                  <b>Valor:</b> {{ gt_moeda }} {{ formatValor(totalevento[detalhe.eve_cod]) }}
                  <span class="label-tax"><small>incluso (Taxa)</small></span>
                </p>
              </div>
            </div>
            <hr>
            </template> -->

            <ul>
              <li><span>Subtotal:</span> <span>{{ gt_moeda }} {{ formatValor(subTotal) }}</span></li>
              <li><span>Vale Desconto:</span> <span>{{ gt_moeda }} 0,00</span></li>
              <li><span>Total a Pagar:</span> <span id="total_valor">{{ gt_moeda }} {{ formatValor(totalDaSelecao) }}</span></li>
            </ul>
          </div>

          <div>
            <div class="cal-title d-both"><h4>Vale Desconto</h4></div>
            <div class="car-right-body bg-white">
              <h4>Insira o vale desconto</h4>

              <form id="form-cupom" class="cupom" action="#" method="POST">
                <input type="text" class="input-rounded-l" name="cod_vale" id="cod_vale" v-model="valeDesconto" placeholder="Digite aqui ..." required>
                <button type="button" class="btn-apply-desc" @click="aplicarValeDesconto()">Aplicar</button>
              </form>
            </div>
          </div>
        </div>

        <div class="col-md-7">
          <div class="cal-title d-both">
            <h4>Selecione o Método de Pagamento</h4>
          </div>

          <div id="methods-pag" class="bg-white">
            <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
              <li class="nav-item" role="presentation">
                <button class="nav-link btn-form-pag active" id="pills-cartao-tab" data-bs-toggle="pill" data-bs-target="#pills-cartao" type="button" role="tab" aria-controls="pills-cartao" aria-selected="true">
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" class="bi bi-credit-card-2-back" viewBox="0 0 16 16">
                    <path d="M11 5.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5z"/>
                    <path d="M2 2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zm13 2v5H1V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1m-1 9H2a1 1 0 0 1-1-1v-1h14v1a1 1 0 0 1-1 1"/>
                  </svg> 
                  <p>Cartão de Credito</p>
                </button>
              </li>

              <template v-if="mostraPix">
              <li class="nav-item" role="presentation">
                <button class="nav-link btn-form-pag" id="pills-pix-tab" data-bs-toggle="pill" data-bs-target="#pills-pix" type="button" role="tab" aria-controls="pills-pix" aria-selected="false">
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" class="bi bi-x-diamond-fill" viewBox="0 0 16 16">
                    <path d="M9.05.435c-.58-.58-1.52-.58-2.1 0L4.047 3.339 8 7.293l3.954-3.954L9.049.435zm3.61 3.611L8.708 8l3.954 3.954 2.904-2.905c.58-.58.58-1.519 0-2.098l-2.904-2.905zm-.706 8.614L8 8.708l-3.954 3.954 2.905 2.904c.58.58 1.519.58 2.098 0l2.905-2.904zm-8.614-.706L7.292 8 3.339 4.046.435 6.951c-.58.58-.58 1.519 0 2.098z"/>
                  </svg> 
                  <p>Pix</p>
                </button>
              </li>
              </template>

              <template v-if="mostraBoleto">
              <li class="nav-item" role="presentation">
                <button class="nav-link btn-form-pag" id="pills-boleto-tab" data-bs-toggle="pill" data-bs-target="#pills-boleto" type="button" role="tab" aria-controls="pills-boleto" aria-selected="false">
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" class="bi bi-upc-scan" viewBox="0 0 16 16">
                    <path d="M1.5 1a.5.5 0 0 0-.5.5v3a.5.5 0 0 1-1 0v-3A1.5 1.5 0 0 1 1.5 0h3a.5.5 0 0 1 0 1zM11 .5a.5.5 0 0 1 .5-.5h3A1.5 1.5 0 0 1 16 1.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 1-.5-.5M.5 11a.5.5 0 0 1 .5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 1 0 1h-3A1.5 1.5 0 0 1 0 14.5v-3a.5.5 0 0 1 .5-.5m15 0a.5.5 0 0 1 .5.5v3a1.5 1.5 0 0 1-1.5 1.5h-3a.5.5 0 0 1 0-1h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 1 .5-.5M3 4.5a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0zm2 0a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0zm2 0a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0zm2 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3 0a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0z"/>
                  </svg> 
                  <p>Boleto</p>
                </button>
              </li>
              </template>
            </ul>

            <hr>

            <div class="tab-content" id="pills-tabContent">
              <div class="tab-pane fade show active" id="pills-cartao" role="tabpanel" aria-labelledby="pills-cartao-tab" tabindex="0">
                
                Cartão de Credito ...
                <div class="text-center">
                  <button type="button" class="btn-finish" @click="pagConfirmacao()">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle" viewBox="0 0 16 16">
                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                      <path d="m10.97 4.97-.02.022-3.473 4.425-2.093-2.094a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05"/>
                    </svg>
                    <div class="text">Finalizar Pagamento</div>
                  </button>
                </div>
              </div>

              <template v-if="mostraPix">
              <div class="tab-pane fade" id="pills-pix" role="tabpanel" aria-labelledby="pills-pix-tab" tabindex="0">
                
                <p class="text-center">Após a confirmação do pedido você receberá o seu ingresso(s)</p>

                <div class="text-center">
                  <button type="button" class="btn-finish" @click="pagConfirmacao()">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle" viewBox="0 0 16 16">
                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                      <path d="m10.97 4.97-.02.022-3.473 4.425-2.093-2.094a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05"/>
                    </svg>
                    <div class="text">Gerar QR Code</div>
                  </button>
                </div>
              </div>
              </template>

              <template v-if="mostraBoleto">
              <div class="tab-pane fade" id="pills-boleto" role="tabpanel" aria-labelledby="pills-boleto-tab" tabindex="0">
                
                <p class="text-center">Para pagamento via boleto será acrescido um valor de <b>{{ gt_moeda }} {{ formatValor(detalhesCompra.val_taxa_bol) }}</b> referente a taxa de emissão e liquidação do mesmo.</p>

                <div class="text-center">
                  <button type="button" class="btn-finish" @click="pagConfirmacao()">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle" viewBox="0 0 16 16">
                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                      <path d="m10.97 4.97-.02.022-3.473 4.425-2.093-2.094a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05"/>
                    </svg>
                    <div class="text">Gerar Boleto</div>
                  </button>
                </div>
              </div>
              </template>
              
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>

  <FooterInclude></FooterInclude>
</template>

<script>
import guardaIngressos from '@/store/guardaIngressos.js';
import infoUsuario from "@/store/infoUsuario.js";

import HeaderInclude from "./includes/HeaderInclude.vue";
import FooterInclude from "./includes/FooterInclude.vue";
import Alert from "@/components/alerts/AlertAcao.vue";

import { preparaTituloLink, formatValor } from '@/utils/formDadosEvento.js';

//import endPointValeDesconto from '@/services/endPointValeDesconto.js';
import endPointConfig from '@/services/endPointConfig.js';

export default {
  components: {
    HeaderInclude, FooterInclude, Alert 
  },
  data() {
    return {
      detalhesCompra: guardaIngressos.getAll(),
      gt_moeda: 'R$',
      //totalevento: {},
      totalevento: 0,
      totalDaSelecao: 0,
      subTotal: 0,
      valeDesconto: '',
      retorno: undefined,
      keyPagamento: {},
      mostraBoleto: false,
      mostraPix: false,
    }
  },
  async created() {
    const ingressos = guardaIngressos.getAll();
    const config = this.$route.meta.config;

    
    let somaValores = 0;
    let tot = 0;

    if(config) this.gt_moeda = config.gt_moeda;

    for(let ing in ingressos.ingresso) {
      tot += ingressos.ingresso[ing].valorTot * ingressos.ingresso[ing].qtd;
      somaValores = tot;

      if(ingressos.aceita_boleto == 'S' && ingressos.ingresso[ing].aceita_bol == 'S') {
        this.mostraBoleto = true;
      }

      if(ingressos.aceita_pix == 'S' || ingressos.aceita_pix_aarin == 'S') {
        this.mostraPix = true;
      }

      this.totalevento = tot;
    }

    tot = 0;
    this.subTotal += somaValores;

    somaValores += ingressos.forma_ent_valor;
    this.totalDaSelecao += somaValores;

    //pegando as chaves de pagamento -------------
    this.keyPagamento = await endPointConfig.getChavesPag(ingressos.eve_cod);
  


    
    /*for(let i in ingressos) {
      for(let ing in ingressos[i].ingresso) {
        tot += ingressos.ingresso[ing].valorTot * ingressos.ingresso[ing].qtd;
        somaValores = tot;

        this.totalevento[i] = tot; 
      }

      tot = 0;
      this.subTotal += somaValores;
      
      somaValores += ingressos[i].forma_ent_valor;
      this.totalDaSelecao += somaValores;
    }*/
  },
  methods: {
    formatValor,
    preparaTituloLink,
    async aplicarValeDesconto() {
      /*if(this.valeDesconto == '') {
        this.retorno = 'SIT-WN391001 : Insira um vale desconto valido!';
        return;
      }

      for(let i in this.detalhesCompra) {
        console.log(this.detalhesCompra[i].eve_cod);
      }

      const result = await endPointValeDesconto.utilizarValeDesconto(this.valeDesconto);

      this.retorno = result;*/
    },
    estadoAlerta(data) {
      this.retorno = data; 
    },
    pagConfirmacao() {
      console.log(guardaIngressos.getAll());
      console.log(infoUsuario.get());
      console.log(this.keyPagamento);
    }
  }
}
</script>

<style scoped>
#area-checkout {
  background-color: #f6f6f6;
}
#area-checkout .container {
  max-width: 1200px;
}
.cal-title {
  background: var(--primeira-cor);
  padding: 1rem;
}
.cal-title h4 {
  color: #fff;
  font-family: 'Poppins', sans-serif;
  line-height: 1.1;
  font-weight: 400;
  font-size: 18px;
  margin: 0;
}
.car-right-body {
  font-family: 'Lato', sans-serif;
  font-size: 16px;
  line-height: 23px;
  color: #707070;
}
.bg-white {
  padding: 2rem;
  margin-bottom: 2rem;
}
#form-cupom {
  display: flex;
}
#form-cupom .input-rounded-l {
  height: 50px;
  width: 100%;
  border: 2px solid;
  border-color: rgb(229 231 235);
  border-radius: 10px 0px 0px 10px;
  padding: 12px;
}
#form-cupom .btn-apply-desc {
  border-radius: 0px 10px 10px 0px;
  background-color: var(--primeira-cor);
  text-transform: uppercase;
  color: #fff;
  border: 2px solid;
  border-color: var(--primeira-cor);
  padding: 10px;
  font-weight: 700;
}
.car-right-body h4 {
  font-family: 'Poppins', sans-serif;
  line-height: 1.1;
  font-weight: 400;
  color: #222222;
  font-size: 18px;
}
.label-tax {
  font-size: 14px;
  color:#4C455A;
}
.d-flex-bet {
  justify-content: flex-start;
  align-items: center;
  display: flex;
}
.d-flex-bet img {
  width: 120px;
  padding: 10px;
}
.car-right-body ul {
  display: grid;
  padding-left: 0;
  margin-bottom: 0;
  list-style: none;
  width: 100%;
}
.car-right-body ul li {
  display: flex;
  list-style: none;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #efefef;
  padding: 8px 20px;
  margin-bottom: 5px;
  background: #fff;
}
.btn-form-pag {
  width: 120px;
  border: 1px solid #ccc;
  margin: 10px;
  height: 120px;
  display: grid;
  justify-content: center;
  align-items: center;
}
.btn-form-pag svg {
  text-align: center;
  margin: 0 auto;
  color: #707070;
}
.btn-form-pag p {
  margin: 0;
  font-family: 'Lato', sans-serif;
  font-size: 16px;
  line-height: 23px;
  color: #707070;
  font-weight: 600;
}
.btn-form-pag.active {
  background-color: var(--primeira-cor);
}
.btn-form-pag.active svg,
.btn-form-pag.active p {
  color: #fff;
}
</style>