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
                :btnImagem="false"
              ></MenuAreaUsuario>
            </template>
          </div>

          <div class="col-12 col-md-8">
            <div id="nominal">
              <h4 class="dashboard-content-box__title text-center">Associacão de Ingressos Nominais</h4>
              <br/><br/>

              <form @submit.prevent="salvaNominacao">
                <template v-for="form in formulario" :key="form.ing_id">
                  <div class="card-area-usuario">
                    <div class="row">
                        <div class="form-group col-md-6">
                          <span>Compra:</span>
                          <p><strong>{{ form.pag_id }}</strong></p>
                        </div>

                        <div class="form-group col-md-6">
                          <span>Código Ingresso:</span>
                          <p><strong>{{ form.ing_cod }}</strong></p>
                        </div>

                        <div class="form-group col-md-6">
                          <span>Data Compra:</span>
                          <p><strong>{{ form.data_compra }}</strong></p>
                        </div>

                        <div class="form-group col-md-6">
                          <span>Ingresso:</span>
                          <p><strong>{{ form.ing_descricao }}</strong></p>
                        </div>

                        <div class="form-group col-md-6">
                          <label>Nome Completo:</label>
                          <input type="text" class="form-control" v-model="form.nome" @keydown="validarTecla($event, 'text')" :disabled="preenchido">
                        </div>

                        <div class="form-group col-md-6">
                          <label>E-mail:</label>
                          <input type="email" class="form-control" v-model="form.email" :disabled="preenchido">
                        </div>

                        <div class="form-group col-md-6">
                          <label>CPF:</label>
                          <input type="text" class="form-control" masked="false" v-mask="['###.###.###-##', '##.###.###/####-##']" v-model="form.cpf" :disabled="preenchido">
                        </div>

                        <input type="hidden" v-model="form.ite_cod">
                        <input type="hidden" v-model="form.eve_cod">
                        <input type="hidden" v-model="form.pag_id">

                        <template v-for="extra in form.extras" :key="extra.label">
                          <div class="form-group col-md-6">
                            <label>{{ extra.label }}:</label>

                            <template v-if="extra.droplist && extra.droplist.length">
                              <select class="form-control" v-model="extra.value" :disabled="preenchido">
                                <option value="">Selecione ...</option>
                                <option v-for="item in extra.droplist" :key="item.valor" :value="item.valor">{{ item.label }}</option>
                              </select>
                            </template>

                            <template v-else>
                              <input type="text" class="form-control" :maxlength="extra.tamanho" v-model="extra.value" @keydown="validarTecla($event, extra.tipo)" :disabled="preenchido">
                            </template>
                          </div>
                        </template>
                    </div>
                  </div>
                </template>

                <template v-if="!preenchido">
                  <div class="text-center">
                    <button type="submit" class="btn btn-success">Associar Ingresso</button>
                  </div>
                </template>
                <template v-else>
                  <p class="alert-qtd-comp">Os dados já foram associados, não é mais possível editar os dados.</p>
                </template>
              </form>
            </div>
          </div>
        
        </div>
      </div>
    </div>
      
  <FooterInclude></FooterInclude>
</template>

<script>
import HeaderInclude from '@/views/includes/HeaderInclude.vue';
import MenuAreaUsuario from '@/views/usuario/MenuAreaUsuario.vue';
import FooterInclude from '@/views/includes/FooterInclude.vue';
import Alert from "@/components/alerts/AlertAcao.vue";

import { cpf } from 'cpf-cnpj-validator';
import { mask } from 'vue-the-mask';
import { dadosUsuario } from "@/services/dadosUsuario.js";

import endPointUsuario from '@/services/endPointUsuario.js';
import endPointEvento from '@/services/endPointEvento.js';

