<template>
  <HeaderInclude></HeaderInclude>

  <Alert v-if="retorno != undefined" :msg="retorno" @fechar="estadoAlerta"></Alert>

  <div class="titulo-evento-principal" v-show="confirmacao.eve_cod != ''">
    <h3>{{ evento.nome }}</h3>
  </div>

  <section class="slider-section">
    <div class="container diminui-tamanho-div">
      <div class="card-resumo-event" v-show="status == 'PG'">
        <div class="row">
          <div class="col-md-4">
            <div class="d-flex">
              <img :src="logo" :title="evento.nome">
            </div>
          </div>

          <div class="col-md-8">
            <h4>{{ evento.nome }}</h4>
            <ul>
              <li>
                <span class="dtts1">Data:</span>
                <span class="dtts2">{{ data_verificada }}</span>
              </li>
              <li>
                <span class="dtts1">Horário:</span>
                <span class="dtts2">{{ evento.horaInicio }}</span>
              </li>
              <li>
                <span class="dtts1">Local:</span>
                <span class="dtts2">{{ evento.local }}</span>
              </li>
              <li>
                <span class="dtts1">Endereço:</span>
                <span class="dtts2">
                  {{ evento.endereco }}<br/>
                  {{ evento.cidade }} - {{ evento.estado }}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <template v-if="status == 'PG'">

        <div class="row">
          <div class="col-md-6">
            <div class="card-resumo-event text-center">
              <div>
                <p>Um e-mail de confirmação foi enviado para você.</p>
                <br/>
                <a :href="confirmacao.link_voucher" target="_blank">
                  <button class="btn btn-success button-print-ticket">
                    <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" fill="currentColor" class="bi bi-ticket-perforated" viewBox="0 0 16 16">
                      <path d="M4 4.85v.9h1v-.9zm7 0v.9h1v-.9zm-7 1.8v.9h1v-.9zm7 0v.9h1v-.9zm-7 1.8v.9h1v-.9zm7 0v.9h1v-.9zm-7 1.8v.9h1v-.9zm7 0v.9h1v-.9z"/>
                      <path d="M1.5 3A1.5 1.5 0 0 0 0 4.5V6a.5.5 0 0 0 .5.5 1.5 1.5 0 1 1 0 3 .5.5 0 0 0-.5.5v1.5A1.5 1.5 0 0 0 1.5 13h13a1.5 1.5 0 0 0 1.5-1.5V10a.5.5 0 0 0-.5-.5 1.5 1.5 0 0 1 0-3A.5.5 0 0 0 16 6V4.5A1.5 1.5 0 0 0 14.5 3zM1 4.5a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 .5.5v1.05a2.5 2.5 0 0 0 0 4.9v1.05a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-1.05a2.5 2.5 0 0 0 0-4.9z"/>
                    </svg> Imprimir ingresso
                  </button>
                </a>

                <br/>
                <template v-if="ingresso_nominal == 'S'">
                <p>Os ingressos desse evento são nominais então precisa ser associado a um usuário, utilize o formulário abaixo para isso ou caso não tenha os dados em mão, esse processo pode ser feito posteriormente na área do usuário</p>
                </template>
              </div>
            </div>
          </div>

          <div class="col-md-6">
            <div class="card-resumo-event">
              <ResumoTrasancao 
                :nome="evento.nome"
                :data_compra="data_compra"
                :pag_id="pag_id"
                :forma_pagto="confirmacao.forma_pagto"
                :valor_total="Number(confirmacao.valor_total)"
                :status="confirmacao.status"
                :form_entre_descricao="forma_entrega.descricao"
                :referente="confirmacao.referente"
              ></ResumoTrasancao>
            </div>
          </div>
        </div>

        <br/>

        <template v-if="ingresso_nominal == 'S'">
          <div id="ingresso-nominal" class="text-center">
            <h4 class="dashboard-content-box__title">Associacão de Ingressos Nominais</h4>
            <p class="sub-text-car">Reforçando caso não tenha os dados em mão, esse processo pode ser feito posteriormente na área do usuário.</p>
          </div>

          <div class="col-12 col-md-12">
            <AssocNominal :pag_id="pag_id" @retornoNominal="retornoNominal"></AssocNominal>
          </div>
        </template>
      </template>

      <template v-else-if="status == 'CA'">
        <div class="checkout-form__payment quadro-erro-comp">	
          <p class="modal-description title-resp"><b>Erro no processamento da transação</b></p>
          <template v-if="erro_pgto != ''">
            <p>Não foi possível gerar a compra, motivo: <br><span style="font-weight: 800;">{{ erro_pgto }}</span></p>
          </template>
          <template v-else>
            <p>Seu pagamento não foi autorizado. Verifique os dados e tente novamente ou entre em contato com a operadora do seu cartão.</p>
            <p>Você também pode escolher outro meio de pagamento, como boleto ou outro cartão de crédito.</p>
          </template>
        </div>       
      </template>

      <template v-else>
        <div class="row">
          <div class="col-md-6">
            <div class="card-resumo-event">

              <template v-if="confirmacao.forma_pagto == 'BOL' && confirmacao.gateway != 'MPAG'">
              <div>	
                <p class="modal-description title-resp">Siga as instruções para finalizar sua compra!</p>
                <div class="instructions-payment">
                  <ul>
                    <li>Clique no botão abaixo para imprimir o seu boleto bancário.</li>
                    <li>Seu pedido será liberado assim que o sistema receber a comprovação de pagamento do Boleto.</li>
                    <li>Se o Boleto não ser pago até o vencimento o pedido será cancelado automaticamente.</li>
                  </ul>
                  <br/>

                  <a :href="confirmacao.link_boleto" target="_blank">
                    <button class="btn btn-success button-print-ticket">
                      <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" fill="currentColor" class="bi bi-upc-scan" viewBox="0 0 16 16">
                        <path d="M1.5 1a.5.5 0 0 0-.5.5v3a.5.5 0 0 1-1 0v-3A1.5 1.5 0 0 1 1.5 0h3a.5.5 0 0 1 0 1zM11 .5a.5.5 0 0 1 .5-.5h3A1.5 1.5 0 0 1 16 1.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 1-.5-.5M.5 11a.5.5 0 0 1 .5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 1 0 1h-3A1.5 1.5 0 0 1 0 14.5v-3a.5.5 0 0 1 .5-.5m15 0a.5.5 0 0 1 .5.5v3a1.5 1.5 0 0 1-1.5 1.5h-3a.5.5 0 0 1 0-1h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 1 .5-.5M3 4.5a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0zm2 0a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0zm2 0a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0zm2 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3 0a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0z"/>
                      </svg> Imprimir Boleto
                    </button>
                  </a>
                </div>
              </div>
              </template> 
              
              <template v-else-if="(confirmacao.forma_pagto == 'DIN' || confirmacao.forma_pagto == 'PIX' ) && (confirmacao.gateway == 'MPTP' || confirmacao.gateway == 'MPMKT' || confirmacao.gateway == 'PSG_T' || confirmacao.gateway == 'PSG_S' || confirmacao.gateway == 'AARIN' || confirmacao.gateway == 'PAGAR' || confirmacao.gateway == 'ASAAS_T' || confirmacao.gateway == 'SAFRA_T')">

              <div>	
                <div class="instructions-payment">
                  <p class="modal-description text-center"><strong>Copie e cole o código abaixo.</strong></p>

                  <div class="text-center">
                    <button type="button" class="btn-finish pix-script" @click="copiarCodPix()">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-floppy" viewBox="0 0 16 16">
                        <path d="M11 2H9v3h2z"/>
                        <path d="M1.5 0h11.586a1.5 1.5 0 0 1 1.06.44l1.415 1.414A1.5 1.5 0 0 1 16 2.914V14.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 14.5v-13A1.5 1.5 0 0 1 1.5 0M1 1.5v13a.5.5 0 0 0 .5.5H2v-4.5A1.5 1.5 0 0 1 3.5 9h9a1.5 1.5 0 0 1 1.5 1.5V15h.5a.5.5 0 0 0 .5-.5V2.914a.5.5 0 0 0-.146-.353l-1.415-1.415A.5.5 0 0 0 13.086 1H13v4.5A1.5 1.5 0 0 1 11.5 7h-7A1.5 1.5 0 0 1 3 5.5V1H1.5a.5.5 0 0 0-.5.5m3 4a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5V1H4zM3 15h10v-4.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5z"/>
                      </svg>
                      <div class="text">Copiar PIX</div>
                    </button>
                  </div>

                  <br>

                  <textarea v-model="confirmacao.qr_code" id="texto-cod-pix" class="texto-cod-pix" readonly></textarea>

                  <template v-if="confirmacao.qr_code_base64 != '' || confirmacao.qr_code_link_img != ''">
                    <p class="text-center">Se preferir escaneie o QRcode abaixo</p>

                    <div class="col-md-12 d-flex" style="margin-bottom: 25px;"> 
                      <template v-if="confirmacao.qr_code_base64 != ''">
                        <img :src="`data:image/jpeg;base64,${confirmacao.qr_code_base64}`" class="img-qr-code"/>
                      </template>

                      <template v-if="confirmacao.qr_code_link_img != ''">
                        <img :src="confirmacao.qr_code_link_img" class="img-qr-code"/>
                      </template>
                    </div>
                  </template>

                  <p class="text-center">Se o seu pedido não for pago em até 30 minutos ele será cancelado automaticamente.</p><br>

                  <div id="btn-conf-pag-final" class="text-center">
                    <button type="button" class="btn-finish">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                        <path d="m10.97 4.97-.02.022-3.473 4.425-2.093-2.094a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05"/>
                      </svg>  
                      <div class="text">Confirmar Pagamento</div>
                    </button>
                  </div>

                </div>
              </div>

              </template>

              <template v-else>
                <template v-if="erro_pgto == ''">
                  Seu pagamento não foi autorizado ainda. 
                </template>
                <template v-else>
                  <p>
                    Estamos aguardando a resposta da operadora quanto à aprovação da transação.<br/>
                    Assim que obtivermos resposta você receberá um e-mail. A informação do status da compra também esta disponível na área do usuário.
                  </p>
                </template>
              </template>

            </div>
          </div>

          <div class="col-md-6">
            <div class="card-resumo-event">
              <ResumoTrasancao 
                :nome="evento.nome"
                :data_compra="data_compra"
                :pag_id="pag_id"
                :forma_pagto="confirmacao.forma_pagto"
                :valor_total="Number(confirmacao.valor_total)"
                :status="confirmacao.status"
                :form_entre_descricao="forma_entrega.descricao"
                :referente="confirmacao.referente"
              ></ResumoTrasancao>
            </div>
          </div>
        </div>
      </template>

      <div class="centralize-entre-btn-fi">
        <router-link class="btn-finish btn-f-rdape" to="/">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-house-door" viewBox="0 0 16 16">
            <path d="M8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4.5a.5.5 0 0 0 .5-.5v-4h2v4a.5.5 0 0 0 .5.5H14a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM2.5 14V7.707l5.5-5.5 5.5 5.5V14H10v-4a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v4z"/>
          </svg>    
          <div class="text">Home</div>
        </router-link>
      </div>
    </div>
  </section>

  <FooterInclude></FooterInclude>
