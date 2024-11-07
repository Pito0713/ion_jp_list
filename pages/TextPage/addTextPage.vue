<template lang="pug">
  LayoutsPage
    VeeForm(v-slot="{ handleSubmit }" :validation-schema="schema" as="div")
      form(@submit="handleSubmit($event, onSubmit)")
        div(class='flex justify-center items-center flex-col custom-container')
          div(class='w-full')
            Card(class='flex justify-center items-center flex-col')
              a(class='w-full text-xl mb-2 font-bold') 原文
              VeeField(name="text" type="text" v-slot="{ field }")
                textarea(placeholder='請輸入日文' v-model="fileInput" class='mx-2.5 w-full' v-bind="field")
              VeeErrorMessage(name="text" class='ml-2.5 w-full text-red-700 text-sm')
              a(class='w-full text-base mt-2 font-bold') 備註(選填)
              textarea(placeholder='可輸入平假名或片假名或翻譯(選填)' v-model="transInput" class='mt-2.5 w-full')
            
            Card(class='w-full mt-2.5')
              a(class='w-full text-xl mb-2 font-bold	') 單字
              div(v-for='(input, index) in inputs' :key='index' class='flex justify-center items-center flex-row')
                div(class="grid grid-cols-8 gap-4 mb-2.5")
                  input(type='text', v-model='input.jpValue' placeholder='請輸入日文' class="col-span-3")
                  input(type='text', v-model='input.chValue' placeholder='請輸入翻譯' class="col-span-3")
                  div(@click='remove(index)'  class='text-center col-span-2 custom-button') 刪除
              div(@click='addInput' class='custom-button') 新增
            Card(class='w-full mt-2.5')
              a(class='w-full  mb-2 font-bold text-gray-500') 轉出樣本
              a(class='w-full text-xl font-medium mb-2') {{fileInput}}
              a(class='text-textSecond text-gray-500') {{transInput}}
              div(class='border-b-2 my-2.5' )
              div(v-for='(input, index) in inputs' :key='index')
                div
                  a(class='mr-2 font-medium text-gray-800 text-lg') {{input.jpValue}}
                  a(class='text-textSecond text-gray-500 text-sm') {{input.chValue}}
          button(type="submit" class='mt-4 w-80') 提交
  </template>

<script setup>
import { ref, reactive, onMounted, watch, computed, defineComponent, defineExpose } from 'vue'
import Card from '../../components/Card.vue'
import LayoutsPage from '../../layouts/LayoutsPage.vue'
import ServiceApi from '~/service/service';
import * as yup from 'yup';

const fileInput = ref(null);
const transInput = ref(null);
const inputs = ref([{ jpValue: '', chValue: '' }]);
const submitArea = ref(null);
const router = useRouter()

const submit = () => {
  submitArea.value = true
}
const addInput = () => {
  inputs.value.push({ jpValue: '', chValue: '' })
}
const remove = (index) => {
  inputs.value.splice(index, 1);
}

const schema = yup.object({
  text: yup.string().required('此欄位為必填')
});

const onSubmit = async () => {
  let submitData = {
    file: fileInput.value,
    translation: transInput.value,
    inputs: JSON.stringify(inputs.value),
  }

  let target = await ServiceApi.addText(submitData)
  const route = useRoute()
  if (target?.status === "success") {
    router.push({ path: "/Textpage" })
  }
}

defineComponent({
  components: { Card, LayoutsPage },
})
defineExpose({
  fileInput,
  transInput,
  remove,
  addInput,
  submit
})

</script>