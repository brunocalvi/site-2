<template>
  <HeaderInclude></HeaderInclude>

  <Alert v-if="retorno != undefined" :msg="retorno" @fechar="estadoAlerta"></Alert>

  <template v-if="usu_ativo == 'N'">
    <div class="alert-usuario-inativo">
      <div class="alert alert-danger text-center" role="alert"> 
        Seu usuário está inativo.<br/>
        Para ativá-lo, use o link enviado para o e-mail utilizado no cadastrado.
      </div>
    </div>
  </template>

  <div class="main section-area-usuario">
    <form @submit.prevent="cadastraUsuario">
      <div class="container">
        <div class="col-12 col-md-10 ajusta-card-cadastro">
          <div class="card-area-usuario" data-aos="fade-up" data-aos-duration="1000">
            <h4 class="title-p-user">Realizar o cadastro</h4>
            <p>Forneça seus dados abaixo para que a plataforma crie o seu perfil</p>

            <ul class="list-top-cadastro">
              <li>Nos campos numéricos forneça apenas números</li>
              <li>Campos com * são de preenchimento obrigatório</li>
            </ul>
            
            <div class="row">
              <div class="form-group col-12 col-md-9">
                <label for="nome">Nome Completo: <span class="camp_obrigatorio">*</span></label>
                <input type="text" class="form-control" name="nome" id="nome" v-model="form.nome" @keydown="validarTecla($event, 'text')" />
              </div>

              <div class="form-group col-12 col-md-3">
                <label for="nacionalidade">Nacionalidade:</label>
                <select class="form-control" name="nacionalidade" id="nacionalidade" v-model="form.nacionalidade">
                  <option value="BRA">Brasileiro</option>
                  <option value="EXT">Estrangeiro</option>
                </select> 
              </div>

              <div class="form-group col-md-2 col-12">
                <label for="ddd">DDD: <span class="camp_obrigatorio">*</span></label>
                <input type="text" name="ddd" id="ddd" maxlength="5" class="form-control" v-model="form.ddd" />
              </div>

              <div class="form-group col-12 col-md-6">
                <label for="celular">Celular: <span class="camp_obrigatorio">*</span></label>
                <input type="text" name="celular" id="celular" class="form-control" maxlength="12" placeholder="000000000" v-model="form.celular" @keydown="validarTecla($event, 'num')"/>
              </div>

              <div class="form-group col-md-4 col-12">
                <label for="sexo">Sexo:</label>
                <select class="form-control" name="sexo" id="sexo" v-model="form.sexo">
                  <option disabled value="">Selecione ...</option>
                  <option value="F">Feminino</option>
                  <option value="M">Masculino</option>
                  <option value="O">Outros</option>
                </select>
              </div>

              <p class="ajuste-nascimento">Data de Nascimento: <span class="camp_obrigatorio">*</span></p>

              <div class="form-group col-md-4 col-12">
                <select class="form-control" name="dia" id="dia" v-model="form.dia">
                  <option disabled value="">Dia ...</option>
                  <option value="01">01</option>
                  <option value="02">02</option>
                  <option value="03">03</option>
                  <option value="04">04</option>
                  <option value="05">05</option>
                  <option value="06">06</option>
                  <option value="07">07</option>
                  <option value="08">08</option>
                  <option value="09">09</option>
                  <option value="10">10</option>
                  <option value="11">11</option>
                  <option value="12">12</option>
                  <option value="13">13</option>
                  <option value="14">14</option>
                  <option value="15">15</option>
                  <option value="16">16</option>
                  <option value="17">17</option>
                  <option value="18">18</option>
                  <option value="19">19</option>
                  <option value="20">20</option>
                  <option value="21">21</option>
                  <option value="22">22</option>
                  <option value="23">23</option>
                  <option value="24">24</option>
                  <option value="25">25</option>
                  <option value="26">26</option>
                  <option value="27">27</option>
                  <option value="28">28</option>
                  <option value="29">29</option>
                  <option value="30">30</option>
                  <option value="31">31</option>
                </select> 
              </div>

              <div class="form-group col-md-4 col-12">
                <select class="form-control" name="mes" id="mes" v-model="form.mes">
                  <option disabled value="">Mês ...</option>
                  <option value="01">Janeiro</option>
                  <option value="02">Fevereiro</option>
                  <option value="03">Março</option>
                  <option value="04">Abril</option>
                  <option value="05">Maio</option>
                  <option value="06">Junho</option>
                  <option value="07">Julho</option>
                  <option value="08">Agosto</option>
                  <option value="09">Setembro</option>
                  <option value="10">Outubro</option>
                  <option value="11">Novembro</option>
                  <option value="12">Dezembro</option>
                </select>
              </div>
                  
              <div class="form-group col-md-4">
                <select class="form-control" v-model="form.ano" name="ano" id="ano">
                  <option disabled value="">Ano ...</option>
                  <option v-for="ano in anos" :key="ano" :value="ano"> {{ ano }} </option>
                </select>
              </div>

              <template v-if="this.form.nacionalidade == 'BRA'">
                <div class="form-group col-md-12 col-12">
                  <p><b>Tipo de Cadastro:</b></p>
                  <div class="radio-buttons-container">
                    <div class="radio-button">
                      <input name="radio-group" id="radio2" class="radio-button__input" type="radio" @click="tipoCadastro('PF')" :checked="checkPF" />
                      <label for="radio2" class="radio-button__label">
                        <span class="radio-button__custom"></span> Pessoa Física       
                      </label>
                    </div>

                    <div class="radio-button">
                      <input name="radio-group" id="radio1" class="radio-button__input" type="radio" @click="tipoCadastro('PJ')" :checked="checkPJ">
                      <label for="radio1" class="radio-button__label">
                        <span class="radio-button__custom"></span> Pessoa Jurídica
                      </label>
                    </div>
                  </div>
                </div>

                <small class="camp_obrigatorio">*Insira somente números nesses campos</small><br/>

                <template v-if="checkPF == true">
                  <div class="row">
                    <div class="form-group col-md-6 col-12">
                      <label for="cpf">CPF: <span class="camp_obrigatorio">*</span></label>
                      <input type="text" name="cpf" id="cpf" class="form-control" v-model="form.cpf" placeholder="00000000000" @keydown="validarTecla($event, 'num')">
                    </div>

                    <div class="form-group col-md-6 col-12">
                      <label for="rg">RG:</label>
                      <input type="text" name="rg" id="rg" class="form-control" v-model="form.rg" placeholder="00000000000" @keydown="validarTecla($event, 'num')">
                    </div>
                  </div>
                </template>

                <template v-else>
                  <div class="form-group col-md-12 col-12">
                    <label for="cnpj">CNPJ: <span class="camp_obrigatorio">*</span></label>
                    <input type="text" class="form-control" name="cnpj" id="cnpj" v-model="form.cnpj" placeholder="00000000000" @keydown="validarTecla($event, 'num')">
                  </div>
                </template>
              </template>

              <template v-else>
                <div class="form-group col-md-12 col-12">
                  <label for="passaporte">Nº Passaporte: <span class="camp_obrigatorio">*</span></label>
                  <input type="text" class="form-control" name="passaporte" id="passaporte" v-model="form.passaporte" >
                </div>
              </template>    
            </div>
          </div>

          <template v-if="gt_cad_reduzido == 'N'">
          <div class="card-area-usuario" data-aos="fade-up" data-aos-duration="1000">
            <h4 class="title-p-user">Endereço</h4>

            <div class="row">
              <div class="form-group col-md-4">
                <label for="cep">CEP: <span class="camp_obrigatorio">*</span></label>
                <input type="text" id="cep" name="cep" class="form-control" placeholder="00000000" v-model="form.cep" @keydown="validarTecla($event, 'num')" @blur="preencherCampos()"/>
              </div>

              <div class="form-group col-md-8">                           
                <label for="endereco">Endereço: <span class="camp_obrigatorio">*</span></label>
                <input type="text" name="endereco" id="endereco" class="form-control" v-model="form.endereco">
              </div>

              <div class="form-group col-md-2">
                <label for="numero">Nº: <span class="camp_obrigatorio">*</span></label>
                <input type="text" name="numero" id="numero" class="form-control" maxlength="5" v-model="form.numero_casa">
              </div>

              <div class="form-group col-md-10">
                <label for="complemento">Complemento:</label>
                <input type="text" name="complemento" id="complemento" class="form-control" v-model="form.complemento">
              </div>

              <div class="form-group col-md-4">
                <label for="bairro">Bairro: <span class="camp_obrigatorio">*</span></label>
                <input type="text" name="bairro" id="bairro" class="form-control" v-model="form.bairro">
              </div>

              <div class="form-group col-md-4">
                <label for="cidade">Cidade: <span class="camp_obrigatorio">*</span></label>
                <input type="text" name="cidade" id="cidade" class="form-control" v-model="form.cidade">
              </div>

              <template v-if="this.form.nacionalidade == 'BRA'">
                <div class="form-group col-md-4">
                  <label for="UF-BR">Estado: <span class="camp_obrigatorio">*</span></label>
                  <select class="form-control" name="UF-BR" id="UF-BR" v-model="form.uf_br">
                    <option value="">Selecione ...</option>
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
                  <label for="UF-EX">Estado: <span class="camp_obrigatorio">*</span></label>
                  <input type="text" name="UF-EX" id="UF-EX" class="form-control" placeholder="UF" v-model="form.uf_ex">
                </div>
              </template>  
            </div>
          </div>
          </template>

          <div class="card-area-usuario" data-aos="fade-up" data-aos-duration="1000">
            <h4 class="title-p-user">Cadastrar usuário</h4>

            <div class="row">
              <div class="form-group col-md-6">
                <label for="email">E-mail: <span class="camp_obrigatorio">*</span></label>
                <input type="email" name="email" class="form-control" v-model="form.email">
              </div>
                                    
              <div class="form-group col-md-6">
                <label for="novo_email">Confirmar E-mail: <span class="camp_obrigatorio">*</span></label>
                <input type="email" name="novo_email" class="form-control" v-model="form.novo_email">
              </div>

              <div class="form-group col-md-6">
                <label for="senha">Senha: <span class="camp_obrigatorio">*</span></label>
                <div class="btn-olho-senha">
                  <input :type="inputType1" name="senha" id="senha" maxlength="10" class="form-control" @input="validarEntradaSenha()" v-model="form.senha" autocomplete="off">
                  <button type="button" title="Ver ou ocultar senha" @click="viewSenha('P')">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
                      <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/>
                      <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>
                    </svg>
                  </button>
                </div>
              </div>
                                    
              <div class="form-group col-md-6">
                <label for="nova_senha">Confirmar Senha: <span class="camp_obrigatorio">*</span></label>
                <div class="btn-olho-senha">
                  <input :type="inputType2" name="nova_senha" id="nova_senha" maxlength="10" class="form-control" @input="confirmaSenha()" v-model="form.nova_senha" autocomplete="off">
                    <button type="button" title="Ver ou ocultar senha" @click="viewSenha('N')">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
                      <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/>
                      <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>
                    </svg>
                  </button>
                </div>
              </div>

              <div class="form-group col-md-12">
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
                  <li id="check-special" :class="{ 'senha-confi': confiSenha }">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle" viewBox="0 0 16 16">
                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                      <path d="m10.97 4.97-.02.022-3.473 4.425-2.093-2.094a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05"/>
                    </svg> As senhas estão batendo!
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div class="card-area-usuario" data-aos="fade-up" data-aos-duration="1000">
            <h4 class="title-p-user">Gêneros favoritos</h4>
            
            <div class="form-group col-md-12">
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
            </div>
            <br/><br/>
          </div>

          <div class="card-area-usuario" data-aos="fade-up" data-aos-duration="1000">
            <h4 class="title-p-user">Termos de uso e política de privacidade da LGPD</h4>
            <div v-html="gt_termo_lgpd"></div>

            <div class="form-group col-md-12">
              <label class="area-cont-check">
                <input type="checkbox" id="concorda" name="concorda" v-model="form.concorda">
                <svg viewBox="0 0 64 64" height="2em" width="2em">
                  <path d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16" pathLength="575.0541381835938" class="path"></path>
                </svg>
              </label>
              <label for="concorda">Li e concordo com as política de privacidade para a compra de ingressos. <a href="#" target="_blank"><b class="camp_obrigatorio">Ler Política de Privacidade</b></a></label>
            </div>

            <div class="form-group col-md-12">
              <label class="area-cont-check">
                <input type="checkbox" id="autorizaReceber" name="autorizaReceber" v-model="form.autorizaReceber">
                <svg viewBox="0 0 64 64" height="2em" width="2em">
                  <path d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16" pathLength="575.0541381835938" class="path"></path>
                </svg>
              </label>
              <label for="autorizaReceber">Autorizo receber informações e ofertas da empresa e seus parceiros.</label> 
            </div>

            <div class="form-group col-md-12 text-center">
              <button type="submit" class="btn btn-success">Finalizar Cadastro</button>
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>

  <FooterInclude></FooterInclude>
