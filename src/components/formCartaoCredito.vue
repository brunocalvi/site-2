<template>
  <div class="checkout-form__details">

    <h4 class="checkout-form__title">Dados do cartão</h4>
    <p>Gateway: {{ gateway }}</p>

    <template v-if="dadosGateway.eve_aceita_clear_s == 'S' || dadosGateway.eve_titular_cartao == 'S'">
      <div class="mt-1">
          <div class="alert alert-danger" role="alert">
            <p class="text-center mb-0">O cartão de crédito deve ser associado ao proprietário do cadastro!</p>
          </div> 
      </div>
    </template>

    <div class="row">
      <div class="col-md-12">
        <div class="checkout-form__input">
          <label class="form-label">Nome do titular (como está no cartão) *</label>
          <input type="text" class="form-control" name="cardholderName" id="cardholderName" data-checkout="cardholderName" data-pagarmecheckout-element="holder_name" maxlength="50" autocomplete=off placeholder="Nome do titular" required>
          <input data-checkout="docType" id="docType" type="hidden" value="CPF"/> 
        </div>
      </div>

      <div class="col-md-12">
        <div class="checkout-form__input">
          <label class="form-label">Número do cartão *</label>
          <template v-if="gateway == 'PAGAR' || gateway == 'ASAAS_T' || gateway == 'SAFRA_T'">
            <input name="n_car" type="text" size="16" maxlength="16" class="form-control pseg_t_cc" onselectstart="return false" onpaste="return false" oncopy="return false" oncut="return false" ondrag="return false" ondrop="return false" autocomplete=off placeholder="Numero do Cartão" required>
          </template>
          <template v-else>
            <template v-if="gateway == 'MPTP' || gateway == 'MPMKT'">
              <div id="cardNumber" style="height: 50px;"></div>
            </template>
            <template v-else>
              <input type="text" class="form-control pseg_t_cc" aria-label="cardNumber" id="cardNumber" data-checkout="cardNumber" onselectstart="return false" onpaste="return false" oncopy="return false" oncut="return false" ondrag="return false" ondrop="return false" autocomplete=off placeholder="Numero do Cartão" required>
            </template>
          </template>
        </div>
      </div>

      <template v-if="gateway == 'MPTP' || gateway == 'MPMKT'">
        <div class="col-md-6">
          <div class="sidebar-widget-02__form">
            <div class="checkout-form__input">
              <label class="form-label">Mês/Ano*</label>
              <div id="expirationDate" style="height: 50px;" ></div>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="col-md-6">
          <div class="sidebar-widget-02__form">
            <div class="checkout-form__input">
              <label class="form-label">Mês*</label>
              <b-form-select class="form-control" name="m_car" id="cardExpirationMonth" data-checkout="cardExpirationMonth" onselectstart="return false" onpaste="return false" oncopy="return false" oncut="return false" ondrag="return false" ondrop="return false" autocomplete=off required>
                <option class="level-0" value="">--</option>
                <option class="level-0" value="1">01</option>
                <option class="level-0" value="2">02</option>
                <option class="level-0" value="3">03</option>
                <option class="level-0" value="4">04</option>
                <option class="level-0" value="5">05</option>
                <option class="level-0" value="6">06</option>
                <option class="level-0" value="7">07</option>
                <option class="level-0" value="8">08</option>
                <option class="level-0" value="9">09</option>
                <option class="level-0" value="10">10</option>
                <option class="level-0" value="11">11</option>
                <option class="level-0" value="12">12</option>
              </b-form-select>  
            </div>
          </div>
        </div>

        <div class="col-md-6">
          <div class="sidebar-widget-02__form">
            <div class="checkout-form__input">
              <label class="form-label">Ano*</label>
              <b-form-select class="form-control" name="a_car" id="cardExpirationYear" data-checkout="cardExpirationYear" maxlength="4" onselectstart="return false" onpaste="return false" oncopy="return false" oncut="return false" ondrag="return false" ondrop="return false" autocomplete=off :options="anosCartao" v-model="selectedCard" required></b-form-select>  
            </div>
          </div>
        </div>
      </template>

      <div class="col-md-6">
        <div class="checkout-form__input">
          <label class="form-label">Cód. de segurança *</label>
          <template v-if="gateway == 'MPTP' || gateway == 'MPMKT'">
            <div id="securityCode" style="height: 50px;"> </div> 
          </template>
          <template v-else>
            <input type="text" class="form-control" name="c_car" placeholder="CVV" id="securityCode" data-checkout="securityCode" maxLength="4" onselectstart="return false" onpaste="return false" oncopy="return false" oncut="return false" ondrag="return false" ondrop="return false" autocomplete=off required>
          </template>
        </div>
      </div>

      <div class="col-md-6">
        <div class="sidebar-widget-02__form">
          <div class="checkout-form__input" id="select_parcelas">
            <template v-if="juros_personalizado == 'S'">
              <label class="form-label">Parcelas*</label>
              <b-form-select class="form-control" id="installments" name="installments" :options="parcelasCustomizadas" v-model="selectedParcela"></b-form-select>
            </template>
            <template v-else>

            </template>
          </div>
        </div>
      </div>



















    </div>

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
</template>

