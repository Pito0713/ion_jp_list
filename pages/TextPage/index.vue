<template lang="pug">
LayoutsPage
  div(class='relative flex justify-center items-center flex-col pb-16')
    Card(class='w-full flex-col mt-3' id='topUpElement')
      div(class='flex flex-row w-full' )
        input(:placeholder="$t('please_enter_word')" v-model="textInput" class="flex-1")
        button(class='mx-2 px-5 flex-6' @click='handleSearch') {{$t('search')}}
      div(class='flex w-full' )
        template(v-for='(item, index) in tagArray' :key='item')
          Tag(@click='handleTag(item, index)' :class='item.active && activeColor')
            a(:class='item.active && activeColor') {{$t(item.name)}}
    div(v-if='isTopUP' class='fixed w-10 h-10 bottom-20 right-6 md:right-1/2 md:translate-x-72' @click='handleScrollTo')
      ImageFC(src='/img/topup_arrow.png' :width='35' :height='20')
    div(class='fixed w-12 h-12 bottom-4 right-6 md:right-1/2 md:translate-x-72')
      NuxtLinkLocale(to="/TextPage/addTextPage")
        ImageFC(src='/img/add_text_circle.png' :width='50' :height='50')
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
            a(v-if='item.fileTranslate' class=' text-gray-500 text-xs font-medium mr-1 mt-3 ') {{item.fileTranslate}}
            div(@click='handleCopy(item.file)' class='active:opacity-20 mt-2')
              ImageFC(src='/img/item_copy.png' :width='16' :height='16' )
          div(class='w-3/12 flex flex-row justify-end items-center')
            NuxtLink(:to="{ path:localePath('/TextPage/editTextPage'), query: { value: JSON.stringify(item) } }" class='mr-3')
              ImageFC(src='/img/item_edit.png' :width='22.5' :height='22.5')
            div(@click='ShowTop(item)' class='active:opacity-40')
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
    div(class='w-full flex justify-center items-center mt-4 mr-6' id='infiniteScrollElement')
      template(v-if='List.data.length > 0 && hasMoreData') 
        ImageFC(src='/img/loading.svg' :width='50' :height='50')
      template(v-if='List.data.length > 0 && !hasMoreData') 
        a(class='font-medium text-lg text-gray-500' ) {{$t('reached_the_bottom')}}
</template>

<script setup>
import { ref, reactive, onMounted, watch, computed, defineComponent, onBeforeUnmount } from 'vue'
import LayoutsPage from '../../layouts/LayoutsPage.vue'

const init = ref(false) // 觸發初始化狀態與否
const textInput = ref(null) // 搜尋輸入空
const tagArray = ref([]) // TAG 詞語標注 ex: 動詞, 名詞... 
const activeColor = ref('bg-primary-color text-white') // 目標激活顏色
const List = reactive({
  data: {},
}); // for api responses data 


// variables for scroll
const hasMoreData = ref(false) // 是否有更多資料
const currentPageNumber = ref(1) // 起始頁面
const pageSize = ref(10) // api param 筆數, 固定為 10 筆為一單位
const totalCount = ref(0) // api responses data 目標搜尋資料總筆數
const isTopUP = ref(false) // 捲到置頂功能顯示

// use hook 
const { $api } = useNuxtApp();
const loadingIndicator = useLoadingIndicator();
const localePath = useLocalePath()
const { t } = useI18n()

// 搜尋/text api
const search = async () => {
  loadingIndicator.start() // loading 條觸發
  let submitData = {
    searchValue: textInput.value,
    tags: tagArray.value.filter(item => item.active).map(item => item.name),
    // 選擇篩選出有激活啟用的 tag 詞語資料
    pageNumber: currentPageNumber.value,
    pageSize: pageSize.value
  }

  const response = await $api.searchText(submitData)
  // success
  if (response.status === 1) {
    /*
      優先判斷式否由 search button 所觸發的 init 初始化頁面
      若 init 為 true, 將 response data 賦值到 List data 覆蓋前值資料
      
      後續 由頁面載入觸發或 infinite Scroll 捲動觸發 search
      先判斷 List.data 是否有資料
      若有前值 response data 與 List.data 兩者進行合併
      反之 List.data 直接賦值 response data
    */
    if (init.value) {
      List.data = response.data
    } else {
      if (List.data.length > 0) {
        // 擴展運算 將兩者合併
        List.data = [...List.data, ...response.data]
      } else List.data = response.data
    }
    totalCount.value = response.total
  } else {
    // response status failed 
    // clear the list 
    List.data = {}
  }

  init.value = false // call api 完成後,  結束初始化狀態
  loadingIndicator.finish() // loading 條完成
}

