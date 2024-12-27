<template lang="pug">
LayoutsPage(class='flex h-vh flex-col')
  Card(class='flex flex-col justify-start items-start w-full mt-3 mb-0')
    div(class='my-2 text-xl ml-1')
      a(v-if='!answer' ) {{ question.questionA }} &nbsp; &nbsp; &nbsp; {{ question.questionB }}
      a(v-else) {{ question.questionA }} &nbsp; {{answer}} &nbsp; {{ question.questionB }}
    template(v-for='(item, index) in question.questionTagArray' :key='item + index')
      div(class='ml-1 text-base my-1' @click='handleAnswer(item.file)')
        a {{index+1}} . {{item.file}}
    div(class='flex justify-between items-start w-full mt-3 mb-0')
      button(type="submit" :disabled="isSubmit || !answer" class='mt-3 text-base disabled:bg-slate-500' @click='handleSubmit()') {{$t('submit')}}
      button(class='ml-2 mt-3 text-base' @click='changeTextTest()') {{$t('next_question')}}

</template>
<script setup>
import { ref, reactive, onMounted, watch, computed, defineComponent } from 'vue'
import LayoutsPage from '../../layouts/LayoutsPage.vue'
// ----- State
const question = ref({}); // 題目
const answer = ref(null); // 答案
const isSubmit = ref(false); // 提交按鈕 for disabled

// ----- use hook config 
const { $api } = useNuxtApp();
const loadingIndicator = useLoadingIndicator();

/*
  @props : {
    _value: string
  }
*/
const handleAnswer = (_value) => {
  if (!isSubmit.value) answer.value = _value
}

// 提交資料 呼叫 answerTest api
const handleSubmit = async () => {
  loadingIndicator.start() // start loading 
  let submitData = {
    _id: question.value._id, // 題目的 object id 
    file: answer.value, // 使用者提交的答案 
    extraId: JSON.stringify(question.value.questionTagArray) // 全部選項 id 
  }
  let res = await $api.answerTest(submitData)

  // success 
  if (res.status === 1) {
    // 引用 Pinia 全域值 modalStore
    // 公用彈窗導入
    const store = modalStore();
    store.ModalShow(res.message);

    // assign res.data
    const correctAnswerFile = res.data.correctAnswer.file // 正確答案
    const fileAnswerTranslation = res.data.answerFile // 各個選項的翻譯資料

    /* --- question 資料進行重組
      當提交回答問題後, 由 api 提供的各個選項資料進行重組
      補上 各個選項資料的 平假 與 翻譯
    */
    question.value.questionTagArray.forEach((item, index) => {
      let target = question.value.questionTagArray[index]
      let targetTranslation = fileAnswerTranslation.find((e) => { return target._id === e._id }) // 找到對應 api 回傳選項翻譯資料
      // reset to new file
      // ex: 若い (わかい) 年輕的 
      let resetAnswerFile = `${targetTranslation.file}  ${targetTranslation?.fileHiragana ? `(${targetTranslation?.fileHiragana})` : ''} ${targetTranslation?.fileTranslate || ''} `

      if (item.file == correctAnswerFile) return target.file = resetAnswerFile + ` (O)` // 正確的 
      else target.file = resetAnswerFile + ` (X)` // 錯誤的 
    })
    isSubmit.value = true // 提交按鈕 disabled
  }
  loadingIndicator.finish()
}

// 更換問題題目
const changeTextTest = async () => {
  answer.value = null
  await callTextTest() // 重新呼叫資料
}

// @Api textTest api
const callTextTest = async () => {
  let target = await $api.textTest()

  // success 
  if (target.status === 1) {
    isSubmit.value = false; // question 初始化 提交按鈕關閉
    let str = target.data.question;

    /*先 indexOf 查找若是否 () 
      若有 () 問題框有進行 split 分割，否則不分割
      以利 問題框是顯示在畫面進行塞入
      ex: 若い()人   -> partA : 若い(  partB:)人
    */
    const indexOfPart = str.indexOf('()');
    let partA = null
    let partB = null
    if (indexOfPart > -1) { // indexOf 沒有值回傳 -1
      partA = str.split('(')[0] + ` (`;  // 以 ( 判斷為前段 A
      partB = `) ` + str.split(')')[1];  // 以 ) 判斷為後段 B
      if (indexOfPart === 0) partA = ` (` // 如果( 是在第一個位置 直接回傳 (
    } else {
      partA = target.data.question
    }

    // assignment values
    question.value = {
      _id: target.data._id,
      questionA: partA,
      questionB: partB ? partB : '', // 若問題中沒有 )直接回傳 空值
      questionTagArray: target.data.randomTagTestArray
    }
  }
}

onMounted(
  // 頁面載入後, 觸發api
  () => callTextTest()
)

defineComponent({
  components: { LayoutsPage },
})
defineExpose({
  handleAnswer,
  handleSubmit,
  changeTextTest,
})

</script>