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

    <div class="row gy-4">
      <div class="col-md-12">
        <div class="checkout-form__input">
          <label class="form-label">Nome do titular (como está no cartão) *</label>
          <input type="text" class="form-control" name="cardholderName" id="cardholderName" data-checkout="cardholderName" data-pagarmecheckout-element="holder_name" maxlength="50" autocomplete=off placeholder="Nome do titular" required>
          <input data-checkout="docType" id="docType" type="hidden" value="CPF"/> 
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
  data() {
    return {
      evento: guardaIngressoStore(),
      detalhesCompra: {},
      dadosGateway: {},
      gateway: '',
      org_id: "k8vif92e",
      sessionId: '',  
    }
  },
  async mounted() {
    this.detalhesCompra = this.evento.getAll();

    //pegando as chaves de pagamento -------------
    for(let eve in this.detalhesCompra) {
      try {
        let gatewayMult = await endPointConfig.getChavesPag(eve);
        this.dadosGateway = gatewayMult;
      } catch(e) {
        this.retorno = "SIS-UK257345 : Ocorreu um erro ao consultar as configurações de pagamento. Por favor, tente novamente.";
      }
    }

    console.log(this.dadosGateway);

    this.gateway = this.dadosGateway.gateway_cartao; 
    this.sessionId = this.dadosGateway.sessionId; 

    // Se o gateway for SAFRA_T carrega o script externo dinamicamente
    if (this.gateway == 'SAFRA_T') {
      this.carregarScriptSafra();
    }

    // Se o gateway for algum MP carrega o script externo dinamicamente
    if (this.gateway == "MPTP" || this.gateway == "MPMKT") {
      this.carregarScriptMP();
    }
  },
  methods: {
    carregarScriptSafra() {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = `https://h.online-metrix.net/fp/tags.js?org_id=${this.org_id}&session_id=${this.sessionId}`;
      script.async = true;

      document.body.appendChild(script);

      console.log('Script SAFRA carregado ...');
    },
    carregarScriptMP() {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = `https://sdk.mercadopago.com/js/v2`;
      script.async = true;

      document.body.appendChild(script);

      console.log('Script MP carregado...');
    },
    pagConfirmacao() {
      console.log('Finalizando pagamento...');
    }
  }
}
</script>

<style>

</style>