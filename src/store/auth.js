import axios from 'axios';
import { pegaIP } from '@/services/capturaIpMaquina.js';

export default {
  async login(email, senha) {
    email.trim();
    senha.trim();

    let err = '';
    let ip = await pegaIP();
    let site = process.env.VUE_APP_URL_SITE;

    if(!email.includes('@')) {
      email.replace(/[^0-9]/g, '');
    }

    if(email == '') {
      err = 'SIT-EW410815 : Informe um e-mail ou CPF valido!';
    }

    if(senha == '') {
      err = 'SIT-CS521627 : Informe uma senha valida!';
    }

    if(err == '') {
      try {
        const response = await axios.get(`${site}api/login.php?email=${email}&senha=${senha}&ip=${ip}`);
        
        if(response.data.token != undefined) {
          sessionStorage.setItem('token', response.data.token); 
        } else {
          return response.data;
        }
        
        return true;

      } catch (e) {
        return 'SIT-E616652 : '.e;
      }
    } else {
      return err;
    }
  },
  logout() {
    sessionStorage.removeItem('token');
  }
}
