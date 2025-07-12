import axios from 'axios';

export async function dadosUsuario() {
  try {
    let site = process.env.VUE_APP_URL_SITE;
    let token = sessionStorage.getItem('token');

    const response = await axios.get(`${site}api/usuario.php?token=${token}`);
    return response.data;

  } catch (e) {
    return null;
  }
}
