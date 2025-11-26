<template>
  <div class="purchase-container">
    <div class="card">
      <div class="card-header">
        <h2>Comprar Criptomoneda</h2>
      </div>

      <div class="form-group">
        <label for="ClienteId">Cliente</label>
        <select v-model="datosformulario.clienteId" id="ClienteId">
          <option disabled value="">Seleccione un cliente</option>
          <option v-for="cliente in clientes" :key="cliente.id" :value="cliente.id">
            {{ cliente.nombre }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="exchange">Banco</label>
        <select v-model="datosformulario.exchange" id="exchange">
          <option disabled value="">Elegí un banco</option>
          <option v-for="(label, code) in mapaexchange" :key="code" :value="code">{{ label }}</option>
        </select>
      </div>

      <div class="form-group">
        <label for="cryptoCode">Crypto</label>
        <select v-model="datosformulario.cryptoCode" id="cryptoCode">
          <option disabled value="">Elegí una criptomoneda</option>
          <option v-for="(label, code) in mapaCriptos" :key="code" :value="label">{{ code }}</option>
        </select>
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
        <input
          id="amount"
          type="number"
          v-model.number="datosformulario.cantidad"
          min="0.0000000000000000001"
          placeholder="0.00000000"
        />
      </div>

      <div class="form-group">
        <label for="monto">Monto (ARS)</label>
        <!-- mostramos el monto calculado (solo lectura) -->
        <input id="monto" type="text" :value="montoFormateado" readonly />
      </div>

      <div class="form-group">
        <label for="datetime">Fecha y hora: {{ fechaHoraActual }}</label>
      </div>

      <p v-if="loading" class="loading-mensaje">Cargando...</p>
      <div v-if="mensaje" class="mensaje-exitoso">{{ mensaje }}</div>
      <div v-if="error" class="mensaje-error">{{ error }}</div>

      <button @click="registro" :disabled="loading">Confirmar Compra</button>
      
    </div>
  </div>
</template>

<script setup>
import axios from 'axios'
import { ref, watch, onMounted, onBeforeUnmount, computed } from 'vue'

// --- Estado ---
const clientes = ref([])
const mensaje = ref('')
const error = ref('')
const loading = ref(false)

// Mapa: key = valor que enviaremos a la API, value = label para mostrar
const mapaexchange = {
  binancep2p: 'Binance',
  astropay: 'Astropay',
  bitso: 'Bitso',
  ripio: 'Ripio'
}

const mapaCriptos = {
  bitcoin: 'BTC',
  ethereum: 'ETH',
  usdc: 'USDC',
  bnb: 'BNB'
}

const datosformulario = ref({
  clienteId: '',
  exchange: '',
  cryptoCode: '',
  accion: '',
  cantidad: 0.00000000,
  monto: 0.00000000,
  fechaHora: ''
})

// Ref que guardará el precio final (opcional, usamos también datosformulario.monto)
const PrecioFinal = ref(0)

// Formateo del monto para mostrar
const montoFormateado = computed(() => {
  const monto = Number(datosformulario.value.monto || 0.000000000)
  return monto.toLocaleString('es-AR', { minimumFractionDigits: 1, maximumFractionDigits: 10 })
})

// --- Llamada a la API para calcular el monto ---
async function calcularmonto() {
  const crypto = datosformulario.value.cryptoCode
  const exchange = datosformulario.value.exchange
  const cantidad = Number(datosformulario.value.cantidad)

  if (!crypto || !exchange || !(cantidad > 0)) {
    // si falta algo, ponemos 0
    PrecioFinal.value = 0
    datosformulario.value.monto = 0
    return
  }

  try {
    const resp = await axios.get('https://localhost:7171/api/Transaccion/obtenerPrecioAsync', {
      params: {
        exchange,
        cantidad,
        cripto: crypto
      }
    })

    const precio = parseFloat(resp.data)
    if (Number.isFinite(precio)) {
      PrecioFinal.value = precio
      datosformulario.value.monto = precio
    } else {
      PrecioFinal.value = 0
      datosformulario.value.monto = 0
    }
  } catch (err) {
    console.error('Error al obtener el monto:', err)
  }
}

// --- Registro (envío al backend) ---
const registro = async () => {
  mensaje.value = ''
  error.value = ''

  if (!datosformulario.value.clienteId) {
    error.value = 'Seleccione un cliente'
    return
  }
  if (!datosformulario.value.cryptoCode || !datosformulario.value.cantidad) {
    error.value = 'Complete los campos obligatorios'
    return
  }
  if (Number(datosformulario.value.cantidad) <= 0) {
    error.value = 'La cantidad debe ser mayor a 0'
    return
  }
  if (Number(datosformulario.value.monto) <= 0) {
    error.value = 'El monto no puede ser cero'
    return
  }

  try {
    loading.value = true
    const compra = {
      cryptoCode: datosformulario.value.cryptoCode,
      accion: datosformulario.value.accion,
      clienteId: datosformulario.value.clienteId,
      cantidad: Number(datosformulario.value.cantidad),
      monto: Number(datosformulario.value.monto),
      fechaHora: new Date().toISOString()
    }

    console.log('Enviando al backend:', compra)
    await axios.post('http://localhost:5265/api/Transaccion', compra)

    mensaje.value = 'Compra registrada con éxito'

    // reset parcial del formulario (dejamos cliente para pruebas si querés)
    datosformulario.value = {
      clienteId: '',
      exchange: '',
      cryptoCode: '',
      accion: '',
      cantidad: 0.00000000,
      monto: 0.00000000,
      fechaHora: ''
    }

    PrecioFinal.value = 0

    setTimeout(() => {
      mensaje.value = ''
    }, 5000)
  } catch (err) {
    console.error(err)
    error.value = 'Error al registrar la compra'
  } finally {
    loading.value = false
  }
}

// --- Fecha y hora ---
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
onMounted(async () => {
  try {
    const response = await axios.get('https://localhost:7171/api/Cliente/listar')
    clientes.value = response.data
  } catch (err) {
    console.error('Error al obtener los clientes:', err)
  }

  actualizarFechaHora()
  intervalo = setInterval(actualizarFechaHora, 60000)
})

onBeforeUnmount(() => {
  clearInterval(intervalo)
})


watch(
  () => [datosformulario.value.cryptoCode, datosformulario.value.exchange, datosformulario.value.cantidad],
  calcularmonto
)
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
        height: 730px;
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
 
    label{
        font-size: 0.9rem;
        font-weight: 600;
        color: #ffffff;
        display: block;
        margin-bottom: 15px;
        margin-left: 10px;
    }
    input{
      width: 96%;
      padding: 10px;
      border-radius: 10px;
      border: 1px solid #cbd5e1;
      font-size: 1rem;
      background: white;
      color: #0f172a;
      transition: all 0.3s;
      margin-bottom: 10px;

    }
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
        margin-left: 25%;
        margin-top: 10px;
        color: #ffffff;
        width: 50%;
    }
    button:hover {
        transform: translateY(-5px);
        transition: 1s;
        box-shadow: 0 4px 6px rgb(0, 3, 70);
        height: auto;
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