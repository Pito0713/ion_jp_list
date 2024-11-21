// ~/plugins/api.js
import axios from 'axios';
export default defineNuxtPlugin(() => {
	const config = useRuntimeConfig();
	/*
  env = ENV_PRODUCTION_DOMAIN & ENV_DEV_DOMAIN
	Authorization requires token
	*/
	const env = config.public.ENV_PRODUCTION_DOMAIN;
	axios.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded';
	axios.defaults.baseURL = env;
	// 請求
	const requestInterceptor = (config: any) => {
		// 請求10秒沒收到回應中斷
		config.timeout = 10000;

		let userToken = useCookie('userToken')?.value;
		if (userToken) config.headers['Authorization'] = `Bearer ${userToken}`;
		return config;
	};

	// 回應
	const responseInterceptor = (response: any) => {
		const isJSON = (data: any) => {
			try {
				JSON.parse(data);
				return true;
			} catch (error) {
				return false;
			}
		};

		interface searchText {
			file: string;
			inputs: string;
			translation: string;
		}

		let target = response?.data;
		if (target?.status === 'success') {
			// 指定路由
			if (response?.config?.url === '/searchText') {
				target?.data.forEach((item: searchText) => {
					try {
						if (isJSON(item.inputs)) {
							// 將 inputs 轉換成 JSON 格式數據
							item.inputs = JSON.parse(item.inputs);
						}
					} catch (error) {
						console.log('解析失敗，非 JSON 格式：');
					}
				});
			}
		}
		return response;
	};

	// 請求錯誤
	const requestInterceptorError = (error: any) => {
		return Promise.reject(error);
	};

	// 回應錯誤
	const responseInterceptorError = (error: any) => {
		return Promise.reject(error);
	};

	// axios攔截器
	axios.interceptors.request.use(requestInterceptor, requestInterceptorError);
	axios.interceptors.response.use(responseInterceptor, responseInterceptorError);

	const fetchApi_Data = async (
		method: string,
		url: string,
		params: string | undefined,
		body: any
	) => {
		try {
			const response = await axios({
				method: method,
				url: url + params,
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
				data: body,
			});
			return response.data;
		} catch (error: any) {
			return error;
		}
	};
	interface log {
		account?: string;
		password?: string;
	}

	interface text {
		file?: string;
		translation?: string;
		inputs?: string;
		searchValue?: string;
	}

	// text/新增
	const addText = async (submitData: text) => {
		let data = await fetchApi_Data('POST', `/addText`, '', submitData);
		return data;
	};
	// text/搜尋
	const searchText = async (submitData: text) => {
		let data = await fetchApi_Data('POST', `/searchText`, '', submitData);
		return data;
	};
	// user/註冊
	const register = async (submitData: log) => {
		let data = await fetchApi_Data('POST', `/register`, '', submitData);
		return data;
	};
	// user/登入
	const login = async (submitData: log) => {
		let data = await fetchApi_Data('POST', `/login`, '', submitData);
		return data;
	};

	return {
		provide: {
			api: {
				addText,
				searchText,
				register,
				login,
			},
		},
	};
});
