import axios from 'axios';
import { pegaIP } from '@/services/capturaIpMaquina.js';

import { infoUsuarioStore } from '@/store/infoUsuario.js';
import { guardaIngressoStore } from '@/store/guardaIngressos.js';

export default {
  async login(email, senha) {
    email.trim();
    senha.trim();

    let err = '';
    let ip = await pegaIP();
    //let site = process.env.VUE_APP_URL_SITE;

    const link = process.env.VUE_APP_LINK_SISTEMA;
    const key = process.env.VUE_APP_WS_KEY;

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
        //const response = await axios.get(`${site}api/login.php?email=${email}&senha=${senha}&ip=${ip}`);
        const response = await axios.get(`${link}/ws/geral/usuario.asp?key=${key}&gmet=1&par1=${email}&par2=${senha}&par3=${ip}&par4=S`);

        if(response.data.statusId != '00') {
          return `SIS-GW862545 : ${response.data.statusMsg}`;

        } else {
          if(response.data.nacionalidade == 'BRA') {
            sessionStorage.setItem('sessionId', response.data.cpf);
          } else {
            sessionStorage.setItem('sessionId', response.data.passaporte);
          }
          
          return response.data;
        }
   
        /*
        if(response.data.token != undefined) {
          sessionStorage.setItem('token', response.data.token); 
        } else {
          return `SIS-GW862545 : ${response.data.statusMsg}`;
        }
        
        return true;
        */

      } catch (e) { return e; }
    } else {
      return err;
    }
  },
  logout() {
    const infoUsuario = infoUsuarioStore();
    const ingressos = guardaIngressoStore();

    sessionStorage.removeItem('sessionId');
    
    infoUsuario.limpar();
    ingressos.limparAll();
  }
}
