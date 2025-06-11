<template>
  <div class="clientes-container">
  <div class="clientes-header">
    <h2>Seleccione un Cliente</h2>
  </div>
  <select>
    <option disabled selected value="">Seleccione...</option>
    <option v-for="cliente in clientes" :key="cliente.id" :value="cliente.id">
      {{ cliente.name }}
    </option>
  </select>
</div>
  
  <div class="historial-compra">
    <div class="historial-header">
      <h2>Historial de Compras</h2>
    </div>

    <div class="form-group">
      <label for="crypto">Criptomoneda:</label>
      <p id="crypto">{{ datosformulario.cryptoCode }}</p>
    </div>

    <div class="form-group">
      <label for="cantidad">Cantidad:</label>
      <p id="cantidad">{{ datosformulario.cantidad.toFixed(8) }}</p>
    </div>

    <div class="form-group">
      <label for="accion">Acción:</label>
      <p id="accion">{{ datosformulario.accion }}</p>
    </div>

    <div class="form-group">
      <label for="monto">Monto:</label>
      <p id="monto">{{ datosformulario.monto }}</p>
    </div>

    <div class="form-group">
      <label for="fechayhora">Fecha y Hora:</label>
      <p id="fechayhora">{{ datosformulario.fechayhora }}</p>
    </div>

    <div class="form-group">
      <label for="id">ID:</label>
      <p id="id">{{ datosformulario.id }}</p>
    </div>

    <button>Ver info</button>

    <button>Modificar Transacción</button>

    <button>Eliinar Transacción</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const datosformulario = ref({
  id: 1,
  cryptoCode: 'BTC',
  accion: 'purchase',
  cantidad: 0.00000001,
  monto: 123.45,
  fechayhora: '2025-06-10 12:00'
})
</script>

<style scoped>
.historial-compra {
  width: 90%;
  max-width: 600px;
  margin: 40px auto;
  background-color: #007bff; /* Azul fuerte como el fondo del form */
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

label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
  color: white;
}

p {
  background-color: #ffffff;
  color: #003366;
  padding: 10px;
  border-radius: 10px;
  font-weight: 500;
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
</style>