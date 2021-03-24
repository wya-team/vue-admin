import { getSettingTopRoutes } from './setting';

export const getTopMenus = (auth) => ({
	...getSettingTopRoutes(auth)
});