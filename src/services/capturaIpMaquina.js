import axios from 'axios';

export async function pegaIP() {
  try {
    const response = await axios.get('https://api.ipify.org?format=json');
    return response.data.ip;
  } catch (e) {
    console.error('Erro ao obter IP:', e);
    return '0.0.0.0'; // valor padrão em caso de falha
  }
}