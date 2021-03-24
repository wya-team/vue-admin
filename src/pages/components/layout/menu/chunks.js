export const getChunks = (auth = {}) => [
	{
		value: 'product',
		name: '商品',
		icon: '',
		show: true,
		route: '/product',
		stair: true,
	},
	{
		value: 'order',
		name: '订单',
		icon: '',
		show: true,
		route: '/order',
		stair: true,
	},
	{
		value: 'setting',
		name: '设置',
		icon: '',
		show: true,
		route: '/setting',
		stair: true,
	}
];