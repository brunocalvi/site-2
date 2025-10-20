import { defineStore } from "pinia";
import { toRaw } from "vue";

export const infoUsuarioStore = defineStore("infoUsuario", {
  state: () => ({
    informacoesUsuario: {}
  }),
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'infoUsuario',
        storage: sessionStorage,
      },
    ],
  },
  actions: {
    salvar(payload) {
      this.informacoesUsuario = structuredClone(toRaw(payload));
    },
    get() {
      return this.informacoesUsuario || {};
    },
    limpar() {
      this.informacoesUsuario = {};
    }
  },
});
/*import { reactive } from "vue";

const state = reactive({
  informacoesUsuario: {}
});

export default {
  state,

  salvar(payload) {
    state.informacoesUsuario = payload;
  },
  get() {
    return state.informacoesUsuario || {};
  },
  limpar() {
    delete state.informacoesUsuario;
  }
};*/
