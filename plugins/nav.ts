export default defineNuxtPlugin((nuxtApp) => {
	const userToken = useCookie('userToken');
	const navState: {value: {nav: boolean | null} | boolean | null} = useState('navState', () => {
		return {nav: false};
	});
	/* 
	判斷 cookies ，更新狀態
	*/
	if (userToken.value) {
		navState.value = {nav: true};
	}
});
