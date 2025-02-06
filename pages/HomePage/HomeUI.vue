<template lang="pug">
Card(class='flex flex-col justify-start items-start w-full mt-3 mb-0')
  div(class='flex flex-row justify-between items-center w-full border-b-2 pb-2')
    a(class='ml-2 text-xl font-medium') {{$t('blank_appropriate_answer')}} 
    button(class='ml-6 text-base bg-slate-500' @click='$emit("change-test")') {{$t('next_question')}}

  template(v-if='!loading')
    div(class='my-2 text-xl ml-1')
      a(v-if='!answer') {{ question.questionA }} &nbsp; &nbsp; &nbsp; {{ question.questionB }}
      a(v-else) {{ question.questionA }} &nbsp; {{answer}} &nbsp; {{ question.questionB }}
    
    template(v-for='(item, index) in question.questionTagArray' :key='item + index')
      div(class='ml-1 text-base my-1' @click='$emit("select-answer", item.file)')
        a(:class='item?.correct && "font-extrabold bg-slate-200 py-1 rounded"') {{index+1}} . {{item.file}}

  LoadingSkeleton(v-else)
  
  div(class='flex justify-between items-start w-full mt-2 mb-0')
    button(
      type="submit" 
      :disabled="isSubmit || !answer" 
      class='mt-3 text-base disabled:bg-slate-500' 
      @click='$emit("submit-answer")'
    ) {{$t('submit')}}

</template>

<script setup>
import LoadingSkeleton from './LoadingSkeleton.vue'
defineComponent({
  components: { LoadingSkeleton },
})
defineProps({
  question: Object,
  loading: Boolean,
  answer: String,
  isSubmit: Boolean,
})
defineEmits(['change-test', 'select-answer', 'submit-answer'])
</script>