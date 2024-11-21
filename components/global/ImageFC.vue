<template lang="pug">
  div
    NuxtImg(:src="src" :alt="alt" :width="width" :height="height" :class="customClass" :fit="fit")
    slot
</template>

<script setup>
import { defineProps } from 'vue'

// 定義 props
defineProps({
  src: {
    type: String,
    required: true, // 圖片路徑是必需的
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
    default: 'cover', // ��設為 cover，可以調整��片的��放方式
    validator: (value) => ['cover', 'contain', 'fill', 'inside', 'outside'].includes(value), // 必��為 cover, contain, fill, scale-down 其中一個
  },
  customClass: {
    type: String,
    default: '', // 用於自定義類
  },
})
</script>

<style