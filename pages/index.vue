<template lang="pug">
LayoutsPage(class='flex h-vh flex-col')
  Card(class='flex flex-col justify-start items-start w-full mt-3 mb-0')
    div(class='my-2 text-xl ml-1')
      a(v-if='!answer' ) {{ articles.translationA }} &nbsp; &nbsp; &nbsp; {{ articles.translationB }}
      a(v-else) {{ articles.translationA }} &nbsp; {{answer}} &nbsp; {{ articles.translationB }}
    template(v-for='(item, index) in articles.targetTagArray' :key='item + index')
      div(class='ml-1 text-base my-1' @click='handleAnswer(item)')
        a {{index+1}} . {{item}}
    div
      button(type="submit" :disabled="isSubmit || !answer" class='mt-3 text-base disabled:bg-slate-500' @click='handleSubmit()') {{$t('submit')}}
      button(class='ml-2 mt-3 text-base' @click='handleCallTest()') {{$t('next_question')}}

</template>
<script setup>
import { ref, reactive, onMounted, watch, computed, defineComponent } from 'vue'
import LayoutsPage from '../../layouts/LayoutsPage.vue'
const articles = ref([]);
const answer = ref(null);
const isSubmit = ref(false);
const { $api } = useNuxtApp();
const loadingIndicator = useLoadingIndicator();

const handleAnswer = (_value) => {
  if (!isSubmit.value) answer.value = _value
}

const handleSubmit = async () => {
  loadingIndicator.start()
  let submitData = {
    _id: articles.value._id,
    file: answer.value,
  }
  let target = await $api.answerTest(submitData)
  if (target.status === 1) {
    const store = modalStore();
    store.ModalShow(target.message);
    articles.value.targetTagArray.forEach((item, index) => {
      if (item == target.data) return articles.value.targetTagArray[index] = item + ` (O)`
      else articles.value.targetTagArray[index] = item + ` (X)`
    })
    isSubmit.value = true

  }
  loadingIndicator.finish()
}

const handleCallTest = async () => {
  answer.value = null
  await callTest()
}

const callTest = async () => {
  let target = await $api.textTest()
  if (target.status === 1) {
    isSubmit.value = false;
    let str = target.data.translation;
    const indexOfPart = str.indexOf('()');

    let partA = null
    let partB = null

    if (indexOfPart > -1) {
      partA = str.split('(')[0] + ` (`;
      partB = `) ` + str.split(')')[1];
      if (indexOfPart === 0) {
        partA = ` (`
      }
    } else {
      partA = target.data.translation
    }

    articles.value = {
      _id: target.data._id,
      translationA: partA,
      translationB: partB ? partB : '',
      targetTagArray: target.data.targetTagArray
    }
  }
}

onMounted(
  () => {
    callTest()
  }
)

defineComponent({
  components: { LayoutsPage },
})
defineExpose({
  handleAnswer,
  handleSubmit,
  handleCallTest,
})

</script>