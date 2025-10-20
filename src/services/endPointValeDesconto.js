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
  async utilizarValeDesconto(data) {
    try {
      const response = await api.get(`vale_desconto.asp?key=${key}&gmet=1&par1=${data.eve_cod}&par2=${data.cod_vale}&par3=${data.valor_compra}&par4=${data.list_qtd_ing}&par5=${data.list_ite_cod}&par6=${data.forma_entrega}&par7=${data.pdv_id}`);
      return response.data;

    } catch (error) {
      console.error('Erro ao utilizar o vale desconto:', error);
      throw error;
    }
  },
};
