<template>
  <template v-if="status == 'PG'">
    <p class="modal-description title-resp">Transação efetuada com sucesso!</p>
  </template>
  <template v-else>
    <p class="modal-description title-resp">Transação em análise!</p>
  </template>

  <br/>

  <article class="job-card">
    <div>
      <p class="text-title">{{ nome }}</p>
      <p class="post-date">Realizada em {{ currentDay('D') }} {{ mesAbreviado(currentDay('M')) }}, {{ currentDay('A') }}</p>
    </div>

    <div class="budget-exp">
      <div>
        <p class="label">ID Transação:</p>
        <p class="value">{{ pag_id }}</p> 
      </div>
      <div>
        <p class="label form-pag">Forma de Pagamento:</p>
        <p class="value">{{ forma_pagto }}</p>
      </div>
    </div>

    <div class="budget-exp">
      <div>
        <p class="label tot">Valor Total:</p>
        <p class="value">{{ gt_moeda }} {{ formatValor(valor_total) }}</p> 
      </div>
      <div>
        <p class="label">Status:</p>
        <p class="value">{{ statusTransacao(status) }}</p>
      </div>
    </div>

    <p>
      <span class="txt-adqu">Forma de entrega:</span>
      <span class="text-body">{{ form_entre_descricao }}</span>
    </p>

    <p>
      <span class="txt-adqu">Adquirido(s):</span>
      <span class="text-body">{{ referente }}</span>
    </p>
  </article>
</template>

<script>
import { mesAbreviado, formatValor } from '@/utils/formDadosEvento.js';

export default {
  props: {
    nome: String,
    data_compra: String,
    pag_id: Number,
    forma_pagto: String,
    valor_total: Number,
    status: String,
    form_entre_descricao: String,
    referente: String,
  },
  data() {
    return {
      gt_moeda: 'R$',
    }
  },
  async created() {
    const config = this.$route.meta.config;

    if(config) {
      this.gt_moeda = config.gt_moeda;
    }
  },
  methods: {
    mesAbreviado,
    formatValor,
    currentDay(value) {
      let result = '';
      let dataArr = this.data_compra.split('/');

      switch(value) {
        case 'A': result = dataArr[2]; break;
        case 'M': result = dataArr[1]; break;
        case 'D': result = dataArr[0]; break;
      }

      return result;
    },
    statusTransacao(status) {
      if(status == "PG") {
        return "Autorizado";
      } else if (status == "EA") {
        return "Em Análise"; 
      } else if (status == "CA") {
        return "Cancelado"; 
      } else if (status == "DV") {
        return "Devolvido"; 
      } else {
        return 'Analisando .....';
      } 
    },
  }
}
</script>

<style>
</style>