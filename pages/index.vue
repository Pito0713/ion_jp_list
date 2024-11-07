<template lang="pug">
  Card
    a carousel
</template>

<script setup>
import { ref, reactive, onMounted, watch, computed, defineComponent, defineExpose } from 'vue'
import Card from '../../components/Card.vue'
defineComponent({
  components: { Card },
})
defineExpose({
})

</script>