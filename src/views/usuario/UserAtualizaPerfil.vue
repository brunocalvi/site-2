<template>
  <HeaderInclude></HeaderInclude>

  <Alert v-if="retorno != undefined" :msg="retorno" @fechar="estadoAlerta"></Alert>

  <div class="main section-area-usuario">
    <div class="container" data-aos="fade-up" data-aos-duration="1000">
      <div class="row">

        <div class="col-12 col-md-4">
          <template v-if="usuario">
            <MenuAreaUsuario 
              :email="usuario.email" 
              :nome="usuario.nome" 
              :id="Number(usuario.id)" 
              @openModal="openModal"
              :btnImagem="true"
              :atuatizaFoto="atuatizaFoto"
            ></MenuAreaUsuario>
          </template>
        </div>

        <div class="col-12 col-md-8">
          <form @submit.prevent="atualizaUsuario">

            <div id="perfil" class="card-area-usuario">
              <h4 class="title-p-user">Dados Cadastrais</h4>
              <p>Forneça seus dados abaixo para atualizar o perfil da sua conta</p>

              <div class="row">
                <div class="form-group col-md-9">
                  <label for="nome">Nome Completo</label>
                  <input type="text" class="form-control" name="nome" id="nome" v-model="form.nome" disabled />
                </div>

                <div class="form-group col-md-3">
                  <label for="sexo">Sexo</label>
                  <select class="form-control" name="sexo" id="sexo" v-model="form.sexo">
                    <option value="">Selecione ...</option>
                    <option value="M">Masculino</option>
                    <option value="F">Feminino</option>
                    <option value="O">Outros</option>
                  </select>
                </div>

                <div class="form-group col-md-4">
                  <label for="cep">CEP </label>
                  <input type="text" class="form-control" name="cep" id="cep" maxlength="8" v-model="form.cep" required />
                  <small id="resp-cep" class="fail-warning"></small>
                </div>

                <div class="form-group col-md-8">                           
                  <label for="endereco">Endereço</label>
                  <input type="text" class="form-control" name="endereco" id="endereco" v-model="form.endereco" required />
                </div>
    
                <div class="form-group col-md-2">
                  <label for="numero">Nº</label>
                  <input type="text" class="form-control" name="numero" id="numero" v-model="form.numero" required />
                </div>
    
                <div class="form-group col-md-10">
                  <label for="complemento">Complemento</label>
                  <input type="text" class="form-control" name="complemento" id="complemento" v-model="form.complemento">
                </div>
    
                <div class="form-group col-md-4">
                  <label for="bairro">Bairro</label>
                  <input type="text" class="form-control" name="bairro" id="bairro" v-model="form.bairro" required />
                </div>
    
                <div class="form-group col-md-4">
                  <label for="cidade">Cidade</label>
                  <input type="text" class="form-control" name="cidade" id="cidade" v-model="form.cidade" required />
                </div>
    
                <template v-if="usuario.nacionalidade == 'BRA'">
                  <div class="form-group col-md-4">
                    <label for="UF-BR">Estado</label>
                    <select class="form-control" name="UF-BR" id="UF-BR" v-model="form.uf">
                      <option value="">Selecione...</option>
                      <option value="AC">Acre</option>
                      <option value="AL">Alagoas</option>
                      <option value="AP">Amapá</option>
                      <option value="AM">Amazonas</option>
                      <option value="BA">Bahia</option>
                      <option value="CE">Ceará</option>
                      <option value="DF">Distrito Federal</option>
                      <option value="ES">Espírito Santo</option>
                      <option value="GO">Goiás</option>
                      <option value="MA">Maranhão</option>
                      <option value="MT">Mato Grosso</option>
                      <option value="MS">Mato Grosso do Sul</option>
                      <option value="MG">Minas Gerais</option>
                      <option value="PA">Pará</option>
                      <option value="PB">Paraíba</option>
                      <option value="PR">Paraná</option>
                      <option value="PE">Pernambuco</option>
                      <option value="PI">Piauí</option>
                      <option value="RJ">Rio de Janeiro</option>
                      <option value="RN">Rio Grande do Norte</option>
                      <option value="RS">Rio Grande do Sul</option>
                      <option value="RO">Rondônia</option>
                      <option value="RR">Roraima</option>
                      <option value="SC">Santa Catarina</option>
                      <option value="SP">São Paulo</option>
                      <option value="SE">Sergipe</option>
                      <option value="TO">Tocantins</option>
                      <option value="EX">Estrangeiro</option>
                    </select>
                  </div>
                </template>

                <template v-else>
                  <div class="form-group col-md-4">
                    <label for="UF-EX">Estado</label>
                    <input type="text" name="UF-EX" id="UF-EX" class="form-control" placeholder="UF" v-model="form.uf">
                  </div>
                </template>
        
                <div class="form-group col-md-2">                              
                  <label for="ddd-cel">DDD</label>
                  <input type="text" class="form-control" name="ddd" id="ddd" maxlength="2" v-model="form.dddcel" required />
                </div>
    
                <div class="form-group col-md-5">
                  <label for="celular">Celular</label>
                  <input type="text" class="form-control" name="celular" id="celular" maxlength="9" v-model="form.telefone" required />
                </div>

                <div class="form-group col-md-5">
                  <label for="email">E-mail</label>
                  <input type="email" class="form-control" required name="email" id="email" v-model="usuario.email" disabled />
                </div>

                <template v-if="usuario.nacionalidade == 'BRA'">
                  <!--<div class="col-md-12" id="t-pessoa">
                    <p><b>Tipo de Cadastro:</b></p>
                    <div class="checkout-form__input">

                      <div class="radio-buttons-container">
                        <template v-if="usuario.cpf.length == 11">
                        <div class="radio-button">
                          <input name="radio-group" id="radio2" class="radio-button__input" type="radio" disabled />
                          <label for="radio2" class="radio-button__label">
                            <span class="radio-button__custom"></span> Pessoa Física       
                          </label>
                        </div>
                        </template>

                        <template v-else>
                        <div class="radio-button">
                          <input name="radio-group" id="radio1" class="radio-button__input" type="radio" disabled />
                          <label for="radio1" class="radio-button__label">
                            <span class="radio-button__custom"></span> Pessoa Jurídica
                          </label>
                        </div>
                        </template>                     
                      </div>

                    </div>
                  </div>-->

                  <template v-if="usuario.cpf.length == 11">
                    <div class="form-group col-md-6 envol-input">
                      <label for="cpf">CPF</label>
                      <input type="text" class="form-control" name="cpf" id="cpf" v-model="usuario.cpf" disabled />
                    </div>
  
                    <div class="form-group col-md-6 envol-input">
                      <label for="rg">RG</label>
                      <input type="text" class="form-control" name="rg" id="rg" v-model="usuario.rg" disabled />
                    </div>
                  </template>

                  <template v-else>
                    <div class="form-group col-md-12 envol-input">
                      <label for="cnpj">CNPJ</label>
                      <input type="text" class="form-control" name="cnpj" id="cnpj" v-model="usuario.cpf" disabled />
                    </div>
                  </template>
                </template>

                <template v-else>
                  <div class="form-group col-md-12 envol-input">
                    <label for="passaporte">Passaporte</label>
                    <input type="text" class="form-control" name="passaporte" id="passaporte" v-model="usuario.passaporte" disabled />
                  </div>
                </template>

              </div>

            </div>

            <div class="card-area-usuario">
              <h4 class="title-p-user">Atualizar Senha</h4>
              <p class="fail-warning">A alteração da senha não é obrigatória. Caso não preencha manterá a senha atual.</p>

              <div class="row">
                <div class="form-group col-md-6">
                  <label for="senha">Digite sua Senha</label>
                  <div class="btn-olho-senha">
                    <input :type="inputType1" name="senha" id="senha" v-model="form.senha" maxlength="10" @input="validarEntradaSenha()" class="form-control">
                    <button type="button" title="Ver ou ocultar senha" @click="viewSenha('P')">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
                        <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/>
                        <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>
                      </svg>
                    </button>
                  </div>
                </div>
                                        
                <div class="form-group col-md-6">
                  <label for="nova_senha">Confirmar Senha</label>
                  <div class="btn-olho-senha">
                    <input :type="inputType2" name="nova_senha" id="nova_senha" maxlength="10" v-model="form.conf_senha" class="form-control" @input="confirmaSenha()">
                    <button type="button" title="Ver ou ocultar senha" @click="viewSenha('N')">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
                        <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/>
                        <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>
                      </svg>
                    </button>
                  </div>
                </div> 
              </div>

              <div class="form-group col-md-12">
                <ul class="password-check">
                  <li id="check-length" :class="{ 'senha-confi': min6 }">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle" viewBox="0 0 16 16">
                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                      <path d="m10.97 4.97-.02.022-3.473 4.425-2.093-2.094a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05"/>
                    </svg> Mínimo de 6 caracteres e máximo de 10
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
                  <li id="check-special" :class="{ 'senha-confi': confiSenha }">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle" viewBox="0 0 16 16">
                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                      <path d="m10.97 4.97-.02.022-3.473 4.425-2.093-2.094a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05"/>
                    </svg> As senhas estão batendo!
                  </li>
                </ul>
              </div>
            </div>

            <div class="card-area-usuario">
              <h4 class="title-p-user">Géneros Favoritos</h4>
            
              <ul class="dashboard-content-ul">
                <template v-for="genero in generos" :key="genero.codigo">
                  <li class="st_cherity_img_cont">
                    <label class="area-cont-check">
                      <input
                        type="checkbox"
                        :id="genero.codigo"
                        :value="genero.codigo"
                        v-model="generosSelecionados"
                      />
                      <svg viewBox="0 0 64 64" height="2em" width="2em">
                        <path
                          d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
                          pathLength="575.0541381835938"
                          class="path"
                        ></path>
                      </svg>
                    </label>
                    <label :for="genero.codigo">{{ genero.descricao }}</label>
                  </li>
                </template>
              </ul>

              <br/><br/>

              <div class="d-flex w-100">
                <button type="submit" name="atualizar" class="btn btn-success">Atualizar Cadastro</button>
              </div>
            </div>
          </form>
        </div>

      </div>
    </div>
  </div>

   <template v-if="modalOpen">
    <div class="modal-backdrop" @click.self="closeModal()">
      <div class="modal-foto text-center">
        <button class="close-button" @click="closeModal()">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle" viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
          </svg>
        </button>

        <div class="modal-content">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" class="bi bi-camera" viewBox="0 0 16 16">
            <path d="M15 12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h1.172a3 3 0 0 0 2.12-.879l.83-.828A1 1 0 0 1 6.827 3h2.344a1 1 0 0 1 .707.293l.828.828A3 3 0 0 0 12.828 5H14a1 1 0 0 1 1 1zM2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4z"/>
            <path d="M8 11a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5m0 1a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7M3 6.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0"/>
          </svg>
          <br/>

          <p class="txt-baixo-cron"><b>Selecione a nova Imagem:</b></p>
          
          <div class="modal-body">
            <input type="file" id='' name="perfil" @change="onFileSelected">
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" @click="uploadFotoUser()">Salvar</button>
          </div>
        </div>
      </div>
    </div>
  </template>

  <FooterInclude></FooterInclude>
