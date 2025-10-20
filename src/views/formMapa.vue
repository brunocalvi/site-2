<template>
  <AlertMap v-if="retorno != undefined" :msg="retorno" :tipoMsg="tipoMsg" @fechar="estadoAlerta"></AlertMap>

  <div id="celular" class="toqueCelular" v-show="celInicia">
    <div class="text-center">
      <div>
        <img src="@/assets/seatcharts/celular.png">
        <h3>Navegue pelo mapa arrastando a tela para ver todos os assentos.</h3>
      </div>
      <div>
        <button class="btn btn-primary" @click="ocultaCelular()">OK</button>
      </div>
    </div>
  </div>

  <span 
    id="modalAssento" 
    v-if="modal.visivel" 
    :style="modal.estilo"
    >
    <span class="infoAssento">
      <p>ID: #{{ modal.id }}<br/>
      Assento: {{ modal.label }}
      </p>
    </span>
    <span id="sta" :class="['statusAssento', modal.classe]">{{ modal.status }}</span>
  </span>

  <div>
    <div class="booking-details">
      <h2 id="tg-button">Detalhes da Compra</h2>
      <div class="hidden-details">
        <h3>Setor selecionado: <b>{{ setorMapa }}</b></h3>
        <ul id="selected-seats">
          <li v-for="car in labelAssento" :key="car.id">
            Assento: <b>{{ car.label }}</b>
          </li>
        </ul>
      </div>	
      <h3> Assentos Selecionados <b>({{ addNum}})</b></h3>
    </div>

    <div class="pd-10">
      <div id="palco" class="front-indicator">Palco</div>
    </div>
  </div>

  <VueZoomable class="area-zoom-vue" selector="#seat-map" 
    :minZoom="0.3"
    :maxZoom="5"
    :dblClickZoomStep="0.4"
    :wheelZoomStep="0.02"
    v-model:pan="pan"
    v-model:zoom="zoom"
  >
    <div id="zoomable-container">
      <div id="seat-map"></div>
    </div>
  </VueZoomable>

  <div>
    <div class="btn-rodape-rot">
      <div class="pull-left">	
        <button type="button" class="btn btn-danger" @click="voltarPagina()">VOLTAR</button>
      </div>

      <div class="pull-right">									
        <button type="button" class="btn btn-success" @click="continuarEscolha()">CONTINUAR</button>
      </div>
    </div>
  </div>
  
</template>

<script>
import $ from '@/plugins/jquery';
import '@/assets/seatcharts/jquery.seat-charts.js';

import { guardaIngressoStore } from '@/store/guardaIngressos.js';

import { preparaTituloLink } from '@/utils/formDadosEvento.js';

import AlertMap from "@/components/alerts/AlertMap.vue";

import diversaMapas from '@/services/diversaMapas.js';

import "vue-zoomable/dist/style.css";
import VueZoomable from "vue-zoomable";

