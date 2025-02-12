// ~/plugins/api.js
import {Buffer} from 'buffer';
export default defineNuxtPlugin(() => {
	const decodeBase64 = (_data: string) => {
		return JSON.parse(Buffer.from(_data, 'base64').toString('utf-8'));
	};
	const encodeBase64 = (_data: string) => {
		return Buffer.from(JSON.stringify(_data)).toString('base64');
	};

	return {
		provide: {
			configUtils: {
				decodeBase64,
				encodeBase64,
			},
		},
	};
});
