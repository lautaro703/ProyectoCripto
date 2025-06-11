import { createRouter, createWebHistory } from 'vue-router'
import Sidebar from '../components/Siderbar.vue'
import Alta from '@/Modules/AltaCompra/components/Alta.vue'


const routes = [
  {
    path: '/',
    name: 'Sidebar',
    component: Sidebar
  },
  {
     path: '/alta',
    name: 'Alta',
    component: Alta
  },
  {
    path: '/historial',
    name: 'Historial',
    component: () => import('@/Modules/HistorialCompra/components/Historial.vue')
  },
  // otros caminos si querés agregar más
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router