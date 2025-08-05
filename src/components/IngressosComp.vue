<template>
  <template v-for="ingresso in ingressos" :key="ingresso.ite_cod">
    <div class="container area-ingre-ind">
      <div class="row">
        <div class="col-8 col-md-8">
          <p>Ingresso: {{ categoriaIngresso(ingresso.categoria) }}</p>
          <p class="titulo-ing">{{ ingresso.nome }} - {{ ingresso.num_lote }}º lote</p>
          <p>{{ gt_moeda }} {{ formatValorSemR(ingresso.valor) }} {{ eve_mostra_taxa == 'S' ? '+ '+formatValorSemR(ingresso.taxa_adm)+' ('+ingresso.eve_label_taxa+')' : '' }}</p>
        </div>

        <div class="col-4 col-md-4">
          <div class="area-val-btns">
            <b-button variant="secondary" class="btn-mm-cont" :disabled="disabledMenos[ingresso.ite_cod]" @click="quantMenos(ingresso)">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dash" viewBox="0 0 16 16">
                <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8"/>
              </svg>
            </b-button>

            <input type="text" :value="valores[ingresso.ite_cod]" class="input-value" readonly>

            <b-button variant="secondary" class="btn-mm-cont" :disabled="disabledMais[ingresso.ite_cod]" @click="quantMais(ingresso)">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus" viewBox="0 0 16 16">
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
              </svg>
            </b-button>
          </div>
          
          <div class="text-right mt-2 valor-individual">{{ gt_moeda }} {{ valIndividual[ingresso.ite_cod] }}</div>
        </div>
      </div>
    </div>
  </template>
</template>

<script>
import endPointSetorLote from '@/services/endPointSetorLote.js';

import { categoriaIngresso, formatValorSemR } from '@/utils/formDadosEvento.js';

export default {
  props: {
    eve_cod: Number,
    pdv_id: Number,
    setor_id: Number,
    eve_mostra_taxa: String
  },
  emits: ['somaTotal'],
  data() {
    return {
      val: 0,
      ingressos: {},
      gt_moeda: 'R$',
      broqGeral: 0,
      valores: {},
      valIndividual: {},
      disabledMais: {},
      disabledMenos: {},
    }
  },
  async created() {
    const config = this.$route.meta.config;

    this.gt_moeda = config.gt_moeda;

    this.ingressos = await endPointSetorLote.listaIngressosSetor({
      pdv: this.pdv_id, 
      eve_cod: this.eve_cod,
      setor_id: this.setor_id 
    });

    this.ingressos.forEach(ingresso => {
      const id = ingresso.ite_cod;
      this.valores[id] = 0;
      this.valIndividual[id] = '0,00';
      this.disabledMais[id] = false;
      this.disabledMenos[id] = true;
    });
  },
  methods: {
    categoriaIngresso,
    formatValorSemR,
    quantMais(ingresso) {
      const id = ingresso.ite_cod;

      if (this.valores[id] < 10) {
        this.valores[id]++;
        this.disabledMenos[id] = false;

        const valor = parseFloat(ingresso.valor.toString().replace(',', '.'));
        const taxa = this.eve_mostra_taxa === 'S' ? parseFloat(ingresso.taxa_adm.toString().replace(',', '.')) : 0;
        const total = (this.valores[id]) * (valor + taxa);

        this.somaTotalGeral({ tipo: '+', ite_cod: id, valor: valor + taxa });

        this.valIndividual[id] = this.formatValorSemR(total.toFixed(2));
      }

      if (this.valores[id] >= 10) {
        this.disabledMais[id] = true;
      }
    },
    quantMenos(ingresso) {
      const id = ingresso.ite_cod;

      if (this.valores[id] > 0) {
        this.valores[id]--;

        const valor = parseFloat(ingresso.valor.toString().replace(',', '.'));
        const taxa = this.eve_mostra_taxa === 'S' ? parseFloat(ingresso.taxa_adm.toString().replace(',', '.')) : 0;
        const total = (this.valores[id]) * (valor + taxa);

        this.somaTotalGeral({ tipo: '-', ite_cod: id, valor: valor + taxa });

        this.valIndividual[id] = this.formatValorSemR(total.toFixed(2));
      }

      this.disabledMais[id] = false;
      this.disabledMenos[id] = this.valores[id] === 0;
    },
    somaTotalGeral(value) {
      this.$emit('somaTotal', value);
    }
  }
}
</script>

<style>
.input-value {
  width: 45px;
  text-align: center;
  height: 30px;
}
.text-right {
  text-align: end;
}
.area-val-btns {
  display: flex;
  justify-content: center;
  align-items: center;
}
.area-ingre-ind {
  border-bottom: 1px dashed rgba(0, 0, 0, 0.54);
  padding-top: 1rem;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12);
}
.titulo-ing {
  margin-bottom: 0;
  font-weight: 600;
}
.btn-mm-cont {
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.btn-mm-cont svg {
  margin-top: -3px;
}
.valor-individual {
  margin-right: 1rem;
  user-select: none;
}
</style>


