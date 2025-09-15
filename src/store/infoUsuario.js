import { reactive } from "vue";

const state = reactive({
  informacoesUsuario: {}
});

export default {
  state,

  salvar(payload) {
    state.informacoesUsuario = payload;
  },
  get() {
    return state.informacoesUsuario || null;
  },
  limpar() {
    delete state.informacoesUsuario;
  }
};
