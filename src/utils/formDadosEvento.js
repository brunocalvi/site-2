export function preparaTituloLink(eve_nome) {
  // Substituir acentos por letras sem acento
  const acentosMap = [
    [/(á|à|ã|â|ä)/gi, 'a'],
    [/(é|è|ê|ë)/gi, 'e'],
    [/(í|ì|î|ï)/gi, 'i'],
    [/(ó|ò|õ|ô|ö)/gi, 'o'],
    [/(ú|ù|û|ü)/gi, 'u'],
    [/(ñ)/gi, 'n'],
    [/(ç)/gi, 'c']
  ];

  acentosMap.forEach(([regex, replacement]) => {
    eve_nome = eve_nome.replace(regex, replacement);
  });

  // Caracteres a serem substituídos por hífen
  const caracteres = ['ä','ã','à','á','â','ê','ë','è','é','ï','ì','í','ö','õ','ò','ó','ô',
                      'ü','ù','ú','û','À','Á','É','Í','Ó','Ú','ñ','Ñ','ç','Ç',' ',
                      '-','(',')',',',';',':','|','!','"','#','$','%','&','/','=','?',
                      '~','^','>','<','ª','º','.'];

  caracteres.forEach(char => {
    const regex = new RegExp(`\\${char}`, 'g'); // Escape necessário
    eve_nome = eve_nome.replace(regex, '-');
  });

  // Substituir múltiplos hífens por um único
  eve_nome = eve_nome.replace(/-+/g, '-');

  // Remover hífens no início e no final
  eve_nome = eve_nome.replace(/^-+|-+$/g, '');

  // Converter para minúsculas
  return eve_nome.toLowerCase();
}

export function revisaLogoEvento(logo) {
  let path = process.env.NODE_ENV === 'production' ? process.env.VUE_APP_PUBLIC_PATH : '/';

  if(!logo || logo.includes('/imagem/logo/')) {
    logo = `${path}img/default.jpg`;
  }
  
  return logo;
}

export function diaSemana(eve_inicio) {
  const data_inicio = eve_inicio.split("/");
  const eve_inicio_tratado = `${data_inicio[2]}-${data_inicio[1]}-${data_inicio[0]}`;
  const dias = ["Segunda-Feira", "Terça-Feira", "Quarta-Feira", "Quinta-Feira", "Sexta-Feira", "Sábado", "Domingo"];
  const data = new Date(eve_inicio_tratado);
  const diaSemana = data.getDay();
  return dias[diaSemana];
}

export function mesAbreviado(mes) {
  switch (mes) {
    case '01': case '1': return 'JAN';
    case '02': case '2': return 'FEV';
    case '03': case '3': return 'MAR';
    case '04': case '4': return 'ABR';
    case '05': case '5': return 'MAI';
    case '06': case '6': return 'JUN';
    case '07': case '7': return 'JUL';
    case '08': case '8': return 'AGO';
    case '09': case '9': return 'SET';
    case '10': return 'OUT';
    case '11': return 'NOV';
    case '12': return 'DEZ';
    default: return '';
  }
}

export function mesCompleto(mes) {
  switch (mes) {
    case '01': case '1': return 'janeiro';
    case '02': case '2': return 'fevereiro';
    case '03': case '3': return 'março';
    case '04': case '4': return 'abril';
    case '05': case '5': return 'maio';
    case '06': case '6': return 'junho';
    case '07': case '7': return 'julho';
    case '08': case '8': return 'agosto';
    case '09': case '9': return 'setembro';
    case '10': return 'outubro';
    case '11': return 'novembro';
    case '12': return 'dezembro';
    default: return '';
  }
}

export function montaData(eve_inicio, eve_dia_inicio, eve_mes_inicio) {
  return diaSemana(eve_inicio) + ', ' + eve_dia_inicio + ' de ' + mesCompleto(eve_mes_inicio);
}

