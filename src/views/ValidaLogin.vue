<template>
  <HeaderInclude></HeaderInclude>

  <Alert v-if="retorno != undefined" :msg="retorno" @fechar="estadoAlerta"></Alert>

  <div class="hs_blog_box1_main_wrapper">
		<div class="hs_blog_box1_cont_main_wrapper" data-aos="fade-up" data-aos-duration="1000">

			<div class="hs_blog_cont_heading_wrapper text-center">
				<h2>Acesse sua conta</h2>
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
            <template v-if="gt_cad_reduzido == 'N'">
              <router-link class="nav-link" to="/cadastro">
                <span>Você ainda não tem uma conta?</span> 
                <b>Cadastre-se <i class="fa fa-long-arrow-right"></i></b>
              </router-link>
            </template>

            <template v-else>
              <div class="nav-link" data-bs-toggle="modal" data-bs-target="#modalCadastroV">
                <span>Você ainda não tem uma conta?</span> 
                <b>Cadastre-se <i class="fa fa-long-arrow-right"></i></b>
              </div>
            </template> 
          </h5>
        </div>
      </div>
                          
    </div>
  </div>

  <div class="modal fade" id="modalCadastroV" tabindex="-1" aria-labelledby="modalCadastroVLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="modalCadastroVLabel">Cadastre-se agora!</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          ...
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary">Save changes</button>
        </div>
      </div>
    </div>
  </div>

  <FooterInclude></FooterInclude>
</template>

<script>
import auth from "@/store/auth.js";
import { guardaIngressoStore } from '@/store/guardaIngressos.js';
import { infoUsuarioStore } from '@/store/infoUsuario.js';

import { dadosUsuario } from "@/services/dadosUsuario.js";

import Alert from "@/components/alerts/AlertAcao.vue";
import HeaderInclude from "./includes/HeaderInclude.vue";
import FooterInclude from "./includes/FooterInclude.vue";

export default {
  components: {
    Alert, HeaderInclude, FooterInclude
  },
  data() {
    return {
      usuario: {},
      email: '',
      senha: '',
      inputType: 'password',
      retorno: undefined,
      ingressos: guardaIngressoStore(),
      infoUsuario: infoUsuarioStore(), 
      gt_cad_reduzido: 'N',
    }
  },
  async created() {
    if(Object.keys(this.ingressos.getAll()).length === 0) {
      this.$router.push('/');
    }

    if(Object.keys(this.infoUsuario.get()).length !== 0) {
      this.$router.push('/checkout');
    }

    const config = this.$route.meta.config;
    this.gt_cad_reduzido = config.gt_cad_reduzido;
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

        if(resposta.statusId == '00') {
          if(resposta.nacionalidade == 'BRA') {
            sessionStorage.setItem('sessionId', resposta.cpf);
          } else {
            sessionStorage.setItem('sessionId', resposta.passaporte);
          }

          this.usuario = await dadosUsuario();
          this.infoUsuario.salvar(this.usuario);

          this.$router.push('/checkout'); 
        } else {
          this.retorno = resposta;
        }
      } catch(e) {
        console.error(e);
      }
    }
  },
}
</script>

<style scoped>
.afaste {
  display: flex;
  justify-content: end;
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
  background-color: #fff;
}
</style>