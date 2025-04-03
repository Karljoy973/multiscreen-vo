<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
<script setup lang="ts"> 
import { inject } from '@vercel/analytics'
inject()
</script>
