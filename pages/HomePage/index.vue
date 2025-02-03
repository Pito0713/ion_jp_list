<template lang="pug">
LayoutsPage(class='flex h-vh flex-col')
HomeUI(
    :question="question"
    :loading="loading"
    :answer="answer"
    :isSubmit="isSubmit"
    @select-answer="handleAnswer"
    @change-test="changeTextTest"
    @submit-answer="handleSubmit"
  ) 
</template>
<script setup>
import { onMounted } from 'vue'
import LayoutsPage from '../../layouts/LayoutsPage.vue'
import HomeUI from './HomeUI.vue'
import { useHomeHook } from './useHomeHook'

const {
  question,
  answer,
  isSubmit,
  loading,
  handleAnswer,
  handleSubmit,
  changeTextTest,
  callTextTest
} = useHomeHook()

onMounted(
  // 頁面載入後, 觸發api
  () => callTextTest()
)

defineComponent({
  components: { LayoutsPage, HomeUI },
})
defineExpose({
  question,
  answer,
  isSubmit,
  loading,
  handleAnswer,
  handleSubmit,
  changeTextTest,
})

</script>