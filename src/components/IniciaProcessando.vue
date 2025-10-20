<template>
  <div class="conteudo-processando">
    <img src="img/aguarde.gif" />
    <p class="final-txt">Processando pagamento...</p>
    <p>
      Esta transação pode levar até 1 minuto.<br/>
      Por favor, não feche esta janela e nem recarregue a página até a conclusão do processo.
    </p>
  </div>
</template>

<script>
export default {
  data() {
    return { }
  }
}
</script>

<style>
.conteudo-processando {
  text-align: center;
  min-height: 15rem;
  margin: 1rem;
  margin-top: 5rem;
}
.conteudo-processando img {
  width: 30px;
}
</style>