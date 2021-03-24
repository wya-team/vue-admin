import { getOrderTopRoutes } from './order';
import { getProductTopRoutes } from './product';
import { getSettingTopRoutes } from './setting';

export const getTopMenus = (auth) => ({
	...getOrderTopRoutes(auth),
	...getProductTopRoutes(auth),
	...getSettingTopRoutes(auth)
});