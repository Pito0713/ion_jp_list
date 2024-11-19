<template lang="pug">
  LayoutsPage
    div(class='relative flex justify-center items-center flex-col custom-container pb-16')
      Card(class=' flex-row w-full my-2.5' )
        input(placeholder='請輸入日文' v-model="textInput" class='flex-1')
        button(class='mx-2 px-5 flex-6' @click='search') 搜尋
      div(class='fixed w-12 h-12 bg-slate-500 rounded-full bottom-4 right-4 md:right-1/2 md:translate-x-72 flex justify-center items-center')
        NuxtLink(to="/TextPage/addTextPage") +
      template(v-for='(item, index) in List.data' :key='item._id')
        Card(class='w-full my-2.5 flex-col' )
          a(class='w-full text-xl font-medium mb-1') {{item.file}}
          a(class='text-textSecond text-gray-500 text-l') {{item.translation}}
          template(v-if='item.inputs.length > 0')
            div(class='border-b-2 my-2.5' )
          template(v-if='item.inputs.length > 0')
            div(v-for='(input, index) in item.inputs' :key='index')
              div
                a(class='mr-2 font-medium text-lg') {{input.jpValue}}
                a(class='text-textSecond text-gray-500 text-sm') {{input.chValue}}
</template>

<script setup>
import { ref, reactive, onMounted, watch, computed, defineComponent, defineExpose } from 'vue'
import Card from '../../components/Card.vue'
import LayoutsPage from '../../layouts/LayoutsPage.vue'
import ServiceApi from '~/service/service';
const textInput = ref(null)

const loadingIndicator = useLoadingIndicator();

const List = reactive({
  data: {},
});

const search = async () => {
  loadingIndicator.start()
  let submitData = {
    searchValue: textInput.value,
  }
  const response = await ServiceApi.searchText(submitData)
  if (response.status === "success") List.data = response.data
  else List.data = {}
  loadingIndicator.finish()
}

// 在組件掛載時調用 API
onMounted(async () => {
  try {
    await search()
  } catch (err) {
    console.error("Failed to fetch text:", err)
  }
})

defineComponent({
  components: { Card, LayoutsPage },
})
defineExpose({
  search
})

</script>