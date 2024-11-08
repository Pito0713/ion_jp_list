<template lang="pug">
LayoutsPage(class='h-svh flex-col')
  VeeForm(v-slot="{ handleSubmit }" :validation-schema="schema" as="div")
    form(@submit="handleSubmit($event, onSubmit)")
      Card
        VeeField(type="text" name="account" v-slot="{ field }")
          label 帳號
          input(type='text' placeholder='請輸入' v-model="account" class='w-full ' v-bind="field")
          VeeErrorMessage(name="account" class='ml-2 w-full text-red-700 text-sm')
        div( class='w-full my-2' )
        VeeField(type="text" name="password" v-slot="{ field }")
          label 密碼
          input(type='text' placeholder='請輸入' v-model="password" class='w-full ' v-bind="field")
          VeeErrorMessage(name="password" class='ml-2 w-full text-red-700 text-sm')
        button(type="submit" class='mt-4 w-80') 登入
  div( class='mt-4 w-80 text-end') 
    NuxtLink(to="/LogInPage/addLogInPage") 註冊帳號
</template>

<script setup>
import { ref, reactive, onMounted, watch, computed, defineComponent, defineExpose } from 'vue'
import Card from '../../components/Card.vue'
import LayoutsPage from '../../layouts/LayoutsPage.vue'
import { authStore } from '../../store/authStore'
import * as yup from 'yup';
import ServiceApi from '~/service/service';

const auth = authStore()
const router = useRouter()

const schema = yup.object({
  account: yup.string().required('此欄位為必填'),
  password: yup.string().required('此欄位為必填')
});

const account = ref(null);
const password = ref(null);

const onSubmit = async () => {
  let submitData = {
    account: account.value,
    password: password.value,
  }
  let target = await ServiceApi.login(submitData)
  if (target?.status === "success") {
    let userToken = useCookie('userToken',
      target?.data?.user?.token,
      {
        maxAge: 60 * 60 * 24 * 7 // 7 天
      })
    userToken.value = target?.data?.user?.token
    await auth.setAuth(true)
    router.push({ path: "/" })
  }

}

defineComponent({
  components: { Card, LayoutsPage },
})
defineExpose({
})

</script>