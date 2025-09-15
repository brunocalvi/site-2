import axios from 'axios';
import { createRouter, createWebHistory  } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
    beforeEnter: endPointConfi,
  },
  {
    path: '/cadastro',
    name: 'cadastro',
    component: () => import('@/views/CadastroView.vue'),
    beforeEnter: endPointConfi,
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue')
  },
  {
    path: '/area-usuario',
    name: 'area-usuario',
    component: () => import('@/views/usuario/UserAtualizaPerfil.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/compras',
    name: 'compras',
    component: () => import('@/views/usuario/UserHistorico.vue'),
    beforeEnter: endPointConfi,
    meta: { requiresAuth: true }
  },
  {
    path: '/cancelar/:pag_id',
    name: 'cancelar',
    component: () => import('@/views/usuario/UserCancelar.vue'),
    beforeEnter: endPointConfi,
    meta: { requiresAuth: true }
  },
  {
    path: '/nominal/:pag_id',
    name: 'nominal',
    component: () => import('@/views/usuario/UserNominar.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/nominal/:ing/:aut',
    name: 'nominal_individual',
    component: () => import('@/views/usuario/UserNominarIndivudual.vue'),
  },
  {
    path: '/recupera-senha',
    name: 'recupera-senha',
    component: () => import('@/views/RecuperaSenha.vue'),
  },
  {
    path: '/pesquisa',
    name: 'pesquisa',
    component: () => import('@/views/PesquisaView.vue'),
    beforeEnter: endPointConfi,
    props: true
  },
  {
    path: '/senha/:user/:aut',
    name: 'alterar_senha',
    component: () => import('@/views/AlteraSenha.vue'),
  },
  {
    path: '/promoter/:proid',
    name: 'produtor',
    component: () => import('@/views/PromoterView.vue'),
  },
  {
    path: '/text/:id/:texto',
    name: 'texto',
    component: () => import('@/views/TextoView.vue'),
  },
  {
    path: '/comprar/:eve_cod/:eve_nome',
    name: 'ingressos',
    component: () => import('@/views/IngressosView.vue'),
    beforeEnter: endPointConfi,
  },
  {
    path: '/evento/:eve_cod/:eve_nome',
    name: 'detalhes_evento',
    component: () => import('@/views/DetalhesEventoView.vue'),
    beforeEnter: endPointConfi,
  },
  {
    path: '/validacao',
    name: 'validacao_login',
    component: () => import('@/views/ValidaLogin.vue'),
  },
  {
    path: '/checkout',
    name: 'checkout',
    component: () => import('@/views/CheckoutView.vue'),
    beforeEnter: endPointConfi,
    meta: { requiresAuthComp: true },

  },
]

// verifica se está em PROD para alterar o caminho raiz
const path = process.env.NODE_ENV === 'production' ? process.env.VUE_APP_PUBLIC_PATH : '/';

const router = createRouter({
  history: createWebHistory(path),
  routes,
  scrollBehavior() {
    // Sempre rola para o topo
    return { top: 0, behavior: 'smooth' };
  },
});

async function endPointConfi(to, from, next) {
  try {
    let LINK_SISTEMA = process.env.VUE_APP_LINK_SISTEMA;
    let WS_KEY = process.env.VUE_APP_WS_KEY;

    const res = await axios.get(`${LINK_SISTEMA}ws/geral/config_mobile.asp?key=${WS_KEY}&gmet=3`)
    to.meta.config = res.data
    next()
  } catch (error) {
    console.error('Erro ao carregar config_mobile.asp:', error)
    next(false) // cancela a navegação em caso de erro
  }
}

// Proteção de rota
router.beforeEach(async (to, from, next) => {
  const token = sessionStorage.getItem('token');

  if (to.meta.requiresAuth || to.meta.requiresAuthComp) {
    if (!token && to.meta.requiresAuth) {
      return next('/login');
    }

    if(!token && to.meta.requiresAuthComp) {
      return next('/');
    }

    try {
      const site = process.env.VUE_APP_URL_SITE;
      await axios.get(`${site}api/usuario.php?token=${sessionStorage.getItem('token')}`);
      next(); 

    } catch (error) {
      //console.warn('Token inválido ou expirado:', error);
      //console.error('Token inválido ou expirado');
      sessionStorage.removeItem('token');
      next('/login');
    }
  } else {
    next();
  }
});

export default router