</template>

<script>
import HeaderInclude from "@/views/includes/HeaderInclude.vue";
import FooterInclude from "@/views/includes/FooterInclude.vue";
import Alert from "@/components/alerts/AlertAcao.vue";

import endPointUsuario from '@/services/endPointUsuario.js';
import { pegaCep } from "@/services/pesquisaUsuarioCep.js";
import validacoes from '@/store/validaCadastro.js';

export default {
  components: { 
    HeaderInclude, FooterInclude, Alert  
  },
  data() {
    return {
      gt_cad_reduzido: 'N',
      gt_termo_lgpd: '',
      generosSelecionados: [],
      generos: {},
      usuario: {},
      form: {},
      min6: false,
      maiusculas: false,
      minusculas: false,
      numeros: false,
      caracEspeciais: false,
      confiSenha: false,
      checkPF: true,
      checkPJ: false,
      inputType1: 'password',
      inputType2: 'password',
      anos: [],
      tpCadastro: 'PF',
      retorno: undefined,
      usu_ativo: 'S',
      formLimpo: {}, 
    }
  },
  async created() {
    const config = this.$route.meta.config;

    if(config) {
      this.gt_cad_reduzido = config.gt_cad_reduzido;
      this.gt_termo_lgpd = config.gt_termo_lgpd;
    }

    this.form = {
      nacionalidade: 'BRA',
      sexo: '',
      dia: '',
      mes: '',
      ano: '',
      concorda: true,
      autorizaReceber: true,
      gt_cad_reduzido: this.gt_cad_reduzido,
      tpCadastro: this.tpCadastro,
      tipo_pessoa: '',
      data_nascimento: '',
      cpf: '',
      rg: '',
      cnpj: '',
      cep: '',
      celular: '',
    }

    // feito assim para iniciar o form corretamente depois de limpo
    this.formLimpo = this.form;

    this.generos = await endPointUsuario.getBuscaGeneros();
    this.generosSelecionados.push(this.generos[0].codigo);

    const anoAtual = new Date().getFullYear();
    this.anos = Array.from({ length: 91 }, (_, i) => anoAtual - i);
  },
  methods: {
    async preencherCampos() {
      let cep = this.form.cep;
      cep = cep.replace(/\D/g, '');

      if (cep.length === 8) {
        try {
          const resultado = await pegaCep(cep);

          if (resultado && !resultado.erro) {
            this.form.endereco = resultado.logradouro;
            this.form.bairro = resultado.bairro;
            this.form.cidade = resultado.localidade;
            this.form.uf_br = resultado.uf;
          } else {
            this.retorno = 'CEP não encontrado ou inválido.';
          }
        } catch (e) {
          console.error('Erro ao buscar o CEP:', e);
        }
      }
    },
    viewSenha(value) {
      if(value == 'P') {
        this.inputType1 = this.inputType1 === 'text' ? 'password' : 'text';
      } else {
        this.inputType2 = this.inputType2 === 'text' ? 'password' : 'text';
      } 
    },
    tipoCadastro(value) {
      if(value == 'PF') {
        this.checkPF = true;
        this.checkPJ = false;
        this.form.cnpj = '';
      } else {
        this.checkPF = false;
        this.checkPJ = true;
        this.form.cpf = '';  
        this.form.rg = '';    
      }

      this.tpCadastro = value; 
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
      let senhaDois = this.form.nova_senha;

      this.confiSenha = senhaUm === senhaDois ? true : false;
    },
    estadoAlerta(data) {
     this.retorno = data; 
    },
    validarTecla(event, tipo) {
      const char = event.key;

      const teclasPermitidas = [
        'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Home', 'End'
      ];

      if (teclasPermitidas.includes(char)) return;

      let regex;

      if (tipo === "num") {
        regex = /^[0-9]$/;
      } else if (tipo === "text") {
        regex = /^[A-Za-zÀ-ÖØ-ö ]$/;
      } else if (tipo === "numtext") {
        regex = /^[A-Za-zÀ-ÖØ-ö0-9 ]$/;
      }

      if(!regex.test(char)) {
        event.preventDefault();
      }
    },
    async cadastraUsuario() {
      let err = undefined;

      this.form.genero = this.generosSelecionados;
      this.form.data_nascimento = `${this.form.ano}-${this.form.mes}-${this.form.dia}`;

      this.form.newsleter = this.form.autorizaReceber == true ? 'S' : 'N';
      this.form.concorda_lgpt = this.form.concorda == true ? 'S' : 'N';

      this.form.uf = this.form.nacionalidade == 'BRA' ? this.form.uf_br : this.form.uf_ex;
      this.form.rg = this.form.nacionalidade != 'BRA' ? '' : this.form.rg;
      this.form.cpf = this.form.nacionalidade != 'BRA' ? '' : this.form.cpf;
      this.form.passaporte = this.form.nacionalidade != 'EXT' ? '' : this.form.passaporte;

      this.form.celular = this.form.celular.replace(/[^\w\s]|_/g, '');
      this.form.cpf = this.form.cpf.replace(/[^\w\s]|_/g, '');
      this.form.rg = this.form.rg.replace(/[^\w\s]|_/g, '');
      this.form.cep = this.form.cep.replace(/[^\w\s]|_/g, '');

      if(this.tpCadastro == 'PF') {
        this.form.tipo_pessoa = this.form.cpf; 
      } else {
        this.form.tipo_pessoa = this.form.cnpj;
        this.form.rg = '00000000';
      }

      err = validacoes.validacoesCadastro(this.form);

      if(err == undefined || err == '') {
        let fim = await endPointUsuario.cadastrarUsuario(this.form);
 
        this.retorno = fim.resposta;
        this.usu_ativo = fim.usu_ativo;

        if(fim.statusId == '00') {
          this.form = {};
        }
        
      } else {
        this.retorno = err;
      }
    }
  }
}
</script>

<style>
.ajusta-card-cadastro {
  margin: 0 auto;
}
.list-top-cadastro {
  list-style: disc;
  color: #ff0000;
  padding-left: 2rem;
  margin-bottom: 1rem;
}
.camp_obrigatorio {
  color: #ff0000;
  text-decoration: none;
}
.ajuste-nascimento {
  display: inline-block;
  max-width: 100%;
  margin-bottom: 5px;
  font-weight: bold;
  color: #707070;
  margin-top: 1rem;
}
.alert-usuario-inativo {
  position: fixed;
  z-index: 1;
  width: 100%;
  bottom: 2rem;
}
.alert-usuario-inativo .alert-danger {
  max-width: 930px;
  margin: 0 auto;
}
</style>
