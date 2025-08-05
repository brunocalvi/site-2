import { cpf } from 'cpf-cnpj-validator';

export default {
  validacoesCadastro(dados) {
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const numeros = /.*\d+.*/;
    let err = undefined;

    if(!dados.concorda) {
      err = 'SIT-WC183975 : É obrigatório concordar com a política de privacidade!';
    }

    if(dados.email == "" || !regexEmail.test(dados.email) || dados.email.indexOf("@") == -1 || dados.email.indexOf(".") == -1) {
      err = 'SIT-MZ796178 : O e-mail está fora do padrão, tente um e-mail valido!';
    }

    if(dados.email !== dados.novo_email) {
      err = 'SIT-WX0259930 : Os e-mails não estão correspondendo ou estão fora do padrão!';
    }

    if(dados.senha == undefined || dados.senha == "") {
      err = 'SIT-RQ785507 : A senha não pode estar vazia!';
    }

    if(dados.senha !== dados.nova_senha) {
      err = 'SIT-KG68380 : As senhas não estão correspondendo ou estão fora do padrão!';
    }

    if(dados.gt_cad_reduzido == 'N') {
      if(dados.cep.length != 8) {
        err = 'SIT-LP242999 : CEP inválido, confirme os números digitados.';
      }

      if(dados.endereco == undefined || dados.endereco == "") {
        err = 'SIT-BH862038 : CEP inválido, confirme os números digitados.';
      }

      if(dados.numero_casa == undefined || dados.numero_casa == "") {
        err = 'SIT-WG924462 : Insira um número válido.';
      }

      if(dados.bairro == undefined || dados.bairro == "") {
        err = 'SIT-ZT351106 : Insira um bairro válido.';
      }

      if(dados.cidade == undefined || dados.cidade == "") {
        err = 'SIT-WE479981 : Insira uma cidade válida.';
      }
      
      if(dados.nacionalidade == 'BRA') { 
        if(dados.uf_br == undefined || dados.uf_br == "") {
          err = 'SIT-FN514017 : Insira um estado válido.';
        }
      } else {
        if(dados.uf_ex == undefined || dados.uf_ex == "") {
          err = 'SIT-FC402370 : Insira um estado válido.';
        }
      }
    }

    if(dados.nacionalidade == 'BRA') {
      if(dados.tpCadastro == 'PF') {
        if(!cpf.isValid(dados.cpf)) {
          err = 'SIT-WD642023 : Precisa ter um CPF válido cadastro no sistema!';
        }
      } else {
        if(dados.cnpj.length != 14) {
          err = 'SIT-TH469859 : Precisa ter um CNPJ válido cadastro no sistema!';
        }
      }  
    } else {
      if(dados.passaporte == undefined || dados.passaporte == "") {
        err = 'SIT-UQ085834 : O passaporte precisa ser preenchido.';
      }
    }

    if(dados.dia == "" || dados.mes == "" || dados.ano == "") {
      err = 'SIT-QT943865 : Precisa preencher a data de nascimento!';
    }

    if(dados.genero == undefined || dados.genero == "") {
      err = 'SIT-YE753474 : Precisa ter pelomenos um gênero selecionado !';
    }

    if(dados.ddd == undefined || dados.ddd == "") {
      err = 'SIT-EY443361 : Digite um DDD válido.';
    }

    if(dados.celular == undefined || dados.celular == "") {
      err = 'SIT-GC716867 : Insira um número para contato.';
    }

    if(dados.nome == "" || dados.nome == undefined || dados.nome.lenght < 3 || dados.nome.indexOf(" ") == -1 || numeros.test(dados.nome)) {
      err = 'SIT-JU578436 : Por favor, coloque um nome e sobrenome válido.';
    }
    
    return err;
  }
}