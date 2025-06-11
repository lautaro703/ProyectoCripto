<template>

 <div class="purchase-container">
    <div class="card">
      <div class="card-header">
        <h2>Comprar Criptomoneda</h2>
     
      </div>
  
      <div class="form-group">
        <label for="ClienteId">Cliente</label>
        <input type="number" v-model="datosformulario.ClienteId" required placeholder="ID de Cliente"/>
       </div>
      
      <div class="form-group">
        <label for="crypto">Criptomoneda</label>
        <select v-model="datosformulario.cryptoCode" id="crypto">
         <option disabled value="">Elegí una criptomoneda</option>
         <option v-for="crypto in criptosDisponibles" :key="crypto" :value="crypto">{{ crypto.toUpperCase() }}</option>
        </select>
      </div>

      <div class="form-group">
         <label for="cryptoCode">Crypto code:</label>
         <input type="text" v-model="datosformulario.cryptoCode" placeholder="Ingrese el código de la cripto" required />
      </div>

      <div class="form-group">
       <label for="accion">Acción:</label>
        <select v-model="datosformulario.accion" id="accion" required>
         <option disabled value="">¿Qué acción va a realizar?</option>
         <option value="purchase">Compra</option>
         <option value="sale">Venta</option>
        </select>
      </div>

      <div class="form-group">
        <label for="amount">Cantidad</label>
       <input type="number" :value="datosformulario.cantidad.toFixed(8)" @input="e => datosformulario.cantidad = parseFloat(e.target.value)" step="0.00000001" min="0.00000001" placeholder="Ej: 0.00000001"/>
      </div>

      <div class="form-group">
        <label for="amount">Monto (ARS)</label>
        <input type="text" :value="datosformulario.monto.toLocaleString('es-AR')" readonly placeholder="Precio en pesos"/>
        <input type="hidden" v-model="datosformulario.monto" />
      </div>
      

      <div class="form-group">
       <label for="datetime">Fecha y hora: {{ fechaHoraActual }}</label>
      </div>

     

      <button @click="registro"> Confirmar Compra</button>
      <p v-if="loading" class="loading-mensaje">Cargando...</p>
      <div v-if="mensaje" class="mensaje-exitoso">{{ mensaje }}</div>
      <div v-if="error" class="mensaje-error">{{error}}</div>
      
     
   </div>
 </div>
</template>

<script setup>
import axios from 'axios'
import { ref, onMounted, onBeforeUnmount } from 'vue'

const mensaje = ref('')
const error = ref('')
const loading = ref(false)


const datosformulario = ref({
  cryptoCode: '',
  accion: 'purchase',
  id: 1,
  cantidad: 0.00000001,
  monto: 0,
  fechayhora: ''
})

const criptosDisponibles = ['bitcoin', 'ethereum', 'usdc', 'bnb']

// Obtener el precio actual de la cripto seleccionada
const preciosCryptos = async () => {
  try {
    const respuesta = await axios.get(`https://criptoya.com/api/bybit/BTC/ARS/0.1`)
    return respuesta.data.totalAsk // corregido el nombre correcto del campo
  } catch (err) {
    throw new Error('Error al obtener el precio de la criptomoneda')
  }
}

// Calcular el monto automáticamente
const calcularMonto = async () => {
  if (!datosformulario.value.cryptoCode || !datosformulario.value.cantidad) {
    datosformulario.value.monto = 0
    return
  }

  try {
    const precio = await preciosCryptos()
    const montoTotal = datosformulario.value.cantidad * precio
    datosformulario.value.monto = parseFloat(montoTotal.toFixed(2))
  } catch (err) {
    error.value = 'No se pudo calcular el monto'
  }
}


const registro = async () => {
  mensaje.value = ''
  error.value = ''
  if (!datosformulario.value.cryptoCode || !datosformulario.value.cantidad ) {
    error.value = 'Complete los campos obligatorios'
    return
  }

  if (datosformulario.value.cantidad <= 0) {
    error.value = 'La cantidad debe ser mayor a 0'
    return
  }
  
  try {
    loading.value = true
    await calcularMonto()

   const compra = {
    cryptoCode: datosformulario.value.cryptoCode,
    accion: datosformulario.value.accion,
    ClienteId: datosformulario.value.id,
    cantidad: parseFloat(datosformulario.value.cantidad),
    monto: parseFloat(datosformulario.value.monto),
    fechaHora: new Date().toISOString()
  }
     console.log("Enviando al backend:", JSON.stringify(compra, null, 2))

    await axios.post('https://localhost:7171/api/Transaccion', compra)

    mensaje.value = 'Compra registrada con éxito'

    datosformulario.value = {
      cryptoCode: '',
      accion: 'purchase',
      cantidad: 0.00000001,
      monto: 0,
      fechayhora: ''
    }
  } catch (err) {
    console.error(err)
    error.value = 'Error al registrar la compra'
  } finally {
    loading.value = false
  }
}

const fechaHoraActual = ref('')

function formatearFechaHora(date) {
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  const hh = String(date.getHours()).padStart(2, '0')
  const min = String(date.getMinutes()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd} ${hh}:${min}`
}

function actualizarFechaHora() {
  fechaHoraActual.value = formatearFechaHora(new Date())
}

let intervalo

onMounted(() => {
  actualizarFechaHora()
  intervalo = setInterval(actualizarFechaHora, 60000)
})

onBeforeUnmount(() => {
  clearInterval(intervalo)
})


</script>

<style scoped>
    .main {
        background-color: #14005c;
        width: 100%;
        border-radius: 30px;
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
        height: 800px;
    }
    h2 {
       color: rgb(0, 57, 138);
        text-transform: uppercase;
    }
    .purchase-container {
        box-shadow: 0 12px 20px rgb(26, 25, 25);
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        border-radius: 30px;
        background-color: #ffffff;
        padding: 20px;
        margin-left: 25%;
        color: rgb(0, 0, 0);
        height: 80%;
        width: 40%;
    }
    /*.purchase-container:hover {
        transition: 2s;
        transform: translateX(-.10px);
        background-color: rgb(1, 1, 17);
    }*/
    label{
        font-size: 0.9rem;
        font-weight: 600;
        color: #ffffff;
        display: block;
        margin-bottom: 15px;
        margin-left: 10px;
    }
        input,
    select {
        width: 100%;
        padding: 10px;
        border-radius: 10px;
        border: 1px solid #cbd5e1;
        font-size: 1rem;
        background: white;
        color: #0f172a;
        transition: all 0.3s;
        margin-bottom: 10px;
    }
    .input-cantidad{
       
        width: 95%;
    }
    .input-monto {
        width: 95%;
    }
    .input-fecha{
        width: 95%;
    }
    button {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        padding: 15px;
        border-radius: 10px;
        background-color: rgb(0, 106, 255);
        border: 2px solid #ffffff;
        text-align: center;
        margin-left: 198px;
        margin-top: 40px;
        color: #ffffff;
    }
    button:hover {
        transform: translateY(-5px);
        transition: 1s;
        box-shadow: 0 4px 6px rgb(0, 3, 70);
    }
    .loading-mensaje{
      color: #ffffff;
      text-align: center;
    }
    .mensaje-exitoso{
      color: #ffffff;
      text-align: center;
    }
    .mensaje-error{
      color: #ffffff;
      text-align: center;
    }
</style>