<template>
  <AlertMap v-if="retorno != undefined" :msg="retorno" :tipoMsg="tipoMsg" @fechar="estadoAlerta"></AlertMap>

  <div class="mapa-assentos">
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

    <div id="zoomable-container">
      <VueZoomable class="area-zoom-vue" selector="#image-map-wrapper" 
        :minZoom="0.3"
        :maxZoom="5"
        :dblClickZoomStep="0.4"
        :wheelZoomStep="0.02"
        v-model:pan="pan"
        v-model:zoom="zoom"
      >
        <div id="image-map-wrapper" class="image-mapper">
          <img :src="`https://img.ingressodigital.com/imagem/logo/${img_nome}`" width="auto" height="auto" id="svgMapa" class="seats-map">
          <svg id="image-map-svg" width="auto" height="auto" >
            <template v-for="(item, index) in shapes" :key="index">
              <circle target="_blank"
                v-if="item.shape === 'circle'"
                :cx="item.cx"
                :cy="item.cy"
                :r="item.r"
                :alt="item.alt"
                :title="item.title"
                :href="item.href"
                :class="item.class"
                :coords="item.coords"
                @click="selecionarAssento(item)"
                @mouseover="mostrarModal(item, $event)"
                @mouseout="ocultarModal()"
              />

              <rect
                v-else-if="item.shape === 'rect'"
                :x="item.x"
                :y="item.y"
                :width="item.width"
                :height="item.height"
                :class="item.class"
                @click="selecionarAssento(item)"
                @mouseover="mostrarModal(item, $event)"
                @mouseout="ocultarModal()"
              />

              <polygon
                v-else-if="item.shape === 'polygon'"
                :points="item.points"
                :class="item.class"
                @click="selecionarAssento(item)"
                @mouseover="mostrarModal(item, $event)"
                @mouseout="ocultarModal()"
              />
            </template>
          </svg>
        </div>
      </VueZoomable>
    </div>
  </div>

  <span 
    id="modalAssento" 
    v-if="modal.visivel" 
    :style="modal.estilo"
    >
    <span class="infoAssento">
      <p>ID: {{ modal.id }}<br/>
      Assento: {{ modal.label }}
      </p>
    </span>
    <span id="sta" :class="['statusAssento', modal.classe]">{{ modal.status }}</span>
  </span>

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
import diversaMapas from '@/services/diversaMapas.js';

import { preparaTituloLink } from '@/utils/formDadosEvento.js';

import AlertMap from "@/components/alerts/AlertMap.vue";

import "vue-zoomable/dist/style.css";
import VueZoomable from "vue-zoomable";

