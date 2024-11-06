<template lang="pug">
  LayoutsPage
    div(class='flex justify-center items-center flex-col custom-container')
      div(class='w-full')
        Card(class='flex justify-center items-center flex-col')
          textarea(placeholder='here' v-model="fileInput" class='mx-2.5 w-full')
          input(placeholder='here' v-model="transInput" class='mt-2.5 w-full')
          template(v-if='!submitArea')
            button(@click='submit'  class='mt-2.5 w-full') submit
        template(v-if='submitArea')
          Card
            div(v-for='(input, index) in inputs' :key='index')
              div
                input(type='text', v-model='input.jpValue' placeholder='here' class='mt-2.5 w-1/3')
                input(type='text', v-model='input.chValue' placeholder='here' class='mt-2.5 ml-2.5 w-1/3')
                button(@click='remove'  class='ml-2.5 w-1/5') delete
            button(@click='addInput' class='mt-2.5') add input
      
      template(v-if='submitArea')
        Card(class='w-full mt-2.5')
          a(class='w-full text-2xl') {{fileInput}}
          a(class='text-textSecond') {{transInput}}
          div(class='border-b-2 my-2.5' )
          div(v-for='(input, index) in inputs' :key='index')
            div
              a(class='mr-4') {{input.jpValue}}
              a(class='text-textSecond') {{input.chValue}}
      template(v-if='submitArea')
        button(@click='call'  class='mt-4 w-80') call
  </template>

<script setup>
import { ref, reactive, onMounted, watch, computed, defineComponent, defineExpose } from 'vue'
import Card from '../../components/Card.vue'
import LayoutsPage from '../../layouts/LayoutsPage.vue'
import ServiceApi from '~/service/service';

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



const call = async () => {
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
  call,
  submit
})

</script>