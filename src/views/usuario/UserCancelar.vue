<template>
  <HeaderInclude></HeaderInclude>

  <Alert v-if="retorno != undefined" :msg="retorno" @fechar="estadoAlerta"></Alert>

  <div class="main section-area-usuario">
    <div class="container" data-aos="fade-up" data-aos-duration="1000">
      <div class="row">

        <div class="col-12 col-md-4">
          <template v-if="usuario">
            <template v-if="usuario">
              <MenuAreaUsuario 
                :email="usuario.email" 
                :nome="usuario.nome" 
                :id="Number(usuario.id)" 
                :btnImagem="false"
              ></MenuAreaUsuario>
            </template>
          </template>
        </div>

        <div class="col-12 col-md-8">
          <div id="cancelar" class="card-area-usuario">
            <h4 class="dashboard-content-box__title text-center">Cancelamento</h4>
            <br/><br/>

            <div class="row">
              <div class="form-group col-md-6">
                <label>Transação:</label>
								<p><strong>{{ pag_id }}</strong></p>
              </div>

              <div class="form-group col-md-6">
                <label>Evento:</label>
								<p><strong>{{ trn.eve_nome }} - {{ trn.data_pagto }}</strong></p>
              </div>

              <div class="form-group col-md-12">
                <label>Ingressos:</label>
								<p><strong>{{ trn.referente }}</strong></p>
              </div>

              <div class="form-group col-md-12">
                <label>Motivo do Cancelamento:</label>
								<textarea name="motivo" id="motivo" v-model="motivo" class="form-control" rows="3" placeholder="Descreva o motivo ..." required :disabled="enviado"></textarea>
              </div>

              <template v-if="enviado">
                <div class="form-group col-md-12">
                  <label>Status:</label>
                  <p :style="{ color: estiloStatus(justifica.status) }">
                    <strong>{{ statusResposta(justifica.status) }}</strong>
                  </p>
                </div>

                <template v-if="justifica.resposta != ''">
                  <div class="form-group col-md-12">
                    <label>Resposta:</label>
                    <p><strong>{{ justifica.resposta }}</strong></p>
                  </div>
                </template>
              </template>

              <h4 class="dashboard-content-box__title">Termos de cancelamento</h4>
              <div v-html="gt_termo_reembolso"></div>

              <template v-if="!enviado">
                <div class="form-group col-md-12">
                  <div class="st_cherity_img_cont">
                    <input type="checkbox" name="rememberme" v-model="termo_cancelar" id="cbx" style="display: none;" required checked>
                    <label for="cbx" class="check">
                        <svg width="18px" height="18px" viewBox="0 0 18 18">
                            <path d="M1,9 L1,3.5 C1,2 2,1 3.5,1 L14.5,1 C16,1 17,2 17,3.5 L17,14.5 C17,16 16,17 14.5,17 L3.5,17 C2,17 1,16 1,14.5 L1,9 Z"></path>
                            <polyline points="1 9 7 14 15 4"></polyline>
                        </svg>
                    </label>
                    <label for="cbx">Li e concordo com os termos.</label>
                  </div>
                </div>
              </template>
              
              <template v-if="!enviado">
                <div class="text-center">
                  <button type="button" class="btn btn-success" @click="enviarJustificaiva()">Enviar</button>
                </div>
              </template>
   
            </div>

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

import { dadosUsuario } from "@/services/dadosUsuario.js";
import endPointPagamento from '@/services/endPointPagamento.js';
import endPointUsuario from '@/services/endPointUsuario.js';

export default {
  components: {
    HeaderInclude, MenuAreaUsuario, FooterInclude, Alert
  },
  data() {
    return {
      usuario: {},
      trn: {},
      justifica: {},
      pag_id: '',
      motivo: undefined,
      retorno: undefined,
      enviado: false,
      gt_termo_reembolso: '',
      termo_cancelar: '',
    }
  }, 
  async created() {
    this.usuario = await dadosUsuario();

    if(!this.usuario) {
      this.$router.push('/login');
      return;
    }

    this.pag_id = this.$route.params.pag_id;
    const config = this.$route.meta.config;

    this.trn = await endPointPagamento.getTrn(this.pag_id);
    this.justifica = await endPointUsuario.getJustCancelamento(this.pag_id);

    if(isNaN(this.pag_id)) {
      this.$router.push('/compras');
      return;
    }

    if(config) {
      this.gt_termo_reembolso = config.gt_termo_reembolso;
    } 

    if(this.justifica.statusId == '00') {
      this.motivo = this.justifica.motivo; 
      this.enviado = true;
    }
  },
  methods: {
    estadoAlerta(data) {
      this.retorno = data; 
    },
    async enviarJustificaiva() {
      let err = undefined;

      if(this.motivo == undefined) {
        err = 'SIT-UC611283 : Preencha o campo Motivo do Cancelamento!';
      }

      if(this.termo_cancelar != true) {
        err = 'SIT-QU192898 : É preciso aceitar o termo de Cancelamento!';
      }

      if(err == undefined) {
        const data = {
          usuario: this.usuario.id,
          pag_id: this.pag_id,
          eve_cod: this.trn.eve_cod,
          justificativa: this.motivo.replace(/ /g, "+")
        };

        this.enviado = true;
        this.retorno = await endPointUsuario.insertJustCancelamento(data);
      } else {
        this.retorno = err;
      }
    },
    statusResposta(status) {
      switch (status) {
        case 'EA':
          return 'Em Análise';
        case 'AP':
          return 'Aprovado';
        case 'RE':
          return 'Reprovado';
        default:
          return 'Em Análise';
      }
    },
    estiloStatus(status) {
      switch (status) {
        case 'EA':
          return '#d3d619';
        case 'AP':
          return '#009DD7';
        case 'RE':
          return '#F30000';
        default:
          return '#F30000';
      }
    }
  }
}
</script>

<style scoped>
#cancelar p {
  margin-bottom: 0;
}
</style>