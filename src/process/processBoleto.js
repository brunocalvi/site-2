import { guardaIngressoStore } from '@/store/guardaIngressos.js';
import { infoUsuarioStore } from '@/store/infoUsuario.js';
import { pegaIP } from '@/services/capturaIpMaquina.js';
import { getDateOfExpiration } from "@/utils/date.js";

export default {
  async processaBoleto(keyPagamento) {
    let guardaIngressos = guardaIngressoStore();
    let infoUsuario = infoUsuarioStore();
     
    const usuario = infoUsuario.get();
    const ingressos = guardaIngressos.getAll();
    const ip = await pegaIP();

    let qtd_ing = [];
    let mes_id = [];
    let mas_id = [];
    let ite_cod = [];
    let id_setor = [];
    let pdv_id = [];
    let eve_cod = [];
    let valor_unit  = [];
    let valor_seguro  = [];
    let forma_de_entrega = [];
    let forma_ent_valor = [];
    let val_taxa_bol = [];

    let val_id = [];
    let val_desconto = [];

    let paymentMethodId = '';
    let dateOfExpiration = getDateOfExpiration(1);
    const gateway = keyPagamento.gateway_cartao;
    let bandeira = "BOL";
    let binary_mode = false;
    let somaValores = 0;
    let tot = 0;
    let tot_evento = 0;

    if(keyPagamento.binary_mode == "") {
      binary_mode = true;
    } 

    if(gateway == "MPTP" || gateway == "MPMKT") {
      paymentMethodId = "bolbradesco";
    } else if (gateway == "SAFRA_T") {
      paymentMethodId = "Boleto_Safra";
    } else if (gateway == "PAGAR") {
      paymentMethodId = "Boleto_Stone";
    } else {
      paymentMethodId = "Boleto_Santander";
    }

    console.log(ingressos);

    for(let eve in ingressos) {
      valor_seguro.push(0)
      forma_de_entrega.push(ingressos[eve].form_entrega);
      forma_ent_valor.push(ingressos[eve].forma_ent_valor);
      val_taxa_bol.push(ingressos[eve].val_taxa_bol);

      for(let i in ingressos[eve].ingresso) {
        qtd_ing.push(ingressos[eve].ingresso[i].qtd);
        mes_id.push(ingressos[eve].ingresso[i].mes_id);
        mas_id.push(ingressos[eve].ingresso[i].mas_id || 0);
        ite_cod.push(ingressos[eve].ingresso[i].ite_cod);
        id_setor.push(ingressos[eve].ingresso[i].gru_id); 
        pdv_id.push(ingressos[eve].pdv_id); 
        eve_cod.push(ingressos[eve].eve_cod); 

        tot += ingressos[eve].ingresso[i].valorTot * ingressos[eve].ingresso[i].qtd;

        valor_unit.push(tot.toFixed(2)); 
      }

      // vale desconto se tiver
      val_id.push(ingressos[eve].desconto.val_id || 0);
      val_desconto.push(ingressos[eve].desconto.val_desconto || 0);
      

      somaValores += tot;
      tot = 0;

      somaValores += ingressos[eve].forma_ent_valor;
      somaValores += ingressos[eve].val_taxa_bol;
      tot_evento++;
    }

    const valorFinal = somaValores.toFixed(2);

    const json = {
      "binary_mode": binary_mode,
      "gateway": gateway,
      "acesso_via": "S",
      "tot_evento": tot_evento,
      "venda": {
          "usu_id": usuario.id,
          "token": "",
          "pdv_id": pdv_id.toString(),
          "eve_cod": eve_cod.toString(),
          "qtd_ing": qtd_ing.toString(),
          "mes_id": mes_id.toString(),
          "mas_id": mas_id.toString(),
          "ite_cod": ite_cod.toString(),
          "id_setor": id_setor.toString(),
          "val_id": val_id.toString(),
          "valor_desconto": val_desconto.toString(),
          "valor_unit": valor_unit.toString(),
          "valor": valorFinal,
          "valorAux": valorFinal,
          "valor_seguro": valor_seguro.toString(),
          "pro_id": 0,
          "forma_de_entrega": forma_de_entrega.toString(),
          "forma_entrega_valor": forma_ent_valor.toString(),
          "taxa_boleto": val_taxa_bol.toString(),
          "forma_pagto": bandeira.toUpperCase(),  
          "data_vencimento": dateOfExpiration, 
          "hash": "",
          "pagar_antigo": "",
      },
      "dados_do_comprador": {
          "valor_parcela": valorFinal,
          "parcelas": 1,
          "cep": usuario.cep,
          "logradouro": usuario.endereco,
          "bandeira": paymentMethodId,
          "cpf": usuario.cpf,
          "numero_cc": "",
          "ip": ip,
          "ddd": usuario.dddcel,
          "tel": usuario.celular,
          "numero": usuario.numero,
          "cidade": usuario.cidade,
          "uf": usuario.uf,
          "bairro": usuario.bairro,
          "complemento": usuario.complemento,
          "gravar": "",
          "email": usuario.email,
          "data_nasc": usuario.datanascimento,
          "n_car": "",          
          "m_car": "",
          "a_car": "",
          "c_car": "",
          "num_cartao_final": "",
          "clearsale_sessionid": keyPagamento.sessionId || '',  
      },
      "dados_do_usuario": {
          "cep": usuario.cep,
          "logradouro": usuario.endereco,
          "cpf": usuario.cpf,
          "nome_comprador": usuario.nome,
          "ddd_tel": usuario.dddcel,
          "tel": usuario.celular,
          "numero": usuario.numero,
          "cidade": usuario.cidade,
          "uf": usuario.uf,
          "email": usuario.email
      },
      "aceita_3ds": "N"  
    };

    return json;
  }
}