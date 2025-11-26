<template>
  <div class="purchase-container">
    <div class="card">
      <h1>Clientes registrados</h1>
    </div>

    <ul>
      <li v-for="cliente in clientes" :key="cliente.id" class="cliente-item">
        <div class="dato">
         <strong>Nombre:</strong>
           <template v-if="clienteEditado === cliente.id">
            <input v-model="cliente.nombre" />
           </template>

           <template v-else>
            <label>{{ cliente.nombre }}</label>
           </template>
        </div>

       <div class="dato">
        <strong>Email:</strong>
         <template v-if="clienteEditado === cliente.id">
          <input v-model="cliente.email" />
         </template>

         <template v-else>
          <label>{{ cliente.email }}</label>
         </template>
        </div>

      <div class="acciones">
        <template v-if="clienteEditado === cliente.id">
          <button @click="GuardarCambios(cliente.id)">Guardar</button>
          <button @click="CancelarEdicion">Cancelar</button>
        </template>

        <template v-else>
          <button @click="ModificarCli(cliente.id)">Modificar</button>
          <button @click="EliminarCli(cliente.id)">Eliminar</button>
        </template>
      </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const clientes = ref([])
const clienteEditado = ref(null)

async function cargarClientes() {
  const response = await axios.get('https://localhost:7171/api/Cliente/listarClientescompletos')
  clientes.value = response.data
}

function ModificarCli(id) {
  clienteEditado.value = id
}

function CancelarEdicion() {
  clienteEditado.value = null
}

async function GuardarCambios(id) {
  try {
    const clienteActualizado = clientes.value.find(c => c.id === id)
    await axios.put(`https://localhost:7171/api/Cliente/${id}`, clienteActualizado)
    clienteEditado.value = null
    console.log('Cliente actualizado correctamente')
  } catch (error) {
    console.error('Error al actualizar el cliente:', error)
  }
}

async function EliminarCli(id) {
  const confirmado = confirm('¿Desea eliminar el cliente?')
  if (!confirmado) return

  try {
    try{
      await axios.delete(`https://localhost:7171/api/Transaccion/EliminarTransaccionPorCliente/${id}`)
      console.log('Transacciones del cliente eliminadas correctamente')
    }
    catch(error){
      console.error('Error al eliminar las transacciones del cliente:', error)
    }
    await axios.delete(`https://localhost:7171/api/Cliente/${id}`)
    await cargarClientes()
    alert('Cliente eliminado correctamente')
  } catch (error) {
    console.error('Error al eliminar el cliente:', error)
  }
}

onMounted(async () => {
  await cargarClientes()
})
</script>

<style scoped>
 .main{
  background-color: #14005c ;
  width: 100%;
  border-radius: 30px;
  height: 10%;
 }
 h1{
  color: rgb(0, 57, 138);
  text-transform: uppercase;
    text-align: left;
 }

 label{
  font-size: 2rem;
  font-weight: 600;
  color: #000000;
  display: block;
  margin-bottom: center;
  margin-left: 5px;
  justify-content: space-between;
 }
  input,
    select {
        width: 98%;
        height: 30px;
        padding: 5px;
        border-radius: 10px;
        border: 1px solid #cbd5e1;
        font-size: 100%;
        background: white;
        color: #0f172a;
        transition: all 0.3s;
        margin-bottom: 10px;
    }
    .card-header {
        margin-bottom: 20px;
        box-shadow: 0 4px 6px rgb(214, 214, 214);
        border-radius: 20px;
        padding: 10px;
        background-color: rgb(255, 255, 255);
        text-align: center;
        text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.6);
    }
    .card {
        
        background-color: rgb(0, 106, 255);
        padding: 30px;
        border-radius: 20px;
        height: 200%;
        width: 96.9%;
        align-self: center;
        justify-content: center;
        position: relative;
    }
     .purchase-container {
        box-shadow: 0 12px 20px rgb(26, 25, 25);
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        width: 100%;
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        background-color: #ffffff;
        padding: 20px;
        color: rgb(0, 0, 0);
        height: 900%;
        width: 97.5%;
        align-items: 10%;
        justify-content: 10%;
        
    }
    .card h1 {
      text-align: left;
      font-size: 3rem;
    }
    
     .loading-mensaje{
      color: #000000;
      text-align: center;
    }
    .mensaje-exitoso{
      color: #00ff4c;
      text-align: center;
     
    }
    .mensaje-error{
      color: #ff0000;
      text-align: center;
    }
  button {
     font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
     padding: 20px;
     border-radius: 10px;
     background-color: rgb(0, 106, 255);
     border: 2px solid #ffffff;
     text-align: center;
     color: #ffffff;
     width: 100%;
     margin-top: 20px;
     position: relative;
     margin-left: 10px;
     display: block;
     margin: 10px ;
     font-size: 1.5rem;
    }
    button:hover {
        transform: translateY(-5px);
        transition: 1s;
        box-shadow: 0 4px 6px rgb(0, 3, 70);
    }
  .cliente-item {
  display: flex;
  justify-content: space-between;
  align-items: 100%;
  background-color: #c0c0c0; 
  padding: 15px;
  margin-bottom: 12px;
  border-radius: 10px;
  width: 98.5%;
  
}
strong {
  margin-right: 5px;
  font-size: 2rem;
  margin: 10px;
}
ul {
  list-style: none;
  padding: 0;
}
.dato {
  display: flex;
  align-items: center;
  gap:2px;
  margin: 10px;
}

.acciones {
  display: flex;
  gap: 10px;
}

</style>