import { getSettingRoutes } from "./setting";

export const getChildMenus = (auth) => ({
	setting: getSettingRoutes(auth)
});