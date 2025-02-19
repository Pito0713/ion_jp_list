export function useLogInHook() {
	// @use hook
	const {$api} = useNuxtApp();
	const loadingIndicator = useLoadingIndicator();

	// @router fit i18
	const router = useRouter();
	const localePath = useLocalePath(); // 路徑函數

	// @statements
	const authState = useState<object | null>('authState', () => null); // 用於存放 auth 狀態，初始值為 null
	const infoState = useState<object | null>('infoState', () => null); // 用於存放 user info，初始值為 null
	const navState = useState('navState', () => ({nav: false})); // 用於存放nav狀態，預設 nav 為 false
	const account = ref(null);
	const password = ref(null);
	const isShowEye = ref(false);

	/* @Api /login 登入*/
	const onSubmit = async () => {
		if (
			['', null, undefined].includes(account.value) &&
			['', null, undefined].includes(password.value)
		)
			return;

		loadingIndicator.start();

		let submitData = {
			account: account.value, // property <string>
			password: password.value, //property <string>
		};
		let target = await $api.login(submitData);

		// success
		if (target?.status === 1) {
			// 設定 userToken Cookie，存放 Token，有效期 7 天
			let userToken = useCookie('userToken', {maxAge: 60 * 60 * 24 * 7});
			userToken.value = target?.data?.token; // cookies 存入 token

			// 設定 userInfo Cookie，存放使用者資訊，有效期 7 天
			let userInfo = useCookie('userInfo', {maxAge: 60 * 60 * 24 * 7});
			userInfo.value = JSON.stringify(target?.data); // cookies 存入使用者資訊 (轉為 JSON 字串)

			// useState 更新全域狀態管理
			authState.value = {token: target?.data?.token};
			navState.value = {nav: true};
			infoState.value = {info: JSON.stringify(target?.data)};

			// 成功登入後導向至 HomePage
			router.push(localePath('/HomePage'));
		}
		loadingIndicator.finish();
	};

	const handleShowEye = () => {
		isShowEye.value = !isShowEye.value;
	};

	return {
		account,
		password,
		isShowEye,
		onSubmit,
		handleShowEye,
	};
}
