<template lang="pug">
LayoutsPage(class='flex h-vh flex-col')
  //- template(v-for='(item, index) in articles' :key='item.url')
  //-   Card(class='h-svh flex justify-start items-center w-full mt-2 mb-0' @click='windowOpen(item.url)')
  //-     ImageFC(:src="item.urlToImage" :width='125' :height='50' :fit="'fill'" class='mr-2 rounded-lg')
  //-     div(class='flex flex-col overflow-hidden')
  //-       a(class='mr-2 text-base ')  {{item.title}}
  //-       p(class='mr-2 text-sm truncate text-gray-500')  {{item.description}}
</template>

<script setup>
import { ref, reactive, onMounted, watch, computed, defineComponent } from 'vue'
// import axios from 'axios';
import LayoutsPage from '../../layouts/LayoutsPage.vue'
// const articles = ref([]);

// const windowOpen = async (e) => {
//   await navigateTo(e, {
//     open: {
//       target: '_blank',
//       windowFeatures: {
//         width: 500,
//         height: 500
//       }
//     }
//   })
// }

// const config = useRuntimeConfig()

// onMounted(
//   async () => {
//     const apiKey = config.public.NEW_API_KEY;
//     const domains = 'nhk.or.jp';
//     const today = new Date(); // 取得當前日期
//     today.setDate(today.getDate() - 1); // 設定為前一天
//     const formatDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

//     const url = `https://newsapi.org/v2/everything?domains=${domains}&from=${formatDate}&page=1&pageSize=10&apiKey=${apiKey}`;

//     try {
//       const { data } = await axios.get(url);
//       if (data.status == 'ok') articles.value = data.articles || [];
//       console.log(articles.value);
//     } catch (error) {
//       console.error('Error fetching top headlines:', error);
//     }
//   }
// )

defineComponent({
  components: { LayoutsPage },
})
defineExpose({
  // windowOpen
})

</script>