export default {
  components: {
    HeaderInclude, MenuAreaUsuario, FooterInclude, Alert
  },
  directives: { 
    mask 
  },
  data() {
    return {
      usuario: {},
      formulario: [],
      extras: {},
      ingressos: [],
      pag_id: '',
      retorno: undefined,
      preenchido: false,
    }
  },
  async created() {
    this.usuario = await dadosUsuario();

    if(!this.usuario) {
      this.$router.push('/login');
      return;
    }

    this.pag_id = this.$route.params.pag_id;
    this.ingressos = await endPointUsuario.getIngressoNominal(this.pag_id);

    for(const ingresso of this.ingressos) {
      let ing_descricao;
      let addExtra;

      if(ingresso.num_mesa != null) {
				ing_descricao = `${ingresso.label_mesa} ${ingresso.nome_lote} (${ingresso.num_mesa})`;
			} else {
				ing_descricao = ingresso.nome_lote;
			}

      let ingExtra = await this.camposExtras(ingresso.eve_cod);
      
      if(ingExtra != undefined) {
        addExtra = ingExtra;
      
        for(let i = 0; i < addExtra.length; i++) {
          const extraKey = `extra${i + 1}`;
          if(ingresso[extraKey] !== undefined && ingresso[extraKey] !== '') {
            addExtra[i].value = ingresso[extraKey];
          }
        }
      }

      this.formulario.push({
        nome: ingresso.nome_usuario,
        email: ingresso.email_usuario,
        cpf: ingresso.identificacao_usuario,
        ite_cod: ingresso.ite_cod,
        eve_cod: ingresso.eve_cod,
        pag_id: ingresso.pag_id,
        ing_cod: ingresso.ing_cod,
        data_compra: ingresso.data_compra,
        ing_descricao: ing_descricao,
        ing_id: ingresso.ing_id,
        extras: addExtra, 
      });

      if(ingresso.identificacao_usuario != '') {
        this.preenchido = true;
      }
    }
  },
   methods: {
    async camposExtras(eve_cod) {
      return await endPointEvento.getAddNominal(eve_cod);
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
    async salvaNominacao() {
      let err = '';
      let regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      let parametros = '';
      let campExtras = '';
      let cpfLimpo = '';

      for(const ingresso of this.formulario) {
        if(ingresso.cpf == '') {
          err = `SIT-RT242833 : Precisa preencher o CPF do ingresso ${ingresso.ing_cod}!`;
        }

        if(!cpf.isValid(ingresso.cpf)) {
          err = `SIT-DW942552 : CPF do ingresso ${ingresso.ing_cod} é invalido!`;
        }

        if(ingresso.nome == "" || ingresso.nome.lenght < 3 || ingresso.nome.indexOf(" ") == -1) {
          err = `SIT-JF256576 : Coloque um nome e sobrenome válido no ingresso ${ingresso.ing_cod}!`;
        }
   
        if(ingresso.email.indexOf("@") == -1 || ingresso.email.indexOf(".") == -1 || ingresso.email == "" || !regexEmail.test(ingresso.email)) {
          err = `SIT-DC764779 : Indique um e-mail válido no ingresso ${ingresso.ing_cod}!`;
        }

        if(ingresso.extras != undefined) {
          for(const extra of ingresso.extras) {
            campExtras = campExtras + `${extra.value}¢`;
          }

          campExtras = campExtras.slice(0, -1);
          campExtras = campExtras + `|`;
        }
        
        cpfLimpo = ingresso.cpf.replace(/[^0-9\s]/g, '');

        parametros = parametros + `${ingresso.ite_cod}¢${ingresso.nome}¢${cpfLimpo}¢${ingresso.ing_id}¢${ingresso.eve_cod}¢${ingresso.email}|`;
      }

      if(err == '') {
        parametros = parametros.replace(/ /g, "+");
        parametros = parametros.slice(0, -1);
        campExtras = campExtras.replace(/ /g, "+");
        campExtras = campExtras.slice(0, -1);

        let data = {
          par1: this.pag_id,
          par2: parametros,
          par3: 'S',
          par4: campExtras
        };

        this.retorno = await endPointEvento.inputNominal(data);
        this.preenchido = true;
  
      } else {
        this.retorno = err;
      }
    }
  }
}
</script>

<style>
.alert-qtd-comp {
  text-align: center;
  color: #ff0000;
}
</style>