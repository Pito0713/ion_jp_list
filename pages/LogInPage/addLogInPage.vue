<template lang="pug">
LayoutsPage(class='flex justify-center items-center h-svh flex-col')
  VeeForm(v-slot="{ handleSubmit }" :validation-schema="schema" as="div")
    form(@submit="handleSubmit($event, onSubmit)")
      Card(class='flex-col')
        VeeField(type="text" name="account" v-slot="{ field }")
          label 帳號
          input(type='text' placeholder='請輸入帳號' v-model="account" class='w-full ' v-bind="field")
          VeeErrorMessage(name="account" class='ml-2 w-full text-red-700 text-sm')
        div( class='w-full my-2' )
        VeeField(type="text" name="password" v-slot="{ field }")
          label 密碼
          input(type='text' placeholder='請輸入密碼' v-model="password" class='w-full ' v-bind="field")
          VeeErrorMessage(name="password" class='ml-2 w-full text-red-700 text-sm')
        div( class='w-full my-2' )
        VeeField(type="text" name="passwordAgain" v-slot="{ field }")
          label 重新輸入密碼
          input(type='text' placeholder='請重新輸入密碼' v-model="passwordAgain" class='w-full ' v-bind="field")
          VeeErrorMessage(name="passwordAgain" class='ml-2 w-full text-red-700 text-sm')
        div( class='w-full my-2' )
        button(type="submit" class='mt-4 w-80') 註冊
</template>

<script setup>
import { ref, reactive, onMounted, watch, computed, defineComponent, defineExpose } from 'vue'
import LayoutsPage from '../../layouts/LayoutsPage.vue'
import { authStore } from '../../store/authStore'
import * as yup from 'yup';
import ServiceApi from '~/service/service';

const auth = authStore()
const router = useRouter()

const schema = yup.object({
  account: yup.string().required('此欄位為必填'),
  password: yup.string().required('此欄位為必填'),
  passwordAgain: yup.string().oneOf([yup.ref('password'), null], '密碼不一致，請重新輸入').required('此欄位為必填')
});

const account = ref(null);
const password = ref(null);
const passwordAgain = ref(null);

const onSubmit = async () => {
  let submitData = {
    account: account.value,
    password: password.value,
  }
  let target = await ServiceApi.register(submitData)
  if (target?.status === "success") {
    router.push({ path: "/LogInPage" })
  }
}

defineComponent({
  components: { LayoutsPage },
})
defineExpose({
})

</script>