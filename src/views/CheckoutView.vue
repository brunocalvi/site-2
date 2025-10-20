<template>
  <HeaderInclude></HeaderInclude>

  <Alert v-if="retorno != undefined" :msg="retorno" @fechar="estadoAlerta"></Alert>

  <template v-if="processando">
    <IniciaProcessando></IniciaProcessando>
  </template>

  <template v-else>
    <div id="area-checkout">
      <div class="container">

        <div class="row py-5 d-both">
          <div class="col-md-12">
            <router-Link :to="{ name: 'home' }">
              <button class="Btn-edit-ing">
                <span class="text">Continuar</span>
                <span class="icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-cart2" viewBox="0 0 16 16">
                    <path d="M0 2.5A.5.5 0 0 1 .5 2H2a.5.5 0 0 1 .485.379L2.89 4H14.5a.5.5 0 0 1 .485.621l-1.5 6A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.485-.379L1.61 3H.5a.5.5 0 0 1-.5-.5M3.14 5l1.25 5h8.22l1.25-5zM5 13a1 1 0 1 0 0 2 1 1 0 0 0 0-2m-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0m9-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2m-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0"/>
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
              <template v-for="detalhe in detalhesCompra" :key="detalhe.eve_cod">
                <div class="d-flex-bet">
                  <div><img :src="detalhe.logo" :alt="detalhe.eve_nome" class="icon-chekout"></div>

                  <div>
                    <p>
                      <b>Evento:</b> {{ detalhe.eve_nome }}<br>
                      <b>Ingresso(s):</b><br> 
                      <template v-for="ing in detalhe.ingresso" :key="ing.ite_cod">
                        {{ ing.qtd }}x - {{ ing.nome_setor_lote }}
                        <span v-show="ing.label_mas_id != null">
                        | assento: {{ ing.label_mas_id }}
                        </span><br> 
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
              </template>
   
              <ul>
                <li><span>Subtotal:</span> <span>{{ gt_moeda }} {{ formatValor(subTotal) }}</span></li>
                <li><span>Vale Desconto:</span> <span>{{ gt_moeda }} {{ valor_desconto }}</span></li>
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

              <template v-if="varisoGateways == false">
                <template v-if="totalDaSelecao != 0">
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
                      
                      <p class="text-center">Após confirmação de pagamento do seu pedido você receberá o(s) seu(s) ingresso(s)</p>

                      <div class="text-center">
                        <button type="button" class="btn-finish" @click="pagConfirmacaoPix()">
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
                      
                      <p class="text-center">Após confirmação de pagamento do seu pedido você receberá o(s) seu(s) ingresso(s)</p>

                      <p class="text-center" v-show="val_taxa_bol != 0">
                        Para pagamento via boleto será acrescido um valor de <b>{{ gt_moeda }} {{ formatValor(val_taxa_bol) }}</b> referente a taxa de emissão e liquidação do mesmo.
                      </p>

                      <div class="text-center">
                        <button type="button" class="btn-finish" @click="pagConfirmacaoBoleto()">
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
                </template>

                <template v-else>
                  <h4 class="text-center">Clique no botão abaixo para concluir a sua compra</h4>
                  <p class="text-center">Não há valores a pagar sobre essa compra.</p>

                  <div class="text-center">
                    <button type="button" class="btn-finish" @click="pagConfirmacaoIsento()">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                        <path d="m10.97 4.97-.02.022-3.473 4.425-2.093-2.094a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05"/>
                      </svg>
                      <div class="text">Finalizar Compra</div>
                    </button>
                  </div>
                </template>
              </template>

              <template v-else>
                <h4 class="text-center">Houve um problema na forma de pagamento.</h4>
                <p class="text-center">A forma de pagamento dos eventos é incompatível, é preciso fazer a compra desses eventos separadamente.</p>
              </template>

            </div>
          </div>
        </div>

      </div>
    </div>
  </template>

  <FooterInclude></FooterInclude>
</template>