</template>

<script>
import { dadosUsuario } from "@/services/dadosUsuario.js";
import endPointUsuario from '@/services/endPointUsuario.js';
import { salvaFoto } from '@/services/fotoUusuario.js';

import HeaderInclude from "@/views/includes/HeaderInclude.vue";
import FooterInclude from "@/views/includes/FooterInclude.vue";
import MenuAreaUsuario from '@/views/usuario/MenuAreaUsuario.vue';
import Alert from "@/components/alerts/AlertAcao.vue";

export default {
  components: { 
    HeaderInclude, FooterInclude, MenuAreaUsuario, Alert 
  },
  data() {
    return { 
      usuario: {},
      generos: {},
      form: {},
      generosSelecionados: [],
      inputType1: 'password',
      inputType2: 'password',
      link: process.env.VUE_APP_LINK_SISTEMA,
      key: process.env.VUE_APP_WS_KEY,
      min6: false,
      maiusculas: false,
      minusculas: false,
      numeros: false,
      caracEspeciais: false,
      confiSenha: false,
      retorno: undefined,
      modalOpen: false,
      fotoPerfil: null,
      atuatizaFoto: false
    }
  },
  async created() {
    this.usuario = await dadosUsuario();

    if(this.usuario == undefined) {
      this.$router.push('/login');
    }

    this.generos = await endPointUsuario.getBuscaGeneros();
  
    this.form = {
      nome: this.usuario.nome,
      sexo: this.usuario.sexo,
      cep: this.usuario.cep,
      endereco: this.usuario.endereco,
      numero: this.usuario.numero,
      complemento: this.usuario.complemento,
      bairro: this.usuario.bairro,
      cidade: this.usuario.cidade,
      uf: this.usuario.uf,
      dddcel: this.usuario.dddcel,
      telefone: this.usuario.telefone,
    };

    if(this.usuario.genero) {
      this.generosSelecionados = this.usuario.genero
        .split(',')
        .map(str => parseInt(str.trim()));
    }
  },
  methods: {
    onFileSelected(event) {
      this.fotoPerfil = event.target.files[0];
    },
    async uploadFotoUser() {
      if(!this.fotoPerfil) {
        this.retorno = 'SIT-HF0023733 : Por favor, selecione uma foto.';
        return;
      }

      const formData = new FormData();
      formData.append('file', this.fotoPerfil); 
      formData.append('user_id', this.usuario.id);

      let resultado = await salvaFoto(formData);
      this.atuatizaFoto = true;
      this.retorno = resultado.message;
    },
    openModal() {
      this.modalOpen = true;
    },
    closeModal() {
      this.modalOpen = false;
    },
    viewSenha(value) {
      if(value == 'P') {
        this.inputType1 = this.inputType1 === 'text' ? 'password' : 'text';
      } else {
        this.inputType2 = this.inputType2 === 'text' ? 'password' : 'text';
      } 
    },
    estadoAlerta(data) {
     this.retorno = data; 
    },
    validarEntradaSenha() {
      let valorAtual = this.form.senha;
      const regEx = new RegExp("^[0-9a-zA-Z$*@]*$");

      if(!regEx.test(valorAtual)) {
        let fail = valorAtual.slice(0, -1);
        this.senha = fail;
      }

      let senha = this.form.senha;
    
      this.min6 = senha.length >= 6;
      this.maiusculas = /[A-Z]/.test(senha);
      this.minusculas = /[a-z]/.test(senha);
      this.numeros = /[0-9]/.test(senha);
      this.caracEspeciais = /[$*@]/.test(senha);
    },
    confirmaSenha() {
      let senhaUm = this.form.senha;
      let senhaDois = this.form.conf_senha;

      this.confiSenha = senhaUm === senhaDois ? true : false;
    },
    async atualizaUsuario() {
      let err = '';
      let nascimento = this.usuario.datanascimento.split("/"); 
      let generos = this.generosSelecionados.toString();

      if(this.form.senha !== this.form.conf_senha) {
        err = 'SIT-KG683808 : As senhas não estão correspondendo ou estão fora do padrão !';
      }

      if(generos == '') {
        err = 'SIT-IH000619 : Precisa ter pelomenos 1 gênero favorito selecionado !';
      }

      if(this.form.cep.length != 8) {
        err = 'SIT-IQ993758 : CEP inválido, confirme os números digitados';
      }

      if(err == '') {

        let arr = {
          par1: this.usuario.email,
          par2: this.form.senha == undefined ? '' : this.form.senha,
          par3: this.usuario.nome,
          par4: this.usuario.cpf,
          par5: this.form.sexo,
          par6: `${nascimento[2]}-${nascimento[1]}-${nascimento[0]}`,
          par7: this.usuario.rg,
          par8: this.usuario.nacionalidade,
          par9: this.form.cep,
          par10: this.form.endereco,
          par11: this.form.numero,
          par12: this.form.complemento,
          par13: this.form.bairro,
          par14: this.form.cidade,
          par15: this.form.uf,
          par16: this.form.dddcel,
          par17: this.form.telefone,
          par18: this.form.dddcel,
          par19: this.form.telefone,
          par20: this.usuario.passaporte,
          par21: generos,
          par22: 'S',
          par23: 'S',
          par24: 'S',
          par25: this.usuario.id
        }

        this.retorno = await endPointUsuario.updateUsuario(arr);

      } else {
        this.retorno = err;
      } 
    }
  }
}
</script>

<style>
.area-cont-check {
  margin-right: 10px;
}
#correio {
  text-decoration: none;
  color: #707070;  
}
.fail-warning {
  margin-bottom: 10px;
  color: #ff0000;
}
.btn-success {
  margin: 0 auto;
}
.dashboard-content-ul {
  list-style: none;
  padding: 0;
}
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
.modal-foto {
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
.modal-foto svg {
  margin: 0 auto;
}
.txt-baixo-cron {
  font-family: 'Lato', sans-serif;
  color: #707070;
  text-align: center;
}
.modal-foto h5 {
  margin: 1rem auto;
}
.modal-foto .btn-primary {
  margin: 0 auto;
  margin-top: 1rem;
}
</style>