<template>
  <HeaderInclude></HeaderInclude>

  <Alert v-if="retorno != undefined" :msg="retorno" @fechar="estadoAlerta"></Alert>

  <div class="hs_blog_box1_main_wrapper">
		<div class="hs_blog_box1_cont_main_wrapper">

			<div class="hs_blog_cont_heading_wrapper text-center" data-aos="fade-up" data-aos-duration="1000">
				<h2>Lembrar senha de acesso</h2>
				<p>Por favor digite seu e-mail ou CPF no campo abaixo e clique no botão Enviar.</p>
        <p>O sistema irá verificar a existência do cadastro no banco de dados e caso exista, enviará os proximos passos para concluir a alteração.</p> 
			</div>

      <form action="" method="POST" id="login-form" data-aos="fade-right" @submit.prevent="enviaDadosRecu">
        <div class="modal-form">
          <label class="form-label">E-mail ou CPF cadastrado</label>
          <input type="text" class="input_login" name="email_principal" id="email_principal" placeholder="Seu e-mail ou CPF cadastrado ..." v-model="email_principal">
        </div>

        <div class="modal-form">
          <label class="form-label">E-mail de recuperação</label>
          <input type="text" class="input_login" name="email_secunda" id="email_secunda" placeholder="E-mail opcional ..." v-model="email_secunda">
        </div>

        <div class="prs_animate_btn1 prs_upcom_main_wrapper">
          <button type="submit" class="btn btn-faz-login">Recuperar</button>
        </div>
      </form>

      <div class="col-md-12 centralize-entre">
        <div class="hs_blog_cont_heading_wrapper">
          <h5 class="fazer-cadastro text-center">
            <router-link class="nav-link" to="/cadastro">
              <span>Você ainda não tem uma conta?</span> 
              <b>Cadastre-se <i class="fa fa-long-arrow-right"></i></b>
            </router-link>
          </h5>
        </div>
      </div>
                          
    </div>
  </div>

  <template v-if="modalOpen">
    <div class="modal-backdrop" @click.self="closeModal">
      <div class="modal-senha text-center">
        <!--<button class="close-button" @click="closeModal">x</button>-->

        <div class="modal-content">
          <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" class="bi bi-envelope-check" viewBox="0 0 16 16">
            <path d="M2 2a2 2 0 0 0-2 2v8.01A2 2 0 0 0 2 14h5.5a.5.5 0 0 0 0-1H2a1 1 0 0 1-.966-.741l5.64-3.471L8 9.583l7-4.2V8.5a.5.5 0 0 0 1 0V4a2 2 0 0 0-2-2H2Zm3.708 6.208L1 11.105V5.383l4.708 2.825ZM1 4.217V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v.217l-7 4.2-7-4.2Z"/>
            <path d="M16 12.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Zm-1.993-1.679a.5.5 0 0 0-.686.172l-1.17 1.95-.547-.547a.5.5 0 0 0-.708.708l.774.773a.75.75 0 0 0 1.174-.144l1.335-2.226a.5.5 0 0 0-.172-.686Z"/>
          </svg>
          <h5 class="text-error"><b>{{ txtModal }}</b></h5>

          <p class="txt-baixo-cron">
            Aguarde alguns minutos ....
            <br/>
            <span id="timer">{{ tempoSenha }}</span>
            <br/><br/>
            <b>O e-mail chegara dentro desse tempo.<br/>Caso não chegue, tente novamente quando o tempo zerar!</b>
          </p>
        </div>

        <!--<button @click="closeModal">Fechar</button>-->
      </div>
    </div>
  </template>

  <FooterInclude></FooterInclude>
</template>

<script>
import HeaderInclude from './includes/HeaderInclude.vue'; 
import FooterInclude from './includes/FooterInclude.vue';
import Alert from "@/components/alerts/AlertAcao.vue";

import endPointUsuario from '@/services/endPointUsuario.js';

export default {
  components: {
    HeaderInclude, FooterInclude, Alert 
  },
  data() {
    return {
      email_principal: '',
      email_secunda:'',
      retorno: undefined,
      modalOpen: false,
      txtModal: '',
      tempoSenha: '00:00:00',
    }
  },
  created() {
    if(sessionStorage.getItem("tempoSenha")) {
      this.countdown();
      this.modalOpen = true;
    }
  },
  methods: {
    estadoAlerta(data) {
      this.retorno = data; 
    },
    openModal() {
      this.modalOpen = true;
      this.retorno = undefined;
    },
    /*closeModal() {
      this.modalOpen = false;
    },*/
    countdown() {
      let tempo = parseInt(sessionStorage.getItem("tempoSenha"), 10) || 0;

      if (tempo > 0) {
        let min = parseInt(tempo / 60);
        let seg = tempo % 60;

        if (min < 10) min = "0" + min;
        if (seg < 10) seg = "0" + seg;

        let horaImprimivel = `00:${min}:${seg}`;
        this.tempoSenha = horaImprimivel;

        tempo--;
        sessionStorage.setItem("tempoSenha", tempo);

        setTimeout(() => this.countdown(), 1000);
      } else {
        sessionStorage.removeItem('tempoSenha');
        this.tempoSenha = '00:00:00';
        this.modalOpen = false;
      }
    },
    async enviaDadosRecu() {
      let err = '';

      if(this.email_principal == "") {
        err = `SIT-WF405371 : Indique um e-mail ou CPF válido no primeiro campo!`;
      }

      if(err == '') {
        let dados = {
          par1: this.email_principal,
          par2: this.email_secunda,
        };

        let resultado = await endPointUsuario.enviaDadosRecuperaSenha(dados);

        if(resultado.statusId == '00') {
          sessionStorage.setItem('tempoSenha', 120);
          this.countdown();
          this.openModal();
        } else {
          this.retorno = `SIS-VP842311 : ${resultado.statusMsg}`;
        }
      } else {
        this.retorno = err;
      }  
    }
  }
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* Certifique-se de que o modal fique acima de outros elementos */
}
.modal-senha {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  position: relative; /* Para o botão de fechar */
  width: 80%;
  max-width: 600px;
}
.close-button {
  position: absolute;
  top: 5px;
  right: 15px;
  background: none;
  border: none;
  font-size: 23px;
  cursor: pointer;
  color: rgb(255, 0, 0);
  font-weight: 400;
  margin: 0;
  padding: 0;
}
.modal-content {
  margin-top: 20px;
}
.modal-senha svg {
  margin: 0 auto;
}
.txt-baixo-cron {
  font-family: 'Lato', sans-serif;
  color: #707070;
  text-align: center;
}
.modal-senha h5 {
  margin: 1rem auto;
}
#timer {
  color: #000;
  font-size: 17px;
  font-weight: 700;
}
</style>