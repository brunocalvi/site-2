import axios from 'axios';

const link = process.env.VUE_APP_LINK_SISTEMA;
const key = process.env.VUE_APP_WS_KEY;

const api = axios.create({
  baseURL: `${link}ws/geral`,
  headers: {
    'Content-Type': 'application/json',
  }
});

export default {
  async getTrn(pag_id) {
    try {
      const response = await api.get(`/pagamento.asp?key=${key}&gmet=1&par1=${pag_id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar TRN:', error);
      throw error;
    }
  },
   async processaPagamento(link, dados) {
    try {
      const response = await api.post(link, dados);
      return response.data;
    } catch (error) {
      console.error('Erro ao processar o pagamento:', error);
      throw error;
    }
  },
};
