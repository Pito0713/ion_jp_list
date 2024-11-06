<template lang="pug">
  LayoutsPage
    div(class='relative flex justify-center items-center flex-col custom-container')
      div(class='fixed w-12 h-12 bg-slate-500 rounded-full bottom-4 right-4 md:right-1/2 md:translate-x-72 flex justify-center items-center')
        NuxtLink(to="/TextPage/addTextPage") +
      template(v-for='(item, index) in List.data' :key='item._id')
        Card(class='w-full my-2.5' )
          a(class='w-full text-2xl') {{item.file}}
          a(class='text-textSecond') {{item.translation}}
          div(class='border-b-2 mb-2.5' )
          div(v-for='(input, index) in item.inputs' :key='index')
            div
              a(class='mr-4') {{input.jpValue}}
              a(class='text-textSecond') {{input.chValue}}
</template>

<script setup>
import { ref, reactive, onMounted, watch, computed, defineComponent, defineExpose } from 'vue'
import Card from '../../components/Card.vue'
import LayoutsPage from '../../layouts/LayoutsPage.vue'
import ServiceApi from '~/service/service';
const List = reactive({
  data: {},
});
import { useAsyncData } from 'nuxt/app';

// 在組件掛載時調用 API
onMounted(async () => {
  try {
    const response = await ServiceApi.getText() // 假設 `/api/getText` 是 API 路徑
    List.data = response.data
    console.log(response)
  } catch (err) {
    console.error("Failed to fetch text:", err)
  }
})

defineComponent({
  components: { Card, LayoutsPage },
})
defineExpose({
})

</script>