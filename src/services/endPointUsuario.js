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
  async getCortesia(id) {
    try {
      const response = await api.get(`/usuario.asp?key=${key}&gmet=14&par1=${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar a cortesia: ', error);
      throw error;
    }
  },
  async getBuscaGeneros() {
    try {
      const response = await api.get(`/ListaGeneros.asp?key=${key}&gmet=3`);
      return response.data.Lista;
    } catch (error) {
      console.error('Erro ao buscar os generos: ', error);
      throw error;
    }
  },
  async getHistorico(id) {
    try {
      const response = await api.get(`/usuario.asp?key=${key}&gmet=2&par1=${id}`);
      return response.data.PAGAMENTOS;
    } catch (error) {
      console.error('Erro ao buscar o historico: ', error);
      throw error;
    }
  },
  async updateUsuario(arr) {
    let url = `/usuario.asp?key=${key}&gmet=12&par1=${arr.par1}&par2=${arr.par2}&par3=${arr.par3}&par4=${arr.par4}&par5=${arr.par5}&par6=${arr.par6}&par7=${arr.par7}&par8=${arr.par8}&par9=${arr.par9}&par10=${arr.par10}&par11=${arr.par11}&par12=${arr.par12}&par13=${arr.par13}&par14=${arr.par14}&par15=${arr.par15}&par16=${arr.par16}&par17=${arr.par17}&par18=${arr.par18}&par19=${arr.par19}&par20=${arr.par20}&par21=${arr.par21}&par22=${arr.par22}&par23=${arr.par23}&par24=${arr.par24}&par25=${arr.par25}`; 

    url = url.replace(/ /g, "%20");

    try {
      const response = await api.get(url);
      
      if(response.data.statusId == '00') {
        return `Dados atualizado com sucesso !`;
      } else {
        return `SIS-ZG937515 : ${response.data.statusMsg}`;
      }

    } catch (error) {
      console.error('Erro ao atualizar o usuário: ', error);
      throw error;
    }
  },
  async insertJustCancelamento(data) {
    try {
      const response = await api.get(`/usuario.asp?key=${key}&gmet=16&par1=${data.usuario}&par2=${data.pag_id}&par3=${data.eve_cod}&par4=${data.justificativa}`);

      if(response.data.statusId == '00') {
        return `Informações enviadas com sucesso!`;
      } else {
        return `SIS-OC488456 : ${response.data.statusMsg}`;
      }
    } catch (error) {
      console.error('Erro ao enviar a justificativa : ', error);
      throw error;
    }
  },
  async getJustCancelamento(pag_id) {
    try {
      const response = await api.get(`/usuario.asp?key=${key}&gmet=17&par1=${pag_id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao consultar justificativa : ', error);
      throw error;
    }
  },
  async getIngressoNominal(pag_id) {
    try {
      const response = await api.get(`/usuario.asp?key=${key}&gmet=3&par1=${pag_id}`);
      return response.data.INGRESSOS;
    } catch (error) {
      console.error('Erro ao consultar ingressos : ', error);
      throw error;
    }
  },
  async getIngressoNominalIndividual(ing, aut) {
    try {
      const response = await api.get(`/usuario.asp?key=${key}&gmet=3&par1=&par2=${ing}&par2=${aut}`);
      return response.data.INGRESSOS;
    } catch (error) {
      console.error('Erro ao consultar ingressos : ', error);
      throw error;
    }
  },
  async enviaDadosRecuperaSenha(dados) {
    try {
      const response = await api.get(`/usuario.asp?key=${key}&gmet=9&par1=${dados.par1}&par2=${dados.par2}&par3=S`);
      return response.data;
    } catch (error) {
      console.error('Erro ao enviar os dados : ', error);
      throw error;
    }
  },
  async salvarRecuperaSenha(senha) {
    try {
      const response = await api.get(`/usuario.asp?key=${key}&gmet=9&par4=${senha.par4}&par5=${senha.par5}&par6=${senha.par6}&par7=${senha.par7}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao Salvar a senha : ', error);
      throw error;
    }
  },


   async cadastrarUsuario(dados) {
    let url = `/usuario.asp?key=${key}&gmet=5&par1=${dados.email}&par2=${dados.senha}&par3=${dados.nome}&par4=${dados.tipo_pessoa}&par5=${dados.sexo}&par6=${dados.data_nascimento}&par7=${dados.rg}&par8=${dados.nacionalidade}&par9=${dados.cep}&par10=${dados.endereco}&par11=${dados.numero}&par12=${dados.complemento}&par13=${dados.bairro}&par14=${dados.cidade}&par15=${dados.uf}&par16=${dados.ddd}&par17=${dados.celular}&par18=${dados.ddd}&par19=${dados.celular}&par20=${dados.passaporte}&par21=${dados.genero}&par22=S&par23=${dados.newsleter}&par24=${dados.concorda_lgpt}`; 

    url = url.replace(/ /g, "%20");

    try {
      const response = await api.get(url);
      
      if(response.data.statusId == '00') {
        return { 
          statusId: response.data.statusId,
          resposta: `Usuário cadastrado com sucesso!`,
          usu_ativo: response.data.usu_ativo, 
        };

      } else {
        return { 
          statusId: response.data.statusId,
          resposta:  `SIS-KR801266 : ${response.data.statusMsg}`, 
        };
      }

    } catch (error) {
      console.error('Erro ao cadastrar o usuário: ', error);
      throw error;
    }
  },
};
