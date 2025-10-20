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
            <AssocNominal :pag_id="pag_id" @retornoNominal="retornoNominal"></AssocNominal>
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

import { dadosUsuario } from "@/services/dadosUsuario.js";

import AssocNominal from '@/components/AssocNominal.vue';
import Alert from "@/components/alerts/AlertAcao.vue";

export default {
  components: {
    HeaderInclude, MenuAreaUsuario, FooterInclude, AssocNominal, Alert
  },
  data() {
    return {
      usuario: {},
      formulario: [],
      extras: {},
      ingressos: [],
      pag_id: 0,
      retorno: undefined,
      preenchido: false,
    }
  },
  async created() {
    this.usuario = await dadosUsuario();

    this.pag_id = Number(this.$route.params.pag_id);

    if(!this.usuario) {
      this.$router.push('/login');
      return;
    }
  },
  methods: {
    estadoAlerta(data) {
      this.retorno = data; 
    },
    retornoNominal(value) {
      this.retorno = value; 
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