export default {
  components: {
    VueZoomable, AlertMap 
  },
  data() {
    return {
      eve_cod: this.$route.query.eve_cod,
      map_id: this.$route.query.map_id,
      img_nome: '',
      mapeamento: '',
      mas_ids: [],
      svgMap: '',
      zoom: 0.8,
      pan: {
        x: 0, 
        y: 0,
      },
      shapes: [],
      modal: {
        visivel: false,
        id: null,
        label: '',
        status: 'Livre',
        classe: '',
        estilo: {}, 
      },
      celInicia: true,
      retorno: undefined,
      tipoMsg: 's',
    }
  },
  async mounted() {
    const data = await diversaMapas.listaMapaImgReal({
      eve_cod: this.eve_cod,
      map_id: this.map_id,
    })

    this.eve_nome = 'Retorno'|| this.dadosEvento[this.eve_cod].eve_nome;

    this.img_nome = data.img_real
    this.mapeamento = data.mapeamento
    this.mas_ids = data.mas_id || []

    this.mapeamento = this.substituir_na_string(this.mapeamento)
    this.svgMap = this.converterMapeamentoParaSVG()
  },
  methods: {
    preparaTituloLink,
    substituir_na_string(mapeamento) {
      const encontre = /title/g
      const adicione = 'class="assento" '
      return mapeamento.replace(encontre, adicione + 'title')
    },
    converterMapeamentoParaSVG() {
      const parser = new DOMParser()
      const dom = parser.parseFromString(this.mapeamento, 'text/html')
      const areas = dom.querySelectorAll('area')

      areas.forEach(area => {
        const attrs = {}
        for (let attr of area.attributes) attrs[attr.name] = attr.value

        let shape = attrs.shape
        const coords = attrs.coords ? attrs.coords.split(',').map(Number) : []

        if (shape === 'circle' && coords.length >= 3) {
          this.shapes.push({
            shape,
            cx: coords[0],
            cy: coords[1],
            r: coords[2],
            alt: attrs.alt,
            title: attrs.title,
            href: attrs.href,
            coords: `${coords[0]},${coords[1]},${coords[2]}`,
            class: this.definirClasse(attrs.href)
          })

        } else if (shape === 'rect' && coords.length >= 4) {
          let [x1, y1, x2, y2] = coords
          let width = Math.abs(x2 - x1)
          let height = Math.abs(y2 - y1)
          this.shapes.push({
            shape,
            x: Math.min(x1, x2),
            y: Math.min(y1, y2),
            width,
            height,
            class: this.definirClasse(attrs.href)
          })

        } else if (shape === 'poly') {
          this.shapes.push({
            shape: 'polygon',
            points: attrs.coords,
            class: this.definirClasse(attrs.href)
          })
        }
      })
    },
    definirClasse(href) {
      if (!Array.isArray(this.mas_ids)) return 'assento'
      return this.mas_ids.some(id => href?.includes(`#${id}`)) ? 'vendido' : 'assento'
    },
    atualizaStatusModal(status) {
      switch(status) {
        case "assento": 
          this.modal.status = "Livre"; 
          this.modal.classe = "assento-livre";
          this.modal.estilo.borderTopColor = 'green';
        break;
        case "vendido": 
          this.modal.status = "Ocupado";
          this.modal.classe = "assento-ocupado"; 
          this.modal.estilo.borderTopColor = 'red';
        break;
        case "selected": 
          this.modal.status = "Selecionado"; 
          this.modal.classe = "assento-selecionado";
          this.modal.estilo.borderTopColor = '#E6CAC4';
        break;
      }
    },
    mostrarModal(item, event) {
      this.modal.id = item.href;
      this.modal.label = item.alt;

      const offset = 6;
      const modalWidth = 160;
      const modalHeight = 80;

      let x = event.clientX + offset;
      let y = event.clientY + offset;

      if(x + modalWidth > window.innerWidth) {
        x = event.clientX - modalWidth - offset;
      }

      if(y + modalHeight > window.innerHeight) {
        y = event.clientY - modalHeight - offset;
      }

      this.modal.estilo = {
        position: 'fixed',
        top: `${y - 70}px`,
        left: `${x + 10}px`,
        'z-index': 10000,
        pointerEvents: 'none',
      };

      this.atualizaStatusModal(item.class);
      
      this.modal.visivel = true;
    },
    ocultarModal() {
      this.modal.visivel = false;
    },
    ocultaCelular() {
      this.celInicia = false;
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
    adicionarAlerta(msg, tipoMsg) {
      this.retorno = msg; 
      this.tipoMsg = tipoMsg;
    },
    estadoAlerta(data) {
     this.retorno = data; 
    },
    selecionarAssento(item) {
      //console.log('Clicou em:', item);

      if(item.class == 'vendido') {
        this.adicionarAlerta(`Este assento já foi reservado por outra pessoa.`, 'e');

      } else {
        if(item.class == 'selected') {
          item.class = item.class === 'selected' ? 'assento' : 'selected';
          this.adicionarAlerta(`Assento ${item.alt} selecionado`, 's');
        } else {
          item.class = item.class === 'selected' ? 'assento' : 'selected';
          this.adicionarAlerta(`Assento ${item.alt} liberado.`, 's');

        }
      }
    },
    continuarEscolha() {},
  }
}
</script>

<style>
@import url('@/assets/seatcharts/style-maps.css');

.mapa-assentos {
  position: relative;
  width: 100%;
}
#image-map-svg {
  position: absolute;
  top: 0;
  left: 0;
}
.controll__buttons {
  position: fixed!important;
  bottom: 6rem!important;
}
.vendido {
  cursor: pointer;
  fill:red;
  background-color: red;
  color: #fff;
}
.assento {
  cursor: pointer;
  fill: transparent;
  background-color: #f1f1f1;
}
.assento:hover {
  fill:#4d4dff;
  background-color: #4d4dff;
}
.selected {
  fill:#E6CAC4;
  background-color: #E6CAC4;
}
</style>
