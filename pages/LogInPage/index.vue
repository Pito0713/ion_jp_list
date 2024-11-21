<template lang="pug">
LayoutsPage(class='h-svh flex justify-center items-center flex-col ')
  VeeForm(v-slot="{ handleSubmit }" :validation-schema="schema" as="div")
    form(@submit="handleSubmit($event, onSubmit)")
      Card(class='flex-col')
        VeeField(type="text" name="account" v-slot="{ field }")
          label {{$t('account')}}
          input(type='text' :placeholder="$t('please_enter_account')" v-model="account" class='w-full ' v-bind="field")
          VeeErrorMessage(name="account" class='ml-2 w-full text-red-700 text-sm')
        div( class='w-full my-2' )
        VeeField(type="text" name="password" v-slot="{ field }")
          label {{$t('password')}}
          input(type='text' :placeholder="$t('please_enter_password')" v-model="password" class='w-full ' v-bind="field")
          VeeErrorMessage(name="password" class='ml-2 w-full text-red-700 text-sm')
        button(type="submit" class='mt-4 w-80') {{$t('login')}}
  div( class='mt-4 w-80 text-end') 
    // NuxtLink(to="/LogInPage/addLogInPage") {{$t('account_register')}}

 
</template>

<script setup>
import { ref, reactive, onMounted, watch, computed, defineComponent, defineExpose } from 'vue'
import LayoutsPage from '../../layouts/LayoutsPage.vue'
import { authStore } from '../../store/authStore'
import * as yup from 'yup';
import ServiceApi from '~/service/service';

const auth = authStore()
const router = useRouter()
const { t } = useI18n()

const schema = yup.object({
  account: yup.string().required(t('required')),
  password: yup.string().required(t('required')),
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
      {
        maxAge: 60 * 60 * 24 * 7 // 7 天
      })
    userToken.value = target?.data?.token
    let userInfo = useCookie('userInfo',
      {
        maxAge: 60 * 60 * 24 * 7 // 7 天
      })
    userInfo.value = JSON.stringify(target?.data)
    auth.setAuth(true)
    router.push({ path: "/" })
  }
}

defineComponent({
  components: { LayoutsPage },
})
defineExpose({
  schema,
  onSubmit
})

</script>