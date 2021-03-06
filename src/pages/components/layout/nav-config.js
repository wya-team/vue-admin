import { orderNavConfig } from '../../containers/order/app';
import { productNavConfig } from '../../containers/product/app';
import { settingNavConfig } from '../../containers/setting/app';
import { Global } from '../../routers/_global';

const getNavData = (data) => {
	return data.reduce((pre, cur) => {
		const { auth, children, ...rest } = cur;
		const hasChildren = children && children.length > 0;
		const show = true; // TODO: 根据auth判断是否显示导航, Global.auth[route.auth];
		if (!show) return pre;
		let obj = { ...rest };
		if (hasChildren) {
			obj.children = getNavData(children);
		}
		pre.push(obj);
		return pre;	
	}, []);
};

export const NAV_DATA = getNavData([
	productNavConfig,
	orderNavConfig,
	settingNavConfig
]);