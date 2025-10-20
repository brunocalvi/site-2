import axios from 'axios';

const link = process.env.VUE_APP_LINK_SISTEMA;
const key = process.env.VUE_APP_WS_KEY;

const api = axios.create({
  baseURL: `${link}ws/geral`,
  headers: {
    'Content-Type': 'application/json',
  }
});

export async function dadosUsuario() {
  let cpf = '';
  let passaporte = '';
  let sessionId = sessionStorage.getItem('sessionId');

  if(sessionId.length == 11) {
    cpf = sessionId;
  } else {
    passaporte = sessionId;
  }

  try {
    const response = await api.get(`/usuario.asp?key=${key}&gmet=4&par1=${cpf}&par2=${passaporte}`);
    return response.data;

  } catch (e) {
    return null;
  }
}

/*export async function dadosUsuario() {
  try {
    let site = process.env.VUE_APP_URL_SITE;
    let token = sessionStorage.getItem('token');

    const response = await axios.get(`${site}api/usuario.php?token=${token}`);

    console.log(response.data);
    return response.data;

  } catch (e) {
    return null;
  }
}*/
