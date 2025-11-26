<template>
  <div class="purchase-container">
    <div class="card">

      <div class="card-header">
        <h1>Registro de Cliente</h1>
      </div>

      <div class="form-group">
        <label for="nombre">Nombre del cliente:</label>
        <input type="text" id="nombre" v-model="nombre">
      </div>

      <div class="form-group">
        <label for="email">Mail:</label>
        <input type="text" id="email" v-model="email">
      </div>

      <p v-if="loading" class="loading-mensaje">Cargando...</p>
      <div v-if="mensaje" class="mensaje-exitoso">{{ mensaje }}</div>
      <div v-if="error" class="mensaje-error">{{ error }}</div>

      <button @click="Guardar"><strong>Guardar</strong></button>
      
    </div>
  </div>
</template>


<script setup>

const nombre = ref('')
const email = ref('')
const error = ref('')
const mensaje = ref('')
const loading = ref(false)


import axios from 'axios'
import { ref,watch, onMounted,computed, onBeforeUnmount } from 'vue';

const Guardar = async () => {
  mensaje.value = ''
  error.value = ''

  if (!email.value) {
    error.value = 'Por favor, complete el email.'
    return
  }

  if (!nombre.value) {
    error.value = 'Por favor, complete el nombre.'
    return
  }

  try {

    loading.value = true

    const cargado = {
      Nombre: nombre.value,
      Email: email.value
    }

     console.log('Cargando cliente:', cargado)
     
     await axios.post('https://localhost:7171/api/Cliente', cargado)

    mensaje.value = 'Cliente registrado exitosamente.'
    nombre.value='';
    email.value='';  

    setTimeout(() => {
      mensaje.value = ''
    }, 5000)
  }
  catch (err) {
    console.error('Error al registrar cliente:', err)
    error.value = 'Error al registrar cliente. Intente nuevamente.'
  } finally {
    loading.value = false
  }
}

const datosformulario = ref({
  Nombre: '',
  Email: ''
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
 }
 label{
  font-size: 0.9rem;
  font-weight: 600;
  color: #ffff;
  display: block;
  margin-bottom: 15px;
  margin-left: 10px;
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
        height: 390px;
        width: auto;
        align-self: center;
        justify-content: center;
        position: relative;
    }
     .purchase-container {
        box-shadow: 0 12px 20px rgb(26, 25, 25);
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        border-radius: 30px;
        background-color: #ffffff;
        padding: 20px;
        margin-left: 25%;
        color: rgb(0, 0, 0);
        height: 120%;
        width: 40%;
        align-items: center;
        justify-content: center;
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
     padding: 15px;
     border-radius: 10px;
     background-color: rgb(0, 106, 255);
     border: 2px solid #ffffff;
     text-align: center;
     color: #ffffff;
     width: 100%;
     margin-top: 20px;
     position: static;
     margin-left: 0;
     display: block;
     margin: 20px auto 0 auto;

    }
    button:hover {
        transform: translateY(-5px);
        transition: 1s;
        box-shadow: 0 4px 6px rgb(0, 3, 70);
    }

</style>