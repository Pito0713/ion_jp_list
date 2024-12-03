<template lang="pug">
LayoutsPage
  div(class='relative flex justify-center items-center flex-col pb-16')
    Card(class='w-full flex-col mt-3' )
      div(class='flex flex-row w-full' )
        input(:placeholder="$t('please_enter_word')" v-model="textInput" class="flex-1")
        button(class='mx-2 px-5 flex-6' @click='search') {{$t('search')}}
      div(class='flex w-full' )
        template(v-for='(item, index) in tagArray' :key='item')
          Tag(@click='handleTag(item, index)' :class='item.active && activeColor')
            a(:class='item.active && activeColor') {{$t(item.name)}}
    div(class='fixed w-12 h-12 bottom-4 right-4 md:right-1/2 md:translate-x-72')
      NuxtLinkLocale(to="/TextPage/addTextPage")
        ImageFC(src='/img/add_circle.png' :width='50' :height='50')
    template(v-for='(item, index) in List.data' :key='item._id')
      Card(class='w-full my-1 flex-col' )
        div(class='w-full')
          template(v-if='item.tags.length > 0')
            div(class='flex flex-row')
              template(v-for='(item, index) in item.tags' :key='item')
                a(class='mr-2 mb-1 text-gray-400 text-sm') {{$t(item)}}
        div(class='w-full flex flex-row ')
          div(class='w-9/12 flex flex-row justify-start items-center mb-1')
            a(class=' text-2xl font-medium mr-2 ') {{item.file}}
            div(@click='handleCopy(item.file)' class='active:opacity-40 mt-1')
              ImageFC(src='/img/item_copy.png' :width='16' :height='16' )
          div(class='w-3/12 flex flex-row justify-end items-center')
            NuxtLink(:to="{ path:localePath('/TextPage/editTextPage'), query: { value: JSON.stringify(item) } }" class='mr-3')
              ImageFC(src='/img/item_edit.png' :width='22.5' :height='22.5')
            div(@click='handleIsShowTop(item)' class='active:opacity-40')
              ImageFC(v-if='item.isShowTop' src='/img/heart.png' :width='22.5' :height='22.5' )
              ImageFC(v-else src='/img/heart_line.png' :width='22.5' :height='22.5')
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
import { ref, reactive, onMounted, watch, computed, defineComponent } from 'vue'
import LayoutsPage from '../../layouts/LayoutsPage.vue'
const textInput = ref(null)
const tagArray = ref([])
const activeColor = ref('bg-primary-color text-white')
const List = reactive({
  data: {},
});

const { $api } = useNuxtApp();
const loadingIndicator = useLoadingIndicator();
const localePath = useLocalePath()

const search = async () => {
  loadingIndicator.start()
  let submitData = {
    searchValue: textInput.value,
    tags: tagArray.value.filter(item => item.active).map(item => item.name),
  }
  const response = await $api.searchText(submitData)
  if (response.status === 1) List.data = response.data
  else List.data = {}
  loadingIndicator.finish()
}

const handleTag = async (item, index) => {
  tagArray.value[index].active = !tagArray.value[index].active
}

const handleIsShowTop = async (item) => {
  loadingIndicator.start()
  let submitData = {
    _id: item._id,
    isShowTop: !item.isShowTop
  }

  const response = await $api.editTextShowTop(submitData)
  if (response.status === 1) {
    await search()
  }
  loadingIndicator.finish()
}
const handleCopy = async (_text) => {
  /*
  透過 navigator.clipboard 舊瀏覽器可能不支援
  會返回 promise 若 error 進入 catch, 成功進入 resolved 
  不需使用 resolved 狀態, 直接用 await 代替
  */
  try {
    await navigator.clipboard.writeText(_text);
  } catch (err) {
    console.error('複製失敗:', err);
  }
}

// useFetch(search);

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

// // 在組件掛載時調用 API
onMounted(async () => {
  try {
    await search()
  } catch (err) {
    console.error("Failed to fetch text:", err)
  }
})

defineComponent({
  components: { LayoutsPage },
})
defineExpose({
  localePath,
  search,
  handleTag,
  handleIsShowTop,
  handleCopy,
  activeColor,
  tagArray,
  textInput,
  List,
})

</script>