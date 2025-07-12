import axios from 'axios';

const link = process.env.VUE_APP_LINK_SISTEMA;
const key = process.env.VUE_APP_WS_KEY;
const pdv_site = process.env.VUE_APP_PDV_SITE;

const api = axios.create({
  baseURL: `${link}ws/geral`,
  headers: {
    'Content-Type': 'application/json',
  }
});

export default {
  async getAddNominal(eve_cod) {
    try {
      const response = await api.get(`/evento.asp?key=${key}&gmet=13&par1=${eve_cod}`);

      if(response.data.statusId == '00') {
        return response.data.Lista;
      } else {
        return undefined;
      }
      
    } catch (error) {
      console.error('Erro ao buscar os campos nominais: ', error);
      throw error;
    }
  },
  async inputNominal(data) {
    try {
      const response = await api.get(`/ingresso.asp?key=${key}&gmet=6&par1=${data.par1}&par2=${data.par2}&par3=${data.par3}&par4=${data.par4}`);

      if(response.data.statusId == '00') {
        return `Dados inseridos com sucesso !`;
      } else {
        return `SIS-NP313635 : ${response.data.statusMsg}`;
      }
    } catch (error) {
      console.error('Erro ao inserir os dados nominais: ', error);
      throw error;
    }
  },
  async eventosProdutor(data) {
    try {
      const response = await api.get(`/evento.asp?key=${key}&gmet=${data.gmet}&par1=${data.proid}&par2=${pdv_site}&par3=N`);
      return response.data.Lista;

    } catch (error) {
      console.error('Erro ao buscar os dados do produtor: ', error);
      throw error;
    }
  },
  async dadosEvento(data) {
    try {
      const response = await api.get(`/evento.asp?key=${key}&gmet=2&par1=${data.eve_cod}&par2=${data.pdv_id}`);
      return response.data;

    } catch (error) {
      console.error('Erro ao buscar os dados do evento: ', error);
      throw error;
    }
  },
}