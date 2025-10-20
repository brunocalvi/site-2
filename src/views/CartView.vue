<template>
  <HeaderInclude></HeaderInclude>

  <AlertAcao v-if="retorno != undefined" :msg="retorno" @fechar="estadoAlerta"></AlertAcao>

  <section class="area-carrinho-compras">
    <div class="container">
      <div class="row py-5 d-both">
        <div class="col-12 col-md-7">
          <div class="cal-title d-both">
            <h4>Detalhes</h4>
          </div>

          <div class="car-right-body bg-white">
            <template v-for="item in ingressos" :key="item.ite_cod">
              <div class="card-ing-cart">
                <div class="d-flex-bet">
                  <div>
                    <img :src="item.logo" :alt="item.eve_nome" class="icon-chekout">
                  </div>

                  <div>
                    <p>
                      <b>Evento:</b> {{ item.eve_nome }}<br>
                      <b>Quantidade:</b> {{ item.qtd }} uni.<br> 
                      <b>Ingresso:</b> {{ item.nome_setor_lote }}                                                   
                    </p>
                    <p>
                      <b>Valor:</b> {{ gt_moeda }} {{ formatValor(item.valor) }} 
                      <span class="text-taxa" v-show="item.eve_mostra_taxa == 'S' && item.taxa_adm > 0">
                        <small>+ taxa {{ gt_moeda }} {{ formatValor(item.taxa_adm) }}</small>
                      </span>
                    </p>

                    <router-link :to="{ 
                      name: 'ingressos', 
                      params: { 
                        eve_cod: item.eve_cod, 
                        eve_nome: preparaTituloLink(item.eve_nome) 
                      } 
                    }">
                      <p class="alterar-pedido-carrinho">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
                          <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
                        </svg>
                        Alterar pedido
                      </p>
                    </router-link>
                  </div>

                  <!-- Button excluir ingresso individual -->
                  <button type="button" class="btn del-evento btn-danger" data-bs-toggle="modal" :data-bs-target="`#ModalDelete-${item.ite_cod}`">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
                      <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0"/>
                    </svg>
                  </button>

                  <!-- Modal excluir ingresso individual -->
                  <div class="modal fade" :id="`ModalDelete-${item.ite_cod}`" tabindex="-1" aria-hidden="true">
                    <div class="modal-dialog">
                      <div class="modal-content">
                        <div class="modal-header">
                          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>

                        <div class="text-mod-car modal-body text-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" fill="currentColor" class="bi bi-question-circle" viewBox="0 0 16 16">
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                            <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286m1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94"/>
                          </svg>

                          <h5>Deseja realmente retirar o ingresso <b>{{ item.nome_setor_lote }}</b> do evento <b>{{ item.eve_nome }}</b> do carrinho?</h5>
                        </div>

                        <div class="modal-footer">
                          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                          <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="retirarUmIngresso(item.ite_cod, item.eve_cod)">Sim</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <hr>
            </template>

            <!-- Button limpar carrinho -->
            <button type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#ModalDeleteTudo">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
                <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0"/>
              </svg> Limpar
            </button>

            <!-- Modal limpar carrinho -->
            <div class="modal fade" id="ModalDeleteTudo" tabindex="-1" aria-hidden="true">
              <div class="modal-dialog">
                <div class="modal-content">
                  <div class="modal-header">
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>

                  <div class="text-mod-car modal-body text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" fill="currentColor" class="bi bi-question-circle" viewBox="0 0 16 16">
                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                      <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286m1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94"/>
                    </svg>

                    <h5>Deseja realmente limpar o seu carrinho?</h5>
                  </div>

                  <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="limpaCarrinho()">Sim</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <div class="cal-title d-both">
            <h4>Resumo do carrinho</h4>
          </div>

          <div class="car-right-body bg-white">
            <ul>
              <li><span>Ingressos adquiridos:</span> <span>{{ qtdCarrinho }}x</span></li>
              <li><span>Subtotal:</span> <span>{{ gt_moeda }} {{ formatValor(subTotal) }}</span></li>
              <li><span>Taxas:</span> <span>{{ gt_moeda }} {{ formatValor(valorTaxas) }}</span></li>
              <li><span>Descontos:</span> <span>{{ gt_moeda }} {{ formatValor(valorDesconto) }}</span></li>
              <li><span>Total a Pagar:</span> <span>{{ gt_moeda }} {{ formatValor(valorTotal) }}</span></li>
            </ul>
          </div>

          <div class="botoes-cart-final">
            <router-link to="/checkout">
              <button type="button" class="btn btn-success">Finalizar Compra</button>
            </router-link>

            <router-link to="/">
              <button type="button" class="btn btn-warning">Continuar Comprando</button>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </section>

  <FooterInclude></FooterInclude>
