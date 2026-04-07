import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Transaction from '@/views/Transaction.vue';
import TransactionAdd from '@/views/TransactionAdd.vue';
import TransactionEdit from '@/views/TransactionEdit.vue';
import Settings from '@/views/Settings.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/Home',
      name: 'Home',
      component: Home,
    },
    {
      path: '/transaction',
      name: 'Transaction',
      component: Transaction,
    },
    {
      path: '/transaction/add',
      name: 'TransactionAdd',
      component: TransactionAdd,
    },
    {
      path: '/transaction/edit/:id',
      name: 'TransactionEdit',
      component: TransactionEdit,
    },
    {
      path: '/settings',
      name: 'Settings',
      component: Settings,
    },
  ],
});

export default router;
