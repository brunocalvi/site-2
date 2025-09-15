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
  async configMesaSelect(data) {
    try {
      const response = await api.get(`/setorlote.asp?key=${key}&gmet=6&par1=${data.eve_cod}&par2=${data.lot_cod}&par3=${data.assento_parcial}`);
      return response.data.MESAS;
    } catch (error) {
      console.error('Erro ao criar a mesa:', error);
      throw error;
    }
  },
  async buscaLoteAdicional(data) {
    try {
      const response = await api.get(`/setorlote.asp?key=${key}&gmet=13&par1=${data.lot_cod}&par2=${data.pdv}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao busca o lote adicional:', error);
      throw error;
    }
  },
  async verificaQtdLocalVenda(data) {
    try {
      const response = await api.get(`/setorlote.asp?key=${key}&gmet=8&par1=${data.eve_cod}&par2=${data.ite_cod}&par3=${data.qtd}&par4=${data.mes_id}&par5=${data.mas_id}&par6=0`);
      return response.data;
    } catch (error) {
      console.error('Erro ao verifica se tem qtde/local disponivel para venda:', error);
      throw error;
    }
  },
};