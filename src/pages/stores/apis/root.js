import { RegEx } from '@wya/utils';
import { DEBUG } from '../../constants/constants';
import _common from './_common';
import login from './login';
import product from './product';
import order from './order';
import setting from './setting';

const API = {
	..._common,
	...login,
	...product,
	...order,
	...setting
};

class APIManager {
	constructor() {
		const baseUrl = process.env.NODE_ENV === 'development' 
			? 'https://apis.development.com'
			: 'https://apis.production.com';

		// this.baseUrl
		Object.defineProperty(this, 'baseUrl', {
			value: baseUrl,
			writable: false
		});

		// this.inject
		Object.defineProperty(this, 'inject', {
			value: this.inject,
			writable: false
		});

		DEBUG && (window.apis = this);
	}


	/**
	 * 用于异步的apis注入或者子包apis的注入
	 */
	inject(target) {
		for (let i in target) {
			if (process.env.NODE_ENV === 'development') {
				this[i] && console.warn(`[@stores/apis]: key重复注入 ${i}`);
			}

			this[i] = RegEx.URLScheme.test(target[i]) 
				? target[i]
				: this.baseUrl + target[i];
		}

		return this;
	}
}

export default new APIManager().inject(API);