export function ajustaDataCard(eve_inicio, lista_datas) {
  if(eve_inicio?.includes(' ')) { // Adicionada verificação de null/undefined
    return eve_inicio;
  } else if (lista_datas?.includes(',')) { // Adicionada verificação de null/undefined
    return lista_datas.replace(/,/g, ', ');
  } else if (eve_inicio) { // Garante que eve_inicio não é null ou undefined antes de dividir
    const explode_inicio = eve_inicio.split("/");
    const eve_dia_inicio = explode_inicio[0];
    const eve_mes_inicio = explode_inicio[1];
    return montaData(eve_inicio, eve_dia_inicio, eve_mes_inicio);
  }
  return ''; // Retorno padrão caso nenhuma condição seja atendida
}

/*export function formatValor(value) {
  let val = value.replace(/,/g, '.');

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(val);
}

export function formatValorSemR(value) {
  let val = value.replace(/,/g, '.');

  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(Number(val));
}

export function formatValorBR(value) {
  let numero = Number(value);

  if(Math.abs(numero) < 0.005) numero = 0;

  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numero);
}*/

export function formatValor(value, { normalizarVirgula = false } = {}) {
  let numero = value;

  // Se for string e precisar normalizar vírgulas
  if (normalizarVirgula && typeof numero === 'string') {
    numero = numero.replace(/,/g, '.');
  }

  numero = Number(numero);

  // Evita exibir -0,00 ou 0,00 quando o número é muito pequeno
  if (Math.abs(numero) < 0.005) numero = 0;

  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numero);
}

export function escreveStatus(status) {
	switch (status) {
		case 'PG': return 'Pago';
		case 'NP': return 'Não Pago';
		case 'DV': return 'Devolvido';
		case 'CA': return 'Cancelado';
		case 'EA': return 'Em Análise';
		default: return 'Erro';
	}
}

export function categoriaIngresso(categoria){
  switch (categoria) {
    case 'I': return 'Inteira';
    case 'M': return 'Meia';
    case 'C': return 'Cortesia';
    case 'P': return 'Promocional';
    case 'L': return 'Coletiva';
    default: return 'Erro';
  }
}

export function diaDaSemana(dateString) {
  // O Date() em JavaScript espera o formato AAAA-MM-DD.
  const [month, day, year] = dateString.split('-');
  const formattedDate = `${year}-${month}-${day}`;

  const date = new Date(formattedDate);

  // Array com os nomes dos dias da semana em português
  const daysOfWeek = ['SEG','TER','QUA','QUI','SEX','SÁB','DOM'];

  const dayIndex = date.getDay();
  return daysOfWeek[dayIndex];
}

export function colecaoData($value) {
  const datasArray = $value[0].data_eve.split(',');
  const horasArray = $value[0].hora_eve.split(',');
  const eventosArray = $value[0].cod_eve.split(',');

  const dadosOrganizados = {};

  datasArray.forEach((data, index) => {
    let d = data.split('-');

    // Se a data ainda não existe como chave, inicializa-a
    if (!dadosOrganizados[data]) {
      dadosOrganizados[data] = {
        hora: [],
        evento: [],
        dia: d[1],
        mes: mesAbreviado(d[0]),
        semana: diaDaSemana(data), 
      };
    }

    dadosOrganizados[data].hora.push(horasArray[index]);
    dadosOrganizados[data].evento.push(eventosArray[index]);
  });

  return dadosOrganizados;
}

export function venda_min_max(min, max) {
  if(min > 0 && max == 0) {
    return `Esse ingresso tem venda mínima de ${min} unidades`;

  } else if ((min > 0 & max > 0) && min == max) {
    return `Esse ingresso tem venda obrigatória de ${max} unidades`;

  } else if (min > 0 && max > 0) {
    return `Esse ingresso tem venda mínima de ${min} unidades e venda máxima de ${max} unidades`;

  } else if(max > 0 && min == 0) {
    return `Esse ingresso tem venda máxima de ${max} unidades`;
  }
} 



/*
export function formatData(dateString) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR').format(date);
}
*/