<script>
import { guardaIngressoStore } from '@/store/guardaIngressos.js';
import { infoUsuarioStore } from '@/store/infoUsuario.js';
//import infoUsuario from "@/store/infoUsuario.js";
//import dadosValeDesconto from '@/store/dadosValeDesconto.js';

import HeaderInclude from "./includes/HeaderInclude.vue";
import FooterInclude from "./includes/FooterInclude.vue";
import Alert from "@/components/alerts/AlertAcao.vue";
import IniciaProcessando from '@/components/IniciaProcessando.vue';

import { preparaTituloLink, formatValor } from '@/utils/formDadosEvento.js';

import endPointValeDesconto from '@/services/endPointValeDesconto.js';
import endPointConfig from '@/services/endPointConfig.js';
import endPointEvento from '@/services/endPointEvento.js';
//import submetDadosPag from '@/process/submetDadosPag.js';

import isentos from '@/process/processIsentos.js';
import pix from '@/process/processPix.js';
import boleto from '@/process/processBoleto.js';

export default {
  components: {
    HeaderInclude, FooterInclude, Alert, IniciaProcessando 
  },
  data() {
    return {
      usuarioStore: infoUsuarioStore(), 
      evento: guardaIngressoStore(), 
      detalhesCompra: {},
      gt_moeda: 'R$',
      totalevento: {},
      subTotalevento: {},
      totalDaSelecao: 0,
      subTotal: 0,
      valeDesconto: '',
      valor_desconto: '0,00',
      retorno: undefined,
      keyPagamento: [],
      mostraBoleto: false,
      mostraPix: false,
      jsonFinal: {},
      processando: false,
      usuario: {},
      link_sistema: process.env.VUE_APP_LINK_SISTEMA,
      varisoGateways: false,
      val_taxa_bol: 0,
    }
  },
  async created() {
    this.detalhesCompra = this.evento.getAll();
    this.usuario = this.usuarioStore.get();

    const ingressos = this.detalhesCompra;
    const config = this.$route.meta.config;

    let somaValores = 0;
    let tot = 0;

    if(config) this.gt_moeda = config.gt_moeda;

    //console.log(ingressos);

    for(let ing in ingressos) {
      for(let i in ingressos[ing].ingresso) {
        tot += ingressos[ing].ingresso[i].valorTot * ingressos[ing].ingresso[i].qtd;

        if(ingressos[ing].aceita_boleto == 'S' && ingressos[ing].ingresso[i].aceita_bol == 'S') {
          this.mostraBoleto = true;
        }
      }

      somaValores = tot;
      tot = 0;

      this.subTotalevento[ing] = somaValores;
      this.totalevento[ing] = somaValores; 

      if(Object.keys(ingressos[ing].desconto).length !== 0) {
        this.valor_desconto = ingressos[ing].desconto.val_desconto; 
        somaValores = somaValores - ingressos[ing].desconto.val_desconto;
      }
 
      if(ingressos[ing].aceita_pix == 'S' || ingressos[ing].aceita_pix_aarin == 'S') {
        this.mostraPix = true;
      }

      if(ingressos[ing].val_taxa_bol != 0) {
        this.val_taxa_bol = ingressos[ing].val_taxa_bol;
      }
    }

    let soma = 0;
    let somaSub = 0;
    for(const chave in this.totalevento) {
      soma += this.totalevento[chave] + ingressos[chave].forma_ent_valor;
      somaSub += this.subTotalevento[chave];
    }

    this.subTotal += somaSub;
    this.totalDaSelecao += soma;

    //pegando as chaves de pagamento -------------
    let gatewayMult = '';
    
    for(let eve in this.detalhesCompra) {
      try {
        gatewayMult = await endPointConfig.getChavesPag(eve);
        this.keyPagamento.push(gatewayMult);

        //console.log(this.keyPagamento);
      } catch(e) {
        this.retorno = "SIS-ZJ534215 : Ocorreu um erro ao consultar as configurações de pagamento. Por favor, tente novamente.";
      }
    }

    for(let i = 0; i < this.keyPagamento.length; i++) {
      if(this.keyPagamento[0].gateway_cartao != this.keyPagamento[i].gateway_cartao) {
        this.varisoGateways = true;
      }
    }
  },
  methods: {
    formatValor,
    preparaTituloLink,
    list_qtd_ite_cod() {
      const eventos = this.detalhesCompra;

      let dados = {};
      let list_qtd_ing = {};
      let list_ite_cod = {};

      for(let id in eventos) {
        let qtd_ing = [];
        let ite_cod = [];

        for(let ing in eventos[id].ingresso) {
          qtd_ing.push(eventos[id].ingresso[ing].qtd);
          ite_cod.push(eventos[id].ingresso[ing].ite_cod);
        }

        list_qtd_ing = qtd_ing;
        list_ite_cod = ite_cod;

        dados[id] = {
          eve_cod: eventos[id].eve_cod,
          eve_nome: eventos[id].eve_nome,
          eve_qtde_cpf: eventos[id].eve_qtde_cpf,
          ite_cod: list_ite_cod.toString(),
          qtd_ing: list_qtd_ing.toString(), 
        };
      }

      return  dados;
    },
    async aplicarValeDesconto() {
      const eventos = this.detalhesCompra; 
      const list = this.list_qtd_ite_cod();
      let data = {};
      let result = undefined;
      let retorno = undefined;

      if(this.valeDesconto == null || this.valeDesconto == '') {
        retorno = `SIT-FE314804 : Insira um vale desconto valído.`;

      } else {
        for(let id in list) {
          data = {
            eve_cod: id,
            cod_vale: this.valeDesconto.replace(/ /g, "%20"),
            valor_compra: this.totalevento[id],
            list_qtd_ing: list[id].qtd_ing,
            list_ite_cod: list[id].ite_cod,
            forma_entrega: eventos[id].form_entrega,
            pdv_id: eventos[id].pdv_id,
          }

          try {
            let resV;
            result = await endPointValeDesconto.utilizarValeDesconto(data);

            if(result.statusId == "00") {
              let desconto = {
                val_desconto: result.valor_desconto.replace(/,/g, '.'),
                val_desconto_exibir: result.valor_desconto_exibir,
                val_total: result.valor_total.replace(/,/g, '.'),
                val_id: result.val_id,
              }

              eventos[id].desconto = desconto;

              this.valor_desconto = result.valor_desconto,
              this.totalDaSelecao = this.totalDaSelecao - result.valor_desconto.replace(/,/g, '.'); 

              resV = `O vale desconto foi aplicado com sucesso no evento ${list[id].eve_cod} - ${list[id].eve_nome}`;
            } else {
              eventos[id].desconto = {};
            }

            if(resV == undefined) {
              retorno = `SIS-HS846777 : O vale desconto não está disponivel para nenhum evento no carrinho.`; 
            } else {
              retorno = resV; 
            }
          } catch(e) {
            retorno = `SIT-DS671367 : Houve um problema ao consultar a quantidade disponível no lote do evento ${list[id].eve_cod} - ${list[id].eve_nome}.`;
          }
        }
      }

      this.valeDesconto = '';
      this.retorno = retorno;
    },
    async validaRestricaoCpfMeia() {
      const list = this.list_qtd_ite_cod();
      let result = undefined;
      let retorno = undefined;

      for(let i in list) {
        try { 
          result = await endPointEvento.restricaoCpfMeia({
            eve_cod: list[i].eve_cod,
            user_id: this.usuario.id,
            list_qtd_ing: list[i].qtd_ing,
            list_ite_cod: list[i].ite_cod,
          });

          if(result.statusId == "01") {
            retorno = `SIS-IU560171 : ${result.statusMsg}`; 
          }

          if(result.liberado == 0) {
            retorno = `SIS-DA57022 : Quantidade selecionada excedeu o permitido por usuário para o evento ${list[i].eve_nome}, limitado em ${list[i].eve_qtde_cpf} unidade(s) por CPF.`; 
          }

          if(result.statusId == "00") {
            try {
              result = await endPointEvento.restricaoCpfitemLote({
                eve_cod: list[i].eve_cod,
                user_id: this.usuario.id,
                list_qtd_ing: list[i].qtd_ing,
                list_ite_cod: list[i].ite_cod,
              });

              if(result.statusId != "00") {
                retorno = `SIS-SX168776 : ${result.statusMsg}`;
              }
              
            } catch(e) {
              retorno = `SIT-DS671367 : Houve um problema ao consultar a quantidade disponível no lote do evento ${list[i].eve_cod} - ${list[i].eve_nome}.`;
            }
          }
        } catch(e) {
          retorno = `SIT-OA282843 : Houve um problema ao consultar a quantidade disponível do evento ${list[i].eve_cod} - ${list[i].eve_nome}.`;
        }
      }

      return retorno;
    },
    async validaPreCadastro() {
      let result = undefined;
      let retorno = undefined;

      for(const eve_cod in this.detalhesCompra) {
        result = await endPointEvento.restricaoPreCadastro({
          eve_cod: eve_cod,
          user_id: this.usuario.id,
        });

        if(result.statusId != '00') {
          retorno = `SIS-GV493591 : ${result.statusMsg}`;
        }
      }

      return retorno;
    },
    estadoAlerta(data) {
      this.retorno = data; 
    },
    async pagConfirmacaoIsento() {
      this.jsonFinal = await isentos.processaIsentos(this.keyPagamento[0]);
      this.pagConfirmacao();
    },
    async pagConfirmacaoPix() {
      this.jsonFinal = await pix.processaPix(this.keyPagamento[0]);
      this.pagConfirmacao();
    },
    async pagConfirmacaoBoleto() {
      this.jsonFinal = await boleto.processaBoleto(this.keyPagamento[0]);
      this.pagConfirmacao();
    },
    async pagConfirmacao() {
      let restricao = undefined;

      restricao = await this.validaRestricaoCpfMeia();

      if(restricao == undefined) {
        restricao = await this.validaPreCadastro();
      }

      if(restricao == undefined) {
        this.processando = true;
        let link_pagto = ''; 

        const gateway = this.jsonFinal.gateway;
        const forma_pagto = this.jsonFinal.venda.forma_pagto;

        if(gateway == "MPTP" || gateway == "MPMKT") {
          link_pagto = `${this.link_sistema}mp_api/index.php`;
        } else if ((gateway == "PSG_T" || gateway == "PSG_S") && forma_pagto != "PIX") {
          link_pagto = `${this.link_sistema}pseg_api/index.php`;
        }else if ((gateway == "PSG_T" || gateway == "PSG_S") && forma_pagto == "PIX") {
          link_pagto = `${this.link_sistema}pseg_api/index_pix.php`;
        } else if (gateway == "PICP") {
          link_pagto = `${this.link_sistema}picpay_api/index.php`;
        } else if (gateway == "MPAG") {
          link_pagto = `${this.link_sistema}mp_api/index_pro.php`;
        } else if (gateway == "PAGAR") {
          link_pagto = `${this.link_sistema}pagar_api/index.php`;
        } else if (gateway == "AARIN") {
          link_pagto = `${this.link_sistema}aarin_api/index.php`;
        } else if (gateway == "ASAAS_T" || gateway == "ASAAS_S") {
          link_pagto = `${this.link_sistema}asaas_api/index.php`;
        } else if (gateway == "SAFRA_T") {
          link_pagto = `${this.link_sistema}safra_api/index.php`;
        } else {
          //isento
          link_pagto = `${this.link_sistema}mp_api/index.php`;
        }

        try {

          console.log(link_pagto);
          console.log(this.jsonFinal);

          /*let pag = await submetDadosPag.processaPagamento(link_pagto, this.jsonFinal);

          if(pag.status == '3DS') {
            alert('Carregar o 3DS para processamento ...');

          } else {
            setTimeout(() => {
              this.$router.push({
                name: 'confirmacao',
                params: {
                  retorno_sis: JSON.stringify(pag),
                }
              });
            }, "6000");
          }*/

        } catch(e) {
          alert('erro ao Fazer o pagamento, vou retorna ao inicio!');
          this.$router.push('/');
        }
      } else {
        this.retorno = restricao; 
      }
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