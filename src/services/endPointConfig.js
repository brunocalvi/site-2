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
  async getChavesPag(eve_cod) {
    try {
      const response = await api.get(`/config_mobile.asp?key=${key}&gmet=2&par1=${eve_cod}&par2=S`);
      return response.data;
    
    } catch(error) {
      console.error('Erro ao buscar as chaves de pagamento.');
    }
  },
  async getParcelasPersonalizadas(data) {
    try {
      const response = await api.get(`/parcelas_personalizadas.asp?key=${key}&par1=${data.eve_cod}&par2=${data.total}`);
      return response.data.lista;
    
    } catch(error) {
      console.error('Erro ao buscar as parcelas customizadas.');
    }
  },
}
