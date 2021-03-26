export const productConfig = [
	{
		path: '/product/category',
		name: 'product-category',
		meta: { title: '' },
		components: [
			() => import('./modules/product-category.vue'),
			'left',
			'top'
		]
	},
	{
		path: '/product/goods/editor/:id?',
		name: 'product-goods-editor',
		meta: { title: '' },
		components: [
			() => import('./modules/product-goods-editor.vue'),
			'left'
		]
	}
];
