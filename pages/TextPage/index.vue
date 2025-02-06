<template lang="pug">
LayoutsPage(class='relative w-full' )
  Card(class='custom-container flex-col mt-3 fixed top-14 left-15 z-40')
    div(class='flex flex-row w-full' )
      input(:placeholder="$t('please_enter_word')" v-model="textInput" class="flex-1")
      button(class='mx-2 px-5 flex-6' @click='handleInitSearch') {{$t('search')}}
    div(class='flex w-full' )
      template(v-for='(item, index) in tagArray' :key='item')
        Tag(@click='handleTag(item, index)' :class='item.active && activeColor')
          a(:class='item.active && activeColor') {{$t(item.name)}}
  div(class='relative flex justify-center items-center flex-col pb-16' id='scroll-container')
    div(class='w-full flex h-32 mb-2' id='topUpElement')
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
            a(v-if='item.fileHiragana' class=' text-gray-500 text-xs font-medium mr-1 mt-3 ') {{item.fileHiragana}}
            a(v-if='item.fileTranslate' class=' text-base font-medium ml-3 mr-1 mt-2 ') {{item.fileTranslate}}
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
      template(v-if='List.data.length > 0 && !hasMoreData') 
        a(class='font-medium text-lg text-gray-500' ) {{$t('reached_the_bottom')}}
</template>

<script setup>
import { ref, reactive, onMounted, watch, computed, defineComponent, onBeforeUnmount } from 'vue'
import LayoutsPage from '../../layouts/LayoutsPage.vue'

const init = ref(true) // 觸發初始化狀態與否
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
const isTopUP = ref(false) // 是否顯示置頂功能
const isCallTopUP = ref(false) // 是否觸發置頂功能
const isPrev = ref(false); // 是否回滾觸發上一頁功能

// use hook 
const { $api } = useNuxtApp();
const loadingIndicator = useLoadingIndicator();
const localePath = useLocalePath()
const { t } = useI18n()

// 初始化搜尋 /text api
const initSearch = async () => {
  loadingIndicator.start() // loading 條觸發
  let submitData = {
    searchValue: textInput.value,
    tags: tagArray.value.filter(item => item.active).map(item => item.name), // 選擇篩選出有激活啟用的 tag 詞語資料
    pageNumber: currentPageNumber.value,
    pageSize: pageSize.value
  }

  const response = await $api.searchText(submitData)
  // success
  if (response.status === 1) {
    // initSearch 所觸發的 init 初始化頁面
    // response data 賦值到 List data 覆蓋前值資料
    List.data = response.data
    totalCount.value = response.total
  } else {
    // response status failed 
    // clear the list 
    List.data = {}
  }

  init.value = false // call api 完成後,  結束初始化狀態
  loadingIndicator.finish() // loading 條完成
}

// 下拉更多搜尋 /text api
const searchMoreData = async () => {
  loadingIndicator.start() // loading 條觸發
  let submitData = {
    searchValue: textInput.value,
    tags: tagArray.value.filter(item => item.active).map(item => item.name), // 選擇篩選出有激活啟用的 tag 詞語資料
    pageNumber: currentPageNumber.value,
    pageSize: pageSize.value
  }

  const response = await $api.searchText(submitData)
  // success
  if (response.status === 1) {
    /*      
      後續 由頁面載入觸發或 infinite Scroll 捲動觸發 searchMoreData
      先判斷 List.data 是否有資料
      若 List.data 有值, 將 response data 與 List.data 兩者進行擴展合併,
      確保 List.data 長度不超過 pageSize * 2 的資料量
      splice() 刪除超過的資料量由開頭 0 到扣掉目前 List.data 長度 pageSize * 2 的多餘資料
      ex: List.data.length = 30 , pageSize.value = 10
          List.data.splice(0, 30 - 10 * 2) = List.data.splice(0, 10)
    */

    if (List.data.length > 0) {
      List.data = [...List.data, ...response.data]  // 擴展運算 將兩者合併
      if (List.data.length > pageSize.value * 2) {
        List.data.splice(0, List.data.length - pageSize.value * 2);
      }
    }
  } else {
    // response status failed 
    // clear the list 
    List.data = {}
  }

  isPrev.value = false; // 是否回滾造成的狀態
  loadingIndicator.finish() // loading 條完成
}

