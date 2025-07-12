<template>
  <div class="prs_footer_main_section_wrapper">
		<div class="container">
			<div class="row">
				<div class="col-lg-4 col-md-4 col-sm-6 col-xs-12">
					<div class="prs_footer_cont1_wrapper prs_footer_cont1_wrapper_1">
						<h2>ACESSO RÁPIDO</h2>
						<ul>
              <li v-for="textoAR in textosAR" :key="textoAR.id">
                <i class="ri-checkbox-blank-circle-fill"></i>
                <router-link :to="{ name: 'texto', params: { id: textoAR.id, texto: textoAR.alias } }">{{ textoAR.titulo }}</router-link>
              </li>
						</ul>
					</div>
				</div>

				<div class="col-lg-4 col-md-4 col-sm-6 col-xs-12">
					<div class="prs_footer_cont1_wrapper prs_footer_cont1_wrapper_1 area-user">
						<h2>ÁREA DO USUÁRIO</h2>
            <ul>
              <li v-for="textoAU in textosAU" :key="textoAU.id">
                <i class="ri-checkbox-blank-circle-fill"></i>
                <router-link :to="{ name: 'texto', params: { id: textoAU.id, texto: textoAU.alias } }">{{ textoAU.titulo }}</router-link>
              </li>
						</ul>
					</div>
				</div>

				<div class="col-lg-3 col-md-3 col-sm-6 col-xs-12">
          <div class="prs_footer_cont1_wrapper prs_footer_cont1_wrapper_1 fale-conosco">
						<h2>FALE CONOSCO</h2>
						<ul>
							<li>
                <i class="ri-checkbox-blank-circle-fill"></i>
                <a href="#">Contato</a>
              </li>
              <li>
                <i class="ri-checkbox-blank-circle-fill"></i>
                <a href="#">Faça seu evento conosco</a>
              </li>
						</ul>
					</div>

					<div class="prs_footer_cont1_wrapper prs_footer_cont1_wrapper_4">
						<h2>BAIXE NOSSO APP</h2>
            <div class="row">
              <div class="col col-md-6">
                <a href="#" target="_blank">
                  <img class="icone-app" :src="`${pathProd}img/content/f1.jpg`" alt="app">
                </a>
              </div>

              <div class="col col-md-6">
                <a href="#" target="_blank">
                  <img class="icone-app" :src="`${pathProd}img/content/f2.jpg`" alt="app">
                </a>
              </div>
            </div>
					</div>
				</div>
			</div>
		</div>
	</div>

  <div class="cookie-card" id="card-cookie" v-show="mostraCookies">
    <span class="title">🍪 Aviso de cookies</span>
    <p class="description">Utilizamos cookies para garantir que lhe proporcionamos a melhor experiência no nosso site, leia as políticas de cookies.</p>
    <div class="actions">
      <router-link :to="{ name: 'texto', params: { id: '1', texto: 'politica-de-cookies' } }" class="pref">
        Ler as políticas de cookies
      </router-link>
      <button class="accept" id="aceitaCookies" @click="funcCookies()">Aceitar</button>
    </div>
  </div>

	<div class="prs_bottom_footer_wrapper">	
		<div class="container">
			<div class="row">
				<div class="col-lg-6 col-md-6 col-sm-8 col-xs-12">
					<div class="prs_bottom_footer_cont_wrapper">
						<p>© Todos os direitos reservados</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import endPointSite from '@/services/endPointSite';

export default {
  data() {
    return {
      mostraCookies: true,
      textosAR: '',
      textosAU: '',
      pathProd: '/',
    }
  },
  mounted() {
    if(sessionStorage.getItem('aceitaCookie')) {
      this.mostraCookies = false;
    }
  },
  async created() {
    this.pathProd = process.env.NODE_ENV === 'production' ? process.env.VUE_APP_PUBLIC_PATH : '/';
    this.textosAU = await endPointSite.listatextos('AU');
    this.textosAR = await endPointSite.listatextos('AR');
  },
  methods: {
    funcCookies() {
      this.mostraCookies = false;
      sessionStorage.setItem('aceitaCookie', false);
    }
  }
}
</script>

<style>
.prs_footer_cont1_wrapper img {
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  border-radius: 5px;
  width: 100%;
  margin-top: 2rem;
}
.prs_footer_main_section_wrapper {
  background: #111111;
  float: left;
  width: 100%;
  padding-top: 70px;
  padding-bottom: 70px;
}
.prs_footer_cont1_wrapper {
  float: left;
  width: 100%;
}
.prs_footer_cont1_wrapper h2 {
  font-size: 18px;
  font-weight: bold;
  color: #ffffff;
  position: relative;
  text-transform: uppercase;
}
.prs_footer_cont1_wrapper h2:before {
  content: '';
  border: 2px solid var(--primeira-cor);
  width: 30px;
  position: absolute;
  bottom: -21px;
  left: 0;
}
.prs_footer_cont1_wrapper h2:after {
  content: '';
  border: 1px solid rgba(255, 255, 255, 0.28);
  width: 90px;
  position: absolute;
  bottom: -20px;
  left: 0;
}
.prs_footer_cont1_wrapper ul {
  padding-top: 45px;
  padding-left: 0;
  margin-bottom: 3rem;
}
.fale-conosco {
  margin-bottom: 2rem;
  margin-top: 0;
}
.prs_footer_cont1_wrapper li {
  margin-top: 10px;
  list-style: none;
}
.prs_footer_cont1_wrapper li i {
  color: var(--primeira-cor);
  font-size: 10px;
  position: relative;
  top: -1px;
  margin-right: 7px;
}
.prs_footer_cont1_wrapper li a {
  color: rgba(255, 255, 255, 0.57);
  -webkit-transition: all 0.5s;
  -o-transition: all 0.5s;
  -ms-transition: all 0.5s;
  -moz-transition: all 0.5s;
  transition: all 0.5s;
  text-decoration: none;
}
.prs_footer_cont1_wrapper li a:hover {
  color: var(--primeira-cor);
}
.cookie-card {
  max-width: 430px;
  padding: 1rem;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 20px 20px 30px rgba(0, 0, 0, .05);
  position: fixed;
  z-index: 444;
  bottom: 10px;
  border: 1px solid #ddd;
  margin: 20px;
}
.cookie-card .title {
  font-weight: 600;
  color: rgb(31 41 55);
}
.cookie-card .description {
  margin-top: 1rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: rgb(75 85 99);
}
.cookie-card .actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 1rem;
  -moz-column-gap: 1rem;
  column-gap: 1rem;
  flex-shrink: 0;
}
.cookie-card .pref {
  font-size: 0.75rem;
  line-height: 1rem;
  color: rgb(31 41 55);
  -webkit-text-decoration-line: underline;
  text-decoration-line: underline;
  transition: all .3s cubic-bezier(0.4, 0, 0.2, 1);
  border: none;
  background-color: transparent;
}
.accept {
  font-size: 0.75rem;
  line-height: 1rem;
  background-color: rgb(17 24 39);
  font-weight: 500;
  border-radius: 0.5rem;
  color: #fff;
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 0.625rem;
  padding-bottom: 0.625rem;
  border: none;
  transition: all .15s cubic-bezier(0.4, 0, 0.2, 1);
}
.prs_bottom_footer_wrapper {
  float: left;
  width: 100%;
  background: #0e0e0e;
  padding-top: 20px;
  padding-bottom: 20px;
}
.prs_bottom_footer_cont_wrapper p {
  color: rgba(255, 255, 255, 0.57);
}
</style>