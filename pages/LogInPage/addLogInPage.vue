<template lang="pug">
LayoutsPage(class='flex justify-center items-center h-vh flex-col mt-40')
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
        div( class='w-full my-2' )
        VeeField(type="text" name="passwordAgain" v-slot="{ field }")
          label {{$t('please_enter_password_again')}}
          input(type='text' :placeholder="$t('please_enter_password_again')" v-model="passwordAgain" class='w-full ' v-bind="field")
          VeeErrorMessage(name="passwordAgain" class='ml-2 w-full text-red-700 text-sm')
        div( class='w-full my-2' )
        button(type="submit" class='mt-4 w-80') {{$t('register')}}
</template>

<script setup>
import { ref, reactive, onMounted, watch, computed, defineComponent } from 'vue'
import LayoutsPage from '../../layouts/LayoutsPage.vue'
import * as yup from 'yup';
const { $api } = useNuxtApp();

const { t } = useI18n()
const router = useRouter()

const schema = yup.object({
  account: yup.string().required(t('required')),
  password: yup.string().required(t('required')),
  passwordAgain: yup.string().oneOf([yup.ref('password'), null], t('password_inconsistent_please_re_enter')).required(t('required'))
});

const account = ref(null);
const password = ref(null);
const passwordAgain = ref(null);

const onSubmit = async () => {
  let submitData = {
    account: account.value,
    password: password.value,
  }
  let target = await $api.register(submitData)
  if (target?.status === "success") {
    router.push({ path: "/LogInPage" })
  }
}

defineComponent({
  components: { LayoutsPage },
})
defineExpose({
  account,
  password,
  passwordAgain,
  onSubmit,
  schema,
  router,
  yup,
})

</script>