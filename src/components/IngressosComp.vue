<template>
  <template v-for="ingresso in ingressos" :key="ingresso.ite_cod">
    <template v-if="ingresso.esgotado == 'S'">
      <div class="container area-ingre-ind">
        <div class="row text-esgo-ing">
          <h4>ESGOTADO</h4>
          <p>{{ ingresso.nome }} - {{ ingresso.num_lote }}º lote</p>
        </div>
      </div>
    </template>

    <template v-else>
      <div class="container area-ingre-ind">
        <div class="row">
          <div class="col-8 col-md-8">
            <p>Ingresso: {{ categoriaIngresso(ingresso.categoria) }}</p>
            <p class="titulo-ing">{{ ingresso.nome }} - {{ ingresso.num_lote }}º lote</p>
            <p>
              {{ gt_moeda }} {{ formatValor(ingresso.valor, { normalizarVirgula: true }) }} 
              {{ eve_mostra_taxa == 'S' ? '+ '+formatValor(ingresso.taxa_adm, { normalizarVirgula: true }) : '' }}
              {{ ingresso.eve_label_taxa.length > 0 ? '('+ingresso.eve_label_taxa+')' : '' }}
            </p>
          </div>

          <div class="col-4 col-md-4">
            <div class="area-val-btns">
              <b-button variant="secondary" class="btn-mm-cont" :disabled="disabledMenos[ingresso.ite_cod]" @click="quantMenos(ingresso)">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dash" viewBox="0 0 16 16">
                  <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8"/>
                </svg>
              </b-button>

              <input type="text" :value="valores[ingresso.ite_cod]" class="input-value" readonly>

              <b-button variant="secondary" class="btn-mm-cont" :disabled="disabledMais[ingresso.ite_cod]" @click="quantMais(ingresso)">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus" viewBox="0 0 16 16">
                  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
                </svg>
              </b-button>
            </div>

            <div class="text-right mt-2 valor-individual">{{ gt_moeda }} {{ valIndividual[ingresso.ite_cod] }}</div>
          </div>

          <template v-if="ingresso.lot_qtde_min != 0 || ingresso.lot_qtde_min != 0">
            <div>
              <p class="quant-venda">{{ venda_min_max(ingresso.lot_qtde_min, ingresso.lot_qtde_max) }}</p>
            </div>
          </template>

          <div class="area-selec-mesa" v-show="mostraMesa[ingresso.ite_cod]">
            <select v-model="selectedMesa[ingresso.ite_cod]">
              <option v-for="option in opcoesMesas[ingresso.ite_cod]" :key="option.value" :value="option.value">{{ option.text }}</option>
            </select>
          </div>

          <div v-show="errMesa[ingresso.ite_cod]">
            <p class="erro-aler">Erro ao localizar a mesa</p>
          </div>
          
        </div>
      </div>
    </template>
    
  </template>
</template>

<script>
import endPointSetorLote from '@/services/endPointSetorLote.js';

import { categoriaIngresso, formatValor, venda_min_max } from '@/utils/formDadosEvento.js';

