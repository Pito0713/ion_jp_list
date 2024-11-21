// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	ssr: true,
	compatibilityDate: '2024-04-03',
	components: true, // 確保自動加載組件功能已啟用
	devtools: {enabled: true},
	css: ['~/assets/css/main.css'],
	postcss: {
		plugins: {
			tailwindcss: {},
			autoprefixer: {},
		},
	},
	typescript: {
		typeCheck: true,
	},
	modules: [
		//...
		'@vee-validate/nuxt',
		'@pinia/nuxt',
		'@nuxtjs/i18n',
		'@nuxt/image',
	],
	runtimeConfig: {
		public: {
			NEW_API_KEY: process.env.NEW_API_KEY || 'secret-key',
		},
		private: {
			// secretKey: process.env.NEW_API_KEY || 'secret-key',
		},
	},
	i18n: {
		locales: [
			{code: 'zhTW', language: 'zhTW', name: '繁體中文', file: 'zhTW.json'},
			{code: 'zhHant', language: 'zhHant', name: '簡體中文', file: 'zhHant.json'},
			{code: 'en', language: 'en', name: 'English', file: 'en.json'},
			{code: 'jp', language: 'jp', name: '日文', file: 'jp.json'},
		],
		defaultLocale: 'zhTW',
		langDir: 'locales/',
		lazy: true, // 使用懶加載
		strategy: 'prefix', // URL 中添加語言前綴，如 /en 或 /zh
		detectBrowserLanguage: {
			useCookie: true,
			cookieKey: 'i18n_redirected',
			redirectOn: 'root', // recommended
		},
	},
	veeValidate: {
		// disable or enable auto imports
		autoImports: true,
		// Use different names for components
		componentNames: {
			Form: 'VeeForm',
			Field: 'VeeField',
			FieldArray: 'VeeFieldArray',
			ErrorMessage: 'VeeErrorMessage',
		},
	},
});
