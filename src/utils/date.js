/**
 * console.log(getDateOfExpiration(1, 5)); // opção 1 -> +5 dias T05:00:00.000-04:00
 * console.log(getDateOfExpiration(2));    // opção 2 -> +30 minutos com .000-03:00
 * console.log(getDateOfExpiration(3));    // opção 3 -> +1 dia com -03:00
 */

export function getDateOfExpiration(option = 1, dias = 1) {
  const date = new Date();

  switch (option) {
    case 1:
      // === $date_of_expiration = date('Y-m-d', strtotime("+".$dias_vencto_bol." days")) . "T05:00:00.000-04:00";
      date.setDate(date.getDate() + dias);
      return `${date.toISOString().split("T")[0]}T05:00:00.000-04:00`;

    case 2:
      // === $date_of_expiration = date('Y-m-d\TH:i:s', strtotime("+30 minutes")) . ".000-03:00";
      date.setMinutes(date.getMinutes() + 30);
      return `${date.toISOString().split(".")[0]}.000-03:00`;

    case 3:
      // === $date_of_expiration = date('Y-m-d\TH:i:s', strtotime("+1 days")) . "-03:00";
      date.setDate(date.getDate() + 1);
      return `${date.toISOString().split(".")[0]}-03:00`;

    default:
      // padrão: mesma lógica original da sua primeira function
      date.setDate(date.getDate() + 1);
      return `${date.toISOString().split(".")[0]}-03:00`;
  }
}
