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
      //console.error('Erro ao buscar os campos nominais: ', error);
      //throw error;
      return undefined;
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
  async buscaMaisEventosPai(data) {
    try {
      const response = await api.get(`/lista_busca.asp?gmet=1&key=${key}&pdv_id=${data.pdv_id}&ocultar=N&txt_nome=${data.txt_nome}&estado=${data.estado}&cidade=${data.cidade}&local=${data.local}`);
      return response.data;

    } catch (error) {
      console.error('Erro ao buscar os dados do evento: ', error);
      throw error;
    }
  },
  async dadosFormaEntrega(forma_entrega) {
    try {
      const response = await api.get(`/evento.asp?key=${key}&gmet=5&par1=${forma_entrega}`);
      return response.data;

    } catch (error) {
      console.error('Erro ao buscar a forma de entrega: ', error);
      throw error;
    }
  },
  async restricaoCpfMeia(data) {
    try {
      const response = await api.get(`/evento.asp?key=${key}&gmet=4&par1=${data.eve_cod}&par2=${data.user_id}&par3=${data.list_qtd_ing}&par4=${data.list_ite_cod}`);
      return response.data;

    } catch (error) {
      console.error('Erro ao consultar restrição de cpf e meia: ', error);
      throw error;
    }
  },
  async restricaoCpfitemLote(data) {
    try {
      const response = await api.get(`/evento.asp?key=${key}&gmet=8&par1=${data.eve_cod}&par2=${data.user_id}&par3=${data.list_ite_cod}&par4=${data.list_qtd_ing}`);
      return response.data;

    } catch (error) {
      console.error('Erro ao consultar restrição de cpf e item code: ', error);
      throw error;
    }
  },
  async restricaoPreCadastro(data) {
    try {
      const response = await api.get(`/evento.asp?key=${key}&gmet=12&par1=${data.eve_cod}&par2=${data.user_id}`);
      return response.data;

    } catch (error) {
      console.error('Erro ao verificar o Pre Cadastro: ', error);
      throw error;
    }
  },
}