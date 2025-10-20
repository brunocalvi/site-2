import axios from 'axios';

const link = process.env.VUE_APP_LINK_SISTEMA;
//const key = process.env.VUE_APP_WS_KEY;

const api = axios.create({
  baseURL: `${link}ws/geral`,
  headers: {
    'Content-Type': 'application/json',
  }
});

export default {
  async libReservaAppCliente(eve_cod) {
    try {
      const response = await api.get(`/assento_reservado.php?gmet=1&eve_cod=${eve_cod}`);
      return response.data;
    
    } catch (error) {
      console.error('Erro ao tentar liberar App Cliente: ', error);
      throw error;
    }
  },
  async listaMapaForm(dados) {
    try {
      const response = await api.get(`/lista_mapa.php?eve_cod=${dados.eve_cod}&map_id=${dados.map_id}`);
      return response.data;
    
    } catch (error) {
      console.error('Erro ao buscar os dados do mapa: ', error);
      throw error;
    }
  },
  async listaMapaImgReal(dados) {
    try {
      const response = await api.get(`${link}/ws/site/consulta_status_assento.php?evento=${dados.eve_cod}&map_id=${dados.map_id}`);
      return response.data;
    
    } catch (error) {
      console.error('Erro ao buscar os dados do mapa: ', error);
      throw error;
    }
  },
}