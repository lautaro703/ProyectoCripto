import { createRouter, createWebHistory } from 'vue-router'
import Sidebar from '../components/Siderbar.vue';
import Alta from '@/Modules/AltaCompra/components/Alta.vue';
import Historial from '@/Modules/HistorialCompra/components/Historial.vue';
import Registro from '@/Modules/RegistroClientes/components/Registro.vue';
import Modificar from '@/Modules/HistorialCompra/components/Modificar.vue';
import ClientesModificacion from '@/Modules/ModificacionClientes/components/ClientesModificacion.vue';

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
    component: Historial
  },
  {
    path: '/registro',
    name: 'Registro',
    component: Registro,
  },
  {
    path: '/modificar',
    name: 'modificar',
    component: Modificar
  },
  {
    path: '/ClientesModificacion',
    name: 'ClientesModificacion',
    component: ClientesModificacion
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
