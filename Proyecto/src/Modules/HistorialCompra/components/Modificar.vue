<template>

 <div class="purchase-container">
    <div class="card" :class="{'exito':habilitar}" >
      <div class="card-header">
        <h2> Modificar compra de criptomoneda</h2>
      </div>
  
     <div class="form-group">
        <label for="ClienteId">Cliente</label>
        <select v-model="datosformulario.clienteId" id="ClienteId" :disabled="true">
          <option disabled value="">Seleccione un cliente</option>
          <option v-for="cliente in clientes" :key="cliente.id" :value="cliente.id">
            {{ cliente.nombre }}
          </option>
        </select>
      </div>
      

      <div class="form-group">
        <label for="exchange">Exchange:</label>
        <select id="exchange" v-model="datosformulario.exchange":disabled="habilitar">
          <option disabled value="">Seleccione un exchange</option>
          <option v-for="(nombre,codigo) in mapaexchange" :key="codigo" :value="codigo">
            {{ nombre }}</option>
        </select>
      </div>

      <div class="form-group">
        <label for="crypto">Criptomoneda:</label>
        <select v-model="datosformulario.cryptoCode" id="crypto":disabled="habilitar">
         <option disabled value="">Elegí una criptomoneda</option>
         <option v-for="(nombre,codigo) in mapaCriptos" :key="codigo" :value="codigo">{{ nombre }}</option>
        </select>
      </div>

      <div class="form-group">
       <label for="accion">Acción:</label>
        <select v-model="datosformulario.accion" id="accion" required :disabled="habilitar">
         <option disabled value="">¿Qué acción va a realizar?</option>
         <option value="purchase">Compra</option>
         <option value="sale">Venta</option>
        </select>
      </div>

      <div class="form-group">
        <label for="amount">Cantidad</label>
       <input
         type="text"
         v-model="datosformulario.cantidad" 
         placeholder="0.00000000"
         :disabled="habilitar"
         />
      </div>

      <div class="form-group">
        <label for="amount">Monto (ARS)</label>
        <input type="text" :value="precioFinal" readonly placeholder="0.00000000" :disabled="habilitar"/>
      </div>
      

      <div class="form-group">
       <label for="datetime">Fecha y hora: {{ fechaHoraActual }}</label>
      </div>

      <button @click="registro":disabled="habilitar"> Confirmar Compra</button>
      <button @click="$router.push('/historial')"id=colo> Ir al historial </button>

      <p v-if="loading" class="loading-mensaje">Cargando...</p>
      <div v-if="mensaje" class="mensaje-exitoso">{{ mensaje }}</div>
      <div v-if="error" class="mensaje-error">{{error}}</div>

   </div>
 </div>
</template>