</template>

<script>
import endPointEvento from '@/services/endPointEvento.js';
import endPointPagamento from '@/services/endPointPagamento.js';

import HeaderInclude from './includes/HeaderInclude.vue';
import FooterInclude from './includes/FooterInclude.vue';

import AssocNominal from '@/components/AssocNominal.vue';
import Alert from "@/components/alerts/AlertAcao.vue";
import ResumoTrasancao from '@/components/ResumoTrasancao.vue';

import { revisaLogoEvento, mesCompleto, diaSemana } from '@/utils/formDadosEvento.js';

export default {
  components: {
    HeaderInclude, FooterInclude, AssocNominal, Alert, ResumoTrasancao
  },
  data() {
    return {
      confirmacao: {},
      erro_pgto: '',
      status: 'CA',
      evento: {},
      logo: '',
      data_verificada: '',
      pag_id: 0,
      gt_moeda: 'R$',
      data_compra: '99/99/9999',
      forma_entrega: {},
      retorno: undefined,
      ingresso_nominal: 'N',
      cod_qr_code: '',
    }
  },
  async created() {
    const config = this.$route.meta.config;
    const dados = JSON.parse(this.$route.params.retorno_sis);
    this.pag_id = Number(dados.pag_id) || '';
    let erro = dados.erro || '';
    let msg = dados.msg || '';

    if(config) {
      this.gt_moeda = config.gt_moeda;
    }

    if(erro != '') this.erro_pgto = dados.erro;
    if(msg != '') this.erro_pgto = dados.msg;

    if(this.pag_id != '' && this.erro_pgto != '') { 
      await this.carregarDados();

      if(this.confirmacao.forma_pagto == 'PIX') {
        this.consultaEstadoTRN();
      }
    }
  },
  methods: {
    revisaLogoEvento,
    diaSemana,
    async carregarDados() {
      try {
        this.confirmacao = await endPointPagamento.getTrn(this.pag_id);

        this.status = this.confirmacao.status;
        this.ingresso_nominal = this.confirmacao.ingresso_nominal;
        this.cod_qr_code = this.confirmacao.qr_code;

        this.evento = await endPointEvento.dadosEvento({
          eve_cod: this.confirmacao.eve_cod,
          pdv_id: this.confirmacao.pdv_id
        });

        this.forma_entrega = await endPointEvento.dadosFormaEntrega(this.confirmacao.for_ent_id);

        this.logo = revisaLogoEvento(this.evento.logo);

        if(this.evento.Data.indexOf(' ') !== -1) {
          this.data_verificada = this.evento.Data;
        } else {
          this.data_compra = this.confirmacao.data_compra;
          let dataArr = this.evento.Data.split('/');
          this.data_verificada = `${dataArr[0]} de ${mesCompleto(dataArr[1])} de ${dataArr[2]} (${diaSemana(this.evento.Data)})`;
        }
      } catch(e) {
        this.erro_pgto = `Erro ao buscar TRN ${this.pag_id}`; 
        console.error(this.erro_pgto, e);
      }
    },
    async consultaEstadoTRN() {
      const consultanado = setInterval(async () => {
        let confirmacao = await endPointPagamento.getTrn(this.pag_id);

        if(confirmacao.status != this.status) {
          clearInterval(consultanado);
          this.retorno = "Sua compra foi processada com sucesso!";
          await this.carregarDados();
        }
      }, 4000);
    },
    estadoAlerta(data) {
      this.retorno = data; 
    },
    retornoNominal(value) {
      this.retorno = value; 
    },
    async copiarCodPix() {
      const cod = String(this.cod_qr_code);

      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(cod);

        } else {
          const textarea = document.querySelector("#texto-cod-pix");
          textarea.value = cod;
          textarea.select();
          document.execCommand("copy");
        }

        this.retorno = "Código PIX copiado com sucesso para a área de transferência!";
      } catch (err) {
        this.retorno = "Não foi possível copiar o código PIX.";
        console.error("Falha ao copiar texto:", err);
      }
    }
  }
}
</script>

