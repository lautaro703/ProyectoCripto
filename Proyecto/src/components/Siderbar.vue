<template>
  <div class="navbar">
    <h2>Bienvenido</h2>
    <ul>
      <li><router-link to="/registro">Registro de Cliente</router-link></li>
      <li><router-link to="/ClientesModificacion">Ver Clientes</router-link></li>
      <li><router-link to="/alta">Nueva Compra</router-link></li>
      <li><router-link to="/historial">Historial de Movimientos</router-link></li>  
    </ul>
  </div>
</template>


<style scoped>
.navbar {
  background-color: rgb(0, 106, 255);
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 10px;
}

h2{
  color: rgb(255, 255, 255);
  font-family: 'Times New Roman', Times, serif;
}

.navbar ul {
  display: flex;
  gap: 20px;
  list-style: none;
  margin:5px;
  padding: 5px;
  color: rgb(255, 255, 255);
  
}

.navbar a {
  text-decoration: none;
  font-weight: bold;
  color: rgb(255, 255, 255);
}

li:hover{
 
  font-weight: bold;
}
</style>