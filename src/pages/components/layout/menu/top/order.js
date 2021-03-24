export const getOrderTopRoutes = (auth) => ({
	'/order/main': [
		{
			name: '全部订单',
			icon: '',
			show: true,
			route: '/order/main/all',
		}
	],
	'/order/after-sale': '售后处理',
	'/order/batch': '批量发货',
	'/order/setting': [
		{
			name: '基础设置',
			icon: '',
			show: true,
			route: '/order/setting/basic',
		},
		{
			name: '运费模板',
			icon: '',
			show: true,
			route: '/order/setting/template',
		},
		{
			name: '包邮设置',
			icon: '',
			show: true,
			route: '/order/setting/postage',
		},
		{
			name: '物流设置',
			icon: '',
			show: true,
			route: '/order/setting/logistics',
		},
		{
			name: '自提点设置',
			icon: '',
			show: true,
			route: '/order/setting/self-addr',
		}
	],
});
