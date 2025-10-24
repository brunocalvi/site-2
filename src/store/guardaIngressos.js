import { defineStore } from "pinia";

export const guardaIngressoStore = defineStore("guardaIngressos", {
  state: () => ({
    dadosValidacao: {}
  }),
  persist: {
    key: 'guardaIngressos',
    storage: sessionStorage,
  },
  actions: {
    salvar(eve_cod, payload) {
      if(payload.ingresso) {
        const ingressoLimpo = {};

        Object.entries(payload.ingresso).forEach(([idx, val]) => {
          if (val != null) ingressoLimpo[idx] = val;
        });

        payload.ingresso = ingressoLimpo;
      }

      this.dadosValidacao[eve_cod] = payload;
    },
    get(eve_cod) {
      return this.dadosValidacao[eve_cod] || null;
    },
    getIngresso(eve_cod) {
      return this.dadosValidacao[eve_cod].ingresso || null;
    },
    getAll() {
      return this.dadosValidacao;
    },
    retiraUmIng(ite_cod, eve_cod) {
      delete this.dadosValidacao[eve_cod].ingresso[ite_cod];

      if(Object.keys(this.dadosValidacao[eve_cod].ingresso).length === 0) {
        this.limpar(eve_cod);
      }
    },
    limpar(eve_cod) {
      if (eve_cod) {
        delete this.dadosValidacao[eve_cod];
      } else {
        this.dadosValidacao = {};
      }
    },
    limparAll() {
      this.dadosValidacao = {}; 
    }
  },
});
