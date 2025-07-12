<template>
  <HeaderInclude></HeaderInclude>

  <Alert v-if="retorno != undefined" :msg="retorno" @fechar="estadoAlerta"></Alert>

  <div class="hs_blog_box1_main_wrapper">
		<div class="hs_blog_box1_cont_main_wrapper" data-aos="fade-up" data-aos-duration="1000">

			<div class="hs_blog_cont_heading_wrapper text-center">
				<h2>Acesse sua conta</h2>
				<p>Caso ainda não tenha um cadastro você pode fazê-lo rapidamente utilizando o link abaixo</p> 
			</div>

      <form action="" method="POST" id="login-form" @submit.prevent="enviaLogin">
        <div class="modal-form">
          <label class="form-label">E-mail ou CPF cadastrado</label>
          <input type="text" class="input_login" name="email" id="email" placeholder="Seu e-mail ou CPF aqui ..." v-model="email" required>
        </div>

        <div class="modal-form">
          <label class="form-label">Senha</label>
          <div class="btn-olho-senha">
            <input :type="inputType" name="senha" id="senha" maxlength="10" class="input_login" placeholder="Sua senha aqui ..." v-model="senha" autocomplete="off" required>
            <button type="button" title="Ver ou ocultar senha" @click="viewSenha()">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
                <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/>
                <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>
              </svg>
            </button>
          </div>
        </div>

        <div class="modal-form afaste">
          <div class="st_cherity_img_cont">
            <input type="checkbox" name="rememberme" id="cbx" style="display: none;" v-model="salvaLogin">
            <label for="cbx" class="check">
                <svg width="18px" height="18px" viewBox="0 0 18 18">
                    <path d="M1,9 L1,3.5 C1,2 2,1 3.5,1 L14.5,1 C16,1 17,2 17,3.5 L17,14.5 C17,16 16,17 14.5,17 L3.5,17 C2,17 1,16 1,14.5 L1,9 Z"></path>
                    <polyline points="1 9 7 14 15 4"></polyline>
                </svg>
            </label>
            <label for="cbx">Lembrar</label>
          </div>

          <div class="text-end">
            <router-link to="/recupera-senha" class="modal-form__link">Esqueceu a senha?</router-link>
          </div>  
        </div>

        <div class="prs_animate_btn1 prs_upcom_main_wrapper">
          <button type="submit" class="btn btn-faz-login">Entrar</button>
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

  <FooterInclude></FooterInclude>
</template>

<script>
import auth from '@/store/auth.js';
import crypto from '@/store/cryptoLembrar.js';

import HeaderInclude from "@/views/includes/HeaderInclude.vue";
import FooterInclude from "@/views/includes/FooterInclude.vue";
import Alert from "@/components/alerts/AlertAcao.vue";

export default {
  components: { 
    HeaderInclude, FooterInclude, Alert 
  },
  data() {
    return {
      email: '',
      senha: '',
      inputType: 'password',
      retorno: undefined,
      salvaLogin: false,
    }
  },
  watch: {
    salvaLogin() {
      let data = {
        login: this.email,
        senha: this.senha,
        salvar: this.salvaLogin,
      };

      let encryptedDados = crypto.encryptData(data);
      localStorage.setItem('remember', encryptedDados);
    },
  },
  created() {
    if(localStorage.getItem('remember')) {
      let resultado = crypto.decryptData(localStorage.getItem('remember'));
      this.email = resultado.login; 
      this.senha = resultado.senha; 
      this.salvaLogin = resultado.salvar;
      
      if(resultado.salvar == false) {
        localStorage.removeItem('remember');
        this.email = ''; 
        this.senha = ''; 
        this.salvaLogin = false;
      }
    }
  },
  methods: {
    viewSenha() {
      this.inputType = this.inputType === 'text' ? 'password' : 'text';
    },
    estadoAlerta(data) {
     this.retorno = data; 
    },
    async enviaLogin() {
      try {
        let resposta = await auth.login(this.email, this.senha);

        if(resposta == true) {
          this.$router.push('/area-usuario');
        } else {
          this.retorno = `SIS-GW862545 : ${resposta.statusMsg}`;
        }
      } catch(e) {
        console.error(e);

      }
    }
  },
}
</script>

<style>
.afaste {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.btn-faz-login {
  width: 100%;
  background-color: var(--primeira-cor);
  color: #fff;
  border: none;
  height: 50px;
  border-radius: 10px;
  text-transform: uppercase;
}
.btn-faz-login:hover {
  color: var(--primeira-cor);
  border: 1px solid var(--primeira-cor);
}
</style>
