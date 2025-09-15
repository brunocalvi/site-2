import { reactive } from "vue";

const state = reactive({
  dadosValidacao: {}
});

export default {
  state,
  
  salvar(payload) {
    state.dadosValidacao = payload;
  },
  limparAll() {
    delete state.dadosValidacao;  
  },
  getAll() {
    return state.dadosValidacao || null;
  },

  /*
  salvar(eve_cod, payload) {
    state.dadosValidacao[eve_cod] = payload;
  },
  get(eve_cod) {
    return state.dadosValidacao[eve_cod] || null;
  },
  getAll() {
    return state.dadosValidacao || null;
  },
  limpar(eve_cod) {
    if (eve_cod) {
      delete state.dadosValidacao[eve_cod];
    } else {
      state.dadosValidacao = {};
    }
  },
  limparAll() {
    delete state.dadosValidacao;  
  }*/
};
