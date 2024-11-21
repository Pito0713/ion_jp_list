export default defineNuxtPlugin((nuxtApp) => {
	const userToken = useCookie('userToken');
	const userInfo = useCookie('userInfo');
	const authState: {value: {token: string | null} | null} = useState('authState', () => null);
	const infoState: {value: {info: object | null} | null} = useState('infoState', () => null);

	// 如果 cookies 有值，更新全域狀態
	if (userToken.value) {
		authState.value = {token: userToken.value};
	}
	if (userInfo.value) {
		infoState.value = {info: JSON.parse(JSON.stringify(userInfo.value))};
	}
});
