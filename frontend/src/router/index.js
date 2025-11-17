import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Admin from '../views/Admin.vue';
import Totem from '../views/Totem.vue';


const auth = {
  isLoggedIn: localStorage.getItem('isLoggedIn') === 'true',
};

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login,
      beforeEnter: (to, from, next) => {
        if (auth.isLoggedIn) {
          next('/admin');
        } else {
          next();
        }
      },
    },
    {
      path: '/admin',
      name: 'Admin',
      component: Admin,
      beforeEnter: (to, from, next) => {
        if (!auth.isLoggedIn) {
          next('/login');
        } else {
          next();
        }
      },
    },
    {
        path: '/admin/totems',
        name: 'ManageTotems',
        component: () => import('../views/ManageTotens.vue'),
        beforeEnter: (to, from, next) => {
          if (!auth.isLoggedIn) {
            next('/login');
          } else {
            next();
          }
        },
    },
    {
        path: '/admin/slides',
        name: 'ManageSlides',
        component: () => import('../views/ManageSlides.vue'),
        beforeEnter: (to, from, next) => {
          if (!auth.isLoggedIn) {
            next('/login');
          } else {
            next();
          }
        },
    },
    {
      path: '/totem',
      name: 'Totem',
      component: Totem,
    },
    {
      path: '/',
      redirect: '/login',
    },
  ],
});

export { auth };
export default router;