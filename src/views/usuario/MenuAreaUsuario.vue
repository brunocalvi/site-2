<template>
  <div class="card-area-usuario">
    <div class="name-foto centralize-entre">
      <div data-toggle="modal" data-target="#modalUser">
        <img :src="imgfotoUsuario" alt="Foto do usuário" class="foto-usuario-menu">
        <template v-if="btnImagem">
          <button type="button" class="btn-foto" value="Alterar" @click="openModal()" >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-camera-fill" viewBox="0 0 16 16">
              <path d="M10.5 8.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"/>
              <path d="M2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4zm.5 2a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1m9 2.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0"/>
            </svg>
          </button>
        </template>
      </div>
    </div>
    
    <div class="name-email">
      <ul class="text-center">
        <li class="name-list-dat">{{ nome }}</li>
        <li>{{ email }}</li>
        <li>Nº de Cadastro: {{ id }}</li>
      </ul>
    </div>
    
    <div class="nav flex-column nav-pills" id="v-pills-tab">
      <router-link class="nav-link" to="/area-usuario">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="icon-menu bi bi-person-check-fill" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M15.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L12.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0"/>
          <path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
        </svg>
        <span class="icon-label">Atualizar Dados</span>
      </router-link>

      <template v-if="cortesias == '00'">
        <router-link class="nav-link" to="/cortesia">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="icon-menu bi bi-bag-check" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M10.854 8.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L7.5 10.793l2.646-2.647a.5.5 0 0 1 .708 0"/>
            <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1m3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z"/>
          </svg>
          <span class="icon-label">Emitir Cortesia</span>
        </router-link>
      </template>
      
      <router-link class="nav-link" to="/compras">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="icon-menu bi bi-ticket-perforated" viewBox="0 0 16 16">
          <path d="M4 4.85v.9h1v-.9zm7 0v.9h1v-.9zm-7 1.8v.9h1v-.9zm7 0v.9h1v-.9zm-7 1.8v.9h1v-.9zm7 0v.9h1v-.9zm-7 1.8v.9h1v-.9zm7 0v.9h1v-.9z"/>
          <path d="M1.5 3A1.5 1.5 0 0 0 0 4.5V6a.5.5 0 0 0 .5.5 1.5 1.5 0 1 1 0 3 .5.5 0 0 0-.5.5v1.5A1.5 1.5 0 0 0 1.5 13h13a1.5 1.5 0 0 0 1.5-1.5V10a.5.5 0 0 0-.5-.5 1.5 1.5 0 0 1 0-3A.5.5 0 0 0 16 6V4.5A1.5 1.5 0 0 0 14.5 3zM1 4.5a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 .5.5v1.05a2.5 2.5 0 0 0 0 4.9v1.05a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-1.05a2.5 2.5 0 0 0 0-4.9z"/>
        </svg>
        <span class="icon-label">Meus Ingressos</span>
      </router-link>

      <span class="nav-link" @click="logout()">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="icon-menu bi bi-x-circle" viewBox="0 0 16 16">
          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
          <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
        </svg>
        <span class="icon-label">Finalizar Sessão</span>
      </span>
    </div>
  </div>
</template>

<script>
import auth from '@/store/auth.js';
import endPointUsuario from '@/services/endPointUsuario.js';
import { getFoto } from '@/services/fotoUusuario.js';

export default {
  props: {
    email: String,
    nome: String,
    id: Number,
    btnImagem: Boolean,
    atuatizaFoto: Boolean,
  },
  data() {
    return {
      site: process.env.VUE_APP_URL_SITE,
      cortesias: undefined,
      imgfotoUsuario: '',
      id_usuario: '',  
    }
  },
  async created() {
    this.mostraFoto();
  },
  watch: {
    atuatizaFoto() {
      this.mostraFoto();
    },
    id(id) {
      this.cortesias = endPointUsuario.getCortesia(id);  
      this.mostraFoto();
    },
  },
  methods: {
    logout() {
      auth.logout();
      this.$router.push('/login');
    },
    async mostraFoto() {
      let result = await getFoto(this.id);
      let data = result[0];

      if(data == undefined || data == '') {
        this.imgfotoUsuario = `${this.site}images/foto-user.png`;
      } else {
        this.imgfotoUsuario = `${this.site}images/img_perfil/${data.path}`; 
      }
    },
    openModal() {
      this.$emit('openModal');
    }
  }
}
</script>

<style scoped>
.centralize-entre {
  display: flex;
  justify-content: center;
  align-items: center;
}
.btn-foto {
  position: absolute;
  border-radius: 50%;
  border: 1px solid;
  margin-left: -20px;
  cursor: pointer;
  line-height: 0;
  height: 30px;
  width: 30px;
}
.name-email {
  font-size: 11px;
  margin-bottom: 30px;
}
.prs_feature_img_cont ul {
  padding-top: 20px;
  float: left;
  width: 100%;
  position: relative;
}
.name-list-dat {
  font-weight: 600;
  margin-bottom: 10px;
  font-size: 16px;
}
.card-area-usuario ul {
  list-style: none;
  padding: 0;
}
.icon-menu {
  margin-right: 6px;
}
#v-pills-tab .nav-link {
  display: flex;
  justify-content: left;
  align-items: center;
  padding: 1rem;
  border: 1px solid #f1f1f1;
  border-left: none;
  border-right: none;
}
#v-pills-tab .nav-link:hover {
  background-color: #e5e5e5;
}
#v-pills-tab .nav-link:hover .icon-label, svg {
  color: #000;
}
.icon-label, svg {
  color: #404040;
  font-size: 16px;
  line-height: 23px;
}
.foto-usuario-menu {
  max-width: 135px;
  border-radius: 500%;
  /*border: 5px solid #ccc;*/
}
</style>