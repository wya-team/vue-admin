import Vue from 'vue';
import { PRE_ROUTER_URL } from '../constants/constants';
import { loginConfig } from '../containers/login/app';
import { settingNavConfig, settingConfig } from '../containers/setting/app';
import { productNavConfig, productConfig } from '../containers/product/app';
import { orderNavConfig, orderConfig } from '../containers/order/app';

// 开放式路由（未登录），不支持Layout组件的管理
export const basicRoutes = {
	base: PRE_ROUTER_URL,
	mode: 'history',
	routes: [
		...loginConfig,
		{
			path: '*',
			redirect: (to) => {
				return '/login';
			}
		}
	]
};

// 开放式路由（未登录），但可以共享Layout组件
export const layoutRoutes = [];

// 权限路由（已登录），根据权限动态注入路由
export const dynamicRoutes = [
	...productConfig,
	...orderConfig,
	...settingConfig
];
