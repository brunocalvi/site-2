<template>
  <HeaderInclude></HeaderInclude>

  <Alert v-if="retorno != undefined" :msg="retorno" @fechar="estadoAlerta"></Alert>

  <div class="hs_blog_box1_main_wrapper" data-aos="fade-up" data-aos-duration="1000">
		<div class="hs_blog_box1_cont_main_wrapper">

			<div class="hs_blog_cont_heading_wrapper text-center">
				<h2>Alterar senha de acesso</h2>
			</div>

      <form action="" method="POST" id="login-form" @submit.prevent="salvaSenha">
        <div class="row">
          <div class="form-group col-md-12">
            <label for="senha">Digite sua Senha</label>
            <div class="btn-olho-senha">
              <input :type="inputType1" name="senha" id="senha" v-model="senha" maxlength="10" @input="validarEntradaSenha()" class="form-control">
              <button type="button" title="Ver ou ocultar senha" @click="viewSenha('P')">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
                  <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/>
                  <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>
                </svg>
              </button>
            </div>
          </div>
                                  
          <div class="form-group col-md-12">
            <label for="nova_senha">Confirmar Senha</label>
            <div class="btn-olho-senha">
              <input :type="inputType2" name="nova_senha" id="nova_senha" maxlength="10" v-model="conf_senha" class="form-control" @input="confirmaSenha()">
              <button type="button" title="Ver ou ocultar senha" @click="viewSenha('N')">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
                  <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/>
                  <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>
                </svg>
              </button>
            </div>
          </div> 

          <template v-if="confiSenha">
            <p class="senha-conf-correta">Senhas não batem. Verifique o valor digitado.</p>
          </template>

          <ul class="password-check">
            <li id="check-length" :class="{ 'senha-confi': min6 }">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle" viewBox="0 0 16 16">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                <path d="m10.97 4.97-.02.022-3.473 4.425-2.093-2.094a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05"/>
              </svg> Mínimo de 6 caracteres
            </li>
            <li id="check-uppercase" :class="{ 'senha-confi': maiusculas }">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle" viewBox="0 0 16 16">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                <path d="m10.97 4.97-.02.022-3.473 4.425-2.093-2.094a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05"/>
              </svg> Letras maiúsculas
            </li>
            <li id="check-lowercase" :class="{ 'senha-confi': minusculas }"> 
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle" viewBox="0 0 16 16">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                <path d="m10.97 4.97-.02.022-3.473 4.425-2.093-2.094a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05"/>
              </svg> Letras minusculas
            </li>
            <li id="check-number" :class="{ 'senha-confi': numeros }">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle" viewBox="0 0 16 16">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                <path d="m10.97 4.97-.02.022-3.473 4.425-2.093-2.094a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05"/>
              </svg> Precisa ter um número
            </li>
            <li id="check-special" :class="{ 'senha-confi': caracEspeciais }">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle" viewBox="0 0 16 16">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                <path d="m10.97 4.97-.02.022-3.473 4.425-2.093-2.094a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05"/>
              </svg> Carácteres especiais exe: $ * @
            </li>
          </ul>
        </div>
        
        <div class="prs_animate_btn1 prs_upcom_main_wrapper">
          <input type="hidden" id="user" name="user" value="<?php echo $user ?>"/>
          <input type="hidden" id="aut" name="aut" value="<?php echo $aut ?>"/>

          <button type="submit" class="btn btn-faz-login" :disabled="confiSenha">Salvar</button>
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
import HeaderInclude from "@/views/includes/HeaderInclude.vue";
import FooterInclude from "@/views/includes/FooterInclude.vue";
import Alert from "@/components/alerts/AlertAcao.vue";

import endPointUsuario from "@/services/endPointUsuario.js";

export default {
  components: { 
    HeaderInclude, FooterInclude, Alert 
  },
  data() {
    return {
      retorno: undefined,
      inputType1: 'password',
      inputType2: 'password',
      senha: '',
      conf_senha: '',
      min6: false,
      maiusculas: false,
      minusculas: false,
      numeros: false,
      caracEspeciais: false,
      confiSenha: false,
      aut: '',
      user: '',
    }
  },
  mounted() {
    this.aut = this.$route.params.aut;
    this.user = this.$route.params.user;
  },
  methods: {
    estadoAlerta(data) {
      this.retorno = data; 
    },
    viewSenha(value) {
      if(value == 'P') {
        this.inputType1 = this.inputType1 === 'text' ? 'password' : 'text';
      } else {
        this.inputType2 = this.inputType2 === 'text' ? 'password' : 'text';
      } 
    },
    validarEntradaSenha() {
      let valorAtual = this.senha;
      const regEx = new RegExp("^[0-9a-zA-Z$*@]*$");

      if(!regEx.test(valorAtual)) {
        let fail = valorAtual.slice(0, -1);
        this.senha = fail;
      }

      let senha = this.senha;
    
      this.min6 = senha.length >= 6;
      this.maiusculas = /[A-Z]/.test(senha);
      this.minusculas = /[a-z]/.test(senha);
      this.numeros = /[0-9]/.test(senha);
      this.caracEspeciais = /[$*@]/.test(senha);

      this.confirmaSenha();
    },
    confirmaSenha() {
      let senhaUm = this.senha;
      let senhaDois = this.conf_senha;

      this.confiSenha = senhaUm !== senhaDois ? true : false;
      
      if(senhaDois.length < 6) {
        this.confiSenha = false;
      }
    },
    async salvaSenha() {
      let err = '';

      if(this.conf_senha == '') {
        err = "SIT-UI332848 : Forneça a confirmação da senha!";
      }

      if(this.senha == '') {
        err = "SIT-HH622638 : Forneça uma senha!";
      }

      if(this.senha !== this.conf_senha) {
        err = "SIT-YG570337 : As senhas não estão correspondendo ou estão fora do padrão !";
      }

      if(err == '') {
        let dados = {
          par4: 'S',
          par5: this.user,
          par6: this.aut,
          par7: this.senha
        }

        let resultado = await endPointUsuario.salvarRecuperaSenha(dados);

        if(resultado.statusId == '00') {
          this.retorno = resultado.statusMsg;
          this.senha = '';
          this.conf_senha = '';
        } else {
          this.retorno = `SIS-WH152052 : ${resultado.statusMsg}`;
        }
      } else {
        this.retorno = err;
      }
    }
    
  }
}
</script>

<style>
.senha-confi {
  color: #008000;
  text-decoration: none!important;
}
.senha-conf-correta {
  align-items: center;
  font-weight: 500;
  margin-top: 1rem;
  color: #ff0000;
}
.area-cont-check {
  margin-right: 10px;
}
</style>