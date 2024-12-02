<template lang="pug">
  LayoutsPage
    VeeForm(v-slot="{ handleSubmit }" :validation-schema="schema" as="div")
      form(@submit="handleSubmit($event, onSubmit)" class='w-full flex-1')
        div(class='flex justify-center items-center flex-col custom-container')
          div(class='w-full flex-1')
            Card(class='flex justify-center items-center flex-col mt-4')
              div(class='flex flex-col w-full')
                a(class='text-xl mb-2 font-bold') {{$t('single_word')}}
                VeeField(name="text" type="text" v-slot="{ field }")
                  input(:placeholder="$t('please_enter_word')" v-model="textInput" class=' w-full' v-bind="field")
                VeeErrorMessage(name="text" class='ml-2.5 w-full text-red-700 text-sm')
              div(class='flex flex-row w-full ml-2')
                template(v-for='(item, index) in tagArray' :key='item')
                  Tag(@click='handleTag(item, index)' :class='item.active && activeColor')
                    a(:class='item.active && activeColor') {{$t(item.name)}}
            Card(class='mt-2.5 flex-col')
              a(class='w-full text-xl font-bold') {{`${$t('sentences')} / ${$t('translate')}(${$t('optional')})`}}
              textarea(:placeholder="`${$t('please_enter')}${$t('sentences')} / ${$t('translate')}(${$t('optional')})`" v-model="transInput" class='my-2.5 w-full')
              div(class='w-full flex flex-row mb-2' @click='addInput')
                div(class='flex justify-center items-center') 
                  a(class='text-xl font-bold') {{$t('supple_words')}}
                div(class='ml-2 flex justify-center items-center')
                  ImageFC(src='/img/addCircleLine.png' :width='20' :height='20')
              div(v-for='(input, index) in inputs' :key='index' class='flex justify-center items-center flex-row')
                div(class="grid grid-cols-8 gap-4 mb-2.5")
                  input(type='text', v-model='input.jpValue' :placeholder="$t('please_enter_word')" class="col-span-3")
                  input(type='text', v-model='input.chValue' :placeholder="$t('please_enter_translate')" class="col-span-3")
                  div(@click='remove(index)'  class='text-center col-span-2 custom-button') {{$t('delete')}}
            Card(class='mt-2.5 flex-col ')
              a(class='w-full  mb-2 font-bold text-gray-500') {{$t('sample')}}
              a(class='w-full text-xl font-medium mb-2') {{textInput}}
              a(class='text-textSecond text-gray-500') {{transInput}}
              template(v-if='inputs?.length > 0')
                div(class='border-b-2 my-2.5' )
              div(v-for='(input, index) in inputs' :key='index')
                div
                  a(class='mr-2 font-medium text-gray-800 text-lg') {{input.jpValue}}
                  a(class='text-textSecond text-gray-500 text-sm') {{input.chValue}}
          button(type="submit" class='mt-4 w-80') {{$t('submit')}}
  </template>

<script setup>
import { ref, reactive, onMounted, watch, computed, defineComponent } from 'vue'
import LayoutsPage from '../../layouts/LayoutsPage.vue'
import * as yup from 'yup';
const { $api } = useNuxtApp();

const textInput = ref(null);
const transInput = ref(null);
const inputs = ref([]);
const tagArray = ref([])
const activeColor = ref('bg-primary-color text-white')
const router = useRouter()
const { t } = useI18n()

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
  text: yup.string().required(t('required'))
});

const onSubmit = async () => {
  let submitData = {
    file: textInput.value,
    translation: transInput.value,
    inputs: JSON.stringify(inputs.value),
    tags: tagArray.value.filter(item => item.active).map(item => item.name),
  }

  let target = await $api.addText(submitData)
  if (target?.status === 1) {
    router.push({ path: "/TextPage" })
  }
}

// tag 調用, 未加載 i18
const infoState = useState('infoState')
onMounted(async () => {
  try {
    if (infoState?.value?.info) {
      if (infoState?.value?.info?.tags?.length > 0) {
        tagArray.value = infoState?.value?.info?.tags.map(item => {
          // ['verb', 'noun', 'adjective', 'particle']
          return { name: item, active: false }
        });
      }
    }
  } catch (err) {
    console.error("Failed to fetch text:", err)
  }
})

defineComponent({
  components: { LayoutsPage },
})
defineExpose({
  textInput,
  transInput,
  remove,
  addInput,
  onSubmit,
  schema,
  tagArray,
  activeColor,
  inputs,
  handleTag
})

</script>