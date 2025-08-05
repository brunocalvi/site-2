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
  async viraLoteAutomatico(data) {
    try {
      const response = await api.get(`/pdv.asp?key=${key}&gmet=13&par1=${data.pdv}&par2=${data.eve_cod}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao virar o lote:', error);
      throw error;
    }
  },
};