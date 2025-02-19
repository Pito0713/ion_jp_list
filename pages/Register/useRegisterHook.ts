export function useRegisterHook() {
	// @use hook config
	const {$api} = useNuxtApp();

	// @Router
	const router = useRouter();

	// @router fit i18
	const localePath = useLocalePath();

	const account = ref(null);
	const password = ref(null);
	const passwordAgain = ref(null);

	// @Api /register 註冊
	const onSubmit = async (value: any) => {
		let submitData = {
			account: account.value, // property <string>
			password: password.value, // property <string>
		};
		let target = await $api.register(submitData);
		// success
		if (target?.status === 1) {
			router.push(localePath('/LogInPage'));
		}
	};

	return {
		account,
		password,
		passwordAgain,
		onSubmit,
	};
}
