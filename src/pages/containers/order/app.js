// 导航路由
export const orderNavConfig = {
	path: '/order',
	title: '订单',
	children: [
		{
			path: '/order/main',
			title: '订单列表',
			children: [
				{
					path: '/order/main/all',
					name: 'order-main-all',
					title: '订单列表',
					components: [
						() => import('./modules/order-main-all.vue'),
						'left',
						'top'
					]
				}
			]
		},
		{
			path: '/order/after-sale',
			name: 'order-after-sale',
			title: '售后列表',
			components: [
				() => import('./modules/order-after-sale.vue'),
				'left',
				'top'
			]
		},
		{
			path: '/order/batch',
			name: 'order-batch',
			title: '批量处理',
			components: [
				() => import('./modules/order-batch.vue'),
				'left',
				'top'
			]
		},
		{
			path: '/order/setting',
			title: '订单设置',
			children: [
				{
					path: '/order/setting/basic',
					name: 'order-setting-basic',
					title: '基础设置',
					components: [
						() => import('./modules/order-setting-basic.vue'),
						'left',
						'top'
					]
				},
				{
					path: '/order/setting/template',
					name: 'order-setting-template',
					title: '运费模板',
					components: [
						() => import('./modules/order-setting-template.vue'),
						'left',
						'top'
					]
				},
				{
					path: '/order/setting/postage',
					name: 'order-setting-postage',
					title: '包邮设置',
					components: [
						() => import('./modules/order-setting-postage.vue'),
						'left',
						'top'
					]
				},
				{
					path: '/order/setting/logistics',
					name: 'order-setting-logistics',
					title: '物流设置',
					components: [
						() => import('./modules/order-setting-logistics.vue'),
						'left',
						'top'
					]
				},
				{
					path: '/order/setting/self-addr',
					name: 'order-setting-self-addr',
					title: '自提点',
					components: [
						() => import('./modules/order-setting-self-addr.vue'),
						'left',
						'top'
					]
				}
			]
		}
	]
};

// 非导航路由
export const orderConfig = [
	{
		path: '/order/main/all/detail',
		name: 'order-main-all-detail',
		meta: { title: '' },
		components: [
			() => import('./modules/order-main-all-detail.vue'),
			'left'
		]
	},
	{
		path: '/order/after-sale/detail',
		name: 'order-after-sale-detail',
		meta: { title: '' },
		components: [
			() => import('./modules/order-after-sale-detail.vue'),
			'left'
		]
	},
	{
		path: '/order/batch',
		name: 'order-batch',
		meta: { title: '' },
		components: [
			() => import('./modules/order-batch.vue'),
			'left',
			'top'
		]
	},
	{
		path: '/order/batch/result',
		name: 'order-batch-result',
		meta: { title: '' },
		components: [
			() => import('./modules/order-batch-result.vue'),
			'left'
		]
	}
];