<style>
.diminui-tamanho-div {
  max-width: 1200px;
}
.slider-section {
  background-color: #f6f6f6;
  padding: 3rem 0;
}
.quadro-erro-comp {
  max-width: 600px;
  background: #ffffff;
  -webkit-box-shadow: 0px 1px 5px 0px rgb(0 0 0 / 10%);
  -moz-box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.10);
  -o-box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.10);
  -ms-box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.10);
  box-shadow: 0px 1px 5px 0px rgb(0 0 0 / 10%);
  padding: 30px;
  margin: 0 auto;
  border-radius: 10px;
  font-size: 16px;
  line-height: 23px;
  color: #707070;
}
.title-resp {
  margin-bottom: 10px;
  font-weight: 600;
  font-size: 17px;
  color: #000;
}
.centralize-entre-btn-fi {
  max-width: 120px;
  margin: 0 auto; 
}
.card-resumo-event {
  border-bottom: 1px solid #e2e2e2;
  padding: 35px;
  background: #ffffff;
  -webkit-box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.10);
  -moz-box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.10);
  -o-box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.10);
  -ms-box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.10);
  box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.10);
  margin: 0 auto;
  margin-top: 2rem;
}
.card-resumo-event img {
  /*width: 100%;*/
  margin: 0 auto;
  border-radius: 5px;
  margin-bottom: 10px;
  max-height: 350px;
  max-width: 200px;
}
.card-resumo-event ul {
  padding: 0;
  list-style: none;
}
.dtts1 {
  float: left;
  width: 130px;
  font-weight: 700;
  margin-bottom: 5px;
}
.dtts2 {
  float: left;
  width: calc(100% - 130px);
  margin-bottom: 5px;
}
.button-print-ticket {
  display: grid;
  justify-content: center;
  align-items: center;
  width: 150px;
  color: #fff;
  padding: 15px;
  border-radius: 10px;
  text-transform: uppercase;
  font-size: 17px;
  font-weight: bold;
  margin: 0 auto;
}
.button-print-ticket svg {
  margin: 0 auto;
  margin-bottom: 10px;
}
.job-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1.2em;
  max-width: 30em;
  font-family: 'Lato', sans-serif;
  font-size: 16px;
  line-height: 23px;
}
.job-card p {
  margin: 0;
}
.text-title {
  display: -webkit-box;
  /*-webkit-line-clamp: 1;*/
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-size: 1.25em;
  font-weight: 600;
  font-family: "Noto Sans", sans-serif;
  line-height: 23px;
  color: #707070;
}
.post-date {
  color: #598551;
}
.budget-exp {
  display: flex;
  gap: 5em;
}
.budget-exp .label {
  font-size: 1em;
  color: #598551;
  min-width: 135px;
}
.budget-exp .value {
  font-size: 1em;
  font-weight: 600;
  line-height: 1.5rem;
  color: #707070;
}
.form-pag {
  white-space: break-spaces;
}
.txt-adqu {
  font-size: 1em;
  color: #598551;
  font-weight: 600;
}
.text-body {
  display: -webkit-box;
  /*-webkit-line-clamp: 2;*/
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-family: "Poppins", sans-serif;
  letter-spacing: 0.4px;
  font-size: 16px;
  line-height: 23px;
  color: #707070!important;
}
.instructions-payment ul {
  padding-left: 2rem;
  list-style: auto;
}
.instructions-payment ul li {
  margin-bottom: 6px;
}
.texto-cod-pix {
  padding: 25px;
  font-size: 12px;
  margin-bottom: 25px;
  background-color: #f6f6f6;
  border-radius: 8px;
  word-break: break-all;
  border: none;
  width: 100%;
  height: 125px;
}
</style>