/**
 * 具体开发模式 ~ 待定
 */
import { Store } from '@wya/assist-vc';
 
const { Service } = Store;
 
export const commonServices = {
	// appid
	...Service.createStore({
		key: "appid",
		url: '_COMMON_APPID_GET',
	}),
};
 