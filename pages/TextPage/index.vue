<template lang="pug">
  LayoutsPage
    div(class='relative flex justify-center items-center flex-col custom-container pb-16')
      Card(class=' w-full flex-col' )
        div(class='flex flex-row w-full' )
          input(:placeholder="$t('please_enter_word')" v-model="textInput" class="flex-1")
          button(class='mx-2 px-5 flex-6' @click='search') {{$t('search')}}
        div(class='flex w-full' )
          template(v-for='(item, index) in tagArray' :key='item')
            Tag(@click='handleTag(item, index)' :class='item.active && activeColor')
              a(:class='item.active && activeColor') {{$t(item.name)}}
      div(class='fixed w-12 h-12 bg-slate-500 rounded-full bottom-4 right-4 md:right-1/2 md:translate-x-72 flex justify-center items-center')
        NuxtLinkLocale(to="/TextPage/addTextPage") +
      template(v-for='(item, index) in List.data' :key='item._id')
        Card(class='w-full my-2.5 flex-col' )
          template(v-if='item.tags.length > 0')
            div(class='flex flex-row')
              template(v-for='(item, index) in item.tags' :key='item')
                a(class='mr-2 mb-1 text-gray-400 text-sm') {{$t(item)}}
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
import Tag from '../../components/Tag.vue'
import LayoutsPage from '../../layouts/LayoutsPage.vue'
import ServiceApi from '~/service/service';
const textInput = ref(null)
const tagArray = ref([])
const activeColor = ref('bg-primary-color text-white')

const loadingIndicator = useLoadingIndicator();

const List = reactive({
  data: {},
});

const search = async () => {
  loadingIndicator.start()
  let submitData = {
    searchValue: textInput.value,
    tags: tagArray.value.filter(item => item.active).map(item => item.name),
  }
  const response = await ServiceApi.searchText(submitData)
  if (response.status === "success") List.data = response.data
  else List.data = {}
  loadingIndicator.finish()
}

const handleTag = async (item, index) => {
  tagArray.value[index].active = !tagArray.value[index].active
}

// 在組件掛載時調用 API
onMounted(async () => {
  try {
    await search()
  } catch (err) {
    console.error("Failed to fetch text:", err)
  }
})

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
  components: { Card, LayoutsPage, Tag },
})
defineExpose({
  search,
  handleTag,
  activeColor,
  tagArray,
  textInput,
  List,
})

</script>