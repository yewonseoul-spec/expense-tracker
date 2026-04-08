import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Login from '@/views/Login.vue';
import Register from '@/views/Register.vue';
import Transaction from '@/views/Transaction.vue';
import TransactionAdd from '@/views/TransactionAdd.vue';
import TransactionEdit from '@/views/TransactionEdit.vue';
import Settings from '@/views/Settings.vue';

const publicRoutes = ['Login', 'Register'];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
    },
    {
      path: '/register',
      name: 'Register',
      component: Register,
    },
    {
      path: '/Home',
      name: 'Home',
      component: Home,
      meta: { requiresAuth: true },
    },
    {
      path: '/transaction',
      name: 'Transaction',
      component: Transaction,
      meta: { requiresAuth: true },
    },
    {
      path: '/transaction/add',
      name: 'TransactionAdd',
      component: TransactionAdd,
      meta: { requiresAuth: true },
    },
    {
      path: '/transaction/edit/:id',
      name: 'TransactionEdit',
      component: TransactionEdit,
      meta: { requiresAuth: true },
    },
    {
      path: '/settings',
      name: 'Settings',
      component: Settings,
      meta: { requiresAuth: true },
    },
  ],
});

router.beforeEach((to) => {
  const loggedIn = localStorage.getItem('loggedIn') === 'true';
  if (to.meta.requiresAuth && !loggedIn) {
    return { name: 'Login' };
  }
  if (publicRoutes.includes(to.name) && loggedIn) {
    return { name: 'Home' };
  }
});

export default router;
