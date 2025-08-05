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
  async nomeSetorInfo(data) {
    try {
      const response = await api.get(`/setorlote.asp?key=${key}&gmet=2&par1=${data.eve_cod}&par2=${data.pdv}`);
      return response.data.SETOR;
    } catch (error) {
      console.error('Erro ao buscar os setores:', error);
      throw error;
    }
  },
  async listaIngressosSetor(data) {
    try {
      const response = await api.get(`/setorlote.asp?key=${key}&gmet=4&par1=${data.eve_cod}&par2=${data.setor_id}&par3=${data.pdv}`);
      return response.data.LOTES;
    } catch (error) {
      console.error('Erro ao buscar os ingressos:', error);
      throw error;
    }
  },
};