// 搜尋/text api
const searchPrevData = async () => {
  loadingIndicator.start() // loading 條觸發
  let submitData = {
    searchValue: textInput.value,
    tags: tagArray.value.filter(item => item.active).map(item => item.name), // 選擇篩選出有激活啟用的 tag 詞語資料
    pageNumber: currentPageNumber.value,
    pageSize: pageSize.value
  }

  const response = await $api.searchText(submitData)
  // success
  if (response.status === 1) {

    if (List.data.length > 0) {
      // unshift() 方法會添加一個或多個元素至陣列的開頭，並且回傳陣列的新長度。
      List.data.unshift(...response.data)
      await nextTick(); // 等待 DOM 更新
    }

    /*
      插入 response.data 資料後, 等待 DOM 更新後
      previousScrollHeight 這邊為插入 response.data 資料後的 scrollHeight
      然後再次刪除多餘的資料量 確保 List.data 長度不超過 pageSize * 2 的資料量
      -- 在等待 DOM 更新後 --
      在宣告一個 addedHeight 這邊為刪除多餘的資料量後的 scrollHeight
      因為是 unshift() 方法, 所以插入資料後會在最上方,
      所以 previousScrollHeight - addedHeight 這裏為 response.data 插入資料後的高度差
      然後 window.scrollTo 調整滾動條位置,  
    */
    const previousScrollHeight = document.getElementById('scroll-container').scrollHeight;
    if (List.data.length > pageSize.value * 2) {
      List.data.splice(pageSize.value * 2, pageSize.value);
    }
    await nextTick(); // 等待 DOM 更新
    const addedHeight = document.getElementById('scroll-container').scrollHeight;
    // 插入資料後調整滾動條位置
    window.scrollTo({
      top: previousScrollHeight - addedHeight,
      behavior: 'auto', // 平滑的捲動狀態
    });
  } else {
    // response status failed 
    // clear the list 
    List.data = {}
  }

  isPrev.value = true; // 是否回滾造成的狀態
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
  if (response.status === 1) {
    await handleInitSearch()
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
  isPrev.value = false
}

// 搜尋
const handleInitSearch = async (item, index) => {
  /* 初始化啟動, 當前頁籤重置, 總筆數重置*/
  initReset()
  await initSearch()

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
  handleCopy 透過 navigator.clipboard 舊瀏覽器可能不支援
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
  isCallTopUP.value = true // 觸發置頂功能
  window.scrollTo({
    top: 0,
    behavior: 'smooth', // 平滑的捲動狀態
  });
}

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
    await initSearch()
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
        // 底部無限捲動的 div 若進入 viewport 視窗
        console.log(entries[0].isIntersecting, entries[0].isIntersecting)
        if (entries[0].isIntersecting) {

          // 置頂功能觸發時, 切換資料時會觸發短暫的 infiniteScrollElement 進入視窗內
          // 這邊做判斷防止再次觸發無限捲動
          if (isCallTopUP.value) {
            isCallTopUP.value = false // 置頂功能關閉
            isTopUP.value = false // 置頂功能隱藏
            return
          }

          /* 如果這邊是回滾後 再往下拉 
          // 會造成前後值資料插在最前端若只+1 會造成重複 這裡進行判斷*/
          if (isPrev.value) currentPageNumber.value += 2 // 頁籤 + 1
          else currentPageNumber.value += 1  // 頁籤 + 1

          /* 當前若不是初始狀態, 而且總筆數數大於 10 時(第一次 call )
          // 才可再次調用 API 收尋下一筆*/
          if (!init.value && totalCount.value > 10) await searchMoreData()

          // 當前頁面可容納的總筆數  若大於 api response 的 totalCount.value
          if (currentPageNumber.value * pageSize.value >= totalCount.value) {
            hasMoreData.value = false; // 沒有更多值
          } else {
            hasMoreData.value = true; // 有更多值
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
          if (currentPageNumber.value === 1) return
          if (currentPageNumber.value > 1) currentPageNumber.value -= 1 // 頁籤 + 1
          /* 如果是觸發置頂功能 isCallTopUP , 在window scroll 置頂時重新拿取資料*/
          if (isCallTopUP.value) {
            handleInitSearch()
            return
          }
          if (!init.value && totalCount.value > 10) await searchPrevData()
          /* 當前若不是初始狀態, 而且總筆數數大於 10 時(第一次 call )
          // 才可再次調用 API 收尋下一筆*/
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
  initSearch,
  handleTag,
  ShowTop,
  handleCopy,
  handleInitSearch,
  handleScrollTo,
  activeColor,
  tagArray,
  textInput,
  List,
})

</script>