<script setup>
  import router from '@/router';
  import axios from 'axios'
  import { ref,watch, onMounted, onBeforeUnmount } from 'vue';
  import { useRoute } from 'vue-router'

  const route = useRoute()

  const idTransaccion = route.query.id
  const habilitar = ref(false)
  const clienteExiste = ref(null) 
  const mensajeCliente = ref('')
  const mensaje = ref('')
  const error = ref('')
  const loading = ref(false)
  const clienteselecionado = ref(null)
  const clientes = ref([])
  const precioFinal = ref(0.00000000)

  
  const mapaCriptos = {
    BTC: 'bitcoin',
    ETH: 'ethereum',
    USDC:'usdc',
    BNB: 'bnb'
  }

  const mapaexchange = {
    Binance: 'binance',
    Astropay: 'astropay',
    Bitso: 'bitso',
    Ripio: 'ripio',
  }

  const datosformulario = ref({
    cryptoCode: '',
    accion: 'purchase',
    clienteId: null,
    cantidad: '0.00000000',
    monto: '0.00000000', 
    fechaHoraActual: ''
  })

 async function calcularpreciofinal() {
  if (
    datosformulario.value.cryptoCode &&
    datosformulario.value.exchange &&
    datosformulario.value.cantidad > 0
  ) {
    try {
      const respuesta = await axios.get(`https://localhost:7171/api/Transaccion/obtenerPrecioAsync`, {
       params: {
        exchange: datosformulario.value.exchange,
        cantidad: datosformulario.value.cantidad,
        cripto: datosformulario.value.cryptoCode
      }
   })
     
      const precio = parseFloat(respuesta.data)

      precioFinal.value = precio
      datosformulario.value.monto = precio

    }
     catch (e) {
      console.error('Error al obtener el precio:', e)
      precioFinal.value = 0.00000000
      datosformulario.value.monto = 0.0000000000
    }
  }
}

 watch([
  ()=> datosformulario.value.cryptoCode,
  () => datosformulario.value.exchange,
  () => datosformulario.value.cantidad
 ],
 calcularpreciofinal
)
  onMounted(async () => {
    console.log('ID recibido por query:', idTransaccion)
    try {
        const response = await axios.get('https://localhost:7171/api/Cliente/listar')
          clientes.value = response.data;
    }
    catch (error) {
          console.error('Error al cargar los clientes:', error)
        }
    if (idTransaccion) {
     try {
         const respuesta = await axios.get(`https://localhost:7171/api/Transaccion/${idTransaccion}`)
         const transaccion = respuesta.data

         console.log('Transacción obtenida:', transaccion)

         datosformulario.value.clienteId = transaccion.clienteId,
         datosformulario.value.cryptoCode = transaccion.cryptoCode,
         datosformulario.value.accion = transaccion.accion,
         datosformulario.value.cantidad = transaccion.cantidad,
         datosformulario.value.monto = transaccion.monto,
         precioFinal.value = transaccion.monto
     } catch (error) {
      console.error('Error al cargar la transacción:', error)
     }
    }
  })
  const registro = async () => {
    mensaje.value = ''
    error.value = ''

   if( !datosformulario.value.clienteId) {
    error.value = 'Seleccione un cliente'
    return
   }
   if (!datosformulario.value.exchange) {
    error.value = 'Seleccione un exchange'
    return
   }
   
   if (!datosformulario.value.cryptoCode ) {
    error.value = 'selecione una criptomoneda'
    return
   }
   if (datosformulario.value.cantidad <= 0) {
    error.value = 'La cantidad debe ser mayor a 0'
    return
   }
   if (datosformulario.value.monto <= 0) {
    error.value = 'El monto no puede ser cero'
    return
   }

  try {

    loading.value = true
   
    const compra = {
     CryptoCode: datosformulario.value.cryptoCode,
     Accion: datosformulario.value.accion,
     ClienteId: datosformulario.value.clienteId,
     Cantidad: parseFloat(datosformulario.value.cantidad),
     Monto: parseFloat(datosformulario.value.monto),
     FechaHora: new Date().toISOString()
   }
     console.log("Enviando al backend:", JSON.stringify(compra, null, 2))

    await axios.post('http://localhost:5265/api/Transaccion', compra)

    mensaje.value = 'Compra registrada con éxito'

    datosformulario.value = {
      cryptoCode: '',
      accion: '',
      clienteId: '',
      cantidad: '0.00000000',
      monto: '0.00000000',
      fechaHora: ''
    } 

    clienteselecionado.value = null
    precioFinal.value = 0.00000000
    error.value = ''
    clienteExiste.value = null
    mensajeCliente.value = ''
    
    const borrarTransaccion = confirm('¿Desea modificar la transacción?')
    if(!borrarTransaccion){
      return
    }
    try{
      await axios.delete(`https://localhost:7171/api/Transaccion/${idTransaccion}`)
      console.log('Transacción eliminada correctamente')

      setTimeout(() => {
        router.push('/historial')
      }, 5000);
      
      habilitar.value = true

    }
    catch (error) {
      console.error('Error al borrar la transacción:', error)
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
    .card.exito {
       background-color: #00ff3c; /* verde claro tipo bootstrap */
       
    }
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
        margin-left: 130px;
        margin-top: 20px;
        color: #ffffff;
        width: 50%;

    }
    input{
        width: 96%
        ;
    }
    button:hover {
        transform: translateY(-5px);
        transition: 1s;
        box-shadow: 0 4px 6px rgb(0, 3, 70);
    }
    .loading-mensaje{
      color: #ffffff;
      text-align: center;
      margin: 10px;
    }
    .mensaje-exitoso{
      color: #ffffff;
      text-align: center;
      margin: 10px;
    }
    .mensaje-error{
      color: #ffffff;
      text-align: center;
      margin: 10px;
    }
</style>