<template lang="pug">
LayoutsPage(class='flex h-vh flex-col')
  HomeUI(
    :question="question"
    :loading="loading"
    :answer="answer"
    :selectedAnswerId="selectedAnswerId"
    :isSubmit="isSubmit"
    :isEmptyData="isEmptyData"
    @select-answer="handleAnswer"
    @change-quiz="changeTextQuiz"
    @submit-answer="handleSubmit"
  )
  ListUI(
    :homeList="homeList"
    @handle-copy='handleCopy'
    @showText-top='editTextShowTop'
    @showGrammar-top='editGrammarShowTop'
  )

</template>
<script setup>
import { onMounted } from 'vue'
import LayoutsPage from '../../layouts/LayoutsPage.vue'
import HomeUI from './HomeUI.vue'
import ListUI from './ListUI.vue'
import { useHomeHook } from './useHomeHook'

const {
  question,
  answer,
  homeList,
  isSubmit,
  loading,
  selectedAnswerId,
  handleAnswer,
  handleSubmit,
  changeTextQuiz,
  callTextQuiz,
  handleCopy,
  editTextShowTop,
  editGrammarShowTop,
  answerDaily,
  isEmptyData,
} = useHomeHook()

onMounted(
  // 頁面載入後, 觸發api
  () => {
    callTextQuiz()
    answerDaily()
  }
)

defineComponent({
  components: { LayoutsPage, HomeUI, ListUI },
})
defineExpose({
  question,
  answer,
  homeList,
  isSubmit,
  loading,
  selectedAnswerId,
  handleAnswer,
  handleSubmit,
  changeTextQuiz,
  handleCopy,
  editTextShowTop,
})

</script>