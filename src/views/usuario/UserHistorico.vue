<template>
  <HeaderInclude></HeaderInclude>

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
          <div class="card-area-usuario">
            <h4 class="title-p-user">Ingressos adquiridos</h4>
            <p>
              Segue abaixo o relatório de ingressos adquiridos e sua situação.<br/>
              Caso perceba alguma compra com o status <b>"Em análise"</b> com prazo superior a 2 dias ou tenha alguma dúvida favor entre em contato com a central de atendimento.
            </p>
          </div>

          <div class="card-area-usuario">
            <p class="alert-mostra-table"><small>Clique no campo verde com a flecha ao lado da transação para ver os detalhes.</small></p>

            <div class="area-input-pesquisa">
              <input type="text" v-model="searchValue" class="form-control" placeholder="Pesquisar....">
            </div>

            <dataTable buttons-pagination :headers="headers" :items="items" :search-field="searchField" :search-value="searchValue" table-class-name="customize-table">
              <template #expand="item">
               
                <div class="col-md-12">
                  <div class="row">
                    <div class="col-md-7">
                      <b>ID da Trasação:</b><br/> {{ item.trn }} <br/><br/>
                      <b>Data da Transação:</b><br/> {{ item.compra.data_compra }}<br/><br/> 
                    </div>
                    <div class="col-md-5">
                      <div class="status-compra" :class="tipoStatus(item.compra.status)">
                        {{ escreveStatus(item.compra.status) }}
                      </div>
                  
                      <template v-if="item.compra.status == 'PG'">
                        <a :href="item.compra.link_voucher" target="_blank">
                          <button type="button" class="btn btn-success">Imprimir Ingresso</button>
                        </a>
                      </template>

                      <template v-if="gt_reembolso == 'S' & item.compra.status == 'PG'">
                        <router-link :to="{ name: 'cancelar', params: { pag_id: item.trn }}">
                          <button type="button" class="btn btn-danger">Cancelar</button>
                        </router-link>
                      </template>

                      <template v-if="item.compra.ingresso_nominal == 'S' & item.compra.status == 'PG'">
                        <router-link :to="{ name: 'nominal', params: { pag_id: item.trn }}">
                          <button type="button" class="btn btn-info">Alterar títularidade</button>
                        </router-link>
                      </template>
                    </div>
                  </div>

                  <div>
                    <br/>
                    <b>Iten(s) Adiquirido(s):</b><br/> {{ item.compra.referente }} 
                  </div>
                </div>
                
              </template>
            </dataTable>
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

import { formatValor, escreveStatus } from '@/utils/formDadosEvento.js';
import { dadosUsuario } from "@/services/dadosUsuario.js";

import endPointUsuario from '@/services/endPointUsuario.js';
import endPointPagamento from '@/services/endPointPagamento.js';

import dataTable from 'vue3-easy-data-table';
import 'vue3-easy-data-table/dist/style.css';

export default {
  components: {
    HeaderInclude, MenuAreaUsuario, FooterInclude, dataTable
  },
  data() {
    return { 
      usuario: {},
      headers: [
        { text: "Transação", value: "trn", sortable: true, "weight": 100 },
        { text: "Evento", value: "nome", sortable: true },
        { text: "Valor", value: "valor", sortable: true }
      ],
      searchField: ["trn", "nome", "valor"],
      searchValue: '',
      items: [],
      sistema: process.env.VUE_APP_LINK_SISTEMA,
      key: process.env.VUE_APP_WS_KEY,
      gt_reembolso: 'N',
    }
  },
  async created() {
    this.usuario = await dadosUsuario();

    if (!this.usuario) {
      this.$router.push('/login');
      return;
    }
    
    this.items = await this.historicoUsuario();

    const config = this.$route.meta.config;

    if(config) {
      this.gt_reembolso = config.gt_reembolso;
    }
  },
  methods: {
    escreveStatus,
    tipoStatus(status) {
      switch (status) {
        case 'PG':
          return 'aproved';
        case 'NP':
          return 'fail';
        case 'DV':
          return 'aproved';
        case 'CA':
          return 'fail';
        case 'EA':
          return 'review';
        default:
          return 'fail';
      }
    },
    async historicoUsuario() {
      const historico = [];

      try {
        const lista = await endPointUsuario.getHistorico(this.usuario.id);

        for (const pag of lista) {
          const item = {
            trn: pag.id,
            nome: pag.evento,
            valor: formatValor(pag.valor),
            compra: null
          };

          try {
            const resposta = await endPointPagamento.getTrn(pag.id);
            item.compra = resposta;
          } catch (e) {
            console.error(`Erro ao buscar TRN para pag.id ${pag.id}:`, e);
          }

          historico.push(item);
        }

        return historico;

      } catch (e) {
        console.error('Erro ao buscar histórico do usuário:', e);
        return [];
      }
    }
  }, 
}
</script>

<style>
.area-input-pesquisa {
  min-height: 4rem;
}
.area-input-pesquisa input {
  max-width: 200px;
  float: right;
}
.alert-mostra-table {
  color: #ff0000;
  margin-bottom: 1rem;
}
.customize-table { 
  --easy-table-row-border: 1px solid #ddd;
  --easy-table-body-row-font-size: 15px;
  --easy-table-header-font-size: 15px;
  --easy-table-body-row-height: 50px;
}
.aproved {
  color: #6cbd7e;
}
.review {
  color: #ffc221;
}
.fail {
  color: #da0e2b;
}
.status-compra {
  text-align: center;
  font-weight: 600;
  border: 1px solid;
  border-radius: 5px;
  width: 160px;
  margin-bottom: 20px;
  margin-top: 10px;
}
.section-area-usuario .btn {
  width: 160px;
  margin-bottom: 5px;
}
.vue3-easy-data-table__body td.can-expand {
  background-color: #198754;
  color: #fff;
}
.vue3-easy-data-table__body td.expand {
  padding: 1rem;
}
</style>