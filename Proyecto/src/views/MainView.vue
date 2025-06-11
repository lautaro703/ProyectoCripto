<template>
 <div class="container">
    <sidebar></sidebar>
    
  <div class="content">
    <router-view></router-view>
  </div>
 </div>
</template>

<script setup>
import  sidebar  from'@/components/Siderbar.vue';

</script>

<style >
.container {
    display: flex;
}
.content {
    flex: 1;
    padding: 20px;
}
</style>