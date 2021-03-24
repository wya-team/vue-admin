import login from './login/root';
import layout from './layout/root';
import product from './product/root';
import order from './order/root';
import setting from './setting/root';

export default {
	...layout,
	...login,
	...product,
	...order,
	...setting
};
