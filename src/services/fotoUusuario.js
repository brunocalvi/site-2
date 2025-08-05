import axios from 'axios';

export async function salvaFoto(formData) {
  try {
    const response = await axios.post(`${process.env.VUE_APP_URL_SITE}api/enviaFotoPerfil.php`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    //console.log('Imagem enviada com sucesso:', response.data);
    //alert('Imagem enviada com sucesso!');
    return response.data;
  } catch (error) {
    console.error('Erro ao enviar imagem:', error);
    return 'Erro ao enviar imagem.';
  }
}

export async function getFoto(id) {
  try {
    const response = await axios.get(`${process.env.VUE_APP_URL_SITE}api/fotoUsuario.php?user=${id}&arq=FOT`);
    return response.data;
  } catch (error) {
    console.error('Erro ao consultar a imagem:', error);
    return 'Erro ao consultar a imagem.';
  }
}