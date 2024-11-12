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
let userToken = useCookie('userToken')?.value

onMounted(() => {
  if (userToken) {
    auth.setAuth((userToken))
  }
})
</script>