<template lang="pug">
div
  template(v-if='auth.isAuthenticated')
    nav
      div(class='flex border-2 py-4')
        div(class="w-24 text-center font-bold ")
          NuxtLink(to="/") Home
        div(class="w-24 text-center font-bold ")
          NuxtLink(to="/TextPage") TextPage
  main(class='relative flex-1 h-svh bg-gray-200')
    NuxtPage
</template>

<script setup>
import { ref, reactive, onMounted, watch, computed, defineComponent, defineExpose } from 'vue'
import { authStore } from '../../store/authStore'
const auth = authStore()
defineComponent({
  components: {},
})
defineExpose({
})

</script>