export default {
  components: {
    AlertMap, VueZoomable 
  },
  data() {
    return {
      eve_cod: this.$route.query.eve_cod,
      map_id: this.$route.query.map_id,
      lista_lote: this.$route.query.lista_lote,
      tot_ing: Number(this.$route.query.tot_ing || 0),
      retorno: undefined,
      tipoMsg: 's',
      modal: {
        visivel: false,
        id: null,
        label: '',
        status: '',
        classe: '',
        estilo: {}, 
      },
      mouseX: 0,
      mouseY: 0,
      assentosArray: [],
      assentosIdentificacao: [],
      coordXArr: [],
      coordYArr: [],
      coordXMax: 0,
      coordYMax: 0,
      addNum: 0,
      zoom: 0.8,
      pan: {
        x: 0, 
        y: 0,
      },
      celInicia: true,
      setorMapa: '',
      labelAssento: {},
      eve_nome: '',
      guardaIngressos: guardaIngressoStore(),
      dadosEvento: {}, 
    }
  },
  async created() {
    //libera os assentos reservado no app cliente
    //const liberar = await diversaMapas.libReservaAppCliente(this.eve_cod);
    //console.log(liberar.statusId);

    this.dadosEvento = this.guardaIngressos.getAll();
    this.eve_nome = 'Retorno'|| this.dadosEvento[this.eve_cod].eve_nome;
  },
  async mounted() {
    // Anexa o listener de movimento do mouse
    $(document).on('mousemove', this.updateMousePosition);

    let coord_y = 1;
    let string = "";

    // Consulta API com o json do mapa
    const data = await diversaMapas.listaMapaForm({
      eve_cod: this.eve_cod,
      map_id: this.map_id,
    });

    // Processa assentos
    $.each(data.setores[0].assentos, (key, val) => {
      this.coordYArr.push(val.mas_y)
      this.coordXArr.push(val.mas_x)

      if (coord_y === val.mas_y) {
        if (val.mas_assento !== "") {
          if (val.mas_status === "LIB" || val.mas_status == null) {
            string += `a[${val.mas_id}]`
            this.assentosIdentificacao.push(val.mas_assento)
          } else if (val.mas_status === "ESP") {
            string += `e[${val.mas_id}]`
            this.assentosIdentificacao.push(val.mas_assento)
          } else {
            string += `f[${val.mas_id}]`
            this.assentosIdentificacao.push(val.mas_assento)
          }
        } else {
          string += "_"
        }
      } else {
        this.assentosArray.push(string)
        if (val.mas_assento !== "") {
          if (val.mas_status === "LIB" || val.mas_status == null) {
            string = `a[${val.mas_id}]`
            this.assentosIdentificacao.push(val.mas_assento)
          } else if (val.mas_status === "ESP") {
            string = `e[${val.mas_id}]`
            this.assentosIdentificacao.push(val.mas_assento)
          } else {
            string = `f[${val.mas_id}]`
            this.assentosIdentificacao.push(val.mas_assento)
          }
        } else {
          string = "_"
        }
        coord_y = val.mas_y
      }
    })

    this.setorMapa = data.mapaSetor; 
    this.assentosArray.push(string)
    this.coordYMax = Math.max.apply(Math, this.coordYArr)
    this.coordXMax = Math.max.apply(Math, this.coordXArr)

    // Chama o gráfico
    this.grafico()
  },
  methods: {
    preparaTituloLink,
    continuarEscolha() {
      const qtdSelect = Object.keys(this.labelAssento).length;
      let ingressos = this.guardaIngressos.getIngresso(this.eve_cod);

      if(qtdSelect === 0) {
        this.adicionarAlerta('É necessário selecionar assento(s) para continuar', 'e');
        return;

      } else if (qtdSelect != this.tot_ing) {
        this.adicionarAlerta(`Precisa selecionar ${this.tot_ing} assento(s) para continuar`, 'e');
        return;

      } else {
        const assentosArray = Object.values(this.labelAssento);
        let pos = 0;
        
        for(let idIng in ingressos) {
          const qtd = ingressos[idIng].qtd;
          const selecionados = assentosArray.slice(pos, pos + qtd);

          let mas_id = [];
          let label_mas_id = [];

          for(let i in selecionados) {
            mas_id.push(selecionados[i].id);
            label_mas_id.push(selecionados[i].label);
          }

          ingressos[idIng].mas_id = mas_id.toString();
          ingressos[idIng].label_mas_id = label_mas_id.toString();

          pos += qtd;
        }

        this.$router.push('/validacao');
      }
    },
    voltarPagina() {
      this.$router.push({ 
        name: 'ingressos', 
        params: { 
          eve_cod: this.eve_cod,
          eve_nome: preparaTituloLink(this.eve_nome), 
        } 
      }); 
    },
    ocultaCelular() {
      this.celInicia = false;
    },
    adicionarAlerta(msg, tipoMsg) {
      this.retorno = msg; 
      this.tipoMsg = tipoMsg;
    },
    estadoAlerta(data) {
     this.retorno = data; 
    },
    updateMousePosition(e) {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    },
    atualizaStatusModal(status) {
      switch(status) {
        case "available": 
          this.modal.status = "Livre"; 
          this.modal.classe = "assento-livre";
          this.modal.estilo.borderTopColor = 'green';
        break;
        case "unavailable": 
          this.modal.status = "Ocupado";
          this.modal.classe = "assento-ocupado"; 
          this.modal.estilo.borderTopColor = 'red';
        break;
        case "economy": 
          this.modal.status = "Indisponível"; 
          this.modal.classe = "assento-economy";
          this.modal.estilo.borderTopColor = 'black';
        break;
        case "selected": 
          this.modal.status = "Selecionado"; 
          this.modal.classe = "assento-selecionado";
          this.modal.estilo.borderTopColor = '#E6CAC4';
        break;
      }
    },
    mostrarModal(id, label, event) {
      this.modal.id = id;
      this.modal.label = label;

      const rect = event.target.getBoundingClientRect();
      const modalWidth = 180;  // largura aproximada do modal
      const modalHeight = 90;  // altura aproximada
      const offset = 10;

      let x = rect.left + offset;
      let y = rect.top - modalHeight - offset;

      if(x + modalWidth > window.innerWidth) {
        x = rect.right - modalWidth - offset;
      }

      if (x < 0) x = offset;

      this.modal.estilo = {
        top: `${ y + 60 }px`,
        left: `${ x }px`,
        position: 'fixed',
        'z-index': 10000,
        pointerEvents: 'none',
      };

      this.modal.visivel = true;
    },
    ocultarModal() {
      this.modal.visivel = false;
    },
    grafico() {
      let firstSeatLabel = 0
      const self = this;  //captura a instância do Vue aqui

      $(document).ready(function () {
        const sc = $('#seat-map').seatCharts({
          map: self.assentosArray,
          seats: {
            a: { price: 0, classes: 'first-class', category: '' },
            e: { price: 40, classes: 'economy-class', category: 'Economy Class' },
          },
          naming: {
            top: false,
            rows: ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","T","R","S","U","V","W","X","Y","Z","A1","B1","C1","D1","E1","F1","G1","H1","I1","J1","K1","L1","M1","N1","O1","P1","Q1","T1","R1","S1","U1","V1","W1","X1","Y1","Z1"],
            getLabel: function () {
              return self.assentosIdentificacao[firstSeatLabel++] 
            }
          },
          legend: {
            node: $('#legend'),
            items: [
              ['a', 'available', 'Livre'],
              ['f', 'unavailable', 'Reservado']
            ]
          },
          focus: function() {
            self.mostrarModal(this.settings.id, this.settings.label, this.settings.$node[0].getBoundingClientRect ? { target: this.settings.$node[0] } : null);
            self.atualizaStatusModal(this.status())
            return this.status();
          },
          blur: function() {
            self.ocultarModal();
            return this.status();

          },
          click: function() {
            if (this.status() === 'available') {
              if (self.addNum >= self.tot_ing) {
                self.adicionarAlerta('Já foi selecionada a quantidade correta para avançar.', 'e');
                return 'available';

              } else {
                self.addNum++;
                self.adicionarAlerta(`Assento ${this.settings.label} selecionado`, 's');
                self.atualizaStatusModal('selected');

                self.labelAssento[this.settings.id] = {
                  id: this.settings.id,
                  label: this.settings.label,
                }

                return 'selected';

              }
            } else if (this.status() === 'selected') {
              self.addNum--;
              self.adicionarAlerta(`Assento ${this.settings.label} liberado.`, 's');
              self.atualizaStatusModal('available');

              delete self.labelAssento[this.settings.id];

              return 'available';

            } else if (this.status() === 'unavailable') {
              if(this.settings.$node[0].className.includes('economy-class')) {
                self.adicionarAlerta(`Este assento está indisponivel para seleção.`, 'e');
                self.atualizaStatusModal('economy');

              } else {
                self.adicionarAlerta(`Este assento já foi reservado por outra pessoa.`, 'e');
                self.atualizaStatusModal('unavailable');

              }

              return 'unavailable';

            } else {
              self.atualizaStatusModal(this.style())
              return this.style()
            }
          },
        })

        sc.find('f.available').status('unavailable')
        sc.find('e.available').status('unavailable')
      });
    },
  },
}
</script>

