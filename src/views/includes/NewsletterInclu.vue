<template>

  <Alert v-if="retorno != undefined" :msg="retorno" @fechar="estadoAlerta"></Alert>

  <div class="prs_newsletter_wrapper">
    <div class="container">
      <div class="row">
        <div class="col-lg-5 col-md-5 col-sm-12 col-xs-12">
          <div class="prs_newsletter_text">
            <h3>Receba nossas novidades !</h3>
          </div>
        </div>

        <div class="col-lg-7 col-md-7 col-sm-12 col-xs-12">
          <div class="prs_newsletter_field">
            <form action="" method="POST">
              <input type="email" name='email' placeholder="Digite seu e-mail" v-model="emailNews">
              <button type="button" name='email-new' @click="enviaNewsletter()">Enviar</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

import Alert from '@/components/alerts/AlertAcao.vue';

export default {
  components: { Alert },
  data() {
    return {
      emailNews: '',
      site: process.env.VUE_APP_URL_SITE,
      retorno: undefined,
    }
  },
  methods: {
    enviaNewsletter() {
      if(this.emailNews == '') {
        this.retorno = 'Precisa ser preenchido o campo e-mail!';

      } else {
        axios.get(`${this.site}api/newsletter.php?email=${this.emailNews}`).then(res => {
          this.retorno = res.data.message;
          console.log(res);
        }).catch((e) => {
          console.error(e);
        });
      }
    },
    estadoAlerta(data) {
     this.retorno = data; 
    },
  }
}
</script>

<style>
.prs_newsletter_wrapper {
  background-color: var(--primeira-cor);
  padding-top: 60px;
  padding-bottom: 53px;
}
.prs_newsletter_text h3 {
  width: 100%;
  font-size: 30px;
  color: #ffffff;
  font-weight: bold;
  text-transform: uppercase;
}
.prs_newsletter_field input {
  width: calc(100% - 160px);
  border: 2px solid rgba(255, 255, 255, 0.33);
  height: 50px;
  line-height: 50px;
  padding: 0px 15px;
  color: #ffffff;
  border-right: 0;
  background-color: transparent;
  -webkit-border-top-left-radius: 5px;
  -moz-border-top-left-radius: 5px;
  border-top-left-radius: 5px;
  -webkit-border-bottom-left-radius: 5px;
  -moz-border-bottom-left-radius: 5px;
  border-bottom-left-radius: 5px;
}
.prs_newsletter_field button {
  width: 160px;
  height: 50px;
  font-weight: bold;
  background-color: #ffffff;
  color: var(--primeira-cor);
  border: 0px;
  letter-spacing: 1px;
  -webkit-border-top-right-radius: 5px;
  -moz-border-top-right-radius: 5px;
  border-top-right-radius: 5px;
  -webkit-border-bottom-right-radius: 5px;
  -moz-border-bottom-right-radius: 5px;
  border-bottom-right-radius: 5px;
  -webkit-transition: all 0.5s;
  -o-transition: all 0.5s;
  -ms-transition: all 0.5s;
  -moz-transition: all 0.5s;
  transition: all 0.5s;
}
.prs_newsletter_field button:hover {
  background-color: var(--primeira-cor);
  color: #fff;
  border: 2px solid rgba(255, 255, 255, 0.33);
}
.prs_newsletter_field input::-webkit-input-placeholder {
  color: rgba(255, 255, 255, 0.33);
}
</style>