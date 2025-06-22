<template>
 <div class="clientes-container">
    <div class="clientes-header">
      <h2>Seleccione un Cliente</h2>
    </div>
    <select v-model="clienteSeleccionado">
      <option disabled value="">Seleccione...</option>
      <option v-for="cliente in clientes" :key="cliente.id" :value="cliente.id">
        {{ cliente.nombre }}
      </option>
    </select>
    <button @click="cargarTransacciones">Ver info</button>
  </div>

  <div v-if="transacciones.length" class="historial-grid">
  <div
    v-for="transaccion in transacciones"
    :key="transaccion.id"
    class="historial-card"
  >
    <!-- Modo edición -->
    <template v-if="transaccionEditando && transaccionEditando.id === transaccion.id">
      <label>Cripto:</label>
       <p><strong>Cripto:</strong> {{ transaccion.cryptoCode }}</p>

      <label>Acción:</label>
      <input v-model="transaccionEditando.accion" />

      <label>Cantidad:</label>
      <input type="number" v-model.number="transaccionEditando.cantidad" />

      <label>Monto:</label>
      <input type="number" v-model.number="transaccionEditando.monto" />

      <label>Fecha y Hora:</label>
      <p>Fecha y hora: {{ transaccion.fechaHora }}</p>

      <button @click="guardarCambios">Guardar</button>
      <button @click="cancelarEdicion">Cancelar</button>
    </template>

    <!-- Modo lectura -->
    <template v-else>
      <p><strong>ID:</strong> {{ transaccion.id }}</p>
      <p><strong>Cripto:</strong> {{ transaccion.cryptoCode }}</p>
      <p><strong>Acción:</strong> {{ transaccion.accion }}</p>
      <p><strong>Cantidad:</strong> {{ transaccion.cantidad.toFixed(8) }}</p>
      <p><strong>Monto:</strong> {{ transaccion.monto }}</p>
      <p><strong>Fecha y hora:</strong> {{ transaccion.fechaHora }}</p>

      <button @click="modificarTransaccion(transaccion)">Modificar</button>
      <button @click="eliminarTransaccion(transaccion.id)">Eliminar</button>
    </template>
  </div>
 </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import axios from 'axios'

  const clientes = ref([])
  const clienteSeleccionado = ref('')
  const transacciones = ref([])
  const transaccionEditando = ref(null)


  async function eliminarTransaccion(id) {
     const Confirmado = confirm('¿Desea elimiar la transacción?')
     if (!Confirmado) return
     try {
       await axios.delete(`https://localhost:7171/api/Transaccion/${id}`)
       alert('Transacción eliminada correctamente')
       await cargarTransacciones()
     } catch (error) {
       console.error('Error al eliminar la transacción:', error) 
      }
    }

  onMounted(async () => {
    try {
      const response = await axios.get('https://localhost:7171/api/Cliente/listar')
      clientes.value = response.data
    } catch (error) {
      console.error('Error al obtener los clientes:', error)
    }
  })


  async function cargarTransacciones() {
    if (!clienteSeleccionado.value) return
    try {
      const res = await axios.get(`https://localhost:7171/api/Transaccion/transacciones/${clienteSeleccionado.value}`)
      transacciones.value = res.data
    } catch (error) {
      console.error('Error al obtener transacciones:', error)
    }
  }

  function modificarTransaccion(transaccion) {
    transaccionEditando.value = { ...transaccion }
  }

  function cancelarEdicion() {
    transaccionEditando.value = null
  }

  async function guardarCambios() {
    try{
      const id = transaccionEditando.value.id
      await axios.put(`https://localhost:7171/api/Transaccion/${id}`, transaccionEditando.value)
      alert('Transacción actualizada correctamente')
      transaccionEditando.value = null
      await cargarTransacciones()
    }
    catch (error) {
      console.error('Error al guardar cambios:', error)
      alert('Error al actualizar la transacción')
    }
  }

</script>

<style scoped>
  
  select, select option {
    color: black !important;
    background-color: rgb(255, 255, 255) !important;
  }

  .historial-compra {
    width: 90%;
    max-width: 600px;
    margin: 40px auto;
    background-color: #007bff; 
    border-radius: 30px;
    padding: 30px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.25);
    color: #ffffff;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }

  .historial-header {
    background-color: white;
    padding: 20px;
    border-radius: 20px;
    margin-bottom: 30px;
    text-align: center;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .historial-header h2 {
    color: #003366;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
  }

  .form-group {
    margin-bottom: 20px;
  }

 label{
        font-size: 0.9rem;
        font-weight: 600;
        color: #ffffff;
        display: block;
        margin-bottom: 15px;
        margin-left: 10px;
    }

  p {
    background-color: #ffffff;
    color: #003366;
    padding: 10px;
    border-radius: 10px;
    font-weight: 500;
  }

   input {
        width: 90;
        padding: 10px;
        border-radius: 10px;
        border: 1px solid #cbd5e1;
        font-size: 1rem;
        background: white;
        color: #0f172a;
        transition: all 0.3s;
        margin-bottom: 10px;
    }
  button {
    margin-top: 20px;
    padding: 12px 20px;
    border: 2px solid #ffffff;
    background-color: transparent;
    border-radius: 12px;
    color: #ffffff;
    cursor: pointer;
    transition: all 0.3s;
    font-weight: bold;
    display: block;
    margin-left: auto;
    margin-right: auto;
    display: flex;
    justify-content: center;
  }

  button:hover {
    background-color: #ffffff;
    color: #003366;
    transform: translateY(-2px);
  }
  .clientes-container {
    width: 90%;
    max-width: 600px;
    margin: 40px auto;
    background-color: #007bff;
    padding: 30px;
    border-radius: 30px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }

  .clientes-header {
    background-color: #ffffff;
    padding: 20px;
    border-radius: 20px;
    text-align: center;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
    margin-bottom: 25px;
  }

  .clientes-header h2 {
    margin: 0;
    color: #003366;
    font-weight: bold;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
  }

  .clientes-container select {
    width: 100%;
    padding: 12px;
    border-radius: 12px;
    border: none;
    font-size: 1rem;
    background-color: white;
    color: #003366;
  }
  .historial-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: center;
    padding: 0 20px;
  }

  .historial-card {
    background-color: #007bff;
    color: #ffffff;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    border-radius: 30px;
    padding: 25px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.25);
    flex: 1 1 calc(33.33% - 40px); 
    min-width: 260px;
    max-width: 350px;
    box-sizing: border-box;
    text-align: left;
  }

  .historial-card p {
    background-color: #ffffff;
    color: #003366;
    padding: 10px;
    border-radius: 10px;
    font-weight: 500;
    margin-bottom: 10px;
  }

  .historial-card button {
    margin: 10px auto 0 auto;
    padding: 10px 15px;
    border: 2px solid #ffffff;
    background-color: transparent;
    border-radius: 12px;
    color: #ffffff;
    cursor: pointer;
    transition: all 0.3s;
    font-weight: bold;
    display: block;
  }

  .historial-card button:hover {
    background-color: #ffffff;
    color: #003366;
    transform: translateY(-2px);
  }
</style>