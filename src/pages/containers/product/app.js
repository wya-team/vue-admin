// 导航路由
export const productNavConfig = {
	path: '/product',
	title: '商品',
	level: 1,
	children: [
		{
			path: '/product/category',
			name: 'product-category',
			title: '商品分类',
			level: 2,
			components: [
				() => import('./modules/product-category.vue'),
				'left',
				'top'
			]
		}
	]
};

// 非导航路由
export const productConfig = [
	{
		path: '/product/goods/editor/:id?',
		name: 'product-goods-editor',
		title: '商品',
		components: [
			() => import('./modules/product-goods-editor.vue'),
			'left'
		]
	}
];
