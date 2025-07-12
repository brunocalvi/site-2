<template>
  <template v-if="msg.indexOf('sucesso') === -1">
    <div class="error" data-aos="fade-up">
      <div class="error__icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-exclamation-circle" viewBox="0 0 16 16">
          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
          <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z"/>
        </svg>
      </div>

      <div class="error__title">{{ msg }}</div>

      <div class="error__close" @click="fechaAlert()">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
          <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
        </svg>
      </div>
    </div>
  </template>

  <template v-else>
    <div class="sucess" data-aos="fade-up">
      <div class="sucess__icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check2-circle" viewBox="0 0 16 16">
          <path d="M2.5 8a5.5 5.5 0 0 1 8.25-4.764.5.5 0 0 0 .5-.866A6.5 6.5 0 1 0 14.5 8a.5.5 0 0 0-1 0 5.5 5.5 0 1 1-11 0"/>
          <path d="M15.354 3.354a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0z"/>
        </svg>
      </div>

      <div class="sucess__title">{{ msg }}</div>

      <div class="sucess__close" @click="fechaAlert()">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
          <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
        </svg>
      </div>
    </div>
  </template>
</template>

<script>
export default {
  props: { 
    msg: String 
  },
  data() {
    return { }
  },
  methods: {
    fechaAlert() {
      this.$emit('fechar', undefined);
    }
  }
}
</script>

<style>
.error {
  max-width: 400px;
  padding: 12px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: start;
  background: #EF665B;
  border-radius: 8px 0px 0px 8px;
  box-shadow: 0px 0px 5px -3px #111;
  position: fixed;
  right: 0;
  z-index: 9999;
  top: 10rem;
}
.error__icon {
  width: 20px;
}
.error__title {
  font-weight: 500;
  font-size: 1rem;
  margin: 0px 10px;
}
.error__close {
  cursor: pointer;
  margin-left: auto;
}
.error__icon,
.error__close,
.error__title  {
  color: #fff;
  /*line-height: 0;*/
}
.sucess {
  max-width: 400px;
  padding: 12px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: start;
  background: #edfbd8;
  border-radius: 8px 0px 0px 8px;
  box-shadow: 0px 0px 5px -3px #111;
  position: fixed;
  right: 0;
  z-index: 9999;
  top: 10rem;
}
.sucess__icon {
  width: 20px;
  height: 20px;
  transform: translateY(-2px);
}
.sucess__title {
  font-weight: 500;
  font-size: 1rem;
  margin: 0px 10px;
}
.sucess__close {
  cursor: pointer;
  margin-left: auto;
}
.sucess__icon,
.sucess__close,
.sucess__title  {
  color: #2b641e;
}
</style>