<template lang="pug">
LayoutsPage(class='h-vh flex justify-center items-center flex-col mt-40')
  LogInUI
</template>

<script setup>
import LayoutsPage from '../../layouts/LayoutsPage.vue'
import LogInUI from './LogInUI.vue'

defineComponent({
  components: { LayoutsPage, LogInUI },
})

</script>