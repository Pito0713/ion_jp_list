<template lang="pug">
LayoutsPage(class='flex h-vh flex-col')
  TestQuestionCard(
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
import TestQuestionCard from './TestQuestionCard.vue'
import { useTestHandler } from './useTestHandler'

const {
  question,
  answer,
  isSubmit,
  loading,
  handleAnswer,
  handleSubmit,
  changeTextTest,
  callTextTest
} = useTestHandler()

onMounted(
  // 頁面載入後, 觸發api
  () => callTextTest()
)

defineComponent({
  components: { LayoutsPage, TestQuestionCard },
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