// 更新是否置頂/text api
const ShowTop = async (item) => {
  loadingIndicator.start() // loading 條觸發
  let submitData = {
    _id: item._id, // _id of the item
    isShowTop: !item.isShowTop // 是否置頂
  }

  const response = await $api.editTextShowTop(submitData)
  // success
  // 只有在 success 時才會觸發 search
  if (response.status === 1) {
    await handleSearch()
  }
  loadingIndicator.finish()  // loading 條完成
}

// 頁面初始化
/* 初始化啟動, 當前頁籤重置, 總筆數重置 list data 清空*/
const initReset = () => {
  init.value = true
  currentPageNumber.value = 1
  totalCount.value = 0
  List.data = {}
}

// 搜尋
const handleSearch = async (item, index) => {
  /* 初始化啟動, 當前頁籤重置, 總筆數重置*/
  initReset()
  // call api
  await search()
}

// 激活詞語 tag
const handleTag = async (item, index) => {
  // tag handle active status 
  tagArray.value[index].active = !tagArray.value[index].active
}

// 引用 Pinia 全域值 modalStore
// 公用彈窗導入
const store = modalStore();

/*
  透過 navigator.clipboard 舊瀏覽器可能不支援
  會返回 promise 若 error 進入 catch, 成功進入 resolved 
  不需使用 resolved 狀態, 直接用 await 代替
*/
const handleCopy = async (_text) => {
  try {
    await navigator.clipboard.writeText(_text);
    store.ModalShow('success_copy'); // 彈窗文字
  } catch (err) {
    store.ModalShow('fall_copy'); // 彈窗文字
    console.error('fall_copy:', err);
  }
}

// 觸發捲動置頂功能
const handleScrollTo = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth', // 平滑的捲動狀態
  });
}

// useFetch(search);

// 導入 Nuxt 全域狀態管理 useState
const infoState = useState('infoState')
onMounted(async () => {
  // 全域狀態 infoState 
  // 若有值 導入 基礎 tag 值
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

//  掛載 調用 API
let infiniteScroll = null
let topUp = null
onMounted(async () => {
  try {
    await search()

    /*  
      IntersectionObserver - 對於 所指派或指定的 element 
      若元素在 viewport 當前視窗時或離開視窗時，會觸發 entries 
      inject data {
        isIntersecting 判斷元素是否進入 viewport 視窗範圍
      }
    */
    // element
    const infiniteScrollElement = document.querySelector("#infiniteScrollElement")
    if (infiniteScrollElement) {
      infiniteScroll = new IntersectionObserver(async (entries) => {
        if (entries[0].isIntersecting) {
          currentPageNumber.value += 1 // 頁籤 + 1
          /* 
          當前若不是初始狀態, 而且總筆數數大於 10 時(第一次 call )
          才可再次調用 API 收尋下一筆*/
          if (!init.value && totalCount.value > 10) await search()

          // 當前頁面可容納的總筆數 若大於 api response 的 data
          if (currentPageNumber.value * pageSize.value >= totalCount.value) {
            // 沒有更多值
            hasMoreData.value = false;
          } else {
            // 有更多值
            hasMoreData.value = true;
          }
        }
      });
      // 開始監聽 
      infiniteScroll.observe(infiniteScrollElement);
    }

    // element
    const topUpElement = document.querySelector("#topUpElement")
    if (topUpElement) {
      topUp = new IntersectionObserver(async (entries) => {
        // 若元素離開 viewport 當前視窗時，顯示置頂功能
        if (!entries[0].isIntersecting) {
          isTopUP.value = true
        } else {
          isTopUP.value = false
        }
      });
      // 監聽
      topUp.observe(topUpElement);
    }
  } catch (err) {
    console.error("Failed to fetch text:", err)
  }
})


onBeforeUnmount(() => {
  // 解除 IntersectionObserver 監聽事件
  infiniteScroll.disconnect()
  topUp.disconnect()

  infiniteScroll = null; // 設為 null 防止內存洩漏
  topUp = null; // 設為 null 防止內存洩漏
})


defineComponent({
  components: { LayoutsPage },
})
defineExpose({
  localePath,
  search,
  handleTag,
  ShowTop,
  handleCopy,
  handleSearch,
  handleScrollTo,
  activeColor,
  tagArray,
  textInput,
  List,
})

</script>