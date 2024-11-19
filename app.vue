<template>
  <div>
    <NuxtLoadingIndicator :throttle="0" color=#60a5fa :height=7.5> </NuxtLoadingIndicator>
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