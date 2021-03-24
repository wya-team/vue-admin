export const getOrderRoutes = (auth) => ([
	{
		name: '全部订单',
		icon: '',
		show: true,
		route: '/order/main',
	},
	{
		name: '售后处理',
		icon: '',
		show: true,
		route: '/order/after-sale',
	},
	{
		name: '批量发货',
		icon: '',
		show: true,
		route: '/order/batch',
	},
	{
		name: '基础设置',
		icon: '',
		show: true,
		route: '/order/setting',
	}
]);
