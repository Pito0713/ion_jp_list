<template lang="pug">
LayoutsPage(class='h-svh')
  button(@click='logOut' class='mt-4 w-80') 登出
</template>

<script setup>
import { ref, reactive, onMounted, watch, computed, defineComponent, defineExpose } from 'vue'
import Card from '../../components/Card.vue'
import LayoutsPage from '../../layouts/LayoutsPage.vue'
import { authStore } from '../../store/authStore'
const auth = authStore()
let userToken = useCookie('userToken')?.value
const router = useRouter()

const logOut = () => {
  auth.setAuth(false)
  userToken = null
  router.push({ path: "/LogInPage" })
}
defineComponent({
  components: { Card, LayoutsPage },
})
defineExpose({
  logOut
})

</script>