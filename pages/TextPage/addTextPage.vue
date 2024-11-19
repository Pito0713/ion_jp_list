<template lang="pug">
  LayoutsPage
    VeeForm(v-slot="{ handleSubmit }" :validation-schema="schema" as="div")
      form(@submit="handleSubmit($event, onSubmit)" class='w-full flex-1')
        div(class='flex justify-center items-center flex-col custom-container')
          div(class='w-full flex-1')
            Card(class='flex justify-center items-center flex-col')
              div(class='flex flex-col w-full')
                a(class='w-full text-xl mb-2 font-bold') 單字
                VeeField(name="text" type="text" v-slot="{ field }")
                  input(placeholder='請輸入日文' v-model="textInput" class='mx-2.5 w-full' v-bind="field")
                VeeErrorMessage(name="text" class='ml-2.5 w-full text-red-700 text-sm')
              div(class='flex flex-row w-full ml-2')
                template(v-for='(item, index) in tagArray' :key='item')
                  Tag(@click='handleTag(item, index)' :class='item.active && activeColor')
                    a(:class='item.active && activeColor') {{item.name}}
            Card(class='mt-2.5 flex-col')
              a(class='w-full text-xl font-bold') 範句/翻譯(選填)
              textarea(placeholder='可輸入平假名或片假名或翻譯(選填)' v-model="transInput" class='my-2.5 w-full')
              div(class='w-full flex flex-row mb-2')
                div(class='flex justify-center items-center') 
                  a(class='text-xl font-bold') 補充單字
                div(class='ml-2 w-5 h-5 text-xl rounded-full	border-2 border-current flex justify-center items-center')
                  a(@click='addInput' class='text-xl font-bold') +
              div(v-for='(input, index) in inputs' :key='index' class='flex justify-center items-center flex-row')
                div(class="grid grid-cols-8 gap-4 mb-2.5")
                  input(type='text', v-model='input.jpValue' placeholder='請輸入日文' class="col-span-3")
                  input(type='text', v-model='input.chValue' placeholder='請輸入翻譯' class="col-span-3")
                  div(@click='remove(index)'  class='text-center col-span-2 custom-button') 刪除
            
            
            Card(class='mt-2.5 flex-col ')
              a(class='w-full  mb-2 font-bold text-gray-500') 轉出樣本
              a(class='w-full text-xl font-medium mb-2') {{textInput}}
              a(class='text-textSecond text-gray-500') {{transInput}}
              template(v-if='inputs?.length > 0')
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

const textInput = ref(null);
const transInput = ref(null);
const inputs = ref([]);
const tagArray = ref([])
const activeColor = ref('bg-primary-color text-white')
const router = useRouter()

const addInput = () => {
  inputs.value.push({ jpValue: '', chValue: '' })
}
const remove = (index) => {
  inputs.value.splice(index, 1);
}
const handleTag = async (item, index) => {
  tagArray.value[index].active = !tagArray.value[index].active
}

const schema = yup.object({
  text: yup.string().required('此欄位為必填')
});

const onSubmit = async () => {
  let submitData = {
    file: textInput.value,
    translation: transInput.value,
    inputs: JSON.stringify(inputs.value),
    tags: tagArray.value.filter(item => item.active).map(item => item.name),
  }

  let target = await ServiceApi.addText(submitData)
  if (target?.status === "success") {
    router.push({ path: "/Textpage" })
  }
}

// tag 調用, 未加載 i18
onMounted(async () => {
  try {
    let userInfo = useCookie('userInfo')
    let userObject = JSON.parse(JSON.stringify(userInfo.value));
    if (userObject?.tag?.length > 0) {
      tagArray.value = userObject.tag.map(item => {
        // ['verb', 'noun', 'adjective', 'particle']
        return { name: item, active: false }
      });
    }
  } catch (err) {
    console.error("Failed to fetch text:", err)
  }
})

defineComponent({
  components: { Card, LayoutsPage },
})
defineExpose({
  textInput,
  transInput,
  remove,
  addInput,
  onSubmit,
  schema
})

</script>