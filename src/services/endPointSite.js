import axios from 'axios';

//const link = process.env.VUE_APP_LINK_SISTEMA;
//const key = process.env.VUE_APP_WS_KEY;
const site = process.env.VUE_APP_URL_SITE;

const api = axios.create({
  baseURL: `${site}api`,
  headers: {
    'Content-Type': 'application/json',
  }
});

export default {
  async listaParceiros() {
    try {
      const response = await api.get(`/parceiros.php?gmet=1`);
      return response.data;
    } catch (error) {
      console.error('Erro ao consultar os parceiros: ', error);
      throw error;
    }
  },
  async visualizaParceiro(proid) {
    try {
      const response = await api.get(`/parceiros.php?gmet=2&id=${proid}`);
      let parceiro = response.data[0];
      return parceiro;
    } catch (error) {
      console.error('Erro ao consultar o parceiro: ', error);
      throw error;
    }
  },
  async visualizaTexto(id) {
    try {
      const response = await api.get(`/textos.php?gmet=1&id=${id}`);
      return response.data[0];
    } catch (error) {
      console.error('Erro ao consultar o texto: ', error);
      throw error;
    }
  },
  async listatextos(posi) {
    try {
      const response = await api.get(`/textos.php?gmet=2&posi=${posi}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao consultar os textos: ', error);
      throw error;
    }
  },
}