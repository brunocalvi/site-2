import axios from 'axios';

const link = process.env.VUE_APP_LINK_SISTEMA;
const key = process.env.VUE_APP_WS_KEY;
const pdv = process.env.VUE_APP_PDV_SITE;

export default {
  async getPesquisa(data) {
    try {
      const response = await axios.get(`${link}/ws/geral/lista_busca.asp?gmet=${data.gmet}&key=${key}&pdv_id=${pdv}&txt_busca=${data.txt_busca}&txt_genero=${data.txt_genero}&estado=${data.estado}&cidade=${data.cidade}`);
      return response.data.Lista;

    } catch (error) {
      console.error('Erro ao buscar os eventos: ', error);
      throw error;
    }
  },
  async listaCidadesEstados() {
    try {
      const response = await axios.get(`${link}/ws/site/listacidadesgeneros.asp?key=${key}&gc=s`);
      return response.data;

    } catch (error) {
      console.error('Erro ao buscar as informações cidade/estado: ', error);
      throw error;
    }
  },
  async listaGeneros() {
    try {
      const response = await axios.get(`${link}/ws/geral/ListaGeneros.asp?key=${key}&gmet=3`);
      return response.data.Lista;

    } catch (error) {
      console.error('Erro ao buscar os generos: ', error);
      throw error;
    }
  },
}