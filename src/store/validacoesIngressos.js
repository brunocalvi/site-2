export default {
  async dadosIngressos(ingressos) {
    let mapa_ids = [];

    for(let id in ingressos) {
      const ingresso = ingressos[id];

      mapa_ids.push(ingresso.mapa_id);
      let mapa_id = [...new Set(mapa_ids)];
      
      if(ingresso.mesa == 'S' && ingresso.mes_id == 0) {
        return `SIT-SS451306 : É preciso selecionar a mesa/camarote para o ${ingresso.nome_setor_lote}`;
      }

      if(mapa_id.length > 1) {
        return "SIT-TU892698 : Favor selecionar apenas um tipo de lote de cada vez para compra com assento marcado";
      }

      if(ingresso.lot_qtde_min > 0 && ingresso.lot_qtde_max == 0) {
        if(ingresso.qtd < ingresso.lot_qtde_max){
          return `SIT-AY799748 : O ${ingresso.nome_setor_lote} tem venda mínima de ${ingresso.lot_qtde_min} unidades`;
        }
      } 

      if((ingresso.lot_qtde_min > 0 && ingresso.lot_qtde_max > 0) & ingresso.lot_qtde_min == ingresso.lot_qtde_max) {
        if(ingresso.qtd != ingresso.lot_qtde_max){
          return `SIT-A861541 : O ${ingresso.nome_setor_lote} tem venda obrigatória de ${ingresso.lot_qtde_max} unidades`;
        }
      } 

      if(ingresso.lot_qtde_min > 0 && ingresso.lot_qtde_max > 0) {
        if(ingresso.qtd < ingresso.lot_qtde_min || ingresso.qtd > ingresso.lot_qtde_max){
          return `SIT-EQ825851 : O ${ingresso.nome_setor_lote} tem venda mínima de ${ingresso.lot_qtde_min} unidades e venda máxima de ${ingresso.lot_qtde_max} unidades`;
        }
      } 

      if(ingresso.lot_qtde_max > 0 && ingresso.lot_qtde_min == 0) {
        if(ingresso.qtd > ingresso.lot_qtde_max){
          return `SIT-EK665163 : O ${ingresso.nome_setor_lote} tem venda máxima de ${ingresso.lot_qtde_max} unidades`;
        }
      }
    }
  }
}