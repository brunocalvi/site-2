import axios from 'axios';

export async function pegaCep(cep) {
  try {
    const response = await axios.get(`https://viacep.com.br/ws/${cep}/json`);
    return response.data;
  } catch (e) {
    console.error('Erro ao obter os dados do CEP:', e);
    return null;
  }
}