<script>
import endPointConfig from '@/services/endPointConfig.js';

import { guardaIngressoStore } from '@/store/guardaIngressos.js';

export default {
  props: {
    total: Number
  },
  data() {
    return {
      evento: guardaIngressoStore(),
      detalhesCompra: {},
      dadosGateway: {},
      gateway: '',
      org_id: "k8vif92e",
      sessionId: '',
      anosCartao: [{ value: null, text: '--' }], 
      selectedCard: null,
      juros_personalizado: 'N',
      eve_cod: 0,
      parcelasCustomizadas: [{ value: '-1', text: 'Selecione ...' }],
      selectedParcela: '-1',  
    }
  },
  async mounted() {
    this.detalhesCompra = this.evento.getAll();

    //pegando as chaves de pagamento -------------
    for(let eve in this.detalhesCompra) {
      try {
        let gatewayMult = await endPointConfig.getChavesPag(eve);
        this.dadosGateway = gatewayMult;
        this.eve_cod = eve;
      } catch(e) {
        this.retorno = "SIS-UK257345 : Ocorreu um erro ao consultar as configurações de pagamento. Por favor, tente novamente.";
      }
    }

    this.gateway = this.dadosGateway.gateway_cartao; 
    this.sessionId = this.dadosGateway.sessionId; 
    this.juros_personalizado = this.dadosGateway.juros_personalizado; 

    // Se o gateway for SAFRA_T carrega o script externo dinamicamente
    if(this.gateway == 'SAFRA_T') {
      this.carregarScriptSafra();
    }

    // Se o gateway for algum MP carrega o script externo dinamicamente
    if(this.gateway == "MPTP" || this.gateway == "MPMKT") {
      this.carregarScriptMP();
    }

    // carrega os anos +10 do cartão
    this.carregarAnos();

    // gerar as parcelas customizadas
    this.geraParcelasCustom(); 

  },
  methods: {
    carregarScriptSafra() {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = `https://h.online-metrix.net/fp/tags.js?org_id=${this.org_id}&session_id=${this.sessionId}`;
      script.async = true;

      document.body.appendChild(script);
    },
    carregarScriptMP() {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = `https://sdk.mercadopago.com/js/v2`;
      script.async = true;

      document.body.appendChild(script);
    },
    carregarAnos() {
      let ano = new Date().getFullYear();

      for(let i = ano; i <= ano + 10; i++) {
        this.anosCartao.push({ value: i, text: i });
      }
    },
    async geraParcelasCustom() {
      const parcelas = await endPointConfig.getParcelasPersonalizadas({
        eve_cod: this.eve_cod,
        total: this.total,
      });

      for(let i = 0; i < parcelas.length; i++) {
        this.parcelasCustomizadas.push({ 
          value: parcelas[i].numero_parcela, 
          text: `${parcelas[i].numero_parcela} x de R$ ${parcelas[i].valor_parcela} | Total: R$ ${parcelas[i].total_parcela}` 
        }); 
      }  
    },
    pagConfirmacao() {
      console.log('Finalizando pagamento...');
    },
  }
}
</script>

<style>

</style>