</template>

<script>
import HeaderInclude from './includes/HeaderInclude.vue';
import FooterInclude from './includes/FooterInclude.vue';
import AlertAcao from '@/components/alerts/AlertAcao.vue';

import { guardaIngressoStore } from '@/store/guardaIngressos.js';

import { formatValor, preparaTituloLink } from '@/utils/formDadosEvento.js';

export default {
  components: {
    HeaderInclude, FooterInclude, AlertAcao
  },
  data() {
    return {
      retorno: undefined,
      ingressos: [],
      gt_moeda: 'R$',
      qtdCarrinho: 0,
      subTotal: 0,
      valorTaxas: 0,
      valorTotal: 0,
      valorDesconto: 0,
      eventos: guardaIngressoStore(),
    }
  },
  created() {
    const config = this.$route.meta.config;

    if(config) {
      this.gt_moeda = config.gt_moeda;
    }
  },
  mounted() {
    this.reformulaCarrinho();
  },
  methods: {
    formatValor,
    preparaTituloLink,
    estadoAlerta(data) {
      this.retorno = data; 
    }, 
    limpaCarrinho() {
      this.eventos.limparAll();
      this.$router.push({ path: '/' });
    },
    retirarUmIngresso(ite_cod, eve_cod) {
      this.eventos.retiraUmIng(ite_cod, eve_cod);
      this.reformulaCarrinho();
    },
    reformulaCarrinho() {
      let eventos = this.eventos.getAll();
      let qtd_ing = 0;

      // limpa var para organizar valores
      this.ingressos = [];
      this.qtdCarrinho = 0;

      console.log(eventos);

      for(const id in eventos) {
        for(const i in eventos[id].ingresso) {
          this.ingressos.push({
            ...eventos[id].ingresso[i], 
            eve_cod: id, logo: eventos[id].logo , eve_nome: eventos[id].eve_nome
          });

          qtd_ing = eventos[id].ingresso[i].qtd; 

          this.qtdCarrinho += qtd_ing;
          this.subTotal += eventos[id].ingresso[i].valor * qtd_ing;
          this.valorTaxas += eventos[id].ingresso[i].taxa_adm;
          this.valorDesconto += eventos[id].desconto.val_desconto || 0; 
          this.valorTotal += eventos[id].ingresso[i].valorTot * qtd_ing;

          if(Object.keys(eventos[id].desconto).length !== 0) {
            this.valorTotal = this.valorTotal - this.valorDesconto;
          }
        }
      }

      if(Object.keys(eventos).length === 0) {
        this.limpaCarrinho();
      }
    }
  }
}
</script>

<style>
.area-carrinho-compras {
  background: #f6f6f6;
}
.d-both {
  clear: both;
}
.cal-title {
  background: var(--primeira-cor);
  padding: 1rem;
}
.cal-title h4 {
  color: #fff;
  font-family: 'Poppins', sans-serif;
  line-height: 1.1;
  font-weight: 400;
  font-size: 18px;
  margin: 0;
}
.car-right-body {
  font-family: 'Lato', sans-serif;
  font-size: 16px;
  line-height: 23px;
  color: #707070;
}
.bg-white {
  background-color: #fff;
  padding: 2rem;
  margin-bottom: 2rem;
}
.card-ing-cart {
  position: relative;
}
.d-flex-bet {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.icon-chekout {
  width: 100px;
  margin-right: 24px;
}
.car-right-body p {
  margin: 0;
}
.del-evento {
  position: absolute;
  left: -1rem;
  top: 0;
  font-size: 19px;
  cursor: pointer;
  padding: 5px;
  height: 25px;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 25px;
  color: #fff;
}
.car-right-body ul {
  display: grid;
  padding-left: 0;
  margin-bottom: 0;
  list-style: none;
  width: 100%;
}
.car-right-body ul li {
  display: flex;
  list-style: none;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #efefef;
  padding: 8px 20px;
  margin-bottom: 5px;
  background: #fff;
}
.botoes-cart-final .btn {
  width: 100%;
  margin-bottom: 1rem;
  height: 40px;
  font-weight: 600;
}
.text-taxa {
  font-size: 14px;
  color:#4C455A;
}
.alterar-pedido-carrinho {
  color:#4C455A;
}
.alterar-pedido-carrinho:hover {
  color: green;
  text-decoration: underline;
}
.text-mod-car svg {
  margin-bottom: 10px;
  color: #454444dd;
}
.text-mod-car h5 {
  line-height: 30px;
}
</style>