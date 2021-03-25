export const orderConfig = [
	{
		path: '/order/main/all',
		name: 'order-main-all',
		meta: { title: '' },
		components: [
			() => import('./modules/order-main-all.vue'),
			'left',
			'top'
		]
	},
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
		path: '/order/after-sale',
		name: 'order-after-sale',
		meta: { title: '' },
		components: [
			() => import('./modules/order-after-sale.vue'),
			'left',
			'top'
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
	},
	{
		path: '/order/setting/basic',
		name: 'order-setting-basic',
		meta: { title: '' },
		components: [
			() => import('./modules/order-setting-basic.vue'),
			'left',
			'top'
		]
	},
	{
		path: '/order/setting/template',
		name: 'order-setting-template',
		meta: { title: '' },
		components: [
			() => import('./modules/order-setting-template.vue'),
			'left',
			'top'
		]
	},
	{
		path: '/order/setting/postage',
		name: 'order-setting-postage',
		meta: { title: '' },
		components: [
			() => import('./modules/order-setting-postage.vue'),
			'left',
			'top'
		]
	},
	{
		path: '/order/setting/logistics',
		name: 'order-setting-logistics',
		meta: { title: '' },
		components: [
			() => import('./modules/order-setting-logistics.vue'),
			'left',
			'top'
		]
	},
	{
		path: '/order/setting/self-addr',
		name: 'order-setting-self-addr',
		meta: { title: '' },
		components: [
			() => import('./modules/order-setting-self-addr.vue'),
			'left',
			'top'
		]
	}
];
