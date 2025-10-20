import axios from 'axios';

const link = process.env.VUE_APP_URL_SITE;

const api = axios.create({
  baseURL: `${link}api`,
  headers: {
    'Content-Type': 'application/json',
  }
});

export default {
   async processaPagamento(link, dados) {
    try {
      const response = await api.post('/processPag.php', {
        ...dados,
        api_url: link,
      });

      return response.data;

    } catch (error) {
      console.error('Erro ao processar o pagamento:', error);
      throw error;
    }
  },
};
