<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
import { authStore } from '../../store/authStore'
const auth = authStore()
let userToken = useCookie('userToken')

onMounted(() => {
  if (userToken.value) {
    auth.setAuth((userToken.value))
  }
})
</script>