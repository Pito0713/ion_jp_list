<template lang="pug">
Card(class='flex flex-col justify-start items-start w-full mt-3 mb-0 p-3')
  a(v-if="isEmptyData" class='text-xl my-2 font-medium') {{$t('please_add_at_least_4')}} 
  div(v-else class='flex flex-col justify-start items-start w-full')
    div(class='flex flex-row justify-between items-center w-full border-b-2 pb-2')
      a(v-if="!isEmptyData" class='ml-2 text-xl font-medium') {{$t('blank_appropriate_answer')}} 
    template(v-if='!loading')
      div(class='my-2 text-xl ml-1')
        a(v-if='!answer') {{ question.questionA }} &nbsp; &nbsp; &nbsp; {{ question.questionB }}
        a(v-else) {{ question.questionA }} &nbsp; {{answer}} &nbsp; {{ question.questionB }}
      template(v-for='(item, index) in question.questionTagArray' :key='item + index')
        div(class='ml-1 text-base my-1' @click='$emit("select-answer", item)')
          a(class='px-1 py-1' :class='[(selectedAnswerId === item._id && item?.correct ) && "font-extrabold bg-green-100 rounded", (selectedAnswerId === item._id && !item?.correct ) && "font-extrabold bg-slate-200 rounded" , item?.correct && "font-extrabold bg-green-100 rounded"]') {{index+1}} . {{item.file}}
    LoadingSkeleton(v-else)
    div(class='flex justify-end items-start w-full mb-0')
      template(v-if='!isSubmit')
        LoadingBN(
          :type="'submit'" 
          :text="'submit'"
          :disabled="!answer" 
          :customClass="'mt-1 text-base disabled:bg-slate-500'"
          @click='$emit("submit-answer")'
        )
      template(v-else)
        LoadingBN(
          :text="'next_question'"
          :customClass="'mt-1 text-base disabled:bg-slate-500'"
          @click='$emit("change-quiz")'
        )
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
  selectedAnswerId: String,
  isSubmit: Boolean,
  isEmptyData: Boolean,
})
defineEmits(['change-quiz', 'select-answer', 'submit-answer',])
</script>