export default {
  props: {
    eve_cod: Number,
    pdv_id: Number,
    setor_id: Number,
    eve_mostra_taxa: String
  },
  emits: ['carrinho'],
  data() {
    return {
      val: 0,
      ingressos: {},
      gt_moeda: 'R$',
      broqGeral: 0,
      valores: {},
      valIndividual: {},
      disabledMais: {},
      disabledMenos: {},
      venda: [],
      mostraMesa: [],
      opcoesMesas: [],
      selectedMesa: {},
      errMesa: [],
      max: 10,
    }
  },
  async created() {
    const config = this.$route.meta.config;

    this.gt_moeda = config.gt_moeda;

    this.ingressos = await endPointSetorLote.listaIngressosSetor({
      pdv: this.pdv_id, 
      eve_cod: this.eve_cod,
      setor_id: this.setor_id 
    });

    this.ingressos.forEach(ingresso => {
      const id = ingresso.ite_cod;
      this.valores[id] = 0;
      this.valIndividual[id] = '0,00';
      this.disabledMais[id] = false;
      this.disabledMenos[id] = true;
    });
  },
  watch: {
    selectedMesa: {
      deep: true,
      handler(novo) {
        this.dadosMesaSelect(novo);
      }
    }
  },
  methods: {
    categoriaIngresso,
    formatValor,
    venda_min_max,
    quantMais(ingresso) {
      let max = this.max;
      const id = Number(ingresso.ite_cod);

      if(this.venda[id] == undefined) {
        this.venda[id] = {
          ite_cod: id,
          valorTot: 0,
          nome_setor_lote: `${ingresso.setor} - ${ingresso.nome}`,
          gru_id: Number(ingresso.lot_grupo_estoque),
          valor: parseFloat(ingresso.valor.toString().replace(',', '.')),
          taxa_adm: parseFloat(ingresso.taxa_adm.toString().replace(',', '.')),
          eve_mostra_taxa: this.eve_mostra_taxa,
          mapa_id: Number(ingresso.mapa_id),
          aceita_bol: ingresso.lot_aceita_boleto,
          categoria: ingresso.categoria,
          lot_cod: Number(ingresso.lot_cod),
          img_real: ingresso.img_real_ativo2,
          lot_qtde_min: Number(ingresso.lot_qtde_min),
          lot_qtde_max: Number(ingresso.lot_qtde_max),
          assento_parcial: ingresso.assento_parcial,
          mesa: ingresso.mesa, 
          qtd: 0,
          mes_id: 0, 
          mes_numero: '', 
          qtd_mesa: 0, 
        }
      }
      
      if(this.venda[id].lot_qtde_max != 0) max = this.venda[id].lot_qtde_max;

      if(this.venda[id].qtd_mesa != 0) max = this.venda[id].qtd_mesa;

      if(this.venda[id].lot_qtde_min != 0 && this.venda[id].qtd == 0) {
        this.valores[id] = this.venda[id].lot_qtde_min - 1;
      }

      if(this.valores[id] < max) {
        this.valores[id]++;
        this.disabledMenos[id] = false;

        this.atualizaValores(id);
      }

      if(ingresso.mesa == 'S') this.ajustaMesa(id);
    },
    async quantMenos(ingresso) {
      const id = ingresso.ite_cod;
      //const lot_min = Number(ingresso.lot_qtde_min); 
      
      if(this.valores[id] > 0) {
        this.valores[id]--;
      }

      //if(this.venda[id].qtd < lot_min) {
      //  this.valores[id] = 0;  
      //}

      if(this.venda[id].lot_qtde_min > 0 && this.venda[id].lot_qtde_min == this.venda[id].lot_qtde_max) {
        this.valores[id] = 0;
      }

      this.atualizaValores(id);

      if(ingresso.mesa == 'S') this.ajustaMesa(id);  

      if(this.venda[id]?.qtd == 0) {
        this.disabledMais[id] = false;
        this.disabledMenos[id] = true;

        delete this.selectedMesa[id];
        //delete this.venda[id];
      }
    },
    async ajustaMesa(id) {
      const ingresso = this.venda[id];

      let mesa = await endPointSetorLote.configMesaSelect({
        eve_cod: this.eve_cod,
        lot_cod: ingresso.lot_cod,
        assento_parcial: ingresso.assento_parcial, 
      });

      if(mesa && mesa.length > 0) {
        this.mostraMesa[id] = ingresso.qtd > 0 ? true : false; 

        let m = [{ value: undefined, text: 'Selecione uma mesa.' }];
        
        for(let i = 0; i < mesa.length; i++) {
          m.push({ value: mesa[i].mes_id, text: mesa[i].mes_numero });
        }

        this.opcoesMesas[id] = m;

        if(ingresso.qtd > 0 && ingresso.qtd_mesa == 0) {
          this.disabledMais[id] = true;
        } else {
          this.disabledMais[id] = false;
        }
      } else {
        this.disabledMais[id] = true;
        this.disabledMenos[id] = true;

        this.mostraMesa[id] = false;
        this.errMesa[id] = true;
        this.valores[id] = 0;
        this.valIndividual[id] = '0,00';
        this.venda[id].qtd = 0;

        this.atualizaValores(id);
      }
    },
    async dadosMesaSelect(dados) {
      for(let id in dados) {
        const ingresso = this.venda[id];
        if (!ingresso) continue;

        if(dados[id] == undefined) {
          this.valores[id] = 0;
        }

        const valorSelecionado = Number(dados[id]);
        const mesaSelecionada = this.opcoesMesas[id]?.find(m => Number(m.value) === valorSelecionado);

        if(mesaSelecionada) {
          ingresso.mes_id = Number(mesaSelecionada.value);
          ingresso.mes_numero = mesaSelecionada.text;

          if(ingresso.assento_parcial == 'S') {
            var qtd = ingresso.mes_numero.split("(");
            qtd = qtd[1].replace(')', '');

            ingresso.qtd_mesa = Number(qtd);
          }
        }

        if(this.valores[id] > ingresso.qtd_mesa) {
          this.valores[id] = 1;
        }

        this.atualizaValores(id);
        this.ajustaMesa(id);
      }
    },
    async verificaIngAdd(id, qtd_base) {
      const ingressoBase = this.venda[id];

      if(!ingressoBase) return;
      
      const loteAdd = await endPointSetorLote.buscaLoteAdicional({ 
        lot_cod: this.venda[id].lot_cod, 
        pdv: this.pdv_id, 
      });

      if(loteAdd?.statusId !== '00') return;

      const ite_cod_add = Number(loteAdd.ite_cod);
      const prm_quantidade = Number(loteAdd.prm_quantidade) || 0;
      const qtd_add_total = qtd_base * prm_quantidade;

      this.venda[ite_cod_add] = {
        ite_cod: ite_cod_add,
        valorTot: 0,
        nome_setor_lote: `${loteAdd.setor} - ${loteAdd.lot_nome}`,
        gru_id: Number(loteAdd.gru_id),
        valor: parseFloat(loteAdd.ite_valor.toString().replace(',', '.')),
        taxa_adm: parseFloat(loteAdd.taxa_adm.toString().replace(',', '.')),
        eve_mostra_taxa: this.eve_mostra_taxa,
        mapa_id: Number(loteAdd.mapa_id),
        aceita_bol: loteAdd.lot_aceita_boleto,
        categoria: loteAdd.categoria,
        lot_cod: Number(loteAdd.lot_adicional),
        img_real: 'N',
        lot_qtde_min: 0,
        lot_qtde_max: 0,
        assento_parcial: 'N',
        mesa: 0, 
        prm_quantidade: prm_quantidade,
        qtd: qtd_add_total,
        mes_id: 0, 
        mes_numero: '', 
        qtd_mesa: 0, 
      };

      // Remove do carrinho e emite exclusão
      if(qtd_base === 0) {
        delete this.venda[ite_cod_add];
        this.carrinhoInicial({ ite_cod: ite_cod_add, qtd: 0 }); 
        return;
      }

      this.carrinhoInicial(this.venda[ite_cod_add]);
    },
    async atualizaValores(id) {
      if (!this.venda[id]) return;

      let taxa = this.eve_mostra_taxa == 'S' ? this.venda[id].taxa_adm : 0;
      let totalJson = this.venda[id].valor + taxa;
      let total = this.valores[id] * (this.venda[id].valor + taxa); 

      let valFormat = this.formatValor(total.toFixed(2)); 
   
      this.venda[id].valorTot = Number(totalJson.toFixed(2));
      this.valIndividual[id] = valFormat;

      this.venda[id].qtd = this.valores[id];

      // sincroniza adicional automaticamente
      if(this.venda[id].categoria == 'P') {
        await this.verificaIngAdd(id, this.valores[id]);
      }

      this.carrinhoInicial(this.venda[id]);
    },
    carrinhoInicial(venda) {
      //console.log(venda);

      if(!venda || !venda.ite_cod) return;
      this.$emit('carrinho', venda);
    },
  }
}
</script>

