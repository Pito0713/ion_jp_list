// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	ssr: true,
	compatibilityDate: '2024-04-03',
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
	],
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
