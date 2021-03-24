import { getProductRoutes } from './product';
import { getOrderRoutes } from './order';
import { getSettingRoutes } from "./setting";


export const getChildMenus = (auth) => ({
	product: getProductRoutes(auth),
	order: getOrderRoutes(auth),
	setting: getSettingRoutes(auth)
});