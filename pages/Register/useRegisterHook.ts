export function useRegisterHook() {
	// -------  API 配置
	const {$api} = useNuxtApp();

	// ------- Nuxt Router 相關函數
	const router = useRouter();

	// ------- i18n 多語系
	const localePath = useLocalePath(); // 路徑函數

	/**
	 * @Api 註冊
	 * param {Object} _values - 登入資料
	 * property {string} _values.account - 帳號
	 * property {string} _values.password - 密碼
	 */
	const onSubmit = async (_values: {account: string; password: string}) => {
		let target = await $api.register(_values);
		// success
		if (target?.status === 1) {
			router.push(localePath('/LogInPage'));
		}
	};

	return {onSubmit};
}