<style>
.input-value {
  width: 45px;
  text-align: center;
  height: 30px;
}
.text-right {
  text-align: end;
}
.area-val-btns {
  display: flex;
  justify-content: center;
  align-items: center;
}
.area-ingre-ind {
  border-bottom: 1px dashed rgba(0, 0, 0, 0.54);
  padding-top: 1rem;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12);
}
.titulo-ing {
  margin-bottom: 0;
  font-weight: 600;
}
.btn-mm-cont {
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.btn-mm-cont svg {
  margin-top: -3px;
}
.valor-individual {
  margin-right: 1rem;
  user-select: none;
}
.quant-venda {
  text-align: center;
  color: #fca311;
  font-size: 13px;
  font-weight: bold;
  padding-top: 1rem;
  font-style: italic;
}
.area-selec-mesa {
  margin-bottom: 15px;
}
.erro-aler {
  color: red;
  font-weight: 600;
}
.text-esgo-ing h4 {
  font-family: 'Lato', sans-serif;
  color: #d43f3a;
  font-size: 18px;
  text-align: center;
  text-transform: uppercase;
  font-weight: 600;
  margin-top: 1rem;
}
.text-esgo-ing p {
  font-family: 'Lato', sans-serif;
  font-size: 16px;
  line-height: 23px;
  color: #707070;
  text-align: center;
}
</style>


