<template lang="pug">
div
  NuxtImg(:src="src" :alt="alt" :width="width" :height="height" :class="customClass" :fit="fit")
  slot
</template>

<script setup>
// 定義 props
defineProps({
  src: {
    type: String,
    required: true, // 必需的
  },
  alt: {
    type: String,
    default: 'Image', // 默認描述
  },
  width: {
    type: [String, Number],
    default: 'auto',
  },
  height: {
    type: [String, Number],
    default: 'auto',
  },
  fit: {
    type: String,
    default: 'cover',
    validator: (value) => ['cover', 'contain', 'fill', 'inside', 'outside'].includes(value),
  },
  customClass: {
    type: String,
    default: '', // 用於自定義類
  },
})
</script>

<style