<style>
@import url('@/assets/seatcharts/jquery.seat-charts.css');
@import url('@/assets/seatcharts/style-maps.css');

body {
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 14px;
  line-height: 1.42857143;
  color: #333;
  background-color: #fff;
  -webkit-user-select: none; /* Para Chrome, Safari, Opera */
  -moz-user-select: none;    /* Para Firefox */
  -ms-user-select: none;     /* Para Internet Explorer/Edge */
  user-select: none;         /* Para navegadores modernos */
}
.row {
  --bs-gutter-x: 0;
}
#seat-map {
  display: inline-block;
  white-space: nowrap;
  transform: auto;
}
.assento-economy {
  background-color: black;
  color: #fff;
}
#zoomable-container {    
  cursor: grab;
}
#zoomable-container:active {
  cursor: grabbing;
}
.front-indicator {
  margin: 0px 15px 15px 15px;
  background-color: #f6f6f6;
  color: #adadad;
  text-align: center;
  padding: 5px;
  border-radius: 5px;
}
.booking-details {
  font-size: 12px;
  right: 0;
  top: 0;
  background-color: #f1f1f1;
  padding: 20px;
  z-index: 1;
  -webkit-box-shadow: 0 5px 50px -1px rgba(0, 0, 0, .2);
  box-shadow: 0 5px 50px -1px rgba(0, 0, 0, .2);
}
.booking-details h2 {
  margin: 0px;
  font-size: 17px;
}
.booking-details h3 {
  margin: 5px 5px 0 0;
  font-size: 14px;
}
#selected-seats {
  max-height: 70px;
  background-color: #fff;
  margin: 10px auto;
  border-radius: 5px;
  padding: 10px;
  overflow: auto;
}
#selected-seats li {
  margin-bottom: 3px;
}
.pd-10 {
  padding-top: 15px;
}
.controll__buttons {
  position: fixed!important;
  bottom: 6rem!important;
}
@media(max-width: 600px) {  
  .booking-details {
    position: initial;
  }
  .area-zoom-vue {
    height: 75vh;
  }
}
@media(min-width: 601px) {  
  .booking-details {
    position: fixed;
  }
  .area-zoom-vue { 
    height: 88vh;
  }
}
div.seatCharts-seat.available.first-class:hover {
  background-color: #4d4dff;
}
</style>
