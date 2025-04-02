<template >
    <button class="tool" @click="openWindow">
        <slot></slot>
    </button>
</template>
<script setup lang="ts">


const openWindow = () => window.open("http://localhost:3000/", "secund window", "width=800,height=600,left=100,top=100")
</script>
<